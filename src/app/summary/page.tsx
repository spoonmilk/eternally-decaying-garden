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
      <div style={{ border: "1px solid", width: 600 }}>Coming soon</div>
    </main>
  );
}
