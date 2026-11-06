self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data?.text() || '' }; }
  const title = data.title || 'ذكّرني';
  const options = {
    body: data.body || 'عندك موعد قريب.',
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: data.tag || 'zakerni-reminder',
    renotify: true,
    data: { url: data.url || './' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || './', self.location.origin).href;
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const win of wins) { if (win.url.startsWith(self.location.origin) && 'focus' in win) return win.focus(); }
    if (self.clients.openWindow) return self.clients.openWindow(target);
  })());
});
