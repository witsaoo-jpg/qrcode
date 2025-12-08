const CACHE_NAME = 'qr-gen-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sarabun:wght@400;500;600&display=swap'
];

// ติดตั้ง Service Worker และ Cache ไฟล์
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// เรียกใช้ไฟล์จาก Cache เมื่อ Offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // ถ้ามีใน cache ให้ใช้ cache, ถ้าไม่มีให้โหลดจากเน็ต
                return response || fetch(event.request);
            })
    );
});
