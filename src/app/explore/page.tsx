"use client";
import { useEffect, useRef, useState } from "react";
import ExploreFrame from "./explore-frame";
import ExploreHeader from "./explore-header";
import ExploreSidebar from "./explore-sidebar";
import SelectionPopup from "./selection-popup";
import { TIME_BUDGET, usePreservation } from "./use-preservation";
import { type SetId, ALL_PAGES } from "./sets";
import OutroContent from "./outro";
import IntroContent from "./intro";
import ReflectionPopup from "./reflection-popup";

function getDecayPhase(timeLeft: number, totalTime: number) {
  const elapsed = totalTime - timeLeft;
  const interval = totalTime / 6;
  if (elapsed < interval) return 0;
  if (elapsed < interval * 2) return 1;
  if (elapsed < interval * 3) return 2;
  if (elapsed < interval * 4) return 3;
  if (elapsed < interval * 5) return 4;
  return 5;
}

type ReflectionPrompt = {
  id: string;
  body: string;
  triggerPhase: number;
  position: { x: number; y: number };
};

const PROMPT_POS = [
  { x: 40, y: 200 }, // first prompt
  { x: 856, y: 440 }, // second prompt
];

const PROMPTS: Record<number, ReflectionPrompt[]> = {
  1: [
    {
      id: "1a",
      body: "What on these pages feels worth remembering? What would you let decay?",
      triggerPhase: 2,
      position: PROMPT_POS[0],
    },
    {
      id: "1b",
      body: "The web forgets faster than we do. What does it mean to outlive your own archive?",
      triggerPhase: 4,
      position: PROMPT_POS[1],
    },
  ],
  2: [
    {
      id: "2a",
      body: "A broken link is a kind of death. What have you lost to link rot, knowingly or not?",
      triggerPhase: 2,
      position: PROMPT_POS[0],
    },
    {
      id: "2b",
      body: "If a page exists but no one can reach it, does it exist at all?",
      triggerPhase: 4,
      position: PROMPT_POS[1],
    },
  ],
  3: [
    {
      id: "3a",
      body: "Whose stories are most at risk of being forgotten? Who benefits from that forgetting?",
      triggerPhase: 2,
      position: PROMPT_POS[0],
    },
    {
      id: "3b",
      body: "The web preserves what gets attention. What gets attention is rarely what demands justice. What would it take to change that?",
      triggerPhase: 4,
      position: PROMPT_POS[1],
    },
  ],
};

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
  const [visiblePrompts, setVisiblePrompts] = useState<(typeof PROMPTS)[1]>([]);
  const shownPromptIds = useRef<Set<string>>(new Set());
  const decayPhase = getDecayPhase(timeLeft, TIME_BUDGET);

  // auto open accordion for current set
  useEffect(() => {
    setOpenSetIds([currentSetId]);
  }, [currentSetId]);

  useEffect(() => {
    if (phase !== "explore") return;
    const prompts = PROMPTS[currentSetId] ?? [];
    prompts.forEach((p) => {
      if (decayPhase >= p.triggerPhase && !shownPromptIds.current.has(p.id)) {
        shownPromptIds.current.add(p.id);
        setVisiblePrompts((prev) => [...prev, p]);
      }
    });
  }, [decayPhase, phase, currentSetId]);

  // clears prompts when time is up
  useEffect(() => {
    if (timeLeft !== 0) return;
    setVisiblePrompts([]);
  }, [timeLeft]);

  function dismissPrompt(id: string) {
    setVisiblePrompts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <main className="explore">
      <div className="left">
        <ExploreHeader timeLeft={timeLeft} budgetLeft={budgetLeft} />
        {phase === "explore" &&
          visiblePrompts.map((p, i) => (
            <ReflectionPopup
              key={p.id}
              body={p.body}
              initialX={p.position.x}
              initialY={p.position.y}
              onDismiss={() => dismissPrompt(p.id)}
            />
          ))}
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
            timeBudget={TIME_BUDGET}
            timeLeft={timeLeft}
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
