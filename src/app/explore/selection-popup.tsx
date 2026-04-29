"use client";

interface SelectionPopupProps {
  selectionKind: "text" | "image";
  pos: { x: number; y: number };
  budgetLeft: number;
  timeLeft: number;
  onSave: () => void;
  onDismiss: () => void;
}

export default function SelectionPopup({
  selectionKind,
  pos,
  budgetLeft,
  timeLeft,
  onSave,
  onDismiss,
}: SelectionPopupProps) {
  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -100%)",
        background: "white",
        padding: "6px 10px",
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      {budgetLeft === 0 ? (
        <span style={{ color: "red" }}>No budget left</span>
      ) : timeLeft === 0 ? (
        <span style={{ color: "red" }}>Time expired</span>
      ) : (
        <button type="button" onClick={onSave}>
          {selectionKind === "image" ? "Save Image" : "Save"}
        </button>
      )}
      <button type="button" onClick={onDismiss}>✕</button>
    </div>
  );
}
