import { differenceInMonths, format } from "date-fns";
import { CustomerStatus } from "@/lib/types";

export function calculateMonthsActive(
  startDate: Date,
  endDate?: Date | null
): number {
  const end = endDate ?? new Date();
  return Math.max(0, differenceInMonths(end, startDate));
}

export function formatDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export const STATUS_CONFIG: Record<
  CustomerStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Active",
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border border-red-200",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  PENDING: {
    label: "Pending",
    className: "bg-slate-100 text-slate-600 border border-slate-200",
  },
};

export const STATUS_OPTIONS: { value: CustomerStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "EXPIRED", label: "Expired" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}
