import type { Preserved } from "../explore/use-preservation";
import { SITES } from "../explore/sites";

export const IMAGE_WORD_COST = 20;

export function countWords(text: string) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function getWordCount(item: Preserved): number {
  if (item.kind === "image") return IMAGE_WORD_COST;
  return countWords(item.text ?? "");
}

export function getFilename(src: string): string {
  return src.split("/").pop() ?? src;
}

export function extractBlocksFromHtml(
  html: string,
  baseDir: string
): { kind: "text" | "image"; content: string }[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const results: { kind: "text" | "image"; content: string }[] = [];

  // not the cleanest i'll admit, but helps preserve original structure for the right/decayed side
  const elements = doc.body?.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, figcaption, img"
  );
  if (!elements) return results;

  for (const el of Array.from(elements)) {
    if (el.tagName === "IMG") {
      const src = (el as HTMLImageElement).getAttribute("src") ?? "";
      if (!src || src.startsWith("data:")) continue;
      const absoluteSrc = src.startsWith("http") ? src : baseDir + src;
      results.push({ kind: "image", content: absoluteSrc });
    } else {
      const text = (el as HTMLElement).innerText?.trim() ?? "";
      if (text.length > 0) {
        results.push({ kind: "text", content: text });
      }
    }
  }

  return results;
}

export async function countTotalSiteWords(): Promise<number> {
  let total = 0;
  for (const site of Object.values(SITES)) {
    for (const page of site.allPages) {
      try {
        const res = await fetch(site.dir + page);
        const html = await res.text();
        const blocks = extractBlocksFromHtml(html, site.dir);
        total += blocks
          .filter((b) => b.kind === "text")
          .reduce((sum, b) => sum + countWords(b.content), 0);
      } catch {
        console.warn(`Error fetching ${site.dir + page}`);
      }
    }
  }
  return total;
}

export type LostBlock = { kind: "text" | "image"; content: string };

export async function computeLostBlocks(data: Preserved[]): Promise<LostBlock[]> {
  const savedTexts = data
    .filter((item) => item.kind === "text")
    .map((item) => item.text ?? "");

  const savedImageFilenames = data
    .filter((item) => item.kind === "image")
    .map((item) => getFilename(item.imageSrc ?? ""));

  const lost: LostBlock[] = [];

  for (const site of Object.values(SITES)) {
    for (const page of site.allPages) {
      try {
        const res = await fetch(site.dir + page);
        const html = await res.text();
        const blocks = extractBlocksFromHtml(html, site.dir);

        for (const block of blocks) {
          if (block.kind === "image") {
            const wasSaved = savedImageFilenames.includes(getFilename(block.content));
            if (!wasSaved) lost.push(block);
          } else {
            const wasSaved = savedTexts.some(
              (saved) => saved.includes(block.content) || block.content.includes(saved)
            );
            if (!wasSaved) lost.push(block);
          }
        }
      } catch {
        console.warn(`Error fetching ${site.dir + page}`);
      }
    }
  }

  return lost;
}
