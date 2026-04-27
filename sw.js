// XÓA các listener "push" và "notificationclick" ở đây để Firebase SW tự quản lý
// Firebase sẽ nhận tin nhắn qua file firebase-messaging-sw.js

const CACHE_VERSION = 'v2';
const CACHE_NAME = `hiweb-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);

    // Prevent caching manifest and icons
    if (url.pathname === '/manifest.json' || url.pathname.includes('pwa-')) {
        event.respondWith(fetch(event.request, { cache: 'no-cache' }));
        return;
    }

    if (url.pathname.startsWith('/api/') || url.origin !== self.location.origin) {
        return;
    }

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('/index.html').then((response) => {
                    return response || fetch('/index.html');
                });
            })
        );
    }
});


