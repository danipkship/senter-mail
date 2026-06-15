import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStoreSettings, getNotificationSettings, getTemplates } from "@/lib/queries";
import { SettingsClient } from "@/components/settings/settings-client";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const storeId = (session.user as { storeId?: string }).storeId!;
  const userId  = (session.user as { id?: string }).id!;

  const [storeSettings, notificationSettings, templates, currentUser] = await Promise.all([
    getStoreSettings(storeId),
    getNotificationSettings(storeId),
    getTemplates(storeId),
    prisma.user.findUnique({ where: { id: userId }, select: { twoFactorEnabled: true } }),
  ]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Store configuration and notification templates
        </p>
      </div>
      <Suspense fallback={null}>
        <SettingsClient
          storeSettings={storeSettings}
          notificationSettings={notificationSettings}
          templates={templates}
          twoFactorEnabled={currentUser?.twoFactorEnabled ?? false}
        />
      </Suspense>
    </div>
  );
}
