/**
 * ChemCheck: scroll-gesteuertes Statistik-Panel.
 *
 * 1. Bild scrollt natürlich von unten ins Viewport (kein extra Transform).
 * 2. Wird sticky am oberen Rand → hält für HOLD_PX Scroll-Distanz.
 * 3. Fährt per translateY sanft nach oben aus dem Bild.
 */
(function () {
  var port = document.querySelector("[data-chemcheck-stats-scroll]");
  var section = port && port.querySelector(".chemcheck-stats-immersive--sticky");
  if (!port || !section) return;

  var HOLD_PX = 250;
  var EXIT_FR = 0.22;
  var reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function metrics() {
    var vh = window.innerHeight;
    var exitPx = Math.round(vh * EXIT_FR);
    return { vh: vh, hold: HOLD_PX, exit: exitPx };
  }

  function applyHeights() {
    if (reduced) {
      port.style.minHeight = "";
      return;
    }
    var m = metrics();
    port.style.minHeight = Math.round(m.vh * 0.1) + m.hold + m.exit + "px";
  }

  function portTopDocument() {
    var rect = port.getBoundingClientRect();
    return rect.top + (window.scrollY || document.documentElement.scrollTop);
  }

  function easeOutCubic(p) {
    return 1 - Math.pow(1 - p, 3);
  }

  function update() {
    if (reduced) {
      section.style.removeProperty("--stats-roll-y");
      return;
    }

    var m = metrics();
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    var portTop = portTopDocument();
    var range = m.hold + m.exit;

    if (range <= 0 || scrollY < portTop) {
      section.style.setProperty("--stats-roll-y", "0");
      return;
    }

    var t = (scrollY - portTop) / range;
    if (t > 1) t = 1;

    var holdFr = m.hold / range;
    var y;

    if (t <= holdFr) {
      y = 0;
    } else {
      var u = (t - holdFr) / (1 - holdFr);
      u = Math.min(1, Math.max(0, u));
      y = -easeOutCubic(u) * 100;
    }

    section.style.setProperty("--stats-roll-y", String(y));
  }

  var raf = 0;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      update();
    });
  }

  applyHeights();
  update();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    applyHeights();
    update();
  });

  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    function onReduceChange() {
      reduced = mq.matches;
      applyHeights();
      update();
    }
    if (mq.addEventListener) mq.addEventListener("change", onReduceChange);
    else if (mq.addListener) mq.addListener(onReduceChange);
  }

  window.addEventListener("load", function () {
    applyHeights();
    update();
  });
})();
