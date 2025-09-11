import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: note, error } = await supabase
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
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(note)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, content, tagIds } = await request.json()

  // Update the note
  const { data: note, error: noteError } = await supabase
    .from("notes")
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (noteError) {
    return NextResponse.json({ error: noteError.message }, { status: 500 })
  }

  // Update tags - remove existing and add new ones
  await supabase.from("note_tags").delete().eq("note_id", id)

  if (tagIds && tagIds.length > 0) {
    const noteTagsData = tagIds.map((tagId: string) => ({
      note_id: id,
      tag_id: tagId,
      user_id: user.id,
    }))

    const { error: tagError } = await supabase.from("note_tags").insert(noteTagsData)

    if (tagError) {
      console.error("Error updating tags:", tagError)
    }
  }

  return NextResponse.json(note)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Delete note tags first (foreign key constraint)
  await supabase.from("note_tags").delete().eq("note_id", id)

  // Delete the note
  const { error } = await supabase.from("notes").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
