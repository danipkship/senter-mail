"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { customerSchema, CustomerFormData } from "@/lib/validations/customer";
import { renderForCustomer } from "@/lib/notification-utils";
import { sendEmail } from "@/lib/providers/email";
import { sendSMS } from "@/lib/providers/sms";

type CustomerStatus = "ACTIVE" | "PENDING" | "EXPIRED" | "CANCELLED";

async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const storeId = (session.user as { storeId?: string }).storeId;
  if (!storeId) throw new Error("No store");
  return { session, storeId };
}

export async function createCustomer(data: CustomerFormData) {
  const { storeId } = await getSession();
  const parsed = customerSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid data" };

  const d = parsed.data;
  await prisma.customer.create({
    data: {
      storeId,
      firstName: d.firstName,
      lastName: d.lastName,
      companyName: d.companyName || null,
      mailboxNumber: d.mailboxNumber,
      address1: d.address1 || null,
      address2: d.address2 || null,
      city: d.city || null,
      state: d.state || null,
      zip: d.zip || null,
      country: d.country ?? "US",
      phone: d.phone || null,
      email: d.email || null,
      preferredContact: d.preferredContact ?? null,
      startDate: new Date(d.startDate),
      endDate: d.endDate ? new Date(d.endDate) : null,
      status: d.status,
      notes: d.notes || null,
    },
  });

  revalidatePath("/customers");
  return { success: true };
}

export async function updateCustomer(id: string, data: CustomerFormData) {
  const { storeId } = await getSession();
  const parsed = customerSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid data" };

  const d = parsed.data;
  await prisma.customer.updateMany({
    where: { id, storeId },
    data: {
      firstName: d.firstName,
      lastName: d.lastName,
      companyName: d.companyName || null,
      mailboxNumber: d.mailboxNumber,
      address1: d.address1 || null,
      address2: d.address2 || null,
      city: d.city || null,
      state: d.state || null,
      zip: d.zip || null,
      country: d.country ?? "US",
      phone: d.phone || null,
      email: d.email || null,
      preferredContact: d.preferredContact ?? null,
      startDate: new Date(d.startDate),
      endDate: d.endDate ? new Date(d.endDate) : null,
      status: d.status,
      notes: d.notes || null,
    },
  });

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  return { success: true };
}

export async function deleteCustomer(id: string) {
  const { storeId } = await getSession();
  await prisma.customer.deleteMany({ where: { id, storeId } });
  revalidatePath("/customers");
  return { success: true };
}

export async function changeCustomerStatus(id: string, newStatus: CustomerStatus) {
  const { session, storeId } = await getSession();

  const customer = await prisma.customer.findFirst({ where: { id, storeId } });
  if (!customer) return { error: "Customer not found" };

  await prisma.customer.update({ where: { id }, data: { status: newStatus } });

  // Send notification for CANCELLED and EXPIRED
  if (newStatus === "CANCELLED" || newStatus === "EXPIRED") {
    const templateName = newStatus === "CANCELLED"
      ? "Subscription Cancelled"
      : "Subscription Expired";

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    const storeName = store?.name ?? "SENTER MAIL";
    const sentById = session.user!.id!;

    const customerData = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      mailboxNumber: customer.mailboxNumber,
    };

    // Try email first, then SMS
    const channels: { channel: "EMAIL" | "SMS"; to: string | null }[] = [
      { channel: "EMAIL", to: customer.email },
      { channel: "SMS", to: customer.phone },
    ];

    for (const { channel, to } of channels) {
      if (!to) continue;

      const tmplName = channel === "SMS" ? `${templateName} (SMS)` : templateName;
      const template = await prisma.notificationTemplate.findFirst({
        where: { storeId, name: tmplName },
      });
      if (!template) continue;

      const message = renderForCustomer(template.body, customerData, storeName);
      const subject = template.subject
        ? renderForCustomer(template.subject, customerData, storeName)
        : undefined;

      const result = channel === "EMAIL"
        ? await sendEmail(to, subject ?? `Update from ${storeName}`, message)
        : await sendSMS(to, message);

      await prisma.notification.create({
        data: {
          storeId,
          customerId: id,
          sentById,
          type: "GENERAL",
          channel,
          subject: subject ?? null,
          message,
          status: result.success ? "SENT" : "FAILED",
          sentAt: result.success ? new Date() : null,
        },
      });

      break; // send to only one channel (prefer email)
    }
  }

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  return { success: true };
}
