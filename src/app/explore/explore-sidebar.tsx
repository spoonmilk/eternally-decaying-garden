"use client";

import type { Preserved } from "./use-preservation";

interface ExploreSidebarProps {
  preserved: Preserved[];
}

export default function ExploreSidebar({ preserved }: ExploreSidebarProps) {
  return (
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
  );
}
