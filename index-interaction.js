/**
 * Rail + cursor interaction — works on any page with .home-rail markup.
 *
 * Station dots anchor to page content via fallback selectors so the same
 * script runs on main, about, and projects without page-specific code.
 */
(function () {

  /* ── Elements ───────────────────────────────────────────────── */
  const track       = document.getElementById("home-rail-track");
  const headerDot   = document.getElementById("home-header-dot");
  const stationDot  = document.getElementById("home-station-dot");
  const stationDot2 = document.getElementById("home-station-dot-2");
  const stationDot3 = document.getElementById("home-station-dot-3");
  const cursorRail  = document.getElementById("home-cursor-rail-dot");
  const railFill    = document.getElementById("home-rail-fill");
  const header      = document.querySelector(".header--home");

  if (!track || !headerDot || !cursorRail || !railFill) return;

  /* ── Content anchors (page-agnostic fallbacks) ─────────────── */
  const station1Anchor =
    document.querySelector(".intro-line") ||
    document.querySelector("h1") ||
    document.querySelector(".section-title") ||
    document.querySelector(".project-list");

  const station2Anchor =
    document.querySelector(".intro-desc") ||
    document.querySelector(".hashtag-list");

  /* ── Motion preference ───────────────────────────────────────── */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LERP_FREE   = reduceMotion ? 1 : 0.14;
  const LERP_SNAP   = reduceMotion ? 1 : 0.45;
  const LERP_FILL   = reduceMotion ? 1 : 0.07;

  const SNAP_ZONE   = 14;

  /* ── State ───────────────────────────────────────────────────── */
  let mouseY = window.innerHeight * 0.5;

  let ringCurrent = 0;
  let ringTarget  = 0;
  let fillCurrent = 0;
  let fillTarget  = 0;

  let headerDotY   = 0;
  let stationDotY  = 0;
  let stationDot2Y = 0;
  let stationDot3Y = 0;

  /* ── Helpers ─────────────────────────────────────────────────── */
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function trackRect() { return track.getBoundingClientRect(); }
  function toLocal(viewportY) { return viewportY - trackRect().top; }

  /* ── Fixed-dot placement ─────────────────────────────────────── */
  function placeHeaderDot() {
    if (!header) return;
    const hr = header.getBoundingClientRect();
    headerDotY = toLocal((hr.top + hr.bottom) / 2);
    headerDot.style.top = `${headerDotY}px`;
  }

  function placeStationDot() {
    if (!stationDot || !station1Anchor) {
      if (stationDot) stationDot.style.display = "none";
      return;
    }
    stationDot.style.display = "";
    const lr = station1Anchor.getBoundingClientRect();
    stationDotY = toLocal((lr.top + lr.bottom) / 2);
    stationDot.style.top = `${stationDotY}px`;
  }

  function placeStationDot2() {
    if (!stationDot2 || !station2Anchor) {
      if (stationDot2) stationDot2.style.display = "none";
      return;
    }
    stationDot2.style.display = "";
    const pr    = station2Anchor.getBoundingClientRect();
    const lineH = parseFloat(getComputedStyle(station2Anchor).lineHeight) || 26;
    stationDot2Y = toLocal(pr.top + lineH * 0.5);
    stationDot2.style.top = `${stationDot2Y}px`;
  }

  function placeStationDot3() {
    if (!stationDot3) return;
    const emailLink = document.querySelector('.footer-left a[href^="mailto:"]');
    if (!emailLink) {
      stationDot3.style.display = "none";
      return;
    }
    stationDot3.style.display = "";
    const lr = emailLink.getBoundingClientRect();
    stationDot3Y = toLocal((lr.top + lr.bottom) / 2);
    stationDot3.style.top = `${stationDot3Y}px`;
  }

  /* ── Snap logic ──────────────────────────────────────────────── */
  function activeStations() {
    return [headerDotY, stationDotY, stationDot2Y, stationDot3Y].filter(y => y > 0);
  }

  function snappedTarget(raw) {
    for (const sy of activeStations()) {
      if (Math.abs(raw - sy) < SNAP_ZONE) return { y: sy, snapping: true };
    }
    return { y: raw, snapping: false };
  }

  /* ── Target updates ──────────────────────────────────────────── */
  function updateTargets() {
    const tr  = trackRect();
    const rel = mouseY - tr.top;
    const all = activeStations();
    const lastStation = all.length ? Math.max(...all) : tr.height;
    const raw = clamp(rel, headerDotY, lastStation);
    const { y, snapping } = snappedTarget(raw);
    ringTarget  = y;
    fillTarget  = y;
    track._snapping = snapping;
  }

  /* ── Station dots: get bullseye centre once cursor reaches them ── */
  function updateStationStyle() {
    headerDot.classList.toggle("home-header-dot--active",
      mouseY >= headerDotY);

    if (stationDot && stationDotY > 0)
      stationDot.classList.toggle("home-station-dot--passed", mouseY >= stationDotY);
    if (stationDot2 && stationDot2Y > 0)
      stationDot2.classList.toggle("home-station-dot--passed", mouseY >= stationDot2Y);
    if (stationDot3 && stationDot3Y > 0)
      stationDot3.classList.toggle("home-station-dot--passed", mouseY >= stationDot3Y);
  }

  /* ── Event handlers ──────────────────────────────────────────── */
  function onMouseMove(e) {
    mouseY = e.clientY;
    updateTargets();
  }

  /* ── Render loop ─────────────────────────────────────────────── */
  function tick() {
    const lr = track._snapping ? LERP_SNAP : LERP_FREE;

    ringCurrent += (ringTarget - ringCurrent) * lr;
    fillCurrent += (fillTarget - fillCurrent) * LERP_FILL;

    cursorRail.style.top = `${ringCurrent}px`;

    const fillH = Math.max(0, fillCurrent - headerDotY);
    railFill.style.top    = `${headerDotY}px`;
    railFill.style.height = `${fillH}px`;

    updateStationStyle();
    requestAnimationFrame(tick);
  }

  /* ── Init ────────────────────────────────────────────────────── */
  window.addEventListener("mousemove", onMouseMove, { passive: true });

  function placeAll() {
    placeHeaderDot();
    placeStationDot();
    placeStationDot2();
    placeStationDot3();
    updateTargets();
  }

  window.addEventListener("scroll", placeAll, { passive: true });
  window.addEventListener("resize", placeAll);

  [headerDot, stationDot, stationDot2, stationDot3].forEach(el => {
    if (!el) return;
    const inner = document.createElement("span");
    inner.className = "rail-dot-inner";
    el.appendChild(inner);
  });

  placeAll();
  ringCurrent = ringTarget;
  fillCurrent = fillTarget;
  requestAnimationFrame(tick);

  window.addEventListener("load", placeAll);

})();
