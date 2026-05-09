"use client";

import ReactMarkdown from "react-markdown";

interface IntroContentProps {
  setIndex: number;
  screen: number;
  content: string;
  isProse: boolean;
  onAdvance: () => void;
}

export default function IntroContent({
  screen,
  content,
  isProse,
  onAdvance,
}: IntroContentProps) {
  return (
    <div className="inter-content">
      {screen === 1 && (
        <h1>
          <span className="redac-reg">Introduction // </span>
          <span className="redac-20">Definitions, </span>
          <span className="redac-35">Preamble, </span>
          <span className="redac-50">Expectations</span>
        </h1>
      )}
      <div className={isProse ? "intro-body" : "inter-body"}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <button onClick={onAdvance} className="inter-button">
        Continue
      </button>
    </div>
  );
}
