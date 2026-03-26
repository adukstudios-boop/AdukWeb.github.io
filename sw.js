// sw.js – Aduk Games Service Worker

const CACHE_NAME = 'aduk-games-v1.0.0';
const RUNTIME_CACHE = 'aduk-games-runtime-v1';

// Core assets to cache during install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/manifest.json',
  '/favicon.ico',
  // All game files (25 implemented + any future additions)
  '/games/BaseGame.js',
  '/games/SlotGame.js',
  '/games/CrashGame.js',
  '/games/DiceGame.js',
  '/games/RouletteGame.js',
  '/games/KenoGame.js',
  '/games/ScratchGame.js',
  '/games/WheelGame.js',
  '/games/BlackjackGame.js',
  '/games/PokerGame.js',
  '/games/BaccaratGame.js',
  '/games/TeenPattiGame.js',
  '/games/VideoPokerGame.js',
  '/games/WarGame.js',
  '/games/SolitaireGame.js',
  '/games/TicTacToeGame.js',
  '/games/Connect4Game.js',
  '/games/ChessGame.js',
  '/games/CheckersGame.js',
  '/games/BackgammonGame.js',
  '/games/MemoryGame.js',
  '/games/SoccerGame.js',
  '/games/HorseRacingGame.js',
  '/games/JackpotGame.js',
  '/games/LotteryGame.js',
  '/games/RushHourGame.js'
];

// Optional: image assets for offline fallback
const IMAGE_ASSETS = [
  // '/assets/images/icon-192.png',
  // '/assets/images/icon-512.png'
];

const ALL_PRECACHE = [...PRECACHE_ASSETS, ...IMAGE_ASSETS];

// ========== INSTALL ==========
self.addEventListener('install', (event) => {
  console.log('[SW] Installing new version');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell and core assets');
        return cache.addAll(ALL_PRECACHE);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.error('[SW] Precache failed:', err))
  );
});

// ========== ACTIVATE ==========
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new version');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ========== HELPERS ==========
function isGameFile(url) {
  return url.pathname.startsWith('/games/') && url.pathname.endsWith('.js');
}

function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.ico', '.webp'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

function isHTMLPage(url) {
  return url.pathname === '/' || url.pathname.endsWith('.html');
}

// ========== FETCH ==========
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Game files: network-first, cache fallback (ensures latest version)
  if (isGameFile(url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const cloned = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, cloned));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || new Response(
          '// Game file temporarily unavailable. Please check your connection.',
          { status: 503, statusText: 'Service Unavailable' }
        )))
    );
    return;
  }

  // Static assets (CSS, JS, images): cache-first, update in background (stale-while-revalidate)
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
          return networkResponse;
        }).catch(() => null);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // HTML pages: network-first, fallback to cached page or offline page
  if (isHTMLPage(url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const cloned = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, cloned));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('/index.html')))
    );
    return;
  }

  // Default: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const cloned = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, cloned));
        }
        return response;
      }).catch(() => {
        // If offline and no cache, return a generic offline response
        if (event.request.headers.get('accept').includes('text/html')) {
          return new Response(
            '<!DOCTYPE html><html><head><title>Offline</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{font-family:sans-serif;text-align:center;padding:2rem;background:#0f172a;color:#e2e8f0;}h1{color:#fbbf24;}</style></head><body><h1>🔌 You are offline</h1><p>Please check your internet connection to play games.</p><button onclick="location.reload()">Retry Connection</button></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
        return new Response('Network error', { status: 503 });
      });
    })
  );
});

// ========== BACKGROUND SYNC (optional) ==========
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-game-results') {
    event.waitUntil(syncGameResults());
  }
});

async function syncGameResults() {
  const cache = await caches.open(RUNTIME_CACHE);
  const requests = await cache.keys();
  for (const request of requests) {
    if (request.url.includes('/api/game-result')) {
      const response = await cache.match(request);
      if (response) {
        const data = await response.json();
        const fetchResponse = await fetch(request.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (fetchResponse.ok) {
          await cache.delete(request);
        }
      }
    }
  }
}

// ========== PUSH NOTIFICATIONS (optional) ==========
self.addEventListener('push', (event) => {
  let data = { title: 'Aduk Games', body: 'New update available!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }
  const options = {
    body: data.body,
    icon: '/assets/images/icon-192.png',
    badge: '/assets/images/badge.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ========== MESSAGE HANDLING (from main thread) ==========
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((name) => caches.delete(name)));
      })
    );
  }
});