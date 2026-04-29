"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";

const TIME_BUDGET = 180;
const HIGHLIGHT_BUDGET = 25;

export type Preserved = {
  id: string;
  url: string;
  kind: "text" | "image";
  text?: string;
  imageSrc?: string;
};

export function usePreservation(currentUrl?: React.RefObject<string>) {
  const [timeLeft, setTimeLeft] = useState(TIME_BUDGET);
  const [budgetLeft, setBudget] = useState(HIGHLIGHT_BUDGET);
  const [preserved, setPreserved] = useState<Preserved[]>([]);
  const [selection, setSelection] = useState<string | null>(null);
  const [selectionKind, setSelectionKind] = useState<"text" | "image">("text");
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const idCounter = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function onSelection(text: string, rect: DOMRect) {
    if (!text || text.length < 1) return;
    setSelectionKind("text");
    setSelection(text);
    setPopupPos({ x: rect.left + rect.width / 2, y: rect.top });
  }

  function onImageSelection(src: string, rect: DOMRect) {
    setSelectionKind("image");
    setSelection(src);
    setPopupPos({ x: rect.left + rect.width / 2, y: rect.top });
  }

  function onClearSelection() {
    setSelection(null);
    setPopupPos(null);
  }

  function save() {
    if (!selection || budgetLeft <= 0 || timeLeft <= 0) return;
    const id = String(++idCounter.current);
    const url = currentUrl?.current ?? "";
    const entry: Preserved =
      selectionKind === "image"
        ? { id, url, kind: "image", imageSrc: selection }
        : { id, url, kind: "text", text: selection };
    setPreserved((prev) => [...prev, entry]);
    setBudget((b) => b - 1);
    setSelection(null);
    setPopupPos(null);
    setSelectionKind("text");
    window.getSelection()?.removeAllRanges();
  }

  function dismiss() {
    setSelection(null);
    setPopupPos(null);
  }

  return {
    timeLeft,
    budgetLeft,
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
