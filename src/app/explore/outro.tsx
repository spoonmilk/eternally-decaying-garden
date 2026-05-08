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
      <span className="redac-reg">Debrief 1 // </span>
      <span className="redac-20">Link rot,</span>
      <span className="redac-35"> consumption, </span>
      <span className="redac-50">mechanisms of loss</span>
    </h1>
  ),
  1: (
    <h1>
      <span className="redac-reg">Debrief 2 // </span>
      <span className="redac-20">Bias & Justice</span>
      <span className="redac-35"> in </span>
      <span className="redac-50">Knowledge Work</span>
    </h1>
  ),
  2: (
    <h1>
      <span className="redac-reg">Debrief 3 // </span>
      <span className="redac-20">The Eternally</span>
      <span className="redac-35"> Decaying </span>
      <span className="redac-50">Garden</span>
    </h1>
  ),
};

export default function OutroContent({
  setIndex,
  isProse,
  content,
  onContinue,
}: OutroContentProps) {
  return (
    <div className="inter-content">
      {!isProse && DEBRIEF_HEADINGS[setIndex]}
      <div className={isProse ? "intro-body" : "inter-body"}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <button onClick={onContinue} className="inter-button">
        Continue
      </button>
    </div>
  );
}
