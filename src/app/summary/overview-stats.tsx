"use client";

interface SummaryStatsProps {
  totalSiteWords: number | null;
  wordsPreserved: number;
  wordsLost: number | null;
  percentPreserved: number | null;
}

export default function SummaryStats({
  totalSiteWords,
  wordsPreserved,
  wordsLost,
  percentPreserved,
}: SummaryStatsProps) {
  return (
    <div style={{ borderBottom: "1px solid", paddingBottom: 8, marginBottom: 16 }}>
      {totalSiteWords === null ? (
        <span>Calculating total content...</span>
      ) : (
        <>
          <strong>You preserved {percentPreserved}% of available content</strong>
          <span style={{ marginLeft: 16, color: "#666" }}>
            {wordsPreserved} words saved, {wordsLost} words lost, {totalSiteWords} words total
          </span>
        </>
      )}
    </div>
  );
}
