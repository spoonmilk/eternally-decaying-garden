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
  if (!allowed.some((d) => parsed.hostname === d || parsed.hostname.endsWith("." + d))) {
    return new NextResponse("Domain not allowed", { status: 403 });
  }

  let res: Response;
  try {
    res = await fetch(target, { headers: { "User-Agent": "test" }, });
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

  const updatedScript = `
  <script>
  (function() {
    document.addEventListener('mouseup', function() {
      // text
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      var text = sel.toString().trim();
      if (text.length < 2) return;
      var range = sel.getRangeAt(0);
      var rect = range.getBoundingClientRect();
      window.parent.postMessage({
        type: 'SELECTION',
        text: text,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
      }, '*');
    });

    document.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'IMG') return;
      window.parent.postMessage({ type: 'CLEAR_SELECTION' }, '*');
    });

    // image
    document.addEventListener('click', function(e) {
      var target = e.target;
      if (target.tagName !== 'IMG') return;
      e.preventDefault();
      var rect = target.getBoundingClientRect();
      window.parent.postMessage({
        type: 'IMAGE_SELECTION',
        src: target.src,
        alt: target.alt || 'image',
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
      }, '*');
    });
  })();
  </script>`;

  if (html.includes("</head>")) {
    html = html.replace("</head>", updatedScript + "</head>");
  } else {
    html = updatedScript + html;
  }
  return new NextResponse(html, {
    status: res.status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-frame-options": "SAMEORIGIN",
    },
  });
}