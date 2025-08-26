import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-12 md:py-20 space-y-12">
      {/* Hero Skeleton */}
      <div className="flex flex-col items-center text-center space-y-6">
        <Skeleton className="h-12 w-3/4 md:w-1/2" />
        <Skeleton className="h-6 w-full md:w-2/3" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>

      {/* Portfolio Skeleton */}
      <div>
        <Skeleton className="h-10 w-48 mx-auto mb-8" />
         <div className="flex justify-center gap-2 mb-8">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
         </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Skeleton */}
      <div className="grid md:grid-cols-2 gap-12 items-start">
         <div className="space-y-4">
            <Skeleton className="h-10 w-1/2"/>
            <Skeleton className="h-5 w-full"/>
            <Skeleton className="h-5 w-3/4"/>
            <Skeleton className="h-5 w-1/2"/>
         </div>
         <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
         </div>
      </div>
    </div>
  );
}
