"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { WifiOff } from "lucide-react"
import { useTranslations } from "@/lib/use-translations"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const { t } = useTranslations()

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Initial check
    updateOnlineStatus()

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  if (isOnline) {
    return null
  }

  return (
    <Badge variant="secondary" className="fixed top-4 left-4 z-50 bg-orange-100 text-orange-800 border-orange-200">
      <WifiOff className="h-3 w-3 mr-1" />
      Offline Mode
    </Badge>
  )
}
