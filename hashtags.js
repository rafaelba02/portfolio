/**
 * Hashtag rows with optional details: hover expands; click toggles pinned open.
 * After expand (hover or click-to-pin), scrolls minimally so the row fits in the viewport.
 */
(function () {
  var items = document.querySelectorAll(".hashtag-item:has(.hashtag-details)");
  if (!items.length) return;

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /**
   * @param {"click"|"hover"} reason — hover pending is cancelled on mouseleave; click is not.
   */
  function scheduleScrollAfterExpand(item, reason) {
    var details = item.querySelector(".hashtag-details");
    if (!details) return;

    if (item._hashtagScrollState) {
      item._hashtagScrollState.cancel();
      item._hashtagScrollState = null;
    }

    var behavior = reducedMotion() ? "instant" : "smooth";
    var margin = 20;

    function doScroll() {
      var rect = item.getBoundingClientRect();
      var vh = window.innerHeight;
      if (rect.bottom > vh - margin || rect.top < margin) {
        item.scrollIntoView({ block: "nearest", inline: "nearest", behavior: behavior });
      }
    }

    if (reducedMotion()) {
      requestAnimationFrame(function () {
        requestAnimationFrame(doScroll);
      });
      return;
    }

    var finished = false;
    var timeoutId = 0;

    function cleanup() {
      details.removeEventListener("transitionend", onEnd);
      if (timeoutId) window.clearTimeout(timeoutId);
    }

    function onEnd(e) {
      if (e.target !== details || e.propertyName !== "grid-template-rows") return;
      if (finished) return;
      finished = true;
      cleanup();
      item._hashtagScrollState = null;
      doScroll();
    }

    function cancel() {
      if (finished) return;
      finished = true;
      cleanup();
      if (item._hashtagScrollState) item._hashtagScrollState = null;
    }

    details.addEventListener("transitionend", onEnd);
    timeoutId = window.setTimeout(function () {
      if (finished) return;
      finished = true;
      cleanup();
      item._hashtagScrollState = null;
      doScroll();
    }, 450);

    item._hashtagScrollState = { cancel: cancel, reason: reason };
  }

  items.forEach(function (item) {
    var btn = item.querySelector(".hashtag");
    if (!btn || !item.querySelector(".hashtag-details")) return;

    function syncAria() {
      var open = item.classList.contains("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }

    item.addEventListener("mouseenter", function () {
      scheduleScrollAfterExpand(item, "hover");
    });

    item.addEventListener("mouseleave", function () {
      var st = item._hashtagScrollState;
      if (st && st.reason === "hover") {
        st.cancel();
      }
    });

    btn.addEventListener("click", function () {
      var wasOpen = item.classList.contains("is-open");
      item.classList.toggle("is-open");
      syncAria();
      if (!wasOpen && item.classList.contains("is-open")) {
        scheduleScrollAfterExpand(item, "click");
      }
    });

    syncAria();
  });
})();
