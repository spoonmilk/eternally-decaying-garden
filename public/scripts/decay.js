(function () {
  ("use strict");

  const CMYK = ["cyan", "magenta", "yellow", "black"];
  const originalTexts = new Map();
  const BLACK_SQUARE = "█";

  let currentPhase = -1;
  let decayInterval = null;
  let cyclePercent = 10;
  let blackoutStarted = false;
  let blackoutSpans = [];
  let timeBudget = null;

  function getSpans() {
    return Array.from(document.querySelectorAll(".decay-token"));
  }

  function getImages() {
    return Array.from(document.querySelectorAll("img"));
  }

  function getPhase(tLeft) {
    const elapsed = timeBudget - tLeft;
    const interval = timeBudget / 6;
    if (elapsed < interval * 1) return 0;
    if (elapsed < interval * 2) return 1;
    if (elapsed < interval * 3) return 2;
    if (elapsed < interval * 4) return 3;
    if (elapsed < interval * 5) return 4;
    return 5;
  }

  function randomCMYK() {
    return CMYK[Math.floor(Math.random() * CMYK.length)];
  }

  function applyColor(span, color) {
    span.style.backgroundColor = color;
    span.style.color = "black";
  }

  function resetSpan(span) {
    span.style.backgroundColor = "";
    span.style.color = "";
  }

  // replace text with black squares
  function blackenSpan(span) {
    if (!originalTexts.has(span)) {
      originalTexts.set(span, span.textContent);
    }
    span.style.backgroundColor = "black";
    span.style.color = "black";
    // replace text so copying yields black squares
    const original = span.dataset.original || span.textContent || "";
    span.textContent = BLACK_SQUARE.repeat(Math.max(1, original.length));
  }

  // blacken an image by covering it with a black overlay div
  function blackenImage(img) {
    if (img.dataset.blackened) return;
    img.dataset.blackened = "true";
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = img.style.display || "block";
    wrapper.style.width = img.offsetWidth + "px";
    wrapper.style.height = img.offsetHeight + "px";
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.inset = "0";
    overlay.style.backgroundColor = "black";
    wrapper.appendChild(overlay);
    img._blackenWrapper = wrapper;
  }

  function pickRandom(arr, count) {
    return [...arr]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, arr.length));
  }

  function clearDecayInterval() {
    if (decayInterval) {
      clearInterval(decayInterval);
      decayInterval = null;
    }
  }

  function runPhase1Cycle() {
    const spans = getSpans();
    spans.forEach(resetSpan);
    const count = Math.max(1, Math.floor(spans.length * 0.05));
    pickRandom(spans, count).forEach((s) => applyColor(s, randomCMYK()));
  }

  function runPhase2Cycle() {
    const spans = getSpans();
    spans.forEach(resetSpan);
    const count = Math.max(1, Math.floor((spans.length * cyclePercent) / 100));
    pickRandom(spans, count).forEach((s) => applyColor(s, randomCMYK()));
    cyclePercent += 1;
  }

  function runPhase3Cycle() {
    const spans = getSpans();
    const count = Math.max(1, Math.floor((spans.length * cyclePercent) / 100));
    pickRandom(spans, count).forEach((s) => applyColor(s, randomCMYK()));
    cyclePercent += 1;
  }

  function startSlowBlackout() {
    if (blackoutStarted) return;
    blackoutStarted = true;
    clearDecayInterval();

    const spans = getSpans();
    blackoutSpans = [...spans].sort(() => Math.random() - 0.5);
    const N = blackoutSpans.length;
    const totalMs = 28000;

    blackoutSpans.forEach((span, i) => {
      const t = i / N;
      const delay = totalMs * Math.pow(t, 2);
      setTimeout(() => blackenSpan(span), delay);
    });

    // blacken half of images spread over the phase
    const halfImages = pickRandom(
      getImages(),
      Math.floor(getImages().length / 2),
    );
    halfImages.forEach((img, idx) => {
      setTimeout(
        () => blackenImage(img),
        (idx / Math.max(1, halfImages.length)) * totalMs,
      );
    });
  }

  function startFastBlackout() {
    clearDecayInterval();

    const remaining =
      blackoutSpans.length > 0
        ? blackoutSpans.filter((s) => s.style.backgroundColor !== "black")
        : [...getSpans()].sort(() => Math.random() - 0.5);

    getImages().forEach(blackenImage);

    const N = remaining.length;
    const totalMs = 20000; // faster phase

    // schedule all remaining spans
    remaining.forEach((span, i) => {
      const delay = (i / N) * totalMs;
      setTimeout(() => blackenSpan(span), delay);
    });

    // guarantee everything is blackened at the end
    setTimeout(() => {
      document
        .querySelectorAll(".decay-token")
        .forEach((span) => blackenSpan(span));
      document.body.style.backgroundColor = "black";
    }, totalMs + 500);
  }

  function startPhase(phase) {
    clearDecayInterval();
    if (phase === 0) {
      getSpans().forEach(resetSpan);
      return;
    }
    if (phase === 1) {
      runPhase1Cycle();
      decayInterval = setInterval(runPhase1Cycle, 2000);
    }
    if (phase === 2) {
      cyclePercent = 10;
      runPhase2Cycle();
      decayInterval = setInterval(runPhase2Cycle, 2000);
    }
    if (phase === 3) {
      runPhase3Cycle();
      decayInterval = setInterval(runPhase3Cycle, 2000);
    }
    if (phase === 4) {
      startSlowBlackout();
    }
    if (phase === 5) {
      startFastBlackout();
    }
  }

  setInterval(function () {
    const tLeft = window.decayTimeLeft;
    if (tLeft === undefined) return;
    if (timeBudget === null) {
      timeBudget = tLeft;
      return;
    }
    const newPhase = getPhase(tLeft);
    if (newPhase !== currentPhase) {
      currentPhase = newPhase;
      startPhase(newPhase);
    }
  }, 500);
})();

window.decayReset = function () {
  // restore spans
  document.querySelectorAll(".decay-token").forEach((span) => {
    span.style.backgroundColor = "";
    span.style.color = "";
    if (originalTexts.has(span)) {
      span.textContent = originalTexts.get(span);
    } else {
      span.textContent = span.dataset.original || span.textContent;
    }
  });
  originalTexts.clear();

  // restore images
  document.querySelectorAll("img").forEach((img) => {
    if (img._blackenWrapper) {
      img._blackenWrapper.parentNode.insertBefore(img, img._blackenWrapper);
      img._blackenWrapper.remove();
      img._blackenWrapper = null;
      delete img.dataset.blackened;
    }
  });

  // restore body color
  document.body.style.backgroundColor = "";

  // reset all decay states
  currentPhase = -1;
  cyclePercent = 10;
  blackoutStarted = false;
  blackoutSpans = [];
  timeBudget = null;
  clearDecayInterval();
};
