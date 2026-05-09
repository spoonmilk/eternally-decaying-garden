"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { type SetId } from "./sets";

export const TIME_BUDGET = 180;
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
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const currentSetId = (currentSetIndex + 1) as SetId;
  const currentSetIndexRef = useRef(currentSetIndex);
  currentSetIndexRef.current = currentSetIndex;
  const [phase, setPhase] = useState<"intro" | "explore" | "outro">("intro");
  const [phaseScreen, setPhaseScreen] = useState(0);
  const phaseScreenRef = useRef(phaseScreen);
  phaseScreenRef.current = phaseScreen;

  // decrement timer, but only during explore phase
  useEffect(() => {
    if (phase !== "explore") return;
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSetIndex, phase]);

  useEffect(() => {
    if (wordBudgetLeft !== 0) return;
    if (preserved.length === 0) return;
    if (phase !== "explore") return;
    setPhase("outro");
    setPhaseScreen(0);
  }, [wordBudgetLeft, preserved, phase]);

  useEffect(() => {
    setTimeLeft(TIME_BUDGET);
    setWordBudget(MAX_WORD_BUDGET);
    setPhaseScreen(0);
    setPhase(currentSetIndex === 0 ? "intro" : "explore");
  }, [currentSetIndex]);

  function onSelection(text: string, rect: DOMRect) {
    if (!text || text.length < 1) return;
    setSelectionKind("text");
    setSelection(text);
    const wc = countWords(text);
    setSelectionWordCount(wc);
    setPopupPos({ x: rect.left, y: rect.top });
  }

  function onImageSelection(src: string, rect: DOMRect) {
    setSelectionKind("image");
    setSelection(src);
    // images have fixed cost
    setSelectionWordCount(IMAGE_WORD_COST);
    setPopupPos({ x: rect.left, y: rect.top });
  }

  useEffect(() => {
    if (timeLeft !== 0) return;
    setSelection(null);
    setPopupPos(null);
    setSelectionWordCount(0);
  }, [timeLeft]);

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
      const entry: Preserved = {
        id,
        url,
        kind: "image",
        imageSrc: selection,
        savedAt,
      };
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

    // clear selection after save
    setSelection(null);
    setPopupPos(null);
    setSelectionWordCount(0);
    window.getSelection()?.removeAllRanges();
  }

  function dismiss() {
    setSelection(null);
    setPopupPos(null);
    window.getSelection()?.removeAllRanges();
  }

  function advanceFromIntro() {
    const introMaxScreen = currentSetIndex === 0 ? 2 : 0;
    if (phaseScreen < introMaxScreen) {
      setPhaseScreen((s) => s + 1);
    } else {
      setPhase("explore");
      setPhaseScreen(0);
    }
  }

  function onDecayComplete() {
    setPhase("outro");
    setPhaseScreen(0);
  }

  function continueFromOutro() {
    const outroMaxScreen = currentSetIndexRef.current < 2 ? 1 : 2;
    if (phaseScreenRef.current < outroMaxScreen) {
      setPhaseScreen((s) => s + 1);
    } else if (currentSetIndexRef.current < 2) {
      setCurrentSetIndex((i) => i + 1);
    } else {
      sessionStorage.setItem("preserved", JSON.stringify(preserved));
      router.push("/summary");
    }
  }
  return {
    timeLeft,
    budgetLeft: wordBudgetLeft,
    preserved,
    selection,
    selectionKind,
    selectionWordCount,
    popupPos,
    currentSetId,
    phaseScreen,
    onSelection,
    onImageSelection,
    onClearSelection,
    save,
    phase,
    advanceFromIntro,
    onDecayComplete,
    continueFromOutro,
  };
}
