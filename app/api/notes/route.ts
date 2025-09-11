import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: notes, error } = await supabase
    .from("notes")
    .select(`
      *,
      note_tags (
        tags (
          id,
          name,
          color
        )
      )
    `)
    .order("updated_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(notes)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, content, tagIds } = await request.json()

  // Create the note
  const { data: note, error: noteError } = await supabase
    .from("notes")
    .insert({
      title,
      content,
      user_id: user.id,
    })
    .select()
    .single()

  if (noteError) {
    return NextResponse.json({ error: noteError.message }, { status: 500 })
  }

  // Add tags if provided
  if (tagIds && tagIds.length > 0) {
    const noteTagsData = tagIds.map((tagId: string) => ({
      note_id: note.id,
      tag_id: tagId,
      user_id: user.id,
    }))

    const { error: tagError } = await supabase.from("note_tags").insert(noteTagsData)

    if (tagError) {
      console.error("Error adding tags:", tagError)
    }
  }

  return NextResponse.json(note, { status: 201 })
}
