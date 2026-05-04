"use client";

import type { LostBlock } from "./summary-utils";
import { countWords } from "./summary-utils";

interface SummaryLostProps {
  lostBlocks: LostBlock[];
  wordsLost: number | null;
  totalSiteWords: number | null;
}

export default function SummaryLost({ lostBlocks, wordsLost, totalSiteWords }: SummaryLostProps) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
      <div style={{ marginBottom: 8, fontFamily: "monospace", color: "#7a2a2a" }}>
        - lost ({wordsLost ?? "..."} words decayed)
      </div>

      {lostBlocks.length === 0 && totalSiteWords !== null && (
        <div style={{ color: "#999", fontFamily: "monospace" }}>- (nothing was lost)</div>
      )}

      {lostBlocks.map((block, i) => (
        <div key={i} style={{
          background: "#fff0f0",
          borderLeft: "3px solid #7a2a2a",
          padding: "6px 10px",
          marginBottom: 8,
          fontFamily: "monospace",
          fontSize: 12,
          opacity: 0.6,
        }}>
          {block.kind === "image" ? (
            <img
              src={block.content}
              alt=""
              style={{
                width: "auto",
                maxWidth: "100%",
                maxHeight: 80,
                objectFit: "contain",
                filter: "grayscale(100%)",
                opacity: 0.5,
                display: "block",
              }}
            />
          ) : (
            <div style={{ color: "#1a1a1a", textDecoration: "line-through" }}>
              {/* TODO: probs replace the line strike through with some glitchy decaying chars */}
              {block.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
