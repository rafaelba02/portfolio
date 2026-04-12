/**
 * cursor.js – shared custom cursor for all pages.
 *
 * - Big blue dot (22 px) while the cursor is moving.
 * - Small dot (8 px) when stopped — "focusing".
 * Inject <div class="cursor-dot" id="cursor-dot" aria-hidden="true"> before
 * closing </body> on every page, then include this script.
 */
(function () {
  var dot = document.getElementById("cursor-dot");
  if (!dot) return;

  var idleTimer = null;
  var x = window.innerWidth  * 0.5;
  var y = window.innerHeight * 0.5;

  dot.style.transform = "translate(" + x + "px," + y + "px)";

  document.addEventListener("mousemove", function (e) {
    x = e.clientX;
    y = e.clientY;
    dot.style.transform = "translate(" + x + "px," + y + "px)";

    dot.classList.add("cursor-dot--moving");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      dot.classList.remove("cursor-dot--moving");
    }, 320);
  }, { passive: true });
})();
