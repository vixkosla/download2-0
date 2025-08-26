import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.24))] text-center py-12">
      <h1 className="text-6xl font-bold mb-4 font-furore text-primary">404</h1>
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Oops! The page you're looking for doesn't seem to exist. It might have been moved, deleted, or maybe you mistyped the URL.
      </p>
      <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
