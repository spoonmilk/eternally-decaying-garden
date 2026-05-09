import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import "./globals.css";

export default async function Home() {
  const textFilePath = path.join(
    process.cwd(),
    "public",
    "content",
    "introduction.md",
  );
  const text = await fs.readFile(textFilePath, "utf8");

  return (
    <main className="start">
      <div className="start-content">
        <h1 className="site-title">
          <span className="redac-reg">The </span>
          <span className="redac-20" style={{ backgroundColor: "cyan" }}>
            Inter
          </span>
          <span className="redac-20">net</span>
          <br></br>
          <span className="redac-35" style={{ backgroundColor: "yellow" }}>
            as
          </span>
          <span className="redac-35"> an</span>
          <br></br>
          <span className="redac-50">Eternally </span>
          <span className="redac-50" style={{ backgroundColor: "magenta" }}>
            Decay
          </span>
          <span className="redac-50">ing</span>
          <br></br>
          <span className="redac-70">Gar</span>
          <span className="redac-70" style={{ backgroundColor: "black" }}>
            den
          </span>
        </h1>
        <Link href="/explore" passHref>
          <button className="inter-button">Begin</button>
        </Link>
      </div>
    </main>
  );
}
