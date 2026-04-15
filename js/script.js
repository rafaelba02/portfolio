/**
 * Project card hover → cursor-bound preview overlay.
 * The preview image follows the cursor (centred) while hovering over a project card.
 */
(function () {
  var overlay = document.getElementById("project-preview-overlay");
  var overlayImg = document.getElementById("preview-overlay-img");
  var cards = document.querySelectorAll(".project-card[data-keyvisual]");

  if (!overlay || !overlayImg || cards.length === 0) return;

  var cursorDot = document.getElementById("cursor-dot");

  var mouseX = window.innerWidth * 0.5;
  var mouseY = window.innerHeight * 0.5;
  var currentX = mouseX;
  var currentY = mouseY;
  var visible = false;
  var raf = null;

  var LERP = 0.15;
  var halfW = 0;
  var halfH = 0;

  function measureOverlay() {
    var r = overlay.getBoundingClientRect();
    halfW = r.width * 0.5;
    halfH = r.height * 0.5;
  }

  function tick() {
    currentX += (mouseX - currentX) * LERP;
    currentY += (mouseY - currentY) * LERP;
    overlay.style.transform = "translate(" + (currentX - halfW) + "px," + (currentY - halfH) + "px)";

    if (visible) {
      raf = requestAnimationFrame(tick);
    }
  }

  function startLoop() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      var src = card.dataset.keyvisual;
      if (!src) return;
      overlayImg.src = src;
      overlayImg.alt = (card.querySelector(".project-card-name") || {}).textContent || "";
      measureOverlay();
      currentX = mouseX;
      currentY = mouseY;
      overlay.style.transform = "translate(" + (currentX - halfW) + "px," + (currentY - halfH) + "px)";
      overlay.classList.add("is-visible");
      if (cursorDot) {
        cursorDot.classList.add("cursor-dot--blend");
        cursorDot.classList.add("cursor-dot--outline");
      }
      visible = true;
      startLoop();
    });

    card.addEventListener("mouseleave", function () {
      overlay.classList.remove("is-visible");
      if (cursorDot) {
        cursorDot.classList.remove("cursor-dot--blend");
        cursorDot.classList.remove("cursor-dot--outline");
      }
      visible = false;
      stopLoop();
    });
  });

  window.addEventListener("resize", measureOverlay);
})();
