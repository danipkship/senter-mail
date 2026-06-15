"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/providers/sms";
import { sendEmail } from "@/lib/providers/email";
import { NotificationType, NotificationChannel } from "@/lib/types";

export interface SendNotificationInput {
  customerId: string;
  customerName: string;
  mailboxNumber: string;
  type: NotificationType;
  channel: NotificationChannel;
  to: string;
  subject?: string;
  message: string;
}

export interface SendNotificationResult {
  success: boolean;
  error?: string;
  simulated?: boolean;
}

export async function sendNotificationAction(
  input: SendNotificationInput
): Promise<SendNotificationResult> {
  const { customerId, type, channel, to, subject, message } = input;

  if (!to || !message) {
    return { success: false, error: "Missing recipient or message" };
  }

  // Send via provider
  let result: SendNotificationResult;
  if (channel === "SMS") {
    result = await sendSMS(to, message);
  } else if (channel === "EMAIL") {
    result = await sendEmail(
      to,
      subject?.trim() || "Notification from SENTER MAIL",
      message
    );
  } else {
    return { success: false, error: "Invalid channel" };
  }

  // Save to DB (best-effort — don't fail the whole action if DB write fails)
  try {
    const session = await auth();
    const storeId = (session?.user as { storeId?: string } | undefined)?.storeId;
    const sentById = session?.user?.id;

    if (storeId && sentById) {
      await prisma.notification.create({
        data: {
          storeId,
          customerId,
          sentById,
          type,
          channel,
          subject: subject || null,
          message,
          status: result.success ? "SENT" : "FAILED",
          sentAt: result.success ? new Date() : null,
        },
      });
    }
  } catch (err) {
    console.error("[save-notification]", err);
  }

  return result;
}
