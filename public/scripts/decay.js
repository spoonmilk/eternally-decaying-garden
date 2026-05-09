(function () {
  "use strict";

  const CMYK = ["cyan", "magenta", "yellow", "black"];
  const originalTexts = new Map();
  const BLACK_SQUARE = "█";

  let currentPhase = -1;
  let decayInterval = null;
  let cyclePercent = 10;
  let blackoutStarted = false;
  let blackoutSpans = [];
  let initialized = false;

  function getTotalTime() {
    return window.decayTotalTime ?? 90;
  }

  function getSpans() {
    return Array.from(document.querySelectorAll(".decay-token"));
  }

  function getImages() {
    return Array.from(document.querySelectorAll("img"));
  }

  function getPhase(tLeft) {
    const total = getTotalTime();
    const elapsed = total - tLeft;
    const interval = total / 6;
    if (elapsed < interval) return 0;
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

  function blackenSpan(span) {
    if (!originalTexts.has(span)) {
      originalTexts.set(span, span.textContent);
    }
    span.style.backgroundColor = "black";
    span.style.color = "black";
    const original = span.dataset.original || span.textContent || "";
    span.textContent = BLACK_SQUARE.repeat(Math.max(1, original.length));
  }

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

  function jumpToPhase(phase, tLeft) {
    clearDecayInterval();

    if (phase === 0) {
      getSpans().forEach(resetSpan);
      return;
    }

    if (phase === 1) {
      runPhase1Cycle();
      decayInterval = setInterval(runPhase1Cycle, 2000);
      return;
    }

    if (phase === 2) {
      // estimate how many 2s cycles have already fired and advance cyclePercent
      const elapsed = msElapsedInPhase(tLeft, 2);
      cyclePercent = 10 + Math.floor(elapsed / 2000);
      runPhase2Cycle();
      decayInterval = setInterval(runPhase2Cycle, 2000);
      return;
    }

    if (phase === 3) {
      const elapsed = msElapsedInPhase(tLeft, 3);
      cyclePercent = Math.max(cyclePercent, 10 + Math.floor(elapsed / 2000));
      runPhase3Cycle();
      decayInterval = setInterval(runPhase3Cycle, 2000);
      return;
    }

    if (phase === 4 || phase === 5) {
      // both phases use the same blackout, calibrated from phase 4 start to tLeft=0
      // jumpToSlowBlackout handles mid-blackout correctly regardless of which phase we're in
      jumpToSlowBlackout(tLeft);
      return;
    }
  }

  function jumpToSlowBlackout(tLeft) {
    if (blackoutStarted) return;
    blackoutStarted = true;
    clearDecayInterval();

    const total = getTotalTime();
    const interval = total / 6;
    // phase 4 starts when tLeft = interval * 2, ends when tLeft = 0
    // so total animation duration = interval * 2 seconds
    const phaseStartTLeft = interval * 2;
    const totalMs = phaseStartTLeft * 1000;
    const elapsedMs = (phaseStartTLeft - tLeft) * 1000;

    const spans = getSpans();
    blackoutSpans = [...spans].sort(() => Math.random() - 0.5);
    const N = blackoutSpans.length;

    blackoutSpans.forEach((span, i) => {
      const t = i / N;
      const scheduledAt = totalMs * Math.pow(t, 2);
      const remaining = scheduledAt - elapsedMs;
      if (remaining <= 0) {
        blackenSpan(span);
      } else {
        setTimeout(() => blackenSpan(span), remaining);
      }
    });

    const images = getImages();
    const halfImages = pickRandom(images, Math.floor(images.length / 2));
    halfImages.forEach((img, idx) => {
      const scheduledAt = (idx / Math.max(1, halfImages.length)) * totalMs;
      const remaining = scheduledAt - elapsedMs;
      if (remaining <= 0) blackenImage(img);
      else setTimeout(() => blackenImage(img), remaining);
    });
  }

  function jumpToFullBlackout() {
    clearDecayInterval();
    getSpans().forEach(blackenSpan);
    getImages().forEach(blackenImage);
    document.body.style.backgroundColor = "black";
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
      return;
    }
    if (phase === 2) {
      cyclePercent = 10;
      runPhase2Cycle();
      decayInterval = setInterval(runPhase2Cycle, 2000);
      return;
    }
    if (phase === 3) {
      runPhase3Cycle();
      decayInterval = setInterval(runPhase3Cycle, 2000);
      return;
    }
    if (phase === 4) {
      jumpToSlowBlackout(window.decayTimeLeft ?? 0);
      return;
    }
    if (phase === 5) {
      return;
    } // phase 4 blackout already runs through to tLeft=0
  }

  setInterval(function () {
    const tLeft = window.decayTimeLeft;
    if (tLeft === undefined || window.decayTotalTime === undefined) return;

    const newPhase = getPhase(tLeft);

    if (!initialized) {
      initialized = true;
      currentPhase = newPhase;
      jumpToPhase(newPhase, tLeft); // jump to wherever we are in the timeline
      return;
    }

    if (newPhase !== currentPhase) {
      currentPhase = newPhase;
      startPhase(newPhase);
    }
  }, 100);

  (function tryInit() {
    const tLeft = window.decayTimeLeft;
    if (tLeft === undefined) return;
    initialized = true;
    currentPhase = getPhase(tLeft);
    jumpToPhase(currentPhase, tLeft);
  })();
})();

window.decayReset = function () {
  document.querySelectorAll(".decay-token").forEach((span) => {
    span.style.backgroundColor = "";
    span.style.color = "";
    if (originalTexts && originalTexts.has(span)) {
      span.textContent = originalTexts.get(span);
    } else {
      span.textContent = span.dataset.original || span.textContent;
    }
  });
  originalTexts && originalTexts.clear();

  document.querySelectorAll("img").forEach((img) => {
    if (img._blackenWrapper) {
      img._blackenWrapper.parentNode.insertBefore(img, img._blackenWrapper);
      img._blackenWrapper.remove();
      img._blackenWrapper = null;
      delete img.dataset.blackened;
    }
  });

  document.body.style.backgroundColor = "";
  currentPhase = -1;
  cyclePercent = 10;
  blackoutStarted = false;
  blackoutSpans = [];
  initialized = false;
  clearDecayInterval();
};
