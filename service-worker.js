/* Offline-Cache fuer Schulweg NRW (network-first: online immer aktuell) */
var CACHE = "schulweg-v5";
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
  "./icons/icon.svg",
  // K1 + K2 Audio-Assets (en-GB-LibbyNeural, Microsoft Neural TTS)
  "./audio/english/unit1/u1_k1_d-from.mp3",
  "./audio/english/unit1/u1_k1_d-name.mp3",
  "./audio/english/unit1/u1_k1_d-old.mp3",
  "./audio/english/unit1/u1_k1_mia.mp3",
  "./audio/english/unit1/u1_k1_muster-im.mp3",
  "./audio/english/unit1/u1_k1_nice-to-meet.mp3",
  "./audio/english/unit1/u1_k1_r-james.mp3",
  "./audio/english/unit1/u1_k1_refresh1.mp3",
  "./audio/english/unit1/u1_k1_sam-hello.mp3",
  "./audio/english/unit1/u1_k2_alex-intro.mp3",
  "./audio/english/unit1/u1_k2_ankommen.mp3",
  "./audio/english/unit1/u1_k2_b-hoer1.mp3",
  "./audio/english/unit1/u1_k2_ben-intro.mp3",
  "./audio/english/unit1/u1_k2_check-hoer.mp3",
  "./audio/english/unit1/u1_k2_do-you-like.mp3",
  "./audio/english/unit1/u1_k2_mia-intro.mp3",
  "./audio/english/unit1/u1_k2_muster-pronouns.mp3",
  "./audio/english/unit1/u1_k2_r-do-you-know.mp3",
  "./audio/english/unit1/u1_k2_r-hoer-neu.mp3",
  "./audio/english/unit1/u1_k2_r-recap.mp3",
  "./audio/english/unit1/u1_k2_r-where-mia.mp3",
  "./audio/english/unit1/u1_k2_sophie-intro.mp3",
  "./audio/english/unit1/u1_k2_where-ben-from.mp3"
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
