import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-9 w-72 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Status tabs */}
      <Skeleton className="h-10 w-80 rounded-xl" />

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex gap-8">
          {["Customer", "Box #", "Contact", "Status", "Start Date", "Months"].map((h) => (
            <Skeleton key={h} className="h-3 w-16" />
          ))}
        </div>
        <div className="divide-y divide-slate-50">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-12 rounded-md" />
              <div className="hidden md:flex flex-col gap-1 w-40">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="hidden lg:block h-3 w-20" />
              <Skeleton className="hidden lg:block h-4 w-8" />
              <Skeleton className="w-7 h-7 rounded-md ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
