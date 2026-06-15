import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getNotifications } from "@/lib/queries";
import { NotificationsClient } from "@/components/notifications/notifications-client";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const storeId = (session.user as { storeId?: string }).storeId!;

  const notifications = await getNotifications(storeId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Mail and package notification history for all customers
        </p>
      </div>
      <NotificationsClient initialNotifications={notifications} />
    </div>
  );
}
