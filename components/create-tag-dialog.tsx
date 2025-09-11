"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Save, X } from "lucide-react"

interface CreateTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTagCreated: () => void
  initialName?: string
}

const TAG_COLORS = [
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

export function CreateTagDialog({ open, onOpenChange, onTagCreated, initialName = "" }: CreateTagDialogProps) {
  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setName(initialName)
      setSelectedColor(TAG_COLORS[0])
      setError(null)
    }
  }, [open, initialName])

  const handleSave = async () => {
    if (!name.trim()) return

    setSaving(true)
    setError(null)
    const supabase = createClient()

    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error("Not authenticated")

      const { error } = await supabase.from("tags").insert({
        name: name.trim(),
        color: selectedColor,
        user_id: user.user.id,
      })

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          setError("A tag with this name already exists")
          return
        }
        throw error
      }

      onTagCreated()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating tag:", error)
      setError("Failed to create tag")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Tag Name</Label>
            <Input
              id="tag-name"
              placeholder="Enter tag name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {TAG_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? "border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim() || saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Creating..." : "Create Tag"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
