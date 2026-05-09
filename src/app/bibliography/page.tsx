import fs from "fs/promises";
import path from "path";

export default async function BibliographyPage() {
  const filePath = path.join(process.cwd(), "public", "content", "bibliography.md");
  const text = await fs.readFile(filePath, "utf8");
  const entries = text.split("\n").filter((line) => line.trim() !== "");

  return (
    <main className="bibliography-page">
      <div className="bibliography-content">
        <h1>Bibliography</h1>
        <ol className="bibliography-list">
          {entries.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ol>
      </div>
    </main>
  );
}
