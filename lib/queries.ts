import { prisma } from "@/lib/prisma";
import { MockCustomer } from "@/lib/mock-data";
import { MockNotification } from "@/lib/mock-notifications";
import { NotificationTemplate, StoreSettings } from "@/lib/types";

// ── Customers ────────────────────────────────────────────────────────────────

export async function getCustomers(storeId: string): Promise<MockCustomer[]> {
  const rows = await prisma.customer.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });
  return rows as MockCustomer[];
}

export async function getCustomerById(
  id: string,
  storeId: string
): Promise<MockCustomer | null> {
  const row = await prisma.customer.findFirst({
    where: { id, storeId },
  });
  return row as MockCustomer | null;
}

// ── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(
  storeId: string
): Promise<MockNotification[]> {
  const rows = await prisma.notification.findMany({
    where: { storeId },
    include: { customer: { select: { firstName: true, lastName: true, mailboxNumber: true } } },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((n) => ({
    id: n.id,
    customerId: n.customerId,
    customerName: `${n.customer.firstName} ${n.customer.lastName}`,
    mailboxNumber: n.customer.mailboxNumber,
    type: n.type,
    channel: n.channel,
    subject: n.subject,
    message: n.message,
    status: n.status,
    sentAt: n.sentAt ?? n.createdAt,
  }));
}

export async function getNotificationsByCustomer(
  customerId: string
): Promise<MockNotification[]> {
  const rows = await prisma.notification.findMany({
    where: { customerId },
    include: { customer: { select: { firstName: true, lastName: true, mailboxNumber: true } } },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((n) => ({
    id: n.id,
    customerId: n.customerId,
    customerName: `${n.customer.firstName} ${n.customer.lastName}`,
    mailboxNumber: n.customer.mailboxNumber,
    type: n.type,
    channel: n.channel,
    subject: n.subject,
    message: n.message,
    status: n.status,
    sentAt: n.sentAt ?? n.createdAt,
  }));
}

// ── Templates ────────────────────────────────────────────────────────────────

const DEFAULT_TEMPLATES = [
  { name: "Mail Arrived", type: "MAIL" as const, channel: "EMAIL" as const, subject: "You have mail waiting — Mailbox #{mailboxNumber}", body: "Hi {firstName},\n\nYou have mail waiting for pickup at {storeName}.\n\nMailbox: #{mailboxNumber}\n\nStop by during business hours to pick it up.\n\nThanks,\n{storeName}", isDefault: true },
  { name: "Mail Arrived (SMS)", type: "MAIL" as const, channel: "SMS" as const, subject: null, body: "Hi {firstName}, you have mail waiting at {storeName} — Mailbox #{mailboxNumber}. Stop by to pick it up!", isDefault: true },
  { name: "Package Ready", type: "PACKAGE" as const, channel: "EMAIL" as const, subject: "Package ready for pickup — Mailbox #{mailboxNumber}", body: "Hi {firstName},\n\nA package has arrived and is ready for pickup at {storeName}.\n\nMailbox: #{mailboxNumber}\n\nPlease pick it up within 30 days to avoid storage fees.\n\nThanks,\n{storeName}", isDefault: true },
  { name: "Package Ready (SMS)", type: "PACKAGE" as const, channel: "SMS" as const, subject: null, body: "Hi {firstName}, your package is ready for pickup at {storeName} — Mailbox #{mailboxNumber}. Pick up within 30 days.", isDefault: true },
  { name: "Renewal Reminder", type: "GENERAL" as const, channel: "EMAIL" as const, subject: "Your mailbox subscription is expiring soon", body: "Hi {firstName},\n\nThis is a friendly reminder that your mailbox subscription at {storeName} will expire soon.\n\nMailbox: #{mailboxNumber}\n\nPlease stop by or contact us to renew.\n\nThanks,\n{storeName}", isDefault: true },
  { name: "Renewal Reminder (SMS)", type: "GENERAL" as const, channel: "SMS" as const, subject: null, body: "Hi {firstName}, your mailbox #{mailboxNumber} at {storeName} is expiring soon. Please renew to keep your mailbox active.", isDefault: true },
  { name: "Subscription Cancelled", type: "GENERAL" as const, channel: "EMAIL" as const, subject: "Your mailbox subscription has been cancelled", body: "Hi {firstName},\n\nYour mailbox subscription at {storeName} has been cancelled.\n\nMailbox: #{mailboxNumber}\n\nIf you have any questions or would like to reactivate your subscription, please contact us.\n\nThank you for being a customer.\n\n{storeName}", isDefault: false },
  { name: "Subscription Cancelled (SMS)", type: "GENERAL" as const, channel: "SMS" as const, subject: null, body: "Hi {firstName}, your mailbox #{mailboxNumber} at {storeName} has been cancelled. Contact us if you have questions.", isDefault: false },
  { name: "Subscription Expired", type: "GENERAL" as const, channel: "EMAIL" as const, subject: "Your mailbox subscription has expired", body: "Hi {firstName},\n\nYour mailbox subscription at {storeName} has expired.\n\nMailbox: #{mailboxNumber}\n\nTo continue receiving mail at this address, please renew your subscription. Stop by or contact us today.\n\nThanks,\n{storeName}", isDefault: false },
  { name: "Subscription Expired (SMS)", type: "GENERAL" as const, channel: "SMS" as const, subject: null, body: "Hi {firstName}, your mailbox #{mailboxNumber} at {storeName} has expired. Please renew to continue service.", isDefault: false },
];

export async function getTemplates(
  storeId: string
): Promise<NotificationTemplate[]> {
  let rows = await prisma.notificationTemplate.findMany({
    where: { storeId },
    orderBy: { createdAt: "asc" },
  });

  if (rows.length === 0) {
    await prisma.notificationTemplate.createMany({
      data: DEFAULT_TEMPLATES.map((t) => ({
        id: `tmpl_${storeId}_${t.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
        storeId,
        ...t,
      })),
      skipDuplicates: true,
    });
    rows = await prisma.notificationTemplate.findMany({
      where: { storeId },
      orderBy: { createdAt: "asc" },
    });
  }

  return rows.map((t) => ({
    id: t.id,
    storeId: t.storeId,
    name: t.name,
    type: t.type,
    channel: t.channel,
    subject: t.subject ?? null,
    body: t.body,
    isDefault: t.isDefault,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));
}

// ── Store Settings ───────────────────────────────────────────────────────────

export async function getStoreSettings(
  storeId: string
): Promise<StoreSettings> {
  const [store, settings] = await Promise.all([
    prisma.store.findUnique({ where: { id: storeId } }),
    prisma.storeSettings.findUnique({ where: { storeId } }),
  ]);

  return {
    storeName: store?.name ?? "",
    storeEmail: store?.email ?? "",
    storePhone: store?.phone ?? "",
    storeAddress: store?.address ?? "",
  };
}

export async function getNotificationSettings(
  storeId: string
): Promise<{ senderName: string; senderEmail: string; senderPhone: string; emailProvider: string; smsProvider: string }> {
  const [store, settings] = await Promise.all([
    prisma.store.findUnique({ where: { id: storeId } }),
    prisma.storeSettings.findUnique({ where: { storeId } }),
  ]);
  return {
    senderName: settings?.senderName ?? store?.name ?? "",
    senderEmail: settings?.senderEmail ?? "",
    senderPhone: settings?.senderPhone ?? "",
    emailProvider: "",
    smsProvider: "",
  };
}
