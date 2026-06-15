"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StoreSettings } from "@/lib/types";
import { toast } from "sonner";

const storeSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeEmail: z.string().email("Invalid email").or(z.literal("")),
  storePhone: z.string().optional(),
  storeAddress: z.string().optional(),
});

type StoreFormData = z.infer<typeof storeSchema>;

interface StoreFormProps {
  initialSettings: StoreSettings;
}

function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function StoreForm({ initialSettings }: StoreFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: initialSettings.storeName,
      storeEmail: initialSettings.storeEmail,
      storePhone: initialSettings.storePhone,
      storeAddress: initialSettings.storeAddress,
    },
  });

  async function onSubmit(data: StoreFormData) {
    await new Promise((r) => setTimeout(r, 400));
    console.log("Store settings saved:", data);
    toast.success("Store information saved");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Store Name" error={errors.storeName?.message} required>
          <Input
            {...register("storeName")}
            placeholder="Main Street Mailbox"
            className="h-9 border-slate-200 focus-visible:ring-blue-400"
          />
        </Field>
        <Field label="Store Email" error={errors.storeEmail?.message}>
          <Input
            {...register("storeEmail")}
            type="email"
            placeholder="info@yourstore.com"
            className="h-9 border-slate-200 focus-visible:ring-blue-400"
          />
        </Field>
        <Field label="Store Phone" error={errors.storePhone?.message}>
          <Input
            {...register("storePhone")}
            placeholder="305-555-0001"
            className="h-9 border-slate-200 focus-visible:ring-blue-400"
          />
        </Field>
      </div>

      <Field label="Store Address" error={errors.storeAddress?.message}>
        <Textarea
          {...register("storeAddress")}
          placeholder="100 Main Street, Miami, FL 33101"
          className="min-h-[80px] border-slate-200 focus-visible:ring-blue-400 resize-none"
        />
      </Field>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
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
