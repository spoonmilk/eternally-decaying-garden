"use client";

import type { Preserved } from "./use-preservation";
import { SET_IDS, type SetId, getSetForUrl } from "./sets";

interface ExploreSidebarProps {
  preserved: Preserved[];
  openSetIds: SetId[];
  onToggleSet: (setId: SetId) => void;
}

export default function ExploreSidebar({
  preserved,
  openSetIds,
  onToggleSet,
}: ExploreSidebarProps) {
  return (
    <aside className="right">
      <div className="archive-header">Archive</div>
      <div className="archive-content archive-accordions">
        {SET_IDS.map((setId) => {
          // CHANGED: derive setId from item.url since Preserved no longer has a setId field
          const itemsInSet = preserved.filter(
            (item) => getSetForUrl(item.url) === setId,
          );

          return (
            <div
              key={setId}
              className={`archive-accordion${openSetIds.includes(setId) ? " is-open" : ""}`}
            >
              <div
                className="archive-accordion-summary"
                onClick={() => onToggleSet(setId)}
              >
                <div className="summary-left">
                  <span className="set-name">{`Set ${setId}`}</span>
                  <span className="set-count">{`(${itemsInSet.length})`}</span>
                </div>
                {/* UNCHANGED — your chevron SVG */}
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
                    // UNCHANGED — your item rendering
                    itemsInSet.map((item) => {
                      const displayUrl = item.url.replace("https://", "");
                      let previewText: string | null = null;
                      if (item.kind === "text" && item.text) {
                        previewText =
                          item.text.length > 500
                            ? item.text.slice(0, 500) + "…"
                            : item.text;
                      }
                      return (
                        <li key={item.id}>
                          {item.kind === "image" ? (
                            <img src={item.imageSrc} alt="" />
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
  );
}
