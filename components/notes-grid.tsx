"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { NoteCard } from "./note-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"

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
  tags?: Tag[]
}

export function NotesGrid() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search")
  const tagFilter = searchParams.get("tag")

  useEffect(() => {
    fetchNotes()
  }, [searchQuery, tagFilter])

  const fetchNotes = async () => {
    const supabase = createClient()
    setLoading(true)

    try {
      if (searchQuery) {
        // Use the search function for full-text search
        const { data: user } = await supabase.auth.getUser()
        if (!user.user) return

        const { data, error } = await supabase.rpc("search_notes", {
          search_query: searchQuery,
          user_uuid: user.user.id,
        })

        if (error) throw error
        setNotes(data || [])
      } else {
        let query = supabase
          .from("notes")
          .select(`
            *,
            note_tags!inner(
              tags(id, name, color)
            )
          `)
          .order("updated_at", { ascending: false })

        if (tagFilter) {
          query = query.eq("note_tags.tags.id", tagFilter)
        }

        const { data, error } = await query

        if (error) throw error

        const notesWithTags =
          data?.map((note) => ({
            ...note,
            tags: note.note_tags?.map((nt: any) => nt.tags).filter(Boolean) || [],
          })) || []

        setNotes(notesWithTags)
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNoteUpdate = () => {
    fetchNotes()
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground">
          {searchQuery ? "No notes found" : tagFilter ? "No notes with this tag" : "No notes yet"}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {searchQuery
            ? "Try adjusting your search terms"
            : tagFilter
              ? "Try selecting a different tag"
              : "Create your first note to get started"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onUpdate={handleNoteUpdate} />
      ))}
    </div>
  )
}
