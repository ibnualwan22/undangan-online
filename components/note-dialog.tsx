"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Save, X, Plus } from "lucide-react"
import { TagSelector } from "./tag-selector"

interface Tag {
  id: string
  name: string
  color: string
}

interface Note {
  id?: string
  title: string
  content: string
  created_at?: string
  updated_at?: string
  tags?: Tag[]
}

interface NoteDialogProps {
  note?: Note
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function NoteDialog({ note, open, onOpenChange, onSave }: NoteDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setSelectedTags(note.tags || [])
    } else {
      setTitle("")
      setContent("")
      setSelectedTags([])
    }
  }, [note, open])

  const handleSave = async () => {
    if (!title.trim()) return

    setSaving(true)
    const supabase = createClient()

    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error("Not authenticated")

      let noteId = note?.id

      if (noteId) {
        // Update existing note
        const { error } = await supabase
          .from("notes")
          .update({
            title: title.trim(),
            content: content.trim(),
          })
          .eq("id", noteId)

        if (error) throw error
      } else {
        // Create new note
        const { data: newNote, error } = await supabase
          .from("notes")
          .insert({
            title: title.trim(),
            content: content.trim(),
            user_id: user.user.id,
          })
          .select()
          .single()

        if (error) throw error
        noteId = newNote.id
      }

      if (noteId) {
        // Remove existing tag associations
        await supabase.from("note_tags").delete().eq("note_id", noteId)

        // Add new tag associations
        if (selectedTags.length > 0) {
          const tagAssociations = selectedTags.map((tag) => ({
            note_id: noteId,
            tag_id: tag.id,
            user_id: user.user.id,
          }))

          const { error: tagError } = await supabase.from("note_tags").insert(tagAssociations)

          if (tagError) throw tagError
        }
      }

      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving note:", error)
    } finally {
      setSaving(false)
    }
  }

  const removeTag = (tagToRemove: Tag) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagToRemove.id))
  }

  const handleTagSelect = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag])
    }
    setShowTagSelector(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{note?.id ? "Edit Note" : "Create Note"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <Input
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Tags</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowTagSelector(true)}>
                <Plus className="h-3 w-3 mr-1" />
                Add Tag
              </Button>
            </div>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="cursor-pointer"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                      borderColor: `${tag.color}40`,
                    }}
                    onClick={() => removeTag(tag)}
                  >
                    {tag.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-[300px] resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>

      <TagSelector
        open={showTagSelector}
        onOpenChange={setShowTagSelector}
        onTagSelect={handleTagSelect}
        selectedTags={selectedTags}
      />
    </Dialog>
  )
}
