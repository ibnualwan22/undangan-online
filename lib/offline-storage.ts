"use client"

interface PendingNote {
  id: string
  title: string
  content: string
  tags: string[]
  action: "create" | "update" | "delete"
  timestamp: number
}

class OfflineStorage {
  private dbName = "NotesDB"
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains("pendingNotes")) {
          const pendingStore = db.createObjectStore("pendingNotes", { keyPath: "id" })
          pendingStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        if (!db.objectStoreNames.contains("cachedNotes")) {
          const cachedStore = db.createObjectStore("cachedNotes", { keyPath: "id" })
          cachedStore.createIndex("updated_at", "updated_at", { unique: false })
        }
      }
    })
  }

  async addPendingNote(note: PendingNote): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["pendingNotes"], "readwrite")
      const store = transaction.objectStore("pendingNotes")
      const request = store.put(note)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getPendingNotes(): Promise<PendingNote[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["pendingNotes"], "readonly")
      const store = transaction.objectStore("pendingNotes")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async removePendingNote(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["pendingNotes"], "readwrite")
      const store = transaction.objectStore("pendingNotes")
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async cacheNotes(notes: any[]): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cachedNotes"], "readwrite")
      const store = transaction.objectStore("cachedNotes")

      // Clear existing cache
      store.clear()

      // Add new notes
      notes.forEach((note) => {
        store.put(note)
      })

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  async getCachedNotes(): Promise<any[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cachedNotes"], "readonly")
      const store = transaction.objectStore("cachedNotes")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }
}

export const offlineStorage = new OfflineStorage()
