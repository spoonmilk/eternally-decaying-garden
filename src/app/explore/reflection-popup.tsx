"use client";

import { useRef, useState } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  Hourglass,
} from "react95";
import { ThemeProvider } from "styled-components";
import original from "react95/dist/themes/original";

const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="14"
    viewBox="0 0 16 14"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 0H4V2H6V4H10V2H12V0H16V2H14V4H12V6H10V8H12V10H14V12H16V14H12V12H10V10H6V12H4V14H0V12H2V10H4V8H6V6H4V4H2V2H0V0Z"
      fill="black"
    />
  </svg>
);

interface ReflectionPopupProps {
  body: string;
  initialX: number;
  initialY: number;
  onDismiss: () => void;
}

export default function ReflectionPopup({
  body,
  initialX,
  initialY,
  onDismiss,
}: ReflectionPopupProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return;
    setPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  }

  function onMouseUp() {
    dragging.current = false;
  }

  return (
    <ThemeProvider theme={original}>
      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          zIndex: 200,
          width: 240,
        }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <Window style={{ width: "100%" }}>
          <WindowHeader
            onMouseDown={onMouseDown}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 20,
              padding: "4px",
              cursor: "grab",
              userSelect: "none",
            }}
          >
            <div className="window-name">
              <Hourglass size={20} />
              <span
                style={{
                  fontFamily: "MS Sans Serif",
                  fontStyle: "bold",
                  paddingTop: "3px",
                }}
              >
                Reflect
              </span>
            </div>
            <Button
              onClick={onDismiss}
              style={{ minWidth: 24, height: 24, padding: 0 }}
            >
              <IconClose />
            </Button>
          </WindowHeader>
          <WindowContent
            style={{
              fontFamily: "MS Sans Serif",
              fontSize: 20,
              padding: "8px",
            }}
          >
            {body}
          </WindowContent>
        </Window>
      </div>
    </ThemeProvider>
  );
}
