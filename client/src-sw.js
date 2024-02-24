const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

//Cache HTML pages with CacheFirst strategy 
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(
  ({ request }) => 
  request.mode === 'navigate', 
  pageCache
);

// Implement asset caching for CSS, JS and Worker files with CacheFirst strategy
registerRoute(
  ({ request }) =>
    ['style', 'script', 'worker'].includes(request.destination),
  new CacheFirst({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, //By multiplying 7 days by 24 hours in a day by 60 minutes in an hour by 60 seconds in a minute, we get the number of seconds in 7 days. This property in the ExpirationPlugin specifies how long an item will remain in the cache before it is replaced with a fresh version from the network. 
      }),
    ],
  })
);

// Cache logo image with CacheFirst strategy
registerRoute(
  ({ request }) =>
    request.destination === 'image' && request.url.includes('/images/logo.png'),
  new CacheFirst({
    cacheName: 'logo-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, //Cached version will be considered fresh for 7 days
      }),
    ],
  })
);
