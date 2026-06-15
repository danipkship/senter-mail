import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Tabs */}
      <Skeleton className="h-11 w-80 rounded-xl" />

      {/* Form card */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-5">
        <div className="space-y-1">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
