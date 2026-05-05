(function () {
  "use strict";

  const CMYK = ["cyan", "magenta", "yellow", "black"];
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
  }

  function resetSpan(span) {
    span.style.backgroundColor = "";
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
    let i = 0;
    const N = blackoutSpans.length;
    function next() {
      if (i >= N) return;
      blackoutSpans[i].style.backgroundColor = "black";
      blackoutSpans[i].style.color = "black";
      i++;
      const delay = Math.max(50, 200 * (1 - i / N));
      setTimeout(next, delay);
    }
    next();
  }

  function startFastBlackout() {
    clearDecayInterval();
    const remaining =
      blackoutSpans.length > 0
        ? blackoutSpans.filter((s) => s.style.backgroundColor !== "black")
        : [...getSpans()].sort(() => Math.random() - 0.5);
    let i = 0;
    const N = remaining.length;
    function next() {
      if (i >= N) return;
      remaining[i].style.backgroundColor = "black";
      remaining[i].style.color = "black";
      i++;
      const delay = Math.max(5, 30 * (1 - i / N));
      setTimeout(next, delay);
    }
    next();
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
      return; // wait one more tick so elapsed > 0
    }

    const newPhase = getPhase(tLeft);
    if (newPhase !== currentPhase) {
      currentPhase = newPhase;
      startPhase(newPhase);
    }
  }, 500);
})();
