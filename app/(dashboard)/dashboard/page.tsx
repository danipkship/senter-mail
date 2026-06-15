import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserCheck, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { GrowthChart } from "@/components/dashboard/growth-chart";
import { StatusChart } from "@/components/dashboard/status-chart";
import { RecentCustomersTable } from "@/components/dashboard/recent-customers-table";
import { ExpiringSoonTable } from "@/components/dashboard/expiring-soon-table";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { getCustomers, getNotifications } from "@/lib/queries";
import {
  computeDashboardStats,
  computeMonthlyGrowth,
  computeStatusDistribution,
  getRecentCustomers,
  getExpiringSoon,
} from "@/lib/dashboard-utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const storeId = (session.user as { storeId?: string }).storeId!;

  const [customers, notifications] = await Promise.all([
    getCustomers(storeId),
    getNotifications(storeId),
  ]);

  const stats = computeDashboardStats(customers);
  const monthlyData = computeMonthlyGrowth(customers);
  const statusData = computeStatusDistribution(customers);
  const recentlyAdded = getRecentCustomers(customers, 5);
  const expiringSoon = getExpiringSoon(customers);
  const recentActivity = [...notifications]
    .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
    .slice(0, 5);

  const newDelta = stats.newThisMonth - stats.newLastMonth;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Overview of your mailbox customer activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Customers"
          value={stats.totalActive}
          change={
            stats.totalPending > 0
              ? `+${stats.totalPending} pending activation`
              : "All customers active"
          }
          changeType="neutral"
          icon={UserCheck}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="New This Month"
          value={stats.newThisMonth}
          change={
            newDelta > 0
              ? `↑ ${newDelta} vs last month`
              : newDelta < 0
              ? `↓ ${Math.abs(newDelta)} vs last month`
              : "Same as last month"
          }
          changeType={newDelta > 0 ? "positive" : newDelta < 0 ? "negative" : "neutral"}
          icon={Users}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          change="within the next 30 days"
          changeType={stats.expiringSoon > 0 ? "negative" : "positive"}
          icon={AlertTriangle}
          iconClassName={
            stats.expiringSoon > 0
              ? "bg-amber-50 text-amber-500"
              : "bg-emerald-50 text-emerald-500"
          }
        />
        <StatCard
          title="Net Growth"
          value={
            stats.netGrowthThisMonth >= 0
              ? `+${stats.netGrowthThisMonth}`
              : `${stats.netGrowthThisMonth}`
          }
          change={`${stats.cancelledThisMonth} cancelled this month`}
          changeType={
            stats.netGrowthThisMonth > 0
              ? "positive"
              : stats.netGrowthThisMonth < 0
              ? "negative"
              : "neutral"
          }
          icon={TrendingUp}
          iconClassName="bg-teal-50 text-teal-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <GrowthChart data={monthlyData} />
        </div>
        <StatusChart data={statusData} total={customers.length} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <RecentCustomersTable
          customers={recentlyAdded}
          title="Recently Added"
          emptyMessage="No customers added yet."
        />
        <ExpiringSoonTable customers={expiringSoon} />
      </div>

      <ActivityFeed notifications={recentActivity} />
    </div>
  );
}
