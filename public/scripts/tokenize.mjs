import { readFileSync, writeFileSync } from "fs";

const inputPath = process.argv[2];
const outputPath = process.argv[3] || inputPath;

if (!inputPath) {
  console.error("Usage: node tokenize.mjs <input.html> [output.html]");
  process.exit(1);
}

let html = readFileSync(inputPath, "utf-8");

// wrap words in text nodes between tags
// matches text content between > and < that contains non-whitespace
html = html.replace(/>([^<]+)</g, (match, text) => {
  if (!text.trim()) return match;

  // ── CHANGED: don't escape, just split on whitespace and wrap words ──
  const tokenized = text.replace(/(\S+)/g, (word) => {
    return `<span class="decay-token" data-original="${word}">${word}</span>`;
  });

  return `>${tokenized}<`;
});

// inject decay.js before </body> if not already present
if (!html.includes("/scripts/decay.js")) {
  html = html.replace(
    "</body>",
    '    <script src="/scripts/decay.js"></script>\n</body>',
  );
}

writeFileSync(outputPath, html, "utf-8");
console.log(`Tokenized: ${inputPath} → ${outputPath}`);
