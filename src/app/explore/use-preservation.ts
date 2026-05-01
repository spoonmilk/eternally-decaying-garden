"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const TIME_BUDGET = 180;
const MAX_WORD_BUDGET = 500;
const IMAGE_WORD_COST = 20;

export type Preserved = {
  id: string;
  url: string;
  kind: "text" | "image";
  text?: string;
  imageSrc?: string;
  savedAt: number; // For ordering of saves in retrospective/summary view
};

// NOTE: This may be useful if we'd like to include some persistent storage through
// multiple sessions, or to be able to restore sessions. Otherwise, we probably have little need for it.
// type PreservationState = {
//   preserved: Preserved[];
//   addPreserved: (entry: Omit<Preserved, "id" | "savedAt">) => void;
//   clearPreserved: () => void;
// };
//
// export const usePreservationStore = create<PreservationState>()(
//   persist(
//     (set, get) => ({
//       preserved: [],
//       addPreserved: (entry) => {
//         const id = String(get().preserved.length + 1);
//         const savedAt = Date.now();
//         set((state) => ({
//           preserved: [...state.preserved, { ...entry, id, savedAt }],
//         }));
//       },
//       clearPreserved: () => set({ preserved: [] }),
//     }),
//     {
//       name: "preservation-store",
//     },
//   ),
// );

function countWords(text: string) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function truncateToWordLimit(text: string, maxWords: number) {
  if (!text) return text;
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ");
}

export function usePreservation(currentUrl?: React.RefObject<string>) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(TIME_BUDGET);
  const [wordBudgetLeft, setWordBudget] = useState(MAX_WORD_BUDGET);
  const [preserved, setPreserved] = useState<Preserved[]>([]);
  const [selection, setSelection] = useState<string | null>(null);
  const [selectionKind, setSelectionKind] = useState<"text" | "image">("text");
  const [selectionWordCount, setSelectionWordCount] = useState(0);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const idCounter = useRef(0);
  // const addPreserved = usePreservationStore((s) => s.addPreserved);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          sessionStorage.setItem("preserved", JSON.stringify(preserved));
          router.push("/summary");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [preserved, router]);

  function onSelection(text: string, rect: DOMRect) {
    if (!text || text.length < 1) return;
    setSelectionKind("text");
    setSelection(text);
    const wc = countWords(text);
    setSelectionWordCount(wc);
    setPopupPos({ x: rect.left + rect.width / 2, y: rect.top });
  }

  function onImageSelection(src: string, rect: DOMRect) {
    setSelectionKind("image");
    setSelection(src);
    // images have fixed cost
    setSelectionWordCount(IMAGE_WORD_COST);
    setPopupPos({ x: rect.left + rect.width / 2, y: rect.top });
  }

  function onClearSelection() {
    setSelection(null);
    setPopupPos(null);
    setSelectionWordCount(0);
  }

  function save() {
    if (!selection || wordBudgetLeft <= 0 || timeLeft <= 0) return;
    const id = String(++idCounter.current);
    const url = currentUrl?.current ?? "";
    const savedAt = Date.now();

    if (selectionKind === "image") {
      const cost = IMAGE_WORD_COST;
      if (cost > wordBudgetLeft) {
        // Cannot save
        // TODO: Break selection here? Make red after selection budget exceeded?
        return;
      }
      const entry: Preserved = { id, url, kind: "image", imageSrc: selection, savedAt };
      setPreserved((prev) => [...prev, entry]);
      setWordBudget((w) => Math.max(0, w - cost));
    } else {
      const selectedText = selection;
      const kind = "text";
      const selectedWords: number = countWords(selectedText);
      if (selectedWords <= wordBudgetLeft) {
        const entry: Preserved = { id, url, kind, text: selectedText, savedAt };
        setPreserved((prev) => [...prev, entry]);
        setWordBudget((w) => Math.max(0, w - selectedWords));
      } else if (wordBudgetLeft > 0) {
        const truncatedSelection = truncateToWordLimit(
          selectedText,
          wordBudgetLeft,
        );
        const entry: Preserved = {
          id,
          url,
          kind,
          text: truncatedSelection,
          savedAt,
        };
        setPreserved((prev) => [...prev, entry]);
        setWordBudget(0);
      } else {
        return;
      }
    }

    // const entry: Preserved =
    //   selectionKind === "image"
    //     ? { id, url, kind: "image", imageSrc: selection, savedAt }
    //     : { id, url, kind: "text", text: selection, savedAt };
    // setPreserved((prev) => [...prev, entry]);
    // // addPreserved(entry);
    // setBudget((b) => b - 1);
    // setSelection(null);
    // setPopupPos(null);
    // setSelectionKind("text");
    // window.getSelection()?.removeAllRanges();
  }

  function dismiss() {
    setSelection(null);
    setPopupPos(null);
    window.getSelection()?.removeAllRanges();
  }

  return {
    timeLeft,
    budgetLeft: wordBudgetLeft,
    preserved,
    selection,
    selectionKind,
    popupPos,
    onSelection,
    onImageSelection,
    onClearSelection,
    save,
    dismiss,
  };
}
