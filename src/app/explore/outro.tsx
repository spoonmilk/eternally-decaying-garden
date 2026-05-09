"use client";

import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

interface OutroContentProps {
  setIndex: number;
  screen: number;
  content: string;
  isProse: boolean;
  onContinue: () => void;
}

const DEBRIEF_HEADINGS: Record<number, ReactNode> = {
  0: (
    <h1>
      <span className="redac-reg">Interlude 1 // </span>
      <span className="redac-20">Timescales</span>
      <span className="redac-35"> of the </span>
      <span className="redac-50">Internet</span>
    </h1>
  ),
  1: (
    <h1>
      <span className="redac-reg">Interlude 2 // </span>
      <span className="redac-20">Link rot,</span>
      <span className="redac-35"> consumption, </span>
      <span className="redac-50">mechanisms of loss</span>
    </h1>
  ),
  2: (
    <h1>
      <span className="redac-reg">Interlude 3 // </span>
      <span className="redac-20">Bias & Justice</span>
      <span className="redac-35"> in </span>
      <span className="redac-50">Knowledge Work</span>
    </h1>
  ),
};

export default function OutroContent({
  setIndex,
  screen,
  isProse,
  content,
  onContinue,
}: OutroContentProps) {
  const isOutroScreen = setIndex === 2 && screen === 2;

  return (
    <div className="inter-content">
      {isOutroScreen ? (
        <h1>
          <span className="redac-reg">Reflection // </span>
          <span className="redac-reg">What we </span>
          <span className="redac-20">might mean </span>
          <br></br>
          <span className="redac-35">when we talk about</span>
          <br></br>
          <span className="redac-50">Internet Preservation</span>
        </h1>
      ) : (
        isProse && DEBRIEF_HEADINGS[setIndex]
      )}
      <div className={isProse ? "intro-body" : "inter-body"}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <button onClick={onContinue} className="inter-button">
        Continue
      </button>
    </div>
  );
}
