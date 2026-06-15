import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-24 mb-6" />
          <Skeleton className="h-64 w-full rounded-full" />
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
