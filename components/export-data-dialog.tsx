"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Download, FileText } from "lucide-react"

interface ExportDataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportDataDialog({ open, onOpenChange }: ExportDataDialogProps) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    const supabase = createClient()

    try {
      // Fetch all user data
      const [notesResponse, tagsResponse] = await Promise.all([
        supabase.from("notes").select("*").order("created_at"),
        supabase.from("tags").select("*").order("name"),
      ])

      if (notesResponse.error) throw notesResponse.error
      if (tagsResponse.error) throw tagsResponse.error

      // Prepare export data
      const exportData = {
        exportDate: new Date().toISOString(),
        notes: notesResponse.data || [],
        tags: tagsResponse.data || [],
        totalNotes: notesResponse.data?.length || 0,
        totalTags: tagsResponse.data?.length || 0,
      }

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `notes-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      onOpenChange(false)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Your Data
          </DialogTitle>
          <DialogDescription>
            Download all your notes and tags as a JSON file. This includes all your content, creation dates, and tag
            associations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">What's included:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All your notes with titles and content</li>
              <li>• All your tags with names and colors</li>
              <li>• Creation and modification dates</li>
              <li>• Tag associations with notes</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={exporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={exporting}>
              <Download className="h-4 w-4 mr-2" />
              {exporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
