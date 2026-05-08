"use client";
import { useEffect, useRef, useState } from "react";
import ExploreFrame from "./explore-frame";
import ExploreHeader from "./explore-header";
import ExploreSidebar from "./explore-sidebar";
import SelectionPopup from "./selection-popup";
import { usePreservation } from "./use-preservation";
import { type SetId, ALL_PAGES } from "./sets";
import OutroContent from "./outro";
import IntroContent from "./intro";

export default function Explore() {
  const currentUrlRef = useRef<string>(ALL_PAGES[0].displayUrl);

  const {
    timeLeft,
    budgetLeft,
    preserved,
    selection,
    selectionKind,
    selectionWordCount,
    popupPos,
    currentSetId,
    onSelection,
    onImageSelection,
    onClearSelection,
    save,
    phase,
    beginSet,
    onDecayComplete,
    continueFromOutro,
  } = usePreservation(currentUrlRef);

  // accordion open/close state
  const [openSetIds, setOpenSetIds] = useState<SetId[]>([currentSetId]);

  // auto open accordion for current set
  useEffect(() => {
    setOpenSetIds([currentSetId]);
  }, [currentSetId]);

  return (
    <main className="explore">
      <div className="left">
        <ExploreHeader timeLeft={timeLeft} budgetLeft={budgetLeft} />
        {phase === "intro" && (
          <IntroContent setId={currentSetId} onBegin={beginSet} />
        )}
        {phase === "explore" && (
          <ExploreFrame
            onUrlChange={(url) => {
              currentUrlRef.current = url;
            }}
            activeSetId={currentSetId}
            onSelection={onSelection}
            onImageSelection={onImageSelection}
            onClearSelection={onClearSelection}
            timeLeft={timeLeft}
            budgetLeft={budgetLeft}
            onDecayComplete={onDecayComplete}
          />
        )}
        {phase === "outro" && (
          <OutroContent
            completedSetId={currentSetId}
            onContinue={continueFromOutro}
          />
        )}
      </div>
      <ExploreSidebar
        preserved={preserved}
        openSetIds={openSetIds}
        onToggleSet={(setId) => {
          setOpenSetIds((prev) =>
            prev.includes(setId)
              ? prev.filter((id) => id !== setId)
              : [...prev, setId],
          );
        }}
      />
      {selection && popupPos && (
        <SelectionPopup
          selectionKind={selectionKind}
          pos={popupPos}
          budgetLeft={budgetLeft}
          timeLeft={timeLeft}
          selectionWordCount={selectionWordCount}
          onSave={save}
        />
      )}
    </main>
  );
}
