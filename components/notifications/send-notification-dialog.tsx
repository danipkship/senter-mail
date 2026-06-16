"use client";

import { useState, useEffect } from "react";
import { Loader2, Mail, MessageSquare, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotificationTemplate, NotificationType, NotificationChannel } from "@/lib/types";
import { MockNotification } from "@/lib/mock-notifications";
import { renderForCustomer } from "@/lib/notification-utils";
import { sendNotificationAction } from "@/app/actions/send-notification";
import { toast } from "sonner";

interface SendNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    mailboxNumber: string;
    email: string | null;
    phone: string | null;
    preferredContact?: "EMAIL" | "SMS" | null;
  };
  templates: NotificationTemplate[];
  storeName?: string;
  onSent: (notification: MockNotification) => void;
}

const TYPE_OPTIONS: { value: NotificationType; label: string; emoji: string }[] = [
  { value: "MAIL", label: "Mail", emoji: "✉️" },
  { value: "PACKAGE", label: "Package", emoji: "📦" },
  { value: "GENERAL", label: "General", emoji: "📢" },
];

export function SendNotificationDialog({
  open,
  onOpenChange,
  customer,
  templates,
  storeName = "SENTER MAIL",
  onSent,
}: SendNotificationDialogProps) {
  const [type, setType] = useState<NotificationType>("MAIL");
  const [channel, setChannel] = useState<NotificationChannel>("SMS");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("custom");
  const [sending, setSending] = useState(false);

  const hasEmail = !!customer.email;
  const hasPhone = !!customer.phone;

  // Available templates for current type+channel
  const matchingTemplates = templates.filter(
    (t) => t.type === type && t.channel === channel
  );

  // When type or channel changes, auto-select the default template
  useEffect(() => {
    if (!open) return;
    const defaultTemplate = matchingTemplates.find((t) => t.isDefault) ?? matchingTemplates[0];
    if (defaultTemplate) {
      setSelectedTemplateId(defaultTemplate.id);
      setBody(renderForCustomer(defaultTemplate.body, customer, storeName));
      setSubject(defaultTemplate.subject ? renderForCustomer(defaultTemplate.subject, customer, storeName) : "");
    } else {
      setSelectedTemplateId("custom");
      setBody("");
      setSubject("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, channel, open]);

  // When template selection changes
  function handleTemplateChange(id: string) {
    setSelectedTemplateId(id);
    if (id === "custom") {
      setBody("");
      setSubject("");
      return;
    }
    const t = templates.find((t) => t.id === id);
    if (t) {
      setBody(renderForCustomer(t.body, customer, storeName));
      setSubject(t.subject ? renderForCustomer(t.subject, customer, storeName) : "");
    }
  }

  // Reset on open — prefer customer's saved preferredContact, else fallback to availability
  useEffect(() => {
    if (!open) return;
    const preferredChannel: NotificationChannel =
      customer.preferredContact === "EMAIL" && hasEmail ? "EMAIL" :
      customer.preferredContact === "SMS" && hasPhone ? "SMS" :
      hasPhone ? "SMS" : hasEmail ? "EMAIL" : "SMS";
    setChannel(preferredChannel);
    setType("MAIL");
  }, [open, hasPhone, hasEmail, customer.preferredContact]);

  async function handleSend() {
    if (!body.trim()) {
      toast.error("Message body cannot be empty");
      return;
    }
    const to = channel === "SMS" ? customer.phone : customer.email;
    if (!to) {
      toast.error(`No ${channel === "SMS" ? "phone number" : "email"} on file for this customer`);
      return;
    }

    setSending(true);
    try {
      const result = await sendNotificationAction({
        customerId: customer.id,
        customerName: `${customer.firstName} ${customer.lastName}`,
        mailboxNumber: customer.mailboxNumber,
        type,
        channel,
        to,
        subject: channel === "EMAIL" ? subject : undefined,
        message: body,
      });

      const notification: MockNotification = {
        id: `n${Date.now()}`,
        customerId: customer.id,
        customerName: `${customer.firstName} ${customer.lastName}`,
        mailboxNumber: customer.mailboxNumber,
        type,
        channel,
        subject: channel === "EMAIL" ? subject || null : null,
        message: body,
        status: result.success ? "SENT" : "FAILED",
        sentAt: new Date(),
      };

      onSent(notification);
      onOpenChange(false);

      if (result.success) {
        const label = channel === "EMAIL" ? "Email" : "SMS";
        const suffix = result.simulated ? " (simulated — add credentials to .env to send for real)" : "";
        toast.success(`${label} sent to ${customer.firstName} ${customer.lastName}${suffix}`);
      } else {
        toast.error(result.error ?? "Failed to send notification");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-900">
            Notify {customer.firstName} {customer.lastName}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Mailbox #{customer.mailboxNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Type selector */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">
              Notification Type
            </Label>
            <div className="flex gap-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    type === opt.value
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-600"
                  }`}
                >
                  <span className="mr-1.5">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Channel selector */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Channel</Label>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!hasPhone}
                onClick={() => setChannel("SMS")}
                title={!hasPhone ? "No phone number on file" : undefined}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  channel === "SMS"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-emerald-200 hover:text-emerald-600"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                SMS
              </button>
              <button
                type="button"
                disabled={!hasEmail}
                onClick={() => setChannel("EMAIL")}
                title={!hasEmail ? "No email address on file" : undefined}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  channel === "EMAIL"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-600"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
            {!hasPhone && !hasEmail && (
              <p className="text-xs text-amber-600">
                This customer has no phone or email on file.
              </p>
            )}
          </div>

          {/* Template selector */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Template</Label>
            <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
              <SelectTrigger className="h-9 border-slate-200 focus:ring-blue-400">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom message</SelectItem>
                {matchingTemplates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                    {t.isDefault && " ★"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject — email only */}
          {channel === "EMAIL" && (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject line"
                className="h-9 border-slate-200 focus-visible:ring-blue-400"
              />
            </div>
          )}

          {/* Message body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-700">Message</Label>
              {channel === "SMS" && (
                <span
                  className={`text-xs ${
                    body.length > 160 ? "text-amber-500" : "text-slate-400"
                  }`}
                >
                  {body.length} / 160
                  {body.length > 160 &&
                    ` (${Math.ceil(body.length / 160)} segments)`}
                </span>
              )}
            </div>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message or select a template above..."
              className="min-h-[100px] border-slate-200 focus-visible:ring-blue-400 resize-none text-sm"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSend}
              disabled={sending || (!hasPhone && !hasEmail) || !body.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send {channel === "EMAIL" ? "Email" : "SMS"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
