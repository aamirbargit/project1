var cacheName = 'MoneyTracker-Spendr-pwa'; //offline cache name
var filesToCache = [ //all the files that need cached 
    '/',
    '/index.html',
    '/track.html',
    '/aboutus.html',
    '/contactus.html',
    '/budget.js',
    '/chart.js',
    '/nav.js',
    '/style.css',
    '/styles.css',
    '/content.css',
    '/images/aboutus.svg',
    '/images/finance.svg',
    '/icon/edit.png',
    '/icon/plus.png',
    '/icon/trash.png'

];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
    e.respondWith(caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
    }));
});

/*When the app is launched, tell the browser which page to load. It’s generally index.html.

short_name is the name of the app as shown on the icon app. 

display - the shell type should be shown in the app. We use our app to look and feel like a standard native app


*/