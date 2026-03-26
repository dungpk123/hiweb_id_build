// XÓA các listener "push" và "notificationclick" ở đây để Firebase SW tự quản lý
// Firebase sẽ nhận tin nhắn qua file firebase-messaging-sw.js

self.addEventListener('install', (event) => {
    // Immediately clear old SW cache if needed, but primarily skip waiting
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Clear old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => {
            return clients.claim();
        })
    );
});


