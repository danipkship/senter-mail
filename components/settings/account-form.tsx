"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAvatar, fileToAvatarDataUrl } from "@/lib/hooks/use-avatar";

const accountSchema = z.object({
  displayName: z.string().min(1, "Name is required"),
  notificationSenderName: z.string().min(1, "Sender name is required"),
});

type AccountFormData = z.infer<typeof accountSchema>;

const INITIAL = {
  displayName: "Daniel Cruz",
  email: "owner@mainstreetmailbox.com",
  notificationSenderName: "Main Street Mailbox",
};

export function AccountForm() {
  const { avatarUrl, saveAvatar } = useAvatar();
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      displayName: INITIAL.displayName,
      notificationSenderName: INITIAL.notificationSenderName,
    },
  });

  function handleAvatarClick() {
    fileRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      saveAvatar(dataUrl);
      toast.success("Photo updated — visible everywhere");
    } catch {
      toast.error("Failed to process image");
    }
  }

  async function onSubmit(data: AccountFormData) {
    await new Promise((r) => setTimeout(r, 400));
    console.log("Account saved:", data);
    toast.success("Account updated");
  }

  const initials = INITIAL.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          <button
            type="button"
            onClick={handleAvatarClick}
            className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#4361EE] flex items-center justify-center text-xl font-bold text-white">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{INITIAL.displayName}</p>
          <p className="text-xs text-slate-400 mt-0.5">{INITIAL.email}</p>
          <button
            type="button"
            onClick={handleAvatarClick}
            className="text-xs text-blue-600 hover:underline mt-1.5 block"
          >
            Change photo
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Display name */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-slate-700">
            Display Name <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("displayName")}
            placeholder="Your name"
            className="h-9 border-slate-200 focus-visible:ring-blue-400 rounded-md"
          />
          {errors.displayName && (
            <p className="text-xs text-red-500">{errors.displayName.message}</p>
          )}
        </div>

        {/* Email — read only */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-slate-700">Login Email</Label>
          <Input
            value={INITIAL.email}
            readOnly
            className="h-9 border-slate-200 bg-slate-50 text-slate-400 rounded-md cursor-not-allowed"
          />
          <p className="text-xs text-slate-400">Contact support to change your email</p>
        </div>

        {/* Notification sender name */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="text-sm font-medium text-slate-700">
            Notification Sender Name <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("notificationSenderName")}
            placeholder="e.g. Main Street Mailbox"
            className="h-9 border-slate-200 focus-visible:ring-blue-400 rounded-md"
          />
          {errors.notificationSenderName && (
            <p className="text-xs text-red-500">{errors.notificationSenderName.message}</p>
          )}
          <p className="text-xs text-slate-400">
            This name appears in the notifications sent to your customers.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-md"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
