"use client"

import { Button } from "@/components/ui/button"
import { Plus, LogOut, Tag } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n"

interface NotesHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  userEmail?: string
}

export function NotesHeader({ userEmail }: NotesHeaderProps) {
  const router = useRouter()
  const { t } = useI18n()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{t("notes.myNotes")}</h1>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <Button variant="outline" asChild>
              <Link href="/tags">
                <Tag className="h-4 w-4 mr-2" />
                {t("tags.tags")}
              </Link>
            </Button>

            <Button asChild>
              <Link href="/notes/new">
                <Plus className="h-4 w-4 mr-2" />
                {t("notes.newNote")}
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{userEmail}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
