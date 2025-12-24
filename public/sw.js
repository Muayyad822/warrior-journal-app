const CACHE_NAME = 'warrior-journal-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/warriors-journal.png',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event
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
    })
  );
});

// Push notification event listener
self.addEventListener('push', function(event) {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: 'Warrior Journal Reminder',
    body: 'Time to check in with your health!',
    icon: '/warriors-journal.png',
    badge: '/warriors-journal.png',
    tag: 'warrior-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/warriors-journal.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      console.log('Push data is not JSON:', event.data.text());
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event listener
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Background sync for offline reminders
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-reminder') {
    event.waitUntil(handleBackgroundReminder());
  }
});

function handleBackgroundReminder() {
  // Check if any reminders are due
  return self.registration.showNotification('Health Check Reminder', {
    body: 'Don\'t forget to log your daily health data!',
    icon: '/warriors-journal.png',
    tag: 'daily-reminder'
  });
}
