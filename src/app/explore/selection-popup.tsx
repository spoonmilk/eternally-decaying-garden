"use client";

interface SelectionPopupProps {
  selectionKind: "text" | "image";
  pos: { x: number; y: number };
  budgetLeft: number;
  timeLeft: number;
  selectionWordCount: number;
  onSave: () => void;
  onDismiss: () => void;
}

export default function SelectionPopup({
  selectionKind,
  pos,
  budgetLeft,
  timeLeft,
  selectionWordCount,
  onSave,
  onDismiss,
}: SelectionPopupProps) {
  return (
    <div
      className="highlight-button"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-100%, calc(-100% - 8px))",
      }}
    >
      {(() => {
        if (budgetLeft === 0)
          return <span style={{ color: "red" }}>No budget left</span>;
        if (timeLeft === 0)
          return <span style={{ color: "red" }}>Time expired</span>;
        return (
          <button type="button" onClick={onSave}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-plus"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>

            <div className="button-text">
              {selectionKind === "image" ? "Save Image" : "Save Text"}
              {selectionWordCount > 0 && (
                <span
                  style={{
                    color: "var(--text-secondary",
                    fontSize: "16px",
                    fontWeight: "300",
                  }}
                >
                  {" "}
                  ({selectionWordCount} words)
                </span>
              )}
            </div>
          </button>
        );
      })()}
    </div>
  );
}
