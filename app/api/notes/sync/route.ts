import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const noteData = await request.json()
    const { action, ...note } = noteData

    let result
    switch (action) {
      case "create":
        result = await supabase.from("notes").insert({
          title: note.title,
          content: note.content,
          user_id: user.id,
        })
        break

      case "update":
        result = await supabase
          .from("notes")
          .update({
            title: note.title,
            content: note.content,
          })
          .eq("id", note.id)
          .eq("user_id", user.id)
        break

      case "delete":
        result = await supabase.from("notes").delete().eq("id", note.id).eq("user_id", user.id)
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    if (result.error) {
      throw result.error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Failed to sync note" }, { status: 500 })
  }
}
