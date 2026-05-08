"use client";

import { useEffect, useRef, useState } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  TextInput,
  Frame,
  Toolbar,
  Hourglass,
} from "react95";
import { ThemeProvider } from "styled-components";
import original from "react95/dist/themes/original";
import { ALL_PAGES, DEFAULT_URLS, PAGE_SETS } from "./sets";

interface ExploreFrameProps {
  onUrlChange?: (url: string) => void;
  activeSetId: number;
  onSelection?: (text: string, rect: DOMRect) => void;
  onImageSelection?: (src: string, rect: DOMRect) => void;
  onClearSelection?: () => void;
  timeBudget: number;
  timeLeft: number;
  budgetLeft: number;
  onDecayComplete: () => void;
}

const SET_NAMES: Record<number, string> = {
  1: "Act 1: Timescales of the Internet",
  2: "Act 2: Link rot, Consumption, Mechanisms of Loss",
  3: "Act 3: Bias & Justice in Knowledge Work",
};

export default function ExploreFrame({
  onUrlChange,
  activeSetId,
  onSelection,
  onImageSelection,
  onClearSelection,
  timeBudget,
  timeLeft,
  budgetLeft,
  onDecayComplete,
}: ExploreFrameProps) {
  const initialPage = DEFAULT_URLS[activeSetId] ?? DEFAULT_URLS[1];
  const [inputUrl, setInputUrl] = useState(initialPage.displayUrl);
  const [iframeUrl, setIframeUrl] = useState(initialPage.fileUrl);
  const [pageIndex, setPageIndex] = useState(
    ALL_PAGES.findIndex((p) => p.setId === activeSetId),
  );

  // const [blockedUrl, setBlockedUrl] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navHistory = useRef<string[]>([initialPage.fileUrl]);
  const historyIdx = useRef(0);
  const lastNavUrl = useRef(initialPage.fileUrl);

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

  useEffect(() => {
    // reset decay state in the iframe when set advances
    try {
      (iframeRef.current?.contentWindow as any)?.decayReset?.();
    } catch {}

    const newPage = DEFAULT_URLS[activeSetId] ?? DEFAULT_URLS[1];
    setInputUrl(newPage.displayUrl);
    setIframeUrl(newPage.fileUrl);
    setPageIndex(ALL_PAGES.findIndex((p) => p.setId === activeSetId));
    navHistory.current = [newPage.fileUrl];
    historyIdx.current = 0;
    lastNavUrl.current = newPage.fileUrl;
    setCanGoBack(false);
    setCanGoForward(false);
    onUrlChange?.(newPage.displayUrl);
  }, [activeSetId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      if (iframeRef.current?.contentWindow) {
        (iframeRef.current.contentWindow as any).decayTimeLeft = timeLeft;
        (iframeRef.current.contentWindow as any).decayTotalTime = timeBudget;
      }
    } catch {}
  }, [timeLeft, timeBudget]);

  // for displaying page index in the status bar
  const pagesInCurrentSet = ALL_PAGES.filter(
    (p) => p.setId === ALL_PAGES[pageIndex].setId,
  );
  const indexInSet = pagesInCurrentSet.findIndex(
    (p) => p.fileUrl === ALL_PAGES[pageIndex].fileUrl,
  );

  // when navigating between pages in set, separate from the browser ones
  function goPrevPage() {
    const newIndex = pageIndex - 1;
    if (newIndex < 0) return;
    const page = ALL_PAGES[newIndex];
    setPageIndex(newIndex);
    setIframeUrl(page.fileUrl);
    setInputUrl(page.displayUrl);
    onUrlChange?.(page.displayUrl);
  }

  function goNextPage() {
    const newIndex = pageIndex + 1;
    if (newIndex >= ALL_PAGES.length) return;
    const page = ALL_PAGES[newIndex];
    setPageIndex(newIndex);
    setIframeUrl(page.fileUrl);
    setInputUrl(page.displayUrl);
    onUrlChange?.(page.displayUrl);
  }

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

  function navigateTo(url: string) {
    const match = ALL_PAGES.find((p) => p.displayUrl === url.trim());
    if (match) {
      setInputUrl(match.displayUrl);
      pushHistory(match.fileUrl);
      lastNavUrl.current = match.fileUrl;
      setIframeUrl(match.fileUrl);
      onUrlChange?.(match.displayUrl);
    }
  }

  function handleSearch() {
    navigateTo(inputUrl);
  }

  function goBack() {
    if (historyIdx.current <= 0) return;
    historyIdx.current--;
    const url = navHistory.current[historyIdx.current];
    setInputUrl(url);
    updateButtons();
    lastNavUrl.current = url;
    onUrlChange?.(url);
    try {
      iframeRef.current!.contentWindow!.history.back();
    } catch {
      setIframeUrl(url);
    }
  }

  function goForward() {
    if (historyIdx.current >= navHistory.current.length - 1) return;
    historyIdx.current++;
    const url = navHistory.current[historyIdx.current];
    setInputUrl(url);
    updateButtons();
    lastNavUrl.current = url;
    onUrlChange?.(url);
    try {
      iframeRef.current!.contentWindow!.history.forward();
    } catch {
      setIframeUrl(url);
    }
  }

  function handleLoad() {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    try {
      (iframe.contentWindow as any).decayTimeLeft = timeLeft;
      (iframe.contentWindow as any).decayTotalTime = timeBudget;
    } catch {}

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

  return (
    <ThemeProvider theme={original}>
      <Window
        style={{
          width: "100%",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: "MS Sans Serif",
        }}
      >
        <WindowHeader
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 20,
            padding: "4px",
          }}
        >
          <div className="window-name">
            <Hourglass size={20} />
            <span style={{ paddingTop: "3px" }}>{SET_NAMES[activeSetId]}</span>
          </div>

          <div className="browser-buttons">
            <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="4"
                viewBox="0 0 16 4"
                fill="none"
              >
                <path d="M0 0H16V4H0V0Z" fill="black" />
              </svg>
            </Button>
            <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18 0H0V18H18V0ZM16 4H2V16H16V4Z"
                  fill="black"
                />
              </svg>
            </Button>
            <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
              >
                <g clipPath="url(#clip0_150_2901)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 0H4V2H6V4H10V2H12V0H16V2H14V4H12V6H10V8H12V10H14V12H16V14H12V12H10V10H6V12H4V14H0V12H2V10H4V8H6V6H4V4H2V2H0V0Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_150_2901">
                    <rect width="16" height="14" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Button>
          </div>
        </WindowHeader>
        <div className="divider">
          <div className="line1"></div>
          <div className="line2"></div>
        </div>
        <Toolbar
          style={{
            display: "flex",
            height: "40px",
            gap: "8px",
            alignItems: "center",
            margin: "6px",
          }}
        >
          <div className="browser-buttons">
            <Button style={{ width: "40px", height: "40px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="26"
                viewBox="0 0 15 26"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.7693 25.8462L14.7693 0L11.077 -1.59154e-07L11.077 3.69231L7.38467 3.69231L7.38467 7.38461L3.69236 7.38461L3.69236 11.0769L5.67295e-05 11.0769L5.65658e-05 14.7692L3.69236 14.7692L3.69236 18.4615L7.38467 18.4615L7.38467 22.1538L11.077 22.1538L11.077 25.8462L14.7693 25.8462Z"
                  fill="black"
                />
              </svg>
            </Button>
            <Button style={{ width: "40px", height: "40px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="26"
                viewBox="0 0 15 26"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.14557e-06 25.8462L0 0L3.69231 -1.59154e-07L3.69231 3.69231L7.38462 3.69231L7.38462 7.38461L11.0769 7.38461L11.0769 11.0769L14.7692 11.0769L14.7692 14.7692L11.0769 14.7692L11.0769 18.4615L7.38462 18.4615L7.38462 22.1538L3.69231 22.1538L3.69231 25.8462L1.14557e-06 25.8462Z"
                  fill="black"
                />
              </svg>
            </Button>
          </div>
          <TextInput
            value={inputUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputUrl(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter") handleSearch();
            }}
            style={{ flex: 1, height: "40px" }}
            className="search-input"
          />
          <Button
            style={{
              padding: "6px 16px",
              whiteSpace: "nowrap",
              fontSize: 20,
              height: "40px",
              display: "flex",
              gap: "8px",
            }}
          >
            Search
          </Button>
        </Toolbar>
        <div className="divider">
          <div className="line1"></div>
          <div className="line2"></div>
        </div>
        <WindowContent
          style={{
            flex: 1,
            minHeight: 0,
            padding: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {timeLeft === 0 ? (
            <div className="not-found">
              <div className="not-found-content">
                <div className="not-found-headers">
                  <h1>404</h1>
                  <h2>Page Not Found</h2>
                </div>

                <p>
                  {`The requested URL ${inputUrl} was not found on this server.`}
                </p>
                <Button
                  onClick={onDecayComplete}
                  style={{
                    fontSize: 20,
                    height: 40,
                    width: "fit-content",
                    padding: "8px 16px",
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              onLoad={handleLoad}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
            />
          )}
        </WindowContent>
        <div
          style={{
            display: "flex",
            height: 40,
            marginTop: "8px",
            marginBottom: "2px",
          }}
        >
          <Frame
            style={{ flex: 1, height: 40, padding: "2px 8px", fontSize: 20 }}
          >
            Page {indexInSet + 1} / {pagesInCurrentSet.length}
          </Frame>
          <Frame
            style={{ flex: 1, height: 40, padding: "2px 8px", fontSize: 20 }}
          >
            {" "}
          </Frame>
          <Frame
            style={{ flex: 1, height: 40, padding: "2px 8px", fontSize: 20 }}
          >
            {" "}
          </Frame>
          <div className="browser-buttons">
            <Button
              onClick={goPrevPage}
              disabled={pageIndex === 0}
              style={{
                height: 40,
                fontSize: 20,
                display: "flex",
                gap: "8px",
                padding: "6px 16px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="18"
                viewBox="0 0 10 18"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 18L10 0L7.5 -1.07761e-07V2.57143L5 2.57143V5.14286L2.5 5.14286L2.5 7.71429L0 7.71429V10.2857L2.5 10.2857V12.8571L5 12.8571V15.4286L7.5 15.4286V18L10 18Z"
                  fill={pageIndex === 0 ? "#808080" : "black"}
                />
              </svg>
              Prev
            </Button>
            <Button
              onClick={goNextPage}
              disabled={indexInSet === pagesInCurrentSet.length - 1}
              style={{
                height: 40,
                fontSize: 20,
                display: "flex",
                gap: "8px",
                padding: "6px 16px",
              }}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="18"
                viewBox="0 0 10 18"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 18L0 0L2.5 -1.07761e-07V2.57143L5 2.57143V5.14286L7.5 5.14286L7.5 7.71429L10 7.71429V10.2857L7.5 10.2857V12.8571L5 12.8571V15.4286L2.5 15.4286V18L0 18Z"
                  fill={
                    indexInSet === pagesInCurrentSet.length - 1
                      ? "#808080"
                      : "black"
                  }
                />
              </svg>
            </Button>
          </div>
        </div>
      </Window>
    </ThemeProvider>
  );
}
