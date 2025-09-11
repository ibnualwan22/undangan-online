"use client"

import { useState, useEffect } from "react"
import { NoteForm } from "@/components/note-form"
import { useParams } from "next/navigation"

interface Tag {
  id: string
  name: string
  color: string
}

interface Note {
  id: string
  title: string
  content: string
  note_tags?: { tags: Tag }[]
}

export default function EditNotePage() {
  const params = useParams()
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchNote(params.id as string)
    }
  }, [params.id])

  const fetchNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`)
      if (response.ok) {
        const noteData = await response.json()
        setNote(noteData)
      }
    } catch (error) {
      console.error("Error fetching note:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading note...</p>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Note not found</h2>
          <p className="text-muted-foreground">The note you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return <NoteForm note={note} isEditing />
}
