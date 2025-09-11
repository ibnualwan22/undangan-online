import { TagManager } from "@/components/tag-manager"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TagsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/notes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Notes
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Tags</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <TagManager />
      </main>
    </div>
  )
}
