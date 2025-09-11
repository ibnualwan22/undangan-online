"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Search, Filter, X, CalendarIcon, SortAsc, SortDesc } from "lucide-react"
import { format } from "date-fns"

interface Tag {
  id: string
  name: string
  color: string
}

interface SearchFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  sortBy: string
  onSortChange: (sort: string) => void
  sortOrder: "asc" | "desc"
  onSortOrderChange: (order: "asc" | "desc") => void
  dateFrom?: Date
  dateTo?: Date
  onDateFromChange: (date?: Date) => void
  onDateToChange: (date?: Date) => void
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagsChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: SearchFiltersProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags")
      if (response.ok) {
        const tags = await response.json()
        setAvailableTags(tags)
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId))
    } else {
      onTagsChange([...selectedTags, tagId])
    }
  }

  const clearFilters = () => {
    onTagsChange([])
    onDateFromChange(undefined)
    onDateToChange(undefined)
    onSortChange("updated_at")
    onSortOrderChange("desc")
  }

  const hasActiveFilters =
    selectedTags.length > 0 || dateFrom || dateTo || sortBy !== "updated_at" || sortOrder !== "desc"

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search notes by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
              !
            </Badge>
          )}
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Tags Filter */}
              <div className="space-y-2">
                <Label>Filter by Tags</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      style={
                        selectedTags.includes(tag.id)
                          ? { backgroundColor: tag.color, color: "white" }
                          : { borderColor: tag.color, color: tag.color }
                      }
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dateFrom} onSelect={onDateFromChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "MMM dd") : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dateTo} onSelect={onDateToChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated_at">Last Updated</SelectItem>
                    <SelectItem value="created_at">Date Created</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Button
                  variant="outline"
                  onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
                  className="w-full justify-start"
                >
                  {sortOrder === "asc" ? (
                    <>
                      <SortAsc className="mr-2 h-4 w-4" />
                      Ascending
                    </>
                  ) : (
                    <>
                      <SortDesc className="mr-2 h-4 w-4" />
                      Descending
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tagId) => {
                      const tag = availableTags.find((t) => t.id === tagId)
                      return tag ? (
                        <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
                          {tag.name}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTag(tagId)} />
                        </Badge>
                      ) : null
                    })}
                    {dateFrom && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        From: {format(dateFrom, "MMM dd, yyyy")}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => onDateFromChange(undefined)} />
                      </Badge>
                    )}
                    {dateTo && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        To: {format(dateTo, "MMM dd, yyyy")}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => onDateToChange(undefined)} />
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
