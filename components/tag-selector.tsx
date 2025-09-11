"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Plus, Search } from "lucide-react"
import { CreateTagDialog } from "./create-tag-dialog"

interface Tag {
  id: string
  name: string
  color: string
}

interface TagSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTagSelect: (tag: Tag) => void
  selectedTags: Tag[]
}

export function TagSelector({ open, onOpenChange, onTagSelect, selectedTags }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchTags()
    }
  }, [open])

  const fetchTags = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase.from("tags").select("*").order("name")

      if (error) throw error
      setTags(data || [])
    } catch (error) {
      console.error("Error fetching tags:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedTags.find((selected) => selected.id === tag.id),
  )

  const handleTagCreated = () => {
    fetchTags()
    setShowCreateDialog(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Tags</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Loading tags...</p>
              ) : filteredTags.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {searchQuery ? "No tags found" : "No tags available"}
                </p>
              ) : (
                filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted cursor-pointer"
                    onClick={() => onTagSelect(tag)}
                  >
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        borderColor: `${tag.color}40`,
                      }}
                    >
                      {tag.name}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreateTagDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onTagCreated={handleTagCreated}
        initialName={searchQuery}
      />
    </>
  )
}
