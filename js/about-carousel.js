/**
 * About page image carousel: prev/next, swipe, keyboard, 4s autoplay
 * (paused on interaction / hidden tab / reduced motion).
 */
(function () {
  var track = document.getElementById("about-carousel-track");
  var counter = document.getElementById("about-carousel-counter");
  var prev = document.getElementById("about-carousel-prev");
  var next = document.getElementById("about-carousel-next");
  var root = document.getElementById("about-carousel");
  if (!track || !counter || !prev || !next || !root) return;

  var total = track.children.length;
  if (total === 0) return;

  var idx = 0;
  var AUTO_MS = 4000;
  var timer = null;

  var reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function go(i) {
    idx = (i % total + total) % total;
    track.style.transform = "translateX(-" + idx * 100 + "%)";
    counter.textContent = idx + 1 + " / " + total;
  }

  function scheduleAuto() {
    clearInterval(timer);
    if (reducedMotion) return;
    timer = setInterval(function () {
      go(idx + 1);
    }, AUTO_MS);
  }

  function bump() {
    scheduleAuto();
  }

  prev.addEventListener("click", function () {
    go(idx - 1);
    bump();
  });
  next.addEventListener("click", function () {
    go(idx + 1);
    bump();
  });

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      go(idx - 1);
      bump();
    }
    if (e.key === "ArrowRight") {
      go(idx + 1);
      bump();
    }
  });

  var startX = 0;
  var dragging = false;
  track.addEventListener("pointerdown", function (e) {
    startX = e.clientX;
    dragging = true;
  });
  document.addEventListener("pointerup", function (e) {
    if (!dragging) return;
    dragging = false;
    var diff = e.clientX - startX;
    if (Math.abs(diff) > 40) {
      go(idx + (diff < 0 ? 1 : -1));
      bump();
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) clearInterval(timer);
    else scheduleAuto();
  });

  if (typeof window.matchMedia === "function") {
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", function (e) {
      reducedMotion = e.matches;
      if (reducedMotion) clearInterval(timer);
      else scheduleAuto();
    });
  }

  go(0);
  scheduleAuto();
})();
