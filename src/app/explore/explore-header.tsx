"use client";

interface ExploreHeaderProps {
  timeLeft: number;
  budgetLeft: number;
}

export default function ExploreHeader({ timeLeft, budgetLeft }: ExploreHeaderProps) {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <header
      style={{
        border: "1px solid",
        borderBottom: "1px solid",
        padding: 8,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span style={{ color: timeLeft < 20 ? "red" : "inherit" }}>
        Timer {mins}:{secs}
      </span>
      <span>Budget: {budgetLeft} remaining</span>
    </header>
  );
}
