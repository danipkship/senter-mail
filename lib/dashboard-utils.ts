import { MockCustomer } from "@/lib/mock-data";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  isWithinInterval,
  isBefore,
  isAfter,
  addDays,
} from "date-fns";

export interface DashboardStats {
  totalActive: number;
  totalPending: number;
  newThisMonth: number;
  newLastMonth: number;
  cancelledThisMonth: number;
  cancelledLastMonth: number;
  expiringSoon: number;
  netGrowthThisMonth: number;
}

export interface MonthlyDataPoint {
  month: string;
  new: number;
  cancelled: number;
}

export interface StatusDataPoint {
  name: string;
  value: number;
  color: string;
}

export function computeDashboardStats(
  customers: MockCustomer[],
  now = new Date()
): DashboardStats {
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  const thirtyDaysFromNow = addDays(now, 30);

  const totalActive = customers.filter((c) => c.status === "ACTIVE").length;
  const totalPending = customers.filter((c) => c.status === "PENDING").length;

  const newThisMonth = customers.filter((c) =>
    isWithinInterval(c.startDate, { start: thisMonthStart, end: thisMonthEnd })
  ).length;

  const newLastMonth = customers.filter((c) =>
    isWithinInterval(c.startDate, { start: lastMonthStart, end: lastMonthEnd })
  ).length;

  // Use endDate as the "left on" date for CANCELLED/EXPIRED customers
  const cancelledThisMonth = customers.filter(
    (c) =>
      (c.status === "CANCELLED" || c.status === "EXPIRED") &&
      c.endDate &&
      isWithinInterval(c.endDate, { start: thisMonthStart, end: thisMonthEnd })
  ).length;

  const cancelledLastMonth = customers.filter(
    (c) =>
      (c.status === "CANCELLED" || c.status === "EXPIRED") &&
      c.endDate &&
      isWithinInterval(c.endDate, { start: lastMonthStart, end: lastMonthEnd })
  ).length;

  const expiringSoon = customers.filter(
    (c) =>
      c.status === "ACTIVE" &&
      c.endDate &&
      isAfter(c.endDate, now) &&
      isBefore(c.endDate, thirtyDaysFromNow)
  ).length;

  const netGrowthThisMonth = newThisMonth - cancelledThisMonth;

  return {
    totalActive,
    totalPending,
    newThisMonth,
    newLastMonth,
    cancelledThisMonth,
    cancelledLastMonth,
    expiringSoon,
    netGrowthThisMonth,
  };
}

export function computeMonthlyGrowth(
  customers: MockCustomer[],
  months = 6,
  now = new Date()
): MonthlyDataPoint[] {
  return Array.from({ length: months }, (_, i) => {
    const monthDate = subMonths(now, months - 1 - i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const newCount = customers.filter((c) =>
      isWithinInterval(c.startDate, { start: monthStart, end: monthEnd })
    ).length;

    const cancelledCount = customers.filter(
      (c) =>
        (c.status === "CANCELLED" || c.status === "EXPIRED") &&
        c.endDate &&
        isWithinInterval(c.endDate, { start: monthStart, end: monthEnd })
    ).length;

    return {
      month: format(monthDate, "MMM"),
      new: newCount,
      cancelled: cancelledCount,
    };
  });
}

export function computeStatusDistribution(
  customers: MockCustomer[]
): StatusDataPoint[] {
  const counts = { ACTIVE: 0, PENDING: 0, EXPIRED: 0, CANCELLED: 0 };
  for (const c of customers) counts[c.status]++;
  return [
    { name: "Active", value: counts.ACTIVE, color: "#2563eb" },
    { name: "Pending", value: counts.PENDING, color: "#64748b" },
    { name: "Expired", value: counts.EXPIRED, color: "#f59e0b" },
    { name: "Cancelled", value: counts.CANCELLED, color: "#f87171" },
  ].filter((d) => d.value > 0);
}

export function getRecentCustomers(
  customers: MockCustomer[],
  count = 5
): MockCustomer[] {
  return [...customers]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, count);
}

export function getRecentInactive(
  customers: MockCustomer[],
  count = 5
): MockCustomer[] {
  return customers
    .filter((c) => c.status === "CANCELLED" || c.status === "EXPIRED")
    .sort(
      (a, b) => (b.endDate?.getTime() ?? 0) - (a.endDate?.getTime() ?? 0)
    )
    .slice(0, count);
}

export function getExpiringSoon(
  customers: MockCustomer[],
  days = 30,
  now = new Date()
): MockCustomer[] {
  const cutoff = addDays(now, days);
  return customers
    .filter(
      (c) =>
        c.status === "ACTIVE" &&
        c.endDate &&
        isAfter(c.endDate, now) &&
        isBefore(c.endDate, cutoff)
    )
    .sort((a, b) => a.endDate!.getTime() - b.endDate!.getTime());
}
