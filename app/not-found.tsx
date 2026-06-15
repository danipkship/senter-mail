import Link from "next/link";
import { MailOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="text-center px-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
          <MailOpen className="w-10 h-10 text-white" />
        </div>
        <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">
          404 — Not Found
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          This page doesn&apos;t exist
        </h1>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for may have been moved or removed.
        </p>
        <Button asChild className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
