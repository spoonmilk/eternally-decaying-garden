"use client";

import { useRef, useState } from "react";

const INITIAL_URL = "https://cel.cs.brown.edu/csci-1377-s26/";

const ALLOWED_DOMAINS = ["cel.cs.brown.edu"];

function isAllowed(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith("." + d),
    );
  } catch {
    return false;
  }
}

export default function ExploreFrame() {
  const [inputValue, setInputValue] = useState(INITIAL_URL);
  const [blockedUrl, setBlockedUrl] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navHistory = useRef<string[]>([INITIAL_URL]);
  const historyIdx = useRef(0);
  const lastNavUrl = useRef(INITIAL_URL);

  function updateButtons() {
    setCanGoBack(historyIdx.current > 0);
    setCanGoForward(historyIdx.current < navHistory.current.length - 1);
  }

  function pushHistory(url: string) {
    navHistory.current = navHistory.current.slice(0, historyIdx.current + 1);
    navHistory.current.push(url);
    historyIdx.current = navHistory.current.length - 1;
    updateButtons();
  }

  function iframeReplace(url: string) {
    iframeRef.current?.contentWindow?.location.replace(url);
  }

  function navigateTo(url: string) {
    let normalized = url.trim();
    if (normalized && !/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(normalized)) {
      normalized = "https://" + normalized;
    }
    setInputValue(normalized);
    if (!isAllowed(normalized)) {
      setBlockedUrl(normalized);
      return;
    }
    setBlockedUrl(null);
    pushHistory(normalized);
    lastNavUrl.current = normalized;
    iframeReplace(normalized);
  }

  function goBack() {
    if (historyIdx.current <= 0) return;
    historyIdx.current--;
    const url = navHistory.current[historyIdx.current];
    setInputValue(url);
    setBlockedUrl(null);
    updateButtons();
    lastNavUrl.current = url;
    try {
      iframeRef.current!.contentWindow!.history.back();
    } catch {
      iframeReplace(url);
    }
  }

  function goForward() {
    if (historyIdx.current >= navHistory.current.length - 1) return;
    historyIdx.current++;
    const url = navHistory.current[historyIdx.current];
    setInputValue(url);
    setBlockedUrl(null);
    updateButtons();
    lastNavUrl.current = url;
    try {
      iframeRef.current!.contentWindow!.history.forward();
    } catch {
      iframeReplace(url);
    }
  }

  function handleLoad() {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let url: string | undefined;
    try {
      url = iframe.contentWindow?.location.href;
    } catch {
      return;
    }
    if (!url || url === "about:blank" || url === lastNavUrl.current) return;
    if (!isAllowed(url)) {
      iframeReplace(lastNavUrl.current);
      return;
    }
    lastNavUrl.current = url;
    pushHistory(url);
    setInputValue(url);
  }

  return (
    <>
      <nav
        style={{
          borderBottom: "1px solid",
          padding: 8,
          display: "flex",
          gap: 8,
        }}
      >
        <button type="button" onClick={goBack} disabled={!canGoBack}>
          ←
        </button>
        <button type="button" onClick={goForward} disabled={!canGoForward}>
          →
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigateTo(inputValue);
          }}
          style={{ flex: 1, border: "1px solid" }}
        />
        <button type="button" onClick={() => navigateTo(inputValue)}>
          Go
        </button>
      </nav>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <iframe
          ref={iframeRef}
          src={INITIAL_URL}
          onLoad={handleLoad}
          style={{ width: "100%", height: "100%", border: "none" }}
          sandbox="allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
        />
        {blockedUrl && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              textAlign: "center",
              background: "white",
            }}
          >
            <p>
              <strong>{blockedUrl}</strong> is not in the allowed sites list.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
