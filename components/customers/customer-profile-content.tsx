"use client";

import { useState } from "react";
import Link from "next/link";
import { differenceInDays, isAfter } from "date-fns";
import {
  ArrowLeft, Mail, MapPin, Building2,
  Calendar, Clock, Hash, FileText, Bell,
  CheckCircle2, XCircle, Clock as ClockIcon,
  MessageSquare, Pencil, AlertTriangle, Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/customers/status-badge";
import { SendNotificationDialog } from "@/components/notifications/send-notification-dialog";
import { CustomerFormSheet } from "@/components/customers/customer-form-sheet";
import { MockCustomer } from "@/lib/mock-data";
import { MockNotification } from "@/lib/mock-notifications";
import { NotificationTemplate } from "@/lib/types";
import { calculateMonthsActive, formatDate, getInitials } from "@/lib/customer-utils";
import { CustomerFormData } from "@/lib/validations/customer";
import { updateCustomer, changeCustomerStatus } from "@/app/actions/customers";

const STATUS_CONFIG = {
  SENT: { label: "Sent", Icon: CheckCircle2, badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  FAILED: { label: "Failed", Icon: XCircle, badgeClass: "bg-red-50 text-red-700 border-red-200" },
  PENDING: { label: "Pending", Icon: ClockIcon, badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
} as const;

const TYPE_LABELS = { MAIL: "Mail", PACKAGE: "Package", GENERAL: "General" } as const;

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface CustomerProfileContentProps {
  customer: MockCustomer;
  initialNotifications: MockNotification[];
  templates: NotificationTemplate[];
  storeName?: string;
}

export function CustomerProfileContent({
  customer: initialCustomer,
  initialNotifications,
  templates,
  storeName,
}: CustomerProfileContentProps) {
  const [customer, setCustomer] = useState<MockCustomer>(initialCustomer);
  const [notifications, setNotifications] = useState<MockNotification[]>(initialNotifications);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    if (!confirm(`Cancel subscription for ${customer.firstName} ${customer.lastName}? They will receive a cancellation notification.`)) return;
    setCancelling(true);
    setCustomer((prev) => ({ ...prev, status: "CANCELLED" }));
    await changeCustomerStatus(customer.id, "CANCELLED");
    setCancelling(false);
  }

  async function handleReactivate() {
    setCustomer((prev) => ({ ...prev, status: "ACTIVE" }));
    await changeCustomerStatus(customer.id, "ACTIVE");
  }

  const months = calculateMonthsActive(customer.startDate, customer.endDate);
  const initials = getInitials(customer.firstName, customer.lastName);

  const now = new Date();
  const daysUntilExpiry =
    customer.status === "ACTIVE" && customer.endDate && isAfter(customer.endDate, now)
      ? differenceInDays(customer.endDate, now)
      : null;
  const showExpiryWarning = daysUntilExpiry !== null && daysUntilExpiry <= 30;

  async function handleEdit(data: CustomerFormData) {
    setCustomer((prev) => ({
      ...prev,
      ...data,
      companyName: data.companyName || null,
      address1: data.address1 || null,
      address2: data.address2 || null,
      city: data.city || null,
      state: data.state || null,
      zip: data.zip || null,
      phone: data.phone || null,
      email: data.email || null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      notes: data.notes || null,
      updatedAt: new Date(),
    }));
    await updateCustomer(customer.id, data);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Customers
      </Link>

      {/* Expiry warning banner */}
      {showExpiryWarning && (
        <div className={`rounded-md px-4 py-3 flex items-center justify-between gap-4 ${
          daysUntilExpiry! <= 7
            ? "bg-red-50 border border-red-200"
            : "bg-amber-50 border border-amber-200"
        }`}>
          <div className="flex items-center gap-2.5">
            <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${daysUntilExpiry! <= 7 ? "text-red-500" : "text-amber-500"}`} />
            <p className={`text-sm font-medium ${daysUntilExpiry! <= 7 ? "text-red-700" : "text-amber-700"}`}>
              Mailbox subscription expires in{" "}
              <strong>{daysUntilExpiry === 0 ? "today" : `${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"}`}</strong>
              {" "}— consider sending a renewal reminder
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setNotifyOpen(true)}
            className={`flex-shrink-0 gap-1.5 text-xs h-7 ${
              daysUntilExpiry! <= 7
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Notify
          </Button>
        </div>
      )}

      {/* Customer header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="w-16 h-16 bg-[#4361EE] rounded-md flex items-center justify-center text-xl font-bold text-white flex-shrink-0 shadow-md">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {customer.firstName} {customer.lastName}
              </h1>
              <StatusBadge status={customer.status} />
            </div>
            {customer.companyName && (
              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {customer.companyName}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Hash className="w-4 h-4 text-blue-400" />
                Mailbox{" "}
                <span className="font-mono font-semibold text-blue-700">
                  #{customer.mailboxNumber}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-emerald-700">{months}</span>{" "}
                months active
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                Since {formatDate(customer.startDate)}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 flex-shrink-0 flex-wrap">
            <Button
              size="sm"
              onClick={() => setNotifyOpen(true)}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200"
            >
              <Bell className="w-4 h-4" />
              Send Notification
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
            {customer.status === "CANCELLED" || customer.status === "EXPIRED" ? (
              <Button
                size="sm"
                onClick={handleReactivate}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <CheckCircle2 className="w-4 h-4" />
                Reactivate
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={cancelling}
                className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <Ban className="w-4 h-4" />
                Cancel Subscription
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact */}
        <Card className="border border-blue-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Email" value={customer.email} empty="No email on file" />
            <InfoRow label="Phone" value={customer.phone} empty="No phone on file" />
          </CardContent>
        </Card>

        {/* Mailbox */}
        <Card className="border border-blue-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Hash className="w-4 h-4 text-blue-400" />
              Mailbox Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Mailbox #" value={`#${customer.mailboxNumber}`} />
            <InfoRow label="Status" value={customer.status} />
            <InfoRow label="Start Date" value={formatDate(customer.startDate)} />
            <InfoRow
              label="End Date"
              value={customer.endDate ? formatDate(customer.endDate) : null}
              empty="No end date"
            />
            <InfoRow label="Months Active" value={`${months} months`} />
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="border border-blue-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Mailing Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customer.address1 || customer.city ? (
              <div className="text-sm text-slate-700 leading-relaxed">
                {customer.address1 && <p>{customer.address1}</p>}
                {customer.address2 && <p>{customer.address2}</p>}
                {(customer.city || customer.state || customer.zip) && (
                  <p>
                    {[customer.city, customer.state, customer.zip]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                <p>{customer.country}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No address on file</p>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="border border-blue-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customer.notes ? (
              <p className="text-sm text-slate-700 leading-relaxed">{customer.notes}</p>
            ) : (
              <p className="text-sm text-slate-400">No notes</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notification history */}
      <Card className="border border-blue-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              Notification History
            </span>
            {notifications.length > 0 && (
              <span className="text-xs font-normal text-slate-400">
                {notifications.length} sent
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="w-8 h-8 text-slate-200 mb-2" />
              <p className="text-sm text-slate-400">No notifications sent yet</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotifyOpen(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs h-7"
              >
                Send first notification
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map((notif) => {
                const conf = STATUS_CONFIG[notif.status];
                const StatusIcon = conf.Icon;
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
                          className={`text-xs h-4 px-1.5 ${conf.badgeClass}`}
                        >
                          <StatusIcon className="w-2.5 h-2.5 mr-1" />
                          {conf.label}
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

      {/* Dialogs */}
      <SendNotificationDialog
        open={notifyOpen}
        onOpenChange={setNotifyOpen}
        customer={customer}
        templates={templates}
        storeName={storeName}
        onSent={(n) => setNotifications((prev) => [n, ...prev])}
      />
      <CustomerFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        customer={customer}
        onSave={handleEdit}
      />
    </div>
  );
}

function InfoRow({
  label,
  value,
  empty = "—",
}: {
  label: string;
  value: string | null | undefined;
  empty?: string;
}) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-xs text-slate-400 shrink-0">{label}</span>
      <span className="text-sm text-slate-700 text-right">
        {value ?? <span className="text-slate-300">{empty}</span>}
      </span>
    </div>
  );
}
