"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"

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

interface NoteCardProps {
  note: Note
  onDelete: (id: string) => void
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const tags = note.note_tags?.map((nt) => nt.tags) || []
  const preview = note.content.length > 150 ? note.content.substring(0, 150) + "..." : note.content

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
          <div className="flex gap-1 ml-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/notes/${note.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(note.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-4 flex-1">{preview}</p>
        <div className="space-y-3">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">Updated {new Date(note.updated_at).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}
