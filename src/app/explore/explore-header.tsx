"use client";

interface ExploreHeaderProps {
  timeLeft: number;
  budgetLeft: number;
}

export default function ExploreHeader({
  timeLeft,
  budgetLeft,
}: ExploreHeaderProps) {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <header>
      <div className="decay-timer">
        <span
          style={{ color: timeLeft < 20 ? "red" : "inherit" }}
          className="name"
        >
          Decay Timer:
        </span>
        <span
          className="number"
          style={{ color: timeLeft < 20 ? "red" : "inherit" }}
        >
          {" "}
          {mins}:{secs}
        </span>
      </div>
      <a href="/" className="title">
        The Internet as an Eternally Decaying Garden
      </a>
      <div className="budget">
        <span className="name">Budget: </span>
        <span className="number"> {budgetLeft} / 500 words</span>
      </div>
    </header>
  );
}
