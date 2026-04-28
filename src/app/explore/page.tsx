"use client";

import { useEffect, useRef, useState } from "react";
import ExploreFrame from "./explore-frame";

const TIME_BUDGET = 180;
const HIGHLIGHT_BUDGET = 25;
type Preserved = { id: string; text: string; url: string };

export default function Explore() {
  const [timeLeft, setTimeLeft] = useState(TIME_BUDGET);
  const [budgetLeft, setBudget] = useState(HIGHLIGHT_BUDGET);
  const [preserved, setPreserved] = useState<Preserved[]>([]);
  const [selection, setSelection] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const defaultRef = useRef("https://cel.cs.brown.edu/csci-1377-s26/");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // iframe workaround for embedded site in our site
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "CLEAR_SELECTION") { 
        setSelection(null); setPopupPos(null); return; 
    }
      if (e.data?.type === "SELECTION") {
        const { text, rect } = e.data;
        if (!text || text.length < 1) return;
        const iframe = document.querySelector("iframe");
        const iframeRect = iframe?.getBoundingClientRect();
        setSelection(text);
        setPopupPos({ 
            x: (iframeRect?.left ?? 0) + rect.left + rect.width / 2, 
            y: (iframeRect?.top ?? 0) + rect.top });
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function saveSelection() {
    const canSave = selection && budgetLeft > 0 && timeLeft > 0;
    if (!canSave) return;

    const newEntry = {id: Date.now().toString(), text: selection, url: defaultRef.current,};
    setPreserved((previousList) => [...previousList, newEntry]);
    setBudget((b) => b - 1);
    setSelection(null);
    setPopupPos(null);
    window.getSelection()?.removeAllRanges();
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header style={{ border: "1px solid", borderBottom: "1px solid", padding: 8, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: timeLeft < 20 ? "red" : "inherit" }}>Timer {mins}:{secs}</span>
        <span>Budget: {budgetLeft}/{HIGHLIGHT_BUDGET}</span>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, borderRight: "1px solid", overflow: "hidden" }}>
          <ExploreFrame onUrlChange={(url) => { defaultRef.current = url; }} />
        </div>

        <aside style={{ display: "flex", flexDirection: "column", width: 240, overflow: "hidden" }}>
          <div style={{ borderBottom: "1px solid", padding: 8 }}>Preserved ({preserved.length})</div>

          <ul style={{ flex: 1, overflow: "auto", padding: 8, listStyle: "none", margin: 0 }}>
            {preserved.map((item) => {
            const displayUrl = item.url.replace("https://", "");
            const isLong = item.text.length > 500;
            const previewText = isLong ? item.text.slice(0, 500) + "…" : item.text;
            return (
                <li key={item.id} style={{ border: "1px solid", padding: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 9, color: "#666", display: "block", wordBreak: "break-all" }}>
                    {displayUrl}
                </span>
                <p style={{ fontSize: 10 }}>"{previewText}"</p>
                </li>
            );})}
          </ul>

          <div style={{ borderTop: "1px solid", padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            <button type="button">+ Highlight</button>
            <button type="button">+ Note</button>
          </div>
        </aside>
      </div>
      
      {/* modal popup overlaying iframe */}
      {selection && popupPos && (
        <div style={{ position: "fixed", left: popupPos.x, top: popupPos.y,
          transform: "translate(-50%, -100%)", background: "white",
          padding: "6px 10px", display: "flex", gap: 8, alignItems: "center",
        }}>
          {(() => {
            if (budgetLeft === 0) return <span style={{ color: "red" }}>No budget left</span>;
            if (timeLeft === 0) return <span style={{ color: "red" }}>Time expired</span>;
            return <button type="button" onClick={saveSelection}>✦ Save</button>;
          })()}
          <button type="button" onClick={() => { setSelection(null); setPopupPos(null); }} >✕</button>
        </div>
      )}
    </div>
  );
}
