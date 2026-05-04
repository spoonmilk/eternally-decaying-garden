import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("url");
  if (!target) return new NextResponse("Missing url", { status: 400 });

  // allowed domains
  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }
  const allowed = ["cel.cs.brown.edu"];
  if (
    !allowed.some(
      (d) => parsed.hostname === d || parsed.hostname.endsWith("." + d),
    )
  ) {
    return new NextResponse("Domain not allowed", { status: 403 });
  }

  let res: Response;
  try {
    res = await fetch(target, { headers: { "User-Agent": "test" } });
  } catch {
    return new NextResponse("Fetch failed", { status: 502 });
  }

  const contentType = res.headers.get("content-type") ?? "";

  // fonts and images
  if (!contentType.includes("text/html")) {
    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: res.status,
      headers: { "content-type": contentType },
    });
  }

  let html = await res.text();
  const base = `${parsed.origin}`;
  html = html
    .replace(/(href|src|action)="(\/[^"]*?)"/g, (_, attr, path) => {
      const absolute = base + path;
      return `${attr}="/api/proxy?url=${encodeURIComponent(absolute)}"`;
    })
    .replace(/(href|src|action)='(\/[^']*?)'/g, (_, attr, path) => {
      const absolute = base + path;
      return `${attr}='/api/proxy?url=${encodeURIComponent(absolute)}'`;
    });

  return new NextResponse(html, {
    status: res.status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-frame-options": "SAMEORIGIN",
    },
  });
}
