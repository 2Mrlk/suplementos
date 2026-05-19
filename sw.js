const CACHE_NAME = 'SUPLEMENTOS-V2';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './assets/img/logo.png',
    './assets/img/logopwa.png',
    './assets/img/logopwa512.png',
    './assets/img/Banner.png',
    './assets/img/whatsapp.png',
];

// Instala e cacheia apenas os assets estáticos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Fazendo whey no cache!');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Remove caches antigos na ativação
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Estratégia: Network First para API, Cache First para assets estáticos
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Requisições para a API sempre vão para a rede (nunca do cache)
    if (url.hostname.includes('vercel.app')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Assets estáticos: tenta cache primeiro, senão busca na rede
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
