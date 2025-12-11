const CACHE_NAME = "qr-pwa-v1";
const assets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png",
  "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
];

// ติดตั้ง Service Worker และเก็บไฟล์ลง Cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// ดึงไฟล์จาก Cache มาโชว์ (ทำให้ทำงาน Offline ได้)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
