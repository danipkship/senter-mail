"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Mail, MessageSquare, CheckCircle2, XCircle, Clock,
  Search, Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MockNotification } from "@/lib/mock-notifications";
import { NotificationType, NotificationChannel, NotificationStatus } from "@/lib/types";

const STATUS_CONFIG = {
  SENT: { label: "Sent", Icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  FAILED: { label: "Failed", Icon: XCircle, className: "bg-red-50 text-red-700 border-red-200" },
  PENDING: { label: "Pending", Icon: Clock, className: "bg-amber-50 text-amber-700 border-amber-200" },
} as const;

const TYPE_CONFIG = {
  MAIL: { label: "Mail", className: "bg-blue-50 text-blue-700 border-blue-200" },
  PACKAGE: { label: "Package", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  GENERAL: { label: "General", className: "bg-slate-100 text-slate-600 border-slate-200" },
} as const;

type StatusFilter = "ALL" | NotificationStatus;
type ChannelFilter = "ALL" | NotificationChannel;
type TypeFilter = "ALL" | NotificationType;

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "SENT", label: "Sent" },
  { value: "FAILED", label: "Failed" },
  { value: "PENDING", label: "Pending" },
];

function formatDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

interface NotificationsClientProps {
  initialNotifications: MockNotification[];
}

export function NotificationsClient({ initialNotifications }: NotificationsClientProps) {
  const [notifications] = useState<MockNotification[]>(initialNotifications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");

  const counts = useMemo(
    () => ({
      ALL: notifications.length,
      SENT: notifications.filter((n) => n.status === "SENT").length,
      FAILED: notifications.filter((n) => n.status === "FAILED").length,
      PENDING: notifications.filter((n) => n.status === "PENDING").length,
    }),
    [notifications]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notifications.filter((n) => {
      const matchSearch =
        !q ||
        n.customerName.toLowerCase().includes(q) ||
        n.mailboxNumber.includes(q) ||
        n.message.toLowerCase().includes(q);
      const matchStatus = statusFilter === "ALL" || n.status === statusFilter;
      const matchChannel = channelFilter === "ALL" || n.channel === channelFilter;
      const matchType = typeFilter === "ALL" || n.type === typeFilter;
      return matchSearch && matchStatus && matchChannel && matchType;
    });
  }, [notifications, search, statusFilter, channelFilter, typeFilter]);

  const sentCount = counts.SENT;
  const failedCount = counts.FAILED;
  const emailCount = notifications.filter((n) => n.channel === "EMAIL").length;
  const smsCount = notifications.filter((n) => n.channel === "SMS").length;

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Sent", value: sentCount, className: "text-emerald-600" },
          { label: "Failed", value: failedCount, className: "text-red-500" },
          { label: "Via Email", value: emailCount, className: "text-blue-600" },
          { label: "Via SMS", value: smsCount, className: "text-emerald-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-blue-100 rounded-md p-4 shadow-sm"
          >
            <p className={`text-2xl font-bold tabular-nums ${stat.className}`}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, box, message..."
            className="pl-9 h-9 bg-white border-blue-100 focus-visible:ring-blue-400"
          />
        </div>

        {/* Channel filter */}
        <div className="flex gap-1 bg-white border border-blue-100 rounded-md p-1">
          {(["ALL", "EMAIL", "SMS"] as ChannelFilter[]).map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                channelFilter === ch
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {ch === "ALL" ? "All Channels" : ch === "EMAIL" ? "Email" : "SMS"}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex gap-1 bg-white border border-blue-100 rounded-md p-1">
          {(["ALL", "MAIL", "PACKAGE", "GENERAL"] as TypeFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                typeFilter === t
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {t === "ALL" ? "All Types" : TYPE_CONFIG[t].label}
            </button>
          ))}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-white border border-blue-100 rounded-md p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === tab.value
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 text-xs ${
                statusFilter === tab.value ? "opacity-70" : "opacity-50"
              }`}
            >
              {counts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="w-8 h-8 text-slate-200 mb-3" />
            <p className="text-sm font-medium text-slate-600">No notifications found</p>
            <p className="text-xs text-slate-400 mt-1">
              {search ? "Try a different search term" : "Adjust your filters"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                    Message
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                    Sent At
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((notif) => {
                  const statusConf = STATUS_CONFIG[notif.status];
                  const typeConf = TYPE_CONFIG[notif.type];
                  const StatusIcon = statusConf.Icon;

                  return (
                    <tr
                      key={notif.id}
                      className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors"
                    >
                      {/* Customer */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/customers/${notif.customerId}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          <p className="font-medium text-slate-800 text-sm">
                            {notif.customerName}
                          </p>
                          <p className="text-xs text-slate-400">
                            Box #{notif.mailboxNumber}
                          </p>
                        </Link>
                      </td>

                      {/* Type + channel */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${typeConf.className}`}
                          >
                            {typeConf.label}
                          </Badge>
                          {notif.channel === "EMAIL" ? (
                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                      </td>

                      {/* Message preview */}
                      <td className="px-4 py-3 hidden md:table-cell max-w-xs">
                        {notif.subject && (
                          <p className="text-xs font-medium text-slate-600 truncate">
                            {notif.subject}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 truncate">
                          {notif.message.split("\n")[0]}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs ${statusConf.className}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConf.label}
                        </Badge>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-500">
                        {formatDateTime(notif.sentAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 px-1">
        Showing {filtered.length} of {notifications.length} notifications
      </p>
    </div>
  );
}
