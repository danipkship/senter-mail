"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { customerSchema, CustomerFormData } from "@/lib/validations/customer";
import { MockCustomer } from "@/lib/mock-data";
import { STATUS_OPTIONS } from "@/lib/customer-utils";

interface CustomerFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: MockCustomer | null;
  onSave: (data: CustomerFormData, id?: string) => void;
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
      <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
        {children}
      </p>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

export function CustomerFormSheet({
  open,
  onOpenChange,
  customer,
  onSave,
}: CustomerFormSheetProps) {
  const isEdit = !!customer;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { country: "US", status: "ACTIVE" },
  });

  useEffect(() => {
    if (open) {
      if (customer) {
        reset({
          firstName: customer.firstName,
          lastName: customer.lastName,
          companyName: customer.companyName ?? "",
          mailboxNumber: customer.mailboxNumber,
          address1: customer.address1 ?? "",
          address2: customer.address2 ?? "",
          city: customer.city ?? "",
          state: customer.state ?? "",
          zip: customer.zip ?? "",
          country: customer.country,
          phone: customer.phone ?? "",
          email: customer.email ?? "",
          startDate: customer.startDate.toISOString().split("T")[0],
          endDate: customer.endDate
            ? customer.endDate.toISOString().split("T")[0]
            : "",
          status: customer.status,
          notes: customer.notes ?? "",
        });
      } else {
        reset({ country: "US", status: "ACTIVE" });
      }
    }
  }, [open, customer, reset]);

  function onSubmit(data: CustomerFormData) {
    onSave(data, customer?.id);
    onOpenChange(false);
  }

  const statusValue = watch("status");

  const inputCls = "h-9 border-slate-200 focus-visible:ring-blue-400 rounded-sm text-sm";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg flex flex-col p-0 gap-0"
      >
        {/* ── Fixed header ── */}
        <SheetHeader className="flex-shrink-0 px-6 py-5 border-b border-slate-100">
          <SheetTitle className="text-base font-bold text-slate-900">
            {isEdit ? "Edit Customer" : "Add New Customer"}
          </SheetTitle>
          <SheetDescription className="text-sm text-slate-400">
            {isEdit
              ? "Update the customer information below."
              : "Fill in the details to add a new mailbox customer."}
          </SheetDescription>
        </SheetHeader>

        {/* ── Scrollable form body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Personal Info */}
            <section>
              <SectionTitle>Personal Information</SectionTitle>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name" error={errors.firstName?.message} required>
                    <Input
                      {...register("firstName")}
                      placeholder="Maria"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Last Name" error={errors.lastName?.message} required>
                    <Input
                      {...register("lastName")}
                      placeholder="Gonzalez"
                      className={inputCls}
                    />
                  </Field>
                </div>
                <Field label="Company Name" error={errors.companyName?.message}>
                  <Input
                    {...register("companyName")}
                    placeholder="Gonzalez LLC (optional)"
                    className={inputCls}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email" error={errors.email?.message}>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="email@example.com"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Phone" error={errors.phone?.message}>
                    <Input
                      {...register("phone")}
                      placeholder="305-555-0100"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* Mailbox Info */}
            <section>
              <SectionTitle>Mailbox Information</SectionTitle>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Mailbox Number" error={errors.mailboxNumber?.message} required>
                    <Input
                      {...register("mailboxNumber")}
                      placeholder="101"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Status" error={errors.status?.message} required>
                    <Select
                      value={statusValue}
                      onValueChange={(v) => setValue("status", v as CustomerFormData["status"])}
                    >
                      <SelectTrigger className="h-9 border-slate-200 focus:ring-blue-400 rounded-sm text-sm">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start Date" error={errors.startDate?.message} required>
                    <Input
                      {...register("startDate")}
                      type="date"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="End Date" error={errors.endDate?.message}>
                    <Input
                      {...register("endDate")}
                      type="date"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* Address */}
            <section>
              <SectionTitle>Mailing Address</SectionTitle>
              <div className="space-y-3">
                <Field label="Address Line 1">
                  <Input
                    {...register("address1")}
                    placeholder="123 Main St"
                    className={inputCls}
                  />
                </Field>
                <Field label="Address Line 2">
                  <Input
                    {...register("address2")}
                    placeholder="Apt, Suite, etc."
                    className={inputCls}
                  />
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <Field label="City">
                      <Input
                        {...register("city")}
                        placeholder="Miami"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                  <Field label="State">
                    <Input
                      {...register("state")}
                      placeholder="FL"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="ZIP">
                    <Input
                      {...register("zip")}
                      placeholder="33101"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* Notes */}
            <section>
              <SectionTitle>Notes</SectionTitle>
              <Textarea
                {...register("notes")}
                placeholder="Any additional notes about this customer..."
                className="min-h-[80px] border-slate-200 focus-visible:ring-blue-400 resize-none rounded-sm text-sm"
              />
            </section>

          </form>
        </div>

        {/* ── Pinned footer ── */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100 bg-white flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="customer-form"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-sm"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Customer"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
