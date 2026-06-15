"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-6">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-red-400" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">
        Something went wrong
      </h2>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset} variant="outline" className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Try again
      </Button>
    </div>
  );
}
