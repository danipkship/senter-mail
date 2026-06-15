import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // Create store
  const store = await prisma.store.upsert({
    where: { id: "store_seed_001" },
    update: {},
    create: {
      id: "store_seed_001",
      name: "Main Street Mailbox",
      email: "info@mainstreetmailbox.com",
      phone: "555-0100",
      address: "123 Main Street",
    },
  });

  // Create owner user
  const hashedPassword = await bcrypt.hash("password123", 12);

  const owner = await prisma.user.upsert({
    where: { email: "owner@mainstreetmailbox.com" },
    update: {},
    create: {
      email: "owner@mainstreetmailbox.com",
      name: "Store Owner",
      password: hashedPassword,
      role: "OWNER",
      storeId: store.id,
      emailVerified: new Date(),
    },
  });

  // Create store settings
  await prisma.storeSettings.upsert({
    where: { storeId: store.id },
    update: {},
    create: {
      storeId: store.id,
      senderName: store.name,
      senderEmail: store.email ?? "",
      senderPhone: store.phone ?? "",
    },
  });

  // Default notification templates
  const defaultTemplates = [
    {
      name: "Mail Arrived",
      type: "MAIL" as const,
      channel: "EMAIL" as const,
      subject: "You have mail waiting — Mailbox #{mailboxNumber}",
      body: "Hi {firstName},\n\nYou have mail waiting for pickup at {storeName}.\n\nMailbox: #{mailboxNumber}\n\nStop by during business hours to pick it up.\n\nThanks,\n{storeName}",
      isDefault: true,
    },
    {
      name: "Mail Arrived (SMS)",
      type: "MAIL" as const,
      channel: "SMS" as const,
      subject: null,
      body: "Hi {firstName}, you have mail waiting at {storeName} — Mailbox #{mailboxNumber}. Stop by to pick it up!",
      isDefault: true,
    },
    {
      name: "Package Ready",
      type: "PACKAGE" as const,
      channel: "EMAIL" as const,
      subject: "Package ready for pickup — Mailbox #{mailboxNumber}",
      body: "Hi {firstName},\n\nA package has arrived and is ready for pickup at {storeName}.\n\nMailbox: #{mailboxNumber}\n\nPlease pick it up within 30 days to avoid storage fees.\n\nThanks,\n{storeName}",
      isDefault: true,
    },
    {
      name: "Package Ready (SMS)",
      type: "PACKAGE" as const,
      channel: "SMS" as const,
      subject: null,
      body: "Hi {firstName}, your package is ready for pickup at {storeName} — Mailbox #{mailboxNumber}. Pick up within 30 days.",
      isDefault: true,
    },
    {
      name: "Renewal Reminder",
      type: "GENERAL" as const,
      channel: "EMAIL" as const,
      subject: "Your mailbox subscription is expiring soon",
      body: "Hi {firstName},\n\nThis is a friendly reminder that your mailbox subscription at {storeName} will expire soon.\n\nMailbox: #{mailboxNumber}\n\nTo avoid any interruption in service, please stop by or contact us to renew.\n\nThanks,\n{storeName}",
      isDefault: true,
    },
    {
      name: "Renewal Reminder (SMS)",
      type: "GENERAL" as const,
      channel: "SMS" as const,
      subject: null,
      body: "Hi {firstName}, your mailbox #{mailboxNumber} at {storeName} is expiring soon. Please renew to keep your mailbox active.",
      isDefault: true,
    },
    {
      name: "Subscription Cancelled",
      type: "GENERAL" as const,
      channel: "EMAIL" as const,
      subject: "Your mailbox subscription has been cancelled",
      body: "Hi {firstName},\n\nYour mailbox subscription at {storeName} has been cancelled.\n\nMailbox: #{mailboxNumber}\n\nIf you have any questions or would like to reactivate your subscription, please contact us.\n\nThank you for being a customer.\n\n{storeName}",
      isDefault: false,
    },
    {
      name: "Subscription Cancelled (SMS)",
      type: "GENERAL" as const,
      channel: "SMS" as const,
      subject: null,
      body: "Hi {firstName}, your mailbox #{mailboxNumber} at {storeName} has been cancelled. Contact us if you have questions.",
      isDefault: false,
    },
    {
      name: "Subscription Expired",
      type: "GENERAL" as const,
      channel: "EMAIL" as const,
      subject: "Your mailbox subscription has expired",
      body: "Hi {firstName},\n\nYour mailbox subscription at {storeName} has expired.\n\nMailbox: #{mailboxNumber}\n\nTo continue receiving mail at this address, please renew your subscription. Stop by or contact us today.\n\nThanks,\n{storeName}",
      isDefault: false,
    },
    {
      name: "Subscription Expired (SMS)",
      type: "GENERAL" as const,
      channel: "SMS" as const,
      subject: null,
      body: "Hi {firstName}, your mailbox #{mailboxNumber} at {storeName} has expired. Please renew to continue service.",
      isDefault: false,
    },
  ];

  await prisma.notificationTemplate.createMany({
    data: defaultTemplates.map((t) => ({
      id: `tmpl_${store.id}_${t.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      storeId: store.id,
      ...t,
    })),
    skipDuplicates: true,
  });

  console.log("✅ Store:", store.name);
  console.log("✅ User:", owner.email);
  console.log(`✅ Templates: ${defaultTemplates.length} default templates`);
  console.log("\n🔑 Login credentials:");
  console.log("   Email:    owner@mainstreetmailbox.com");
  console.log("   Password: password123\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
