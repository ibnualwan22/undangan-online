"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { NoteDialog } from "./note-dialog"
import { DeleteNoteDialog } from "./delete-note-dialog"

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

interface NoteCardProps {
  note: Note
  onUpdate: () => void
}

export function NoteCard({ note, onUpdate }: NoteCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-sm line-clamp-2 flex-1" onClick={() => setShowEditDialog(true)}>
              {note.title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {note.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs px-2 py-0.5"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                    borderColor: `${tag.color}40`,
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
              {note.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  +{note.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-4 mb-3" onClick={() => setShowEditDialog(true)}>
            {truncateContent(note.content)}
          </p>
          <p className="text-xs text-muted-foreground">{formatDate(note.updated_at)}</p>
        </CardContent>
      </Card>

      <NoteDialog note={note} open={showEditDialog} onOpenChange={setShowEditDialog} onSave={onUpdate} />

      <DeleteNoteDialog note={note} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onDelete={onUpdate} />
    </>
  )
}
