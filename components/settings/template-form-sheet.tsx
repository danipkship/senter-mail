"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, MessageSquare } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
import { NotificationTemplate } from "@/lib/types";
import { TEMPLATE_VARIABLES, renderPreview } from "@/lib/mock-templates";

const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["MAIL", "PACKAGE", "GENERAL"]),
  channel: z.enum(["EMAIL", "SMS"]),
  subject: z.string().optional(),
  body: z.string().min(1, "Message body is required"),
  isDefault: z.boolean(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface TemplateFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: NotificationTemplate | null;
  onSave: (data: TemplateFormData, id?: string) => void;
}

const TYPE_OPTIONS = [
  { value: "MAIL", label: "Mail" },
  { value: "PACKAGE", label: "Package" },
  { value: "GENERAL", label: "General" },
] as const;

const CHANNEL_OPTIONS = [
  { value: "EMAIL", label: "Email" },
  { value: "SMS", label: "SMS" },
] as const;

export function TemplateFormSheet({
  open,
  onOpenChange,
  template,
  onSave,
}: TemplateFormSheetProps) {
  const isEdit = !!template;
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      type: "MAIL",
      channel: "SMS",
      isDefault: false,
    },
  });

  const channel = watch("channel");
  const bodyValue = watch("body") ?? "";
  const subjectValue = watch("subject") ?? "";

  useEffect(() => {
    if (open) {
      if (template) {
        reset({
          name: template.name,
          type: template.type,
          channel: template.channel,
          subject: template.subject ?? "",
          body: template.body,
          isDefault: template.isDefault,
        });
      } else {
        reset({ type: "MAIL", channel: "SMS", isDefault: false, body: "", subject: "" });
      }
    }
  }, [open, template, reset]);

  function insertVariable(variable: string) {
    const ta = bodyRef.current;
    if (!ta) {
      setValue("body", bodyValue + variable);
      return;
    }
    const start = ta.selectionStart ?? bodyValue.length;
    const end = ta.selectionEnd ?? bodyValue.length;
    const newValue = bodyValue.slice(0, start) + variable + bodyValue.slice(end);
    setValue("body", newValue, { shouldValidate: true });
    requestAnimationFrame(() => {
      ta.selectionStart = start + variable.length;
      ta.selectionEnd = start + variable.length;
      ta.focus();
    });
  }

  function onSubmit(data: TemplateFormData) {
    onSave(data, template?.id);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto overflow-x-hidden flex flex-col"
      >
        <SheetHeader className="pb-4 border-b border-slate-100 mb-6">
          <SheetTitle className="text-lg font-bold text-slate-900">
            {isEdit ? "Edit Template" : "New Notification Template"}
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            {isEdit
              ? "Update this notification template."
              : "Create a reusable template for mail and package notifications."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name + Type + Channel row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">
                Template Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("name")}
                placeholder="e.g. Mail Arrived (SMS)"
                className="h-9 border-slate-200 focus-visible:ring-blue-400"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Type</Label>
              <Select
                value={watch("type")}
                onValueChange={(v) =>
                  setValue("type", v as TemplateFormData["type"])
                }
              >
                <SelectTrigger className="h-9 border-slate-200 focus:ring-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Channel</Label>
              <Select
                value={channel}
                onValueChange={(v) =>
                  setValue("channel", v as TemplateFormData["channel"])
                }
              >
                <SelectTrigger className="h-9 border-slate-200 focus:ring-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNEL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subject — only for email */}
          {channel === "EMAIL" && (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">
                Subject Line <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("subject")}
                placeholder="e.g. Package ready for pickup — Mailbox #{{mailboxNumber}}"
                className="h-9 border-slate-200 focus-visible:ring-blue-400"
              />
            </div>
          )}

          {/* Variables */}
          <div className="space-y-2 min-w-0">
            <Label className="text-sm font-medium text-slate-700">
              Insert Variable
            </Label>
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {TEMPLATE_VARIABLES.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => insertVariable(v.key)}
                  className="px-2 py-1 text-xs font-mono bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md transition-colors shrink-0"
                >
                  {v.key}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              Click a variable to insert it at your cursor position
            </p>
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-700">
                Message Body <span className="text-red-500">*</span>
              </Label>
              <span className="text-xs text-slate-400">
                {bodyValue.length} chars
                {channel === "SMS" && bodyValue.length > 160 && (
                  <span className="text-amber-500 ml-1">
                    ({Math.ceil(bodyValue.length / 160)} SMS segments)
                  </span>
                )}
              </span>
            </div>
            <Textarea
              {...register("body")}
              ref={(el) => {
                register("body").ref(el);
                (bodyRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
              }}
              placeholder={
                channel === "SMS"
                  ? "Hi {{firstName}}, you have mail at mailbox #{{mailboxNumber}}..."
                  : "Dear {{customerName}},\n\nA package has arrived..."
              }
              className="min-h-[140px] border-slate-200 focus-visible:ring-blue-400 font-mono text-sm resize-none"
            />
            {errors.body && (
              <p className="text-xs text-red-500">{errors.body.message}</p>
            )}
          </div>

          {/* Live preview */}
          {bodyValue && (
            <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {channel === "EMAIL" ? (
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                ) : (
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                )}
                Preview
              </div>
              {channel === "EMAIL" && subjectValue && (
                <p className="text-xs font-semibold text-slate-700">
                  Subject: {renderPreview(subjectValue)}
                </p>
              )}
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {renderPreview(bodyValue)}
              </p>
            </div>
          )}

          {/* Default toggle */}
          <div className="flex items-center gap-3 py-1">
            <input
              {...register("isDefault")}
              type="checkbox"
              id="isDefault"
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
            />
            <Label htmlFor="isDefault" className="text-sm text-slate-700 cursor-pointer">
              Set as default template for this type & channel
            </Label>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2 pb-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Template"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
