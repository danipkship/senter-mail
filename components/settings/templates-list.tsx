"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, MoreHorizontal, Star, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "@/components/customers/delete-dialog";
import { TemplateFormSheet } from "@/components/settings/template-form-sheet";
import { NotificationTemplate } from "@/lib/types";
import { toast } from "sonner";

const TYPE_CONFIG = {
  MAIL: { label: "Mail", className: "bg-blue-50 text-blue-700 border-blue-200" },
  PACKAGE: { label: "Package", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  GENERAL: { label: "General", className: "bg-slate-100 text-slate-600 border-slate-200" },
} as const;

interface TemplatesListProps {
  initialTemplates: NotificationTemplate[];
}

export function TemplatesList({ initialTemplates }: TemplatesListProps) {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(initialTemplates);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NotificationTemplate | null>(null);

  function openAdd() {
    setEditingTemplate(null);
    setSheetOpen(true);
  }

  function openEdit(t: NotificationTemplate) {
    setEditingTemplate(t);
    setSheetOpen(true);
  }

  function handleSave(
    data: {
      name: string;
      type: NotificationTemplate["type"];
      channel: NotificationTemplate["channel"];
      subject?: string;
      body: string;
      isDefault: boolean;
    },
    id?: string
  ) {
    if (id) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                name: data.name,
                type: data.type,
                channel: data.channel,
                subject: data.subject || null,
                body: data.body,
                isDefault: data.isDefault,
              }
            : t
        )
      );
      toast.success("Template updated successfully");
    } else {
      const newTemplate: NotificationTemplate = {
        id: `t${Date.now()}`,
        name: data.name,
        type: data.type,
        channel: data.channel,
        subject: data.subject || null,
        body: data.body,
        isDefault: data.isDefault,
      };
      setTemplates((prev) => [newTemplate, ...prev]);
      toast.success("Template created successfully");
    }
  }

  function handleDelete(id: string) {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast.success("Template deleted");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Notification Templates</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Reusable templates for mail and package alerts
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-9"
        >
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-md p-12 text-center bg-white">
          <Mail className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">No templates yet</p>
          <p className="text-xs text-slate-400 mt-1">Create your first notification template to get started</p>
          <Button onClick={openAdd} variant="outline" className="mt-4 gap-2">
            <Plus className="w-4 h-4" />
            Create Template
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map((template) => {
            const typeConf = TYPE_CONFIG[template.type];
            return (
              <div
                key={template.id}
                className="bg-white border border-blue-100 rounded-md p-4 flex items-start justify-between gap-4 hover:border-blue-200 transition-colors group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 p-2 bg-slate-50 rounded-lg flex-shrink-0">
                    {template.channel === "EMAIL" ? (
                      <Mail className="w-4 h-4 text-blue-500" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-medium text-slate-800 text-sm">{template.name}</span>
                      {template.isDefault && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200 rounded-md">
                          <Star className="w-2.5 h-2.5" />
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md border font-medium ${typeConf.className}`}
                      >
                        {typeConf.label}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {template.channel === "EMAIL" ? "Email" : "SMS"}
                      </span>
                      {template.subject && (
                        <>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400 truncate max-w-[200px]">
                            {template.subject}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">
                      {template.body.split("\n")[0]}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => openEdit(template)}
                    >
                      <Pencil className="w-3.5 h-3.5 text-slate-400" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => setDeleteTarget(template)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      )}

      <TemplateFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        template={editingTemplate}
        onSave={handleSave}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        customerName={deleteTarget?.name ?? ""}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
      />
    </div>
  );
}
