"use client";

import ExploreFrame from "./explore-frame";
import SelectionPopup from "./selection-popup";
import { usePreservation } from "./use-preservation";

export default function Explore() {
  const {
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
  } = usePreservation();

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header
        style={{
          border: "1px solid",
          borderBottom: "1px solid",
          padding: 8,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: timeLeft < 20 ? "red" : "inherit" }}>
          Timer {mins}:{secs}
        </span>
        <span>Budget: {budgetLeft} remaining</span>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            borderRight: "1px solid",
            overflow: "hidden",
          }}
        >
          <ExploreFrame
            onSelection={onSelection}
            onImageSelection={onImageSelection}
            onClearSelection={onClearSelection}
          />
        </div>

        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            width: 240,
            overflow: "hidden",
          }}
        >
          <div style={{ borderBottom: "1px solid", padding: 8 }}>
            Preserved ({preserved.length})
          </div>

          <ul
            style={{
              flex: 1,
              overflow: "auto",
              padding: 8,
              listStyle: "none",
              margin: 0,
            }}
          >
            {preserved.map((item) => {
              const previewText =
                item.kind === "text" && item.text
                  ? item.text.length > 500
                    ? item.text.slice(0, 500) + "…"
                    : item.text
                  : null;
              return (
                <li
                  key={item.id}
                  style={{ border: "1px solid", padding: 8, marginBottom: 8 }}
                >
                  {item.kind === "image" ? (
                    <img
                      src={item.imageSrc}
                      alt=""
                      style={{ width: "100%", marginTop: 4 }}
                    />
                  ) : (
                    <p style={{ fontSize: 9 }}>"{previewText}"</p>
                  )}
                </li>
              );
            })}
          </ul>

          <div
            style={{
              borderTop: "1px solid",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <button type="button">+ Highlight</button>
            <button type="button">+ Note</button>
          </div>
        </aside>
      </div>

      {selection && popupPos && (
        <SelectionPopup
          selectionKind={selectionKind}
          pos={popupPos}
          budgetLeft={budgetLeft}
          timeLeft={timeLeft}
          onSave={save}
          onDismiss={dismiss}
        />
      )}
    </div>
  );
}
