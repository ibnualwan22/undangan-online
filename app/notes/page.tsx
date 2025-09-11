"use client"

import { useState, useEffect } from "react"
import { NoteCard } from "@/components/note-card"
import { NotesHeader } from "@/components/notes-header"
import { SearchFilters } from "@/components/search-filters"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n"
import { isAfter, isBefore, parseISO } from "date-fns"

interface Tag {
  id: string
  name: string
  color: string
}

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  note_tags?: { tags: Tag }[]
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("updated_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()
  const [userEmail, setUserEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t } = useI18n()

  useEffect(() => {
    checkAuth()
    fetchNotes()
  }, [])

  useEffect(() => {
    filterAndSortNotes()
  }, [notes, searchQuery, selectedTags, sortBy, sortOrder, dateFrom, dateTo])

  const checkAuth = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    setUserEmail(user.email || "")
  }

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes")
      if (response.ok) {
        const notesData = await response.json()
        setNotes(notesData)
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortNotes = () => {
    let filtered = [...notes]

    // Text search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((note) => {
        const titleMatch = note.title.toLowerCase().includes(query)
        const contentMatch = note.content.toLowerCase().includes(query)
        const tagMatch = note.note_tags?.some((nt) => nt.tags.name.toLowerCase().includes(query))
        return titleMatch || contentMatch || tagMatch
      })
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) => {
        const noteTags = note.note_tags?.map((nt) => nt.tags.id) || []
        return selectedTags.every((tagId) => noteTags.includes(tagId))
      })
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filtered = filtered.filter((note) => {
        const noteDate = parseISO(note.updated_at)
        if (dateFrom && isBefore(noteDate, dateFrom)) return false
        if (dateTo && isAfter(noteDate, dateTo)) return false
        return true
      })
    }

    // Sort notes
    filtered.sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "created_at":
          aValue = new Date(a.created_at)
          bValue = new Date(b.created_at)
          break
        case "updated_at":
        default:
          aValue = new Date(a.updated_at)
          bValue = new Date(b.updated_at)
          break
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setFilteredNotes(filtered)
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm(t("notes.deleteConfirm"))) return

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== noteId))
      }
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />
      <NotesHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} userEmail={userEmail} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
          />

          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">
                {notes.length === 0 ? t("notes.noNotes") : t("notes.noNotesFound")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {notes.length === 0 ? t("notes.noNotesMessage") : t("notes.noNotesFoundMessage")}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t("notes.showingNotes", { count: filteredNotes.length.toString(), total: notes.length.toString() })}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <PWAInstallPrompt />
    </div>
  )
}
