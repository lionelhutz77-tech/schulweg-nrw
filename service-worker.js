/* Offline-Cache fuer Schulweg NRW (network-first: online immer aktuell) */
var CACHE = "schulweg-v4";
var DATEIEN = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/vocab/model.js",
  "./js/vocab/config.js",
  "./js/vocab/srs.js",
  "./js/vocab/storage.js",
  "./js/vocab/session.js",
  "./js/vocab/ui.js",
  "./js/audio/registry.js",
  "./js/audio/player.js",
  "./js/learn/competency.js",
  "./js/learn/journey.js",
  "./js/learn/ui.js",
  "./content/englisch-unit1.js",
  "./content/mathe-klasse5.js",
  "./manifest.webmanifest",
  "./icons/icon.svg"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(DATEIEN); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () {
      return caches.match(e.request);
    })
  );
});
