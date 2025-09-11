"use client"

import { NotesGrid } from "@/components/notes-grid"
import { SearchBar } from "@/components/search-bar"
import { CreateNoteButton } from "@/components/create-note-button"
import { UserNav } from "@/components/user-nav"
import { TagFilter } from "@/components/tag-filter"
import { useTranslations } from "@/lib/use-translations"

interface DashboardClientProps {
  user: {
    email?: string
    id: string
  }
}

export function DashboardClient({ user }: DashboardClientProps) {
  const { t } = useTranslations()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{t("notes.myNotes")}</h1>
            <SearchBar />
          </div>
          <div className="flex items-center gap-4">
            <CreateNoteButton />
            <UserNav user={user} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <TagFilter />
        <NotesGrid />
      </main>
    </div>
  )
}
