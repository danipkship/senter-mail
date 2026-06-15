"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Bell, FileText, UserCircle } from "lucide-react";
import { StoreForm } from "@/components/settings/store-form";
import { NotificationsForm } from "@/components/settings/notifications-form";
import { TemplatesList } from "@/components/settings/templates-list";
import { AccountForm } from "@/components/settings/account-form";
import { TwoFactorSettings } from "@/components/settings/two-factor-settings";
import { NotificationTemplate, StoreSettings, NotificationSettings } from "@/lib/types";

interface SettingsClientProps {
  storeSettings: StoreSettings;
  notificationSettings: NotificationSettings;
  templates: NotificationTemplate[];
  twoFactorEnabled: boolean;
}

const VALID_TABS = ["account", "store", "notifications", "templates"] as const;

export function SettingsClient({
  storeSettings,
  notificationSettings,
  templates,
  twoFactorEnabled,
}: SettingsClientProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const defaultTab = VALID_TABS.includes(tabParam as (typeof VALID_TABS)[number])
    ? tabParam!
    : "account";

  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList className="bg-white border border-blue-100 p-1 h-auto gap-1">
        <TabsTrigger
          value="account"
          className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          <UserCircle className="w-4 h-4" />
          Account
        </TabsTrigger>
        <TabsTrigger
          value="store"
          className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          <Store className="w-4 h-4" />
          Store Info
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          <Bell className="w-4 h-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger
          value="templates"
          className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          <FileText className="w-4 h-4" />
          Templates
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="space-y-4">
        <Card className="border border-blue-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-slate-800">Account</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Your profile and how you appear in notifications sent to customers
              </p>
            </div>
            <AccountForm />
          </CardContent>
        </Card>
        <Card className="border border-blue-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-slate-800">Two-Factor Authentication</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Add an extra layer of security to your account
              </p>
            </div>
            <TwoFactorSettings enabled={twoFactorEnabled} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="store">
        <Card className="border border-blue-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-slate-800">Store Information</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Basic information about your mailbox center store
              </p>
            </div>
            <StoreForm initialSettings={storeSettings} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card className="border border-blue-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-slate-800">Notification Settings</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Configure how notifications are sent to your customers
              </p>
            </div>
            <NotificationsForm initialSettings={notificationSettings} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="templates">
        <TemplatesList initialTemplates={templates} />
      </TabsContent>
    </Tabs>
  );
}
