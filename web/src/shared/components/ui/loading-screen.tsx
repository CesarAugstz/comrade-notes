import { Loader2 } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-base-content mb-2">
          Loading your workspace...
        </h2>
        <p className="text-base-content/70">
          Please wait while we get everything ready
        </p>
      </div>
    </div>
  )
}
