// ==========================================================
// service-worker.js：PWAキャッシュ制御（改良版）
// ==========================================================

const CACHE_NAME = "my-english-app-v2"; // ✅ バージョンを変更するとキャッシュ更新される
const urlsToCache = [
  "./index.html",
  "./assets/css/style.css",
  "./js/include.js",
  "./js/storage.js",
  "./assets/img/top.png",
  "./manifest.json"
];

// ----------------------------------------------------------
// 🔹 インストール（初回・更新時）
// ----------------------------------------------------------
self.addEventListener("install", event => {
  console.log("🟢 Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("📦 キャッシュ追加:", urlsToCache);
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // 即座に新しいSWを有効化
});

// ----------------------------------------------------------
// 🔹 アクティベート（古いキャッシュ削除）
// ----------------------------------------------------------
self.addEventListener("activate", event => {
  console.log("⚙️ Service Worker activating...");
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log("🧹 古いキャッシュ削除:", name);
            return caches.delete(name);
          }
        })
      )
    )
  );
  return self.clients.claim(); // 新しいSWがすぐ反映
});

// ----------------------------------------------------------
// 🔹 リクエスト取得時（キャッシュ優先）
// ----------------------------------------------------------
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return; // POST等は除外

  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュがあればそれを返す
      if (response) {
        return response;
      }

      // ネットから取得してキャッシュにも保存
      return fetch(event.request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // 🔸 オフライン時に代替画像やページを返す例
          if (event.request.destination === "image") {
            return caches.match("./assets/img/top.png");
          }
        });
    })
  );
});
