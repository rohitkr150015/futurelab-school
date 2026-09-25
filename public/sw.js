const CACHE = 'futurelab-public-v1'
const SHELL = ['/', '/favicon.svg', '/icon-192.png', '/manifest.webmanifest']
self.addEventListener('install', (event) =>
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL))),
)
self.addEventListener('activate', (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('futurelab-public-') && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      ),
  ),
)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return
  // Never cache private routes, API calls, uploads, applications, invoices, or messages.
  if (
    /^\/(portal|api|login|auth|admissions\/apply|admissions\/track|verify)(\/|$)/.test(url.pathname)
  )
    return
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/images/') ||
    SHELL.includes(url.pathname)
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(event.request, copy))
          }
          return response
        })
        .catch(() => caches.match(event.request)),
    )
  }
})
