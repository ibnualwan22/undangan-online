"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NoteDialog } from "./note-dialog"

export function CreateNoteButton() {
  const [showDialog, setShowDialog] = useState(false)

  const handleNoteCreated = () => {
    // Refresh the page to show the new note
    window.location.reload()
  }

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New Note
      </Button>

      <NoteDialog open={showDialog} onOpenChange={setShowDialog} onSave={handleNoteCreated} />
    </>
  )
}
