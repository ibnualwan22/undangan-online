"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"

interface Tag {
  id: string
  name: string
  color: string
}

export function TagFilter() {
  const [tags, setTags] = useState<Tag[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedTagId = searchParams.get("tag")

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase.from("tags").select("*").order("name")

      if (error) throw error
      setTags(data || [])
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  const handleTagClick = (tagId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedTagId === tagId) {
      params.delete("tag")
    } else {
      params.set("tag", tagId)
    }
    router.push(`/dashboard?${params.toString()}`)
  }

  const clearFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("tag")
    router.push(`/dashboard?${params.toString()}`)
  }

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-medium text-muted-foreground">Filter by tag:</span>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={selectedTagId === tag.id ? "default" : "secondary"}
          className="cursor-pointer"
          style={
            selectedTagId === tag.id
              ? { backgroundColor: tag.color, color: "white" }
              : {
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  borderColor: `${tag.color}40`,
                }
          }
          onClick={() => handleTagClick(tag.id)}
        >
          {tag.name}
        </Badge>
      ))}
      {selectedTagId && (
        <Button variant="ghost" size="sm" onClick={clearFilter}>
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}
