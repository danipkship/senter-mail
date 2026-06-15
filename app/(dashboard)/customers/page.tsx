import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCustomers, getTemplates, getStoreSettings } from "@/lib/queries";
import { CustomersClient } from "@/components/customers/customers-client";

export default async function CustomersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const storeId = (session.user as { storeId?: string }).storeId!;

  const [customers, templates, storeSettings] = await Promise.all([
    getCustomers(storeId),
    getTemplates(storeId),
    getStoreSettings(storeId),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage all mailbox customers for your store
        </p>
      </div>
      <CustomersClient
        initial={customers}
        templates={templates}
        storeName={storeSettings.storeName}
      />
    </div>
  );
}
