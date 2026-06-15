import Link from "next/link";
import { Mail, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MockNotification } from "@/lib/mock-notifications";

interface ActivityFeedProps {
  notifications: MockNotification[];
}

const TYPE_LABELS = {
  MAIL: "Mail arrived",
  PACKAGE: "Package ready",
  GENERAL: "General notice",
} as const;

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ActivityFeed({ notifications }: ActivityFeedProps) {
  return (
    <Card className="border border-slate-200 shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-base font-semibold text-slate-800">
          Recent Activity
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 text-xs font-medium"
        >
          <Link href="/notifications">
            View all
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">
            No notifications sent yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex items-start gap-3 py-3">
                <div
                  className={`mt-0.5 p-1.5 rounded-md flex-shrink-0 ${
                    notif.channel === "EMAIL"
                      ? "bg-blue-50"
                      : "bg-emerald-50"
                  }`}
                >
                  {notif.channel === "EMAIL" ? (
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                  ) : (
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug">
                    <span className="font-medium">
                      {TYPE_LABELS[notif.type]}
                    </span>{" "}
                    sent to{" "}
                    <Link
                      href={`/customers/${notif.customerId}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {notif.customerName}
                    </Link>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Box #{notif.mailboxNumber} ·{" "}
                    {notif.channel === "EMAIL" ? "Email" : "SMS"}
                  </p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">
                  {formatRelative(notif.sentAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
