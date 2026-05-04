"use client";

import { useEffect, useState } from "react";
import type { Preserved } from "../explore/use-preservation";
import {
  type LostBlock,
  computeLostBlocks,
  countTotalSiteWords,
  getWordCount,
} from "./summary-utils";
import SummaryLost from "./summary-lost";
import SummaryPreserved from "./summary-preserved";
import SummaryStats from "./overview-stats";

export default function Summary() {
  const [preserved, setPreserved] = useState<Preserved[]>([]);
  const [totalSiteWords, setTotalSiteWords] = useState<number | null>(null);
  const [lostBlocks, setLostBlocks] = useState<LostBlock[]>([]);

  useEffect(() => {
    const data: Preserved[] = JSON.parse(
      sessionStorage.getItem("preserved") ?? "[]",
    );
    setPreserved(data);

    countTotalSiteWords().then(setTotalSiteWords);
    computeLostBlocks(data).then(setLostBlocks);
  }, []);

  const wordsPreserved = preserved.reduce(
    (sum, item) => sum + getWordCount(item),
    0,
  );
  const wordsLost =
    totalSiteWords !== null
      ? Math.max(0, totalSiteWords - wordsPreserved)
      : null;
  const percentPreserved = totalSiteWords
    ? Math.round((wordsPreserved / totalSiteWords) * 100)
    : null;

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <SummaryStats
        totalSiteWords={totalSiteWords}
        wordsPreserved={wordsPreserved}
        wordsLost={wordsLost}
        percentPreserved={percentPreserved}
      />

      <div style={{ display: "flex", height: "calc(100vh - 80px)" }}>
        <SummaryPreserved
          preserved={preserved}
          wordsPreserved={wordsPreserved}
        />
        <SummaryLost
          lostBlocks={lostBlocks}
          wordsLost={wordsLost}
          totalSiteWords={totalSiteWords}
        />
      </div>
    </main>
  );
}
