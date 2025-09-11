import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <WifiOff className="h-6 w-6" />
          </div>
          <CardTitle>You're Offline</CardTitle>
          <CardDescription>You're currently offline. Some features may not be available.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't worry! You can still view your cached notes and create new ones. They'll sync when you're back online.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
