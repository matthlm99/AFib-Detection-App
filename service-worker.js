// Initialize cache files
var cache_name = "AFib-Detection-App-";
var cache_files = [
    '/',
    '/index.html',
    '/service-worker.js',
    '/content_navigation.js',
    '/dropdown_menu.js',
    '/video_canvas_processing.js',
    '/home_styles.css',
    '/camera-logo.png',
    '/ecg-signal.png',
    '/matlab-bg.png',
    '/phone-camera.jpg'
]

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
      caches.open(cache_name).then(function(cache){
            console.log('Opened cache');
            return cache.addAll(cache_files);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request).then(function(response){
                if (!response || response.status !== 200 || response.type == 'basic'){
                    return response;
                }
                var cache_response = response.clone();
                caches.open(cache_name).then(function(cache){
                    cache.put(event.request, cache_response);
                })
            });
        })
    );
});

self.addEventListener('activate', function(event) {
    var cacheAllowlist = ['pages-cache-v1', 'blog-posts-cache-v1'];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheAllowlist.indexOf(cacheName) == -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});