'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.24))] text-center py-12">
       <h2 className="text-2xl font-semibold mb-4 text-destructive">Something went wrong!</h2>
       <p className="text-muted-foreground mb-6 max-w-md">
         An unexpected error occurred. Please try again. If the problem persists, contact support.
       </p>
       <pre className="mb-6 text-sm text-muted-foreground bg-muted p-4 rounded-md max-w-full overflow-x-auto">
          {error.message || 'An unknown error occurred.'}
          {error.digest && ` (Digest: ${error.digest})`}
       </pre>
      <Button
       className="bg-accent hover:bg-accent/90 text-accent-foreground"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  )
}
