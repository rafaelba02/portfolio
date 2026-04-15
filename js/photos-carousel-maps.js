/**
 * Photos project page: turn captions with data-map-url into links (same behavior as home carousel).
 */
(function () {
  document.querySelectorAll("#photo-carousel .carousel-caption[data-map-url]").forEach(function (p) {
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
})();
