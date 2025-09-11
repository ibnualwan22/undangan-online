"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Trash2, Plus, Palette } from "lucide-react"

interface Tag {
  id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

const PRESET_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // yellow
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#ec4899", // pink
  "#6b7280", // gray
]

export function TagManager() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0])
  const [editTagName, setEditTagName] = useState("")
  const [editTagColor, setEditTagColor] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags")
      if (response.ok) {
        const tagsData = await response.json()
        setTags(tagsData)
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const createTag = async () => {
    if (!newTagName.trim()) return

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim(), color: newTagColor }),
      })

      if (response.ok) {
        const newTag = await response.json()
        setTags([...tags, newTag])
        setNewTagName("")
        setNewTagColor(PRESET_COLORS[0])
        setIsCreateDialogOpen(false)
      }
    } catch (error) {
      console.error("Error creating tag:", error)
    }
  }

  const updateTag = async () => {
    if (!editingTag || !editTagName.trim()) return

    try {
      const response = await fetch(`/api/tags/${editingTag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editTagName.trim(), color: editTagColor }),
      })

      if (response.ok) {
        const updatedTag = await response.json()
        setTags(tags.map((tag) => (tag.id === editingTag.id ? updatedTag : tag)))
        setEditingTag(null)
        setIsEditDialogOpen(false)
      }
    } catch (error) {
      console.error("Error updating tag:", error)
    }
  }

  const deleteTag = async (tagId: string) => {
    if (!confirm("Are you sure you want to delete this tag? It will be removed from all notes.")) return

    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTags(tags.filter((tag) => tag.id !== tagId))
      }
    } catch (error) {
      console.error("Error deleting tag:", error)
    }
  }

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag)
    setEditTagName(tag.name)
    setEditTagColor(tag.color)
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Tags</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tag-name">Tag Name</Label>
                <Input
                  id="tag-name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name..."
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        newTagColor === color ? "border-foreground" : "border-muted"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTagColor(color)}
                    />
                  ))}
                </div>
                <Badge variant="secondary" style={{ backgroundColor: newTagColor + "20", color: newTagColor }}>
                  {newTagName || "Preview"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button onClick={createTag} disabled={!newTagName.trim()}>
                  Create Tag
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {tags.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No tags yet</h3>
            <p className="text-muted-foreground mb-4">Create your first tag to organize your notes</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <Card key={tag.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                    {tag.name}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(tag)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteTag(tag.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Created {new Date(tag.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tag-name">Tag Name</Label>
              <Input
                id="edit-tag-name"
                value={editTagName}
                onChange={(e) => setEditTagName(e.target.value)}
                placeholder="Enter tag name..."
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      editTagColor === color ? "border-foreground" : "border-muted"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setEditTagColor(color)}
                  />
                ))}
              </div>
              <Badge variant="secondary" style={{ backgroundColor: editTagColor + "20", color: editTagColor }}>
                {editTagName || "Preview"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button onClick={updateTag} disabled={!editTagName.trim()}>
                Update Tag
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
