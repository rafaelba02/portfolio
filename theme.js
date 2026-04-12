(function () {
  var root = document.documentElement;

  function readTheme() {
    try { var v = localStorage.getItem("theme"); if (v) return v; } catch (e) {}
    var m = document.cookie.match(/(?:^|;\s*)theme=(light|dark)/);
    return m ? m[1] : null;
  }

  function writeTheme(mode) {
    if (mode === "auto") {
      try { localStorage.removeItem("theme"); } catch (e) {}
      document.cookie = "theme=; max-age=0; path=/; SameSite=Lax";
    } else {
      try { localStorage.setItem("theme", mode); } catch (e) {}
      document.cookie = "theme=" + mode + "; max-age=31536000; path=/; SameSite=Lax";
    }
  }

  var stored = readTheme();
  var mode = stored || "auto";

  if (stored) root.setAttribute("data-theme", stored);

  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  var cycle = ["light", "dark", "auto"];

  function applyMode(m) {
    mode = m;
    if (m === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", m);
    }
    writeTheme(m);
    updateIcon(m);
  }

  function updateIcon(m) {
    btn.querySelector(".icon-sun").style.display  = m === "light" ? "block" : "none";
    btn.querySelector(".icon-moon").style.display = m === "dark"  ? "block" : "none";
    btn.querySelector(".icon-auto").style.display = m === "auto"  ? "block" : "none";
  }

  updateIcon(mode);

  btn.addEventListener("click", function () {
    var next = cycle[(cycle.indexOf(mode) + 1) % cycle.length];
    applyMode(next);
  });
})();
