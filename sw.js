self.addEventListener("push", function (event) {
    let data = {};
    try {
        data = event.data.json();
    } catch (e) {
        data = { title: "HiWeb", body: "You have a new notification." };
    }

    const options = {
        body: data.body,
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png"
    };

    event.waitUntil(
        self.registration.showNotification(data.title || "HiWeb", options)
    );
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow("/")
    );
});

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

self.addEventListener('fetch', function (event) {
    // Empty fetch handler to satisfy PWA criteria without caching
});
