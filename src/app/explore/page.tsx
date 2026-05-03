"use client";

import { useEffect, useRef, useState } from "react";
import ExploreFrame from "./explore-frame";

const TIME_BUDGET = 180;
const HIGHLIGHT_BUDGET = 25;
type SetId = 1 | 2 | 3;

const PAGE_SETS: Record<SetId, string[]> = {
  1: ["https://cel.cs.brown.edu/csci-1377-s26/"],
  2: [],
  3: [],
};

const SET_IDS: SetId[] = [1, 2, 3];

// get which set the url belongs to
function getSetForUrl(url: string): SetId {
  for (const setId of SET_IDS) {
    const sets = PAGE_SETS[setId];
    if (sets.some((set) => url.startsWith(set))) {
      return setId;
    }
  }
  return 1;
}

type Preserved = {
  id: string;
  url: string;
  setId: SetId;
  kind: "text" | "image";
  text?: string;
  imageSrc?: string;
};

export default function Explore() {
  const [timeLeft, setTimeLeft] = useState(TIME_BUDGET);
  const [budgetLeft, setBudget] = useState(HIGHLIGHT_BUDGET);
  const [preserved, setPreserved] = useState<Preserved[]>([]);
  const [selection, setSelection] = useState<string | null>(null);
  const [selectionKind, setSelectionKind] = useState<"text" | "image">("text");
  const defaultRef = useRef("https://cel.cs.brown.edu/csci-1377-s26/");
  const [currentUrl, setCurrentUrl] = useState(defaultRef.current);
  const [openSetIds, setOpenSetIds] = useState<SetId[]>([
    getSetForUrl(defaultRef.current),
  ]);
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

  // iframe workaround for embedded site in our site
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "CLEAR_SELECTION") {
        setSelection(null);
        setPopupPos(null);
        return;
      }
      if (e.data?.type === "SELECTION") {
        const { text, rect } = e.data;
        if (!text || text.length < 1) return;
        const iframe = document.querySelector("iframe");
        const iframeRect = iframe?.getBoundingClientRect();
        setSelectionKind("text");
        setSelection(text);
        setPopupPos({
          x: (iframeRect?.left ?? 0) + rect.left + rect.width,
          y: (iframeRect?.top ?? 0) + rect.top,
        });
      }

      if (e.data?.type === "IMAGE_SELECTION") {
        const { src, rect } = e.data;
        const iframe = document.querySelector("iframe");
        const iframeRect = iframe?.getBoundingClientRect();
        setSelectionKind("image");
        setSelection(src);
        setPopupPos({
          x: (iframeRect?.left ?? 0) + rect.left + rect.width,
          y: (iframeRect?.top ?? 0) + rect.top,
        });
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function saveSelection() {
    const canSave = selection && budgetLeft > 0 && timeLeft > 0;
    if (!canSave) return;

    if (selectionKind === "image") {
      const newEntry: Preserved = {
        id: String(++idCounter.current),
        url: defaultRef.current,
        setId: getSetForUrl(defaultRef.current),
        kind: "image",
        imageSrc: selection,
      };
      setPreserved((previousList) => [...previousList, newEntry]);
    } else {
      const newEntry: Preserved = {
        id: String(++idCounter.current),
        url: defaultRef.current,
        setId: getSetForUrl(defaultRef.current),
        kind: "text",
        text: selection,
      };
      setPreserved((previousList) => [...previousList, newEntry]);
    }
    setBudget((b) => b - 1);
    setSelection(null);
    setPopupPos(null);
    setSelectionKind("text");
    window.getSelection()?.removeAllRanges();
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const activeSetId = getSetForUrl(currentUrl);

  useEffect(() => {
    setOpenSetIds([activeSetId]);
  }, [activeSetId]);

  return (
    <main className="explore">
      <div className="left">
        <header>
          <div className="decay-timer">
            <span
              style={{ color: timeLeft < 20 ? "red" : "inherit" }}
              className="name"
            >
              Decay Timer:
            </span>
            <span
              className="number"
              style={{ color: timeLeft < 20 ? "red" : "inherit" }}
            >
              {" "}
              {mins}:{secs}
            </span>
          </div>

          <span className="title">
            The Internet as an Eternally Decaying Garden
          </span>
          <div className="budget">
            <span className="name">Budget: </span>
            <span className="number">
              {" "}
              {budgetLeft} / {HIGHLIGHT_BUDGET}
            </span>
          </div>
        </header>
        <ExploreFrame
          onUrlChange={(url) => {
            defaultRef.current = url;
            setCurrentUrl(url);
          }}
        />
      </div>
      <aside className="right">
        <div className="archive-header">Archive</div>
        <div className="archive-content archive-accordions">
          {SET_IDS.map((setId) => {
            const itemsInSet = preserved.filter((item) => item.setId === setId);

            return (
              <div
                key={setId}
                className={`archive-accordion${openSetIds.includes(setId) ? " is-open" : ""}`}
              >
                <div
                  className="archive-accordion-summary"
                  onClick={() => {
                    setOpenSetIds((prev) =>
                      prev.includes(setId)
                        ? prev.filter((id) => id !== setId)
                        : [...prev, setId],
                    );
                  }}
                >
                  <div className="summary-left">
                    <span className="set-name">{`Set ${setId}`}</span>
                    <span className="set-count">{`(${itemsInSet.length})`}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down chevron"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M6 9l6 6l6 -6" />
                  </svg>
                </div>
                {openSetIds.includes(setId) && (
                  <ul className="archive-set-list">
                    {itemsInSet.length === 0 ? (
                      <li>Nothing has been saved yet.</li>
                    ) : (
                      itemsInSet.map((item) => {
                        const displayUrl = item.url.replace("https://", "");
                        let previewText;
                        if (item.kind === "text" && item.text) {
                          if (item.text.length > 500) {
                            previewText = item.text.slice(0, 500) + "…";
                          } else {
                            previewText = item.text;
                          }
                        } else {
                          previewText = null;
                        }

                        return (
                          <li key={item.id}>
                            {item.kind === "image" ? (
                              <img src={item.imageSrc} />
                            ) : (
                              <p>{previewText}</p>
                            )}
                            <span className="url">{displayUrl}</span>
                          </li>
                        );
                      })
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* save for images */}
      {selection && popupPos && (
        <div
          className="highlight-button"
          style={{
            left: popupPos.x,
            top: popupPos.y,
            transform: "translate(-100%, calc(-100% - 8px))",
          }}
        >
          {(() => {
            if (budgetLeft === 0)
              return <span style={{ color: "red" }}>No budget left</span>;
            if (timeLeft === 0)
              return <span style={{ color: "red" }}>Time expired</span>;
            return (
              <button type="button" onClick={saveSelection}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-plus"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </svg>
                {selectionKind === "image" ? "Save Image" : "Save Text"}
              </button>
            );
          })()}
        </div>
      )}
    </main>
  );
}
