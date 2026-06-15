"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SendNotificationDialog } from "@/components/notifications/send-notification-dialog";
import { MockNotification } from "@/lib/mock-notifications";
import { mockTemplates } from "@/lib/mock-templates";
import { NotificationTemplate } from "@/lib/types";

interface CustomerNotificationSectionProps {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    mailboxNumber: string;
    email: string | null;
    phone: string | null;
  };
  initialHistory?: MockNotification[];
  templates?: NotificationTemplate[];
}

const STATUS_CONFIG = {
  SENT: {
    label: "Sent",
    icon: CheckCircle2,
    className: "text-emerald-600",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  FAILED: {
    label: "Failed",
    icon: XCircle,
    className: "text-red-500",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "text-amber-500",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
} as const;

const TYPE_LABELS = {
  MAIL: "Mail",
  PACKAGE: "Package",
  GENERAL: "General",
} as const;

function formatRelative(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function CustomerNotificationSection({
  customer,
  initialHistory = [],
  templates = mockTemplates,
}: CustomerNotificationSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [history, setHistory] = useState<MockNotification[]>(initialHistory);

  function handleSent(notification: MockNotification) {
    setHistory((prev) => [notification, ...prev]);
  }

  return (
    <>
      {/* Notify button — rendered inline for the profile header */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="gap-2 border-blue-100 text-blue-600 hover:bg-blue-50"
      >
        <Bell className="w-4 h-4" />
        Notify
      </Button>

      {/* Notification history card */}
      <Card className="border border-blue-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              Notification History
            </span>
            {history.length > 0 && (
              <span className="text-xs font-normal text-slate-400">
                {history.length} sent
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="w-8 h-8 text-slate-200 mb-2" />
              <p className="text-sm text-slate-400">No notifications sent yet</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs h-7"
              >
                Send first notification
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {history.map((notif) => {
                const statusConf = STATUS_CONFIG[notif.status];
                const StatusIcon = statusConf.icon;
                return (
                  <div key={notif.id} className="py-3 flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 bg-slate-50 rounded-md flex-shrink-0">
                      {notif.channel === "EMAIL" ? (
                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-slate-700">
                          {TYPE_LABELS[notif.type]}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs h-4 px-1.5 ${statusConf.badgeClass}`}
                        >
                          <StatusIcon className="w-2.5 h-2.5 mr-1" />
                          {statusConf.label}
                        </Badge>
                        <span className="text-xs text-slate-400 ml-auto">
                          {formatRelative(notif.sentAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {notif.message.split("\n")[0]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <SendNotificationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={customer}
        templates={templates}
        onSent={handleSent}
      />
    </>
  );
}
