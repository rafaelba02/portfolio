/**
 * Home page image carousel: prev/next, swipe, keyboard, 3.5s autoplay (paused on interaction / hidden tab / reduced motion).
 */
(function () {
  var track = document.getElementById("home-carousel-track");
  var counter = document.getElementById("home-carousel-counter");
  var prev = document.getElementById("home-carousel-prev");
  var next = document.getElementById("home-carousel-next");
  var root = document.getElementById("home-carousel");
  if (!track || !counter || !prev || !next || !root) return;

  document.querySelectorAll(".home-carousel-caption[data-map-url]").forEach(function (p) {
    var url = p.getAttribute("data-map-url");
    if (!url) return;
    var label = p.textContent.trim();
    p.removeAttribute("data-map-url");
    var a = document.createElement("a");
    a.className = "home-carousel-caption-link";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = label;
    a.addEventListener("pointerdown", function (e) {
      e.stopPropagation();
    });
    a.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    p.textContent = "";
    p.appendChild(a);
  });

  var total = track.children.length;
  if (total === 0) return;

  var idx = 0;
  var AUTO_MS = 3500;
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

  document.addEventListener("keydown", function (e) {
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
