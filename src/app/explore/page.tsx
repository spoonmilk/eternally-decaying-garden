"use client";

import ExploreFrame from "./explore-frame";
import ExploreHeader from "./explore-header";
import ExploreSidebar from "./explore-sidebar";
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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <ExploreHeader timeLeft={timeLeft} budgetLeft={budgetLeft} />

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

        <ExploreSidebar preserved={preserved} />
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
