"use client";

import { useEffect, useState } from "react";
import type { Preserved } from "../explore/use-preservation";

export default function Summary() {
  const [preserved, setPreserved] = useState<Preserved[]>([]);

  // read saved items from sessionStorage when page loads
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("preserved") ?? "[]");
    setPreserved(data);
  }, []);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      {/* currently just simply displays what the user saved from explore page 
      let's discuss plans/more effective layout in person!!! */}
      <div style={{ border: "1px solid", width: 600 }}>
        <div style={{ borderBottom: "1px solid", padding: 8 }}>
          Reflecting back on what you chose to preserve...
        </div>
        <ul style={{ margin: 0, padding: 8 }}>
          {preserved.map((item) => (
            <li key={item.id} style={{ border: "1px solid", padding: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 10, display: "block", marginBottom: 4 }}>
                {item.url.replace("https://", "")}
              </span>
              {item.kind === "image"
                ? <img src={item.imageSrc} alt="" style={{ width: "100%" }} />
                : <p style={{ fontSize: 10, margin: 0 }}>"{item.text}"</p>
              }
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
