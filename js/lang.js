(function () {
  var root = document.documentElement;
  var btn = document.getElementById("lang-toggle");
  if (!btn) return;

  function getLang() {
    return root.getAttribute("data-lang") || "en";
  }

  function setLang(lang) {
    root.setAttribute("data-lang", lang);
    root.lang = lang;
    try { localStorage.setItem("lang", lang); } catch (e) {}
    update();
  }

  function update() {
    var lang = getLang();
    var opts = btn.querySelectorAll(".lang-opt");
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.toggle("is-active", opts[i].getAttribute("data-lang") === lang);
    }
  }

  btn.addEventListener("click", function () {
    setLang(getLang() === "en" ? "de" : "en");
  });

  update();
})();
