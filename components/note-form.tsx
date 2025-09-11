"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface Tag {
  id: string
  name: string
  color: string
}

interface Note {
  id?: string
  title: string
  content: string
  note_tags?: { tags: Tag }[]
}

interface NoteFormProps {
  note?: Note
  isEditing?: boolean
}

export function NoteForm({ note, isEditing = false }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [selectedTags, setSelectedTags] = useState<Tag[]>(note?.note_tags?.map((nt) => nt.tags) || [])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [newTagName, setNewTagName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags")
      if (response.ok) {
        const tags = await response.json()
        setAvailableTags(tags)
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const tagIds = selectedTags.map((tag) => tag.id)
      const noteData = { title, content, tagIds }

      const url = isEditing ? `/api/notes/${note?.id}` : "/api/notes"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      })

      if (!response.ok) {
        throw new Error("Failed to save note")
      }

      router.push("/notes")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId))
  }

  const createNewTag = async () => {
    if (!newTagName.trim()) return

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim() }),
      })

      if (response.ok) {
        const newTag = await response.json()
        setAvailableTags([...availableTags, newTag])
        addTag(newTag)
        setNewTagName("")
      }
    } catch (error) {
      console.error("Error creating tag:", error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Note" : "Create New Note"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                rows={10}
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Tags</Label>

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      style={{ backgroundColor: tag.color + "20", color: tag.color }}
                      className="flex items-center gap-1"
                    >
                      {tag.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag.id)} />
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter((tag) => !selectedTags.find((t) => t.id === tag.id))
                  .map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => addTag(tag)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Create new tag..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), createNewTag())}
                />
                <Button type="button" variant="outline" onClick={createNewTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEditing ? "Update Note" : "Create Note"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/notes")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
