import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCustomerById, getNotificationsByCustomer, getTemplates, getStoreSettings } from "@/lib/queries";
import { CustomerProfileContent } from "@/components/customers/customer-profile-content";

export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const storeId = (session.user as { storeId?: string }).storeId!;

  const { id } = await params;

  const [customer, notifications, templates, storeSettings] = await Promise.all([
    getCustomerById(id, storeId),
    getNotificationsByCustomer(id),
    getTemplates(storeId),
    getStoreSettings(storeId),
  ]);

  if (!customer) notFound();

  return (
    <CustomerProfileContent
      customer={customer}
      initialNotifications={notifications}
      templates={templates}
      storeName={storeSettings.storeName}
    />
  );
}
