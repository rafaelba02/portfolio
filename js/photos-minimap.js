/**
 * Photos page: OpenStreetMap minimap (Leaflet) — markers from slide data-map-lat/lng;
 * click syncs with #photo-carousel via window.photoCarouselApi.
 */
(function () {
  var el = document.getElementById("photos-minimap");
  var track = document.getElementById("carousel-track");
  var api = window.photoCarouselApi;
  if (!el || !track || !api || typeof L === "undefined") return;

  /* OSM tile policy: send Referer on tile requests */
  L.TileLayer.prototype.createTile = function (coords, done) {
    var tile = document.createElement("img");
    tile.referrerPolicy = "strict-origin-when-cross-origin";
    L.DomEvent.on(tile, "load", L.Util.bind(this._tileOnLoad, this, done, tile));
    L.DomEvent.on(tile, "error", L.Util.bind(this._tileOnError, this, done, tile));
    if (this.options.crossOrigin || this.options.crossOrigin === "") {
      tile.crossOrigin = this.options.crossOrigin === true ? "" : this.options.crossOrigin;
    }
    tile.alt = "";
    tile.setAttribute("role", "presentation");
    tile.src = this.getTileUrl(coords);
    return tile;
  };

  var slides = track.querySelectorAll(".carousel-slide");
  var latlngs = [];
  var markersByIndex = {};

  for (var i = 0; i < slides.length; i++) {
    var slide = slides[i];
    var lat = slide.getAttribute("data-map-lat");
    var lng = slide.getAttribute("data-map-lng");
    if (lat == null || lng == null) continue;
    var latn = parseFloat(lat);
    var lngn = parseFloat(lng);
    if (isNaN(latn) || isNaN(lngn)) continue;
    var ll = [latn, lngn];
    latlngs.push(ll);

    var marker = L.circleMarker(ll, {
      radius: 5,
      weight: 2,
      color: "#565656",
      fillColor: "#ffffff",
      fillOpacity: 1
    });
    (function (slideIndex) {
      marker.on("click", function (e) {
        L.DomEvent.stopPropagation(e);
        api.go(slideIndex);
      });
    })(i);

    markersByIndex[i] = marker;
  }

  if (latlngs.length === 0) {
    el.closest(".photos-minimap-aside").style.display = "none";
    return;
  }

  var map = L.map(el, {
    scrollWheelZoom: false,
    attributionControl: false
  });

  var carousel = document.getElementById("photo-carousel");

  function syncMinimapToPhoto() {
    var idx = api.getIndex();
    var slide = track.children[idx];
    if (!slide) return;
    var img = slide.querySelector("img");
    if (!img) return;
    var h = img.getBoundingClientRect().height;
    if (!h) h = img.offsetHeight;
    if (!h) return;
    var aside = el.closest(".photos-minimap-aside");
    if (!aside) return;
    aside.style.height = Math.round(h) + "px";
    map.invalidateSize(true);
    fitMap();
  }

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  var layers = [];
  for (var k in markersByIndex) {
    if (Object.prototype.hasOwnProperty.call(markersByIndex, k)) {
      markersByIndex[k].addTo(map);
      layers.push(markersByIndex[k]);
    }
  }

  var group = L.featureGroup(layers);

  function fitMap() {
    if (latlngs.length === 1) {
      map.setView(latlngs[0], 8);
    } else {
      map.fitBounds(group.getBounds().pad(0.12));
    }
  }

  fitMap();

  function setActiveMarker(activeIdx) {
    for (var j in markersByIndex) {
      if (!Object.prototype.hasOwnProperty.call(markersByIndex, j)) continue;
      var idx = parseInt(j, 10);
      var m = markersByIndex[j];
      var isActive = idx === activeIdx;
      m.setStyle({
        radius: isActive ? 8 : 5,
        color: isActive ? "#0F35FF" : "#565656",
        weight: isActive ? 3 : 2,
        fillColor: isActive ? "#0F35FF" : "#ffffff",
        fillOpacity: isActive ? 0.92 : 1
      });
      if (isActive) m.bringToFront();
    }
  }

  api.subscribeIndex(function (idx) {
    setActiveMarker(idx);
    syncMinimapToPhoto();
  });
  setActiveMarker(api.getIndex());
  syncMinimapToPhoto();

  if (carousel && typeof ResizeObserver !== "undefined") {
    new ResizeObserver(function () {
      syncMinimapToPhoto();
    }).observe(carousel);
  }

  var imgs = track.querySelectorAll("img");
  for (var ii = 0; ii < imgs.length; ii++) {
    imgs[ii].addEventListener("load", syncMinimapToPhoto);
  }

  window.addEventListener("resize", syncMinimapToPhoto);

  requestAnimationFrame(function () {
    syncMinimapToPhoto();
  });
})();

