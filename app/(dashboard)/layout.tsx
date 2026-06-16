import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { GridBackground } from "@/components/ui/grid-background";
import { getCustomers } from "@/lib/queries";
import { getExpiringSoon } from "@/lib/dashboard-utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const storeId = (session.user as { storeId?: string }).storeId ?? "";

  const user = {
    name: session.user.name ?? session.user.email ?? "User",
    email: session.user.email ?? "",
    storeName: (session.user as { storeName?: string }).storeName ?? "My Store",
    role: (session.user as { role?: string }).role ?? "OWNER",
    initials: (session.user.name ?? session.user.email ?? "U")
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
  };

  const customers = await getCustomers(storeId);
  const expiringCount = getExpiringSoon(customers).length;

  return (
    <div className="flex h-full">
      <GridBackground />
      <Sidebar user={user} expiringCount={expiringCount} />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
