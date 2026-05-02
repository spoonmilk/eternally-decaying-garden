"use client";

import type { Preserved } from "../explore/use-preservation";
import { countWords } from "./summary-utils";

interface SummaryPreservedProps {
  preserved: Preserved[];
  wordsPreserved: number;
}

export default function SummaryPreserved({ preserved, wordsPreserved }: SummaryPreservedProps) {
  const textItems = preserved.filter((item) => item.kind === "text");
  const imageItems = preserved.filter((item) => item.kind === "image");

  return (
    <div style={{ flex: 1, borderRight: "1px solid", overflowY: "auto", padding: 12 }}>
      <div style={{ marginBottom: 8, fontFamily: "monospace", color: "#2a7a2a" }}>
        + preserved ({preserved.length} items, {wordsPreserved} words)
      </div>

      {preserved.length === 0 && (
        <div style={{ color: "#999", fontFamily: "monospace" }}>+ (nothing was saved)</div>
      )}

      {textItems.map((item) => (
        <div key={item.id} style={{
          background: "#e6ffed",
          borderLeft: "3px solid #2a7a2a",
          padding: "6px 10px",
          marginBottom: 8,
          fontFamily: "monospace",
          fontSize: 12,
        }}>
          <div style={{ color: "#1a1a1a" }}>{item.text}</div>
        </div>
      ))}

      {imageItems.map((item) => (
        <div key={item.id} style={{
          background: "#e6ffed",
          borderLeft: "3px solid #2a7a2a",
          padding: "6px 10px",
          marginBottom: 8,
        }}>
          <img
            src={item.imageSrc}
            alt=""
            style={{ width: "100%", maxHeight: 120, objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  );
}
