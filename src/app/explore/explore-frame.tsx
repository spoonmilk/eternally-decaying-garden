"use client";

import { useEffect, useRef } from "react";
import { SITES, type SiteKey } from "./sites";

interface ExploreFrameProps {
    siteKey?: SiteKey;
    onSelection?: (text: string, rect: DOMRect) => void;
    onImageSelection?: (src: string, rect: DOMRect) => void;
    onClearSelection?: () => void;
}

// Some notes from Alex:
// This was starting to get refactored as frame to just render static html tags in-frame but there are issues
// with style continuity/containerizaiton that were driving me actually bonkers. Anyways, now it just serves
// from sites in the /public directory.
export default function ExploreFrame({
    siteKey = "csci-1377",
    onSelection,
    onImageSelection,
    onClearSelection,
}: ExploreFrameProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const onSelectionRef = useRef(onSelection);
    const onImageSelectionRef = useRef(onImageSelection);
    const onClearSelectionRef = useRef(onClearSelection);
    useEffect(() => {
        onSelectionRef.current = onSelection;
    }, [onSelection]);
    useEffect(() => {
        onImageSelectionRef.current = onImageSelection;
    }, [onImageSelection]);
    useEffect(() => {
        onClearSelectionRef.current = onClearSelection;
    }, [onClearSelection]);

    function handleLoad() {
        const iframe = iframeRef.current;
        const doc = iframe?.contentDocument;
        if (!doc) return;

        function iframeOffset() {
            const r = iframe!.getBoundingClientRect();
            return { x: r.left, y: r.top };
        }

        doc.addEventListener("mouseup", () => {
            const sel = doc.getSelection();
            if (!sel || sel.isCollapsed) return;
            const text = sel.toString().trim();
            if (text.length < 2) return;
            const r = sel.getRangeAt(0).getBoundingClientRect();
            const { x, y } = iframeOffset();
            onSelectionRef.current?.(
                text,
                new DOMRect(r.left + x, r.top + y, r.width, r.height),
            );
        });

        doc.addEventListener("mousedown", (e) => {
            if ((e.target as HTMLElement).tagName !== "IMG") {
                onClearSelectionRef.current?.();
            }
        });

        doc.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            if (target.tagName !== "IMG") return;
            e.preventDefault();
            const r = target.getBoundingClientRect();
            const { x, y } = iframeOffset();
            onImageSelectionRef.current?.(
                (target as HTMLImageElement).src,
                new DOMRect(r.left + x, r.top + y, r.width, r.height),
            );
        });
    }

    const site = SITES[siteKey];

    return (
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <iframe
                ref={iframeRef}
                src={site.dir + site.entryPage}
                onLoad={handleLoad}
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "block",
                }}
            />
        </div>
    );
}
