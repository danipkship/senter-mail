import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <Skeleton className="h-7 w-10 mb-1.5" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-9 w-72 rounded-lg" />
        <Skeleton className="h-10 w-52 rounded-xl" />
        <Skeleton className="h-10 w-72 rounded-xl" />
      </div>

      <Skeleton className="h-10 w-60 rounded-xl" />

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex gap-8">
          {["Customer", "Type", "Message", "Status", "Sent At"].map((h) => (
            <Skeleton key={h} className="h-3 w-16" />
          ))}
        </div>
        <div className="divide-y divide-slate-50">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-4">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="hidden sm:block h-5 w-20 rounded-full" />
              <div className="hidden md:flex flex-col gap-1 flex-1 max-w-xs">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="hidden lg:block h-3 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
