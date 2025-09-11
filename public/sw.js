const CACHE_NAME = "notes-app-v1"
const STATIC_CACHE = "notes-static-v1"
const DYNAMIC_CACHE = "notes-dynamic-v1"

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/auth/login",
  "/auth/register",
  "/manifest.json",
  "/icon-192.jpg",
  "/icon-512.jpg",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  // Skip API routes (they need to be fresh)
  if (url.pathname.startsWith("/api/")) {
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.destination === "document") {
            return caches.match("/offline")
          }
        })
    }),
  )
})

// Background sync for offline note saving
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync-notes") {
    event.waitUntil(syncNotes())
  }
})

async function syncNotes() {
  try {
    // Get pending notes from IndexedDB
    const pendingNotes = await getPendingNotes()

    for (const note of pendingNotes) {
      try {
        const response = await fetch("/api/notes/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(note),
        })

        if (response.ok) {
          // Remove from pending notes
          await removePendingNote(note.id)
        }
      } catch (error) {
        console.error("Failed to sync note:", error)
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error)
  }
}

// IndexedDB helpers (simplified)
async function getPendingNotes() {
  return new Promise((resolve) => {
    const request = indexedDB.open("NotesDB", 1)

    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(["pendingNotes"], "readonly")
      const store = transaction.objectStore("pendingNotes")
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result || [])
      }
    }

    request.onerror = () => {
      resolve([])
    }
  })
}

async function removePendingNote(noteId) {
  return new Promise((resolve) => {
    const request = indexedDB.open("NotesDB", 1)

    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(["pendingNotes"], "readwrite")
      const store = transaction.objectStore("pendingNotes")
      store.delete(noteId)

      transaction.oncomplete = () => {
        resolve()
      }
    }

    request.onerror = () => {
      resolve()
    }
  })
}
