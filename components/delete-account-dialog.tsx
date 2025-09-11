"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userEmail: string
}

export function DeleteAccountDialog({ open, onOpenChange, userEmail }: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState("")
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return

    setDeleting(true)
    const supabase = createClient()

    try {
      // Delete user data first
      const { data: user } = await supabase.auth.getUser()
      if (user.user) {
        // Delete notes and tags
        await supabase.from("notes").delete().eq("user_id", user.user.id)
        await supabase.from("tags").delete().eq("user_id", user.user.id)
      }

      // Delete the user account
      const { error } = await supabase.rpc("delete_user")
      if (error) throw error

      // Sign out and redirect
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error deleting account:", error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>This action cannot be undone. This will permanently delete your account and remove all your data.</p>
            <p>
              <strong>Email:</strong> {userEmail}
            </p>
            <div className="space-y-2">
              <Label htmlFor="confirm-delete">Type "DELETE" to confirm:</Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting} onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={confirmText !== "DELETE" || deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
