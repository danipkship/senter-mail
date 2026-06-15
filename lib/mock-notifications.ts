import { NotificationType, NotificationChannel, NotificationStatus } from "@/lib/types";

export interface MockNotification {
  id: string;
  customerId: string;
  customerName: string;
  mailboxNumber: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject: string | null;
  message: string;
  status: NotificationStatus;
  sentAt: Date;
}

export const mockNotifications: MockNotification[] = [
  {
    id: "n1",
    customerId: "c1",
    customerName: "Maria Gonzalez",
    mailboxNumber: "101",
    type: "MAIL",
    channel: "SMS",
    subject: null,
    message: "Hi Maria! You have mail at mailbox #101 at Main Street Mailbox. Come pick it up anytime during business hours.",
    status: "SENT",
    sentAt: new Date("2026-06-09T10:30:00"),
  },
  {
    id: "n2",
    customerId: "c2",
    customerName: "James Williams",
    mailboxNumber: "204",
    type: "PACKAGE",
    channel: "EMAIL",
    subject: "Package ready for pickup — Mailbox #204",
    message: "Dear James Williams,\n\nA package has arrived and is ready for pickup at your mailbox #204.\n\nPlease visit us at your earliest convenience.\n\nBest regards,\nMain Street Mailbox\n305-555-0001",
    status: "SENT",
    sentAt: new Date("2026-06-09T09:15:00"),
  },
  {
    id: "n3",
    customerId: "c9",
    customerName: "Michael Lee",
    mailboxNumber: "450",
    type: "PACKAGE",
    channel: "SMS",
    subject: null,
    message: "Hey Michael! A package is waiting at your mailbox #450. Questions? Call 305-555-0001.",
    status: "SENT",
    sentAt: new Date("2026-06-08T14:45:00"),
  },
  {
    id: "n4",
    customerId: "c4",
    customerName: "David Kim",
    mailboxNumber: "412",
    type: "MAIL",
    channel: "EMAIL",
    subject: "You have mail — Mailbox #412",
    message: "Dear David Kim,\n\nYou have mail waiting at your mailbox #412.\n\nMain Street Mailbox",
    status: "FAILED",
    sentAt: new Date("2026-06-08T11:00:00"),
  },
  {
    id: "n5",
    customerId: "c7",
    customerName: "Carlos Rodriguez",
    mailboxNumber: "223",
    type: "MAIL",
    channel: "SMS",
    subject: null,
    message: "Hi Carlos! You have mail at mailbox #223 at Main Street Mailbox. Come pick it up anytime during business hours.",
    status: "SENT",
    sentAt: new Date("2026-06-07T16:20:00"),
  },
  {
    id: "n6",
    customerId: "c8",
    customerName: "Angela Brown",
    mailboxNumber: "339",
    type: "PACKAGE",
    channel: "SMS",
    subject: null,
    message: "Hey Angela! A package is waiting at your mailbox #339. Questions? Call 305-555-0001.",
    status: "SENT",
    sentAt: new Date("2026-06-07T13:10:00"),
  },
  {
    id: "n7",
    customerId: "c14",
    customerName: "Nancy White",
    mailboxNumber: "244",
    type: "GENERAL",
    channel: "EMAIL",
    subject: "Important notice from Main Street Mailbox",
    message: "Dear Nancy White,\n\nThis is an important notice regarding your mailbox #244. Please contact us if you have any questions.\n\nMain Street Mailbox\n305-555-0001",
    status: "SENT",
    sentAt: new Date("2026-06-06T09:00:00"),
  },
  {
    id: "n8",
    customerId: "c1",
    customerName: "Maria Gonzalez",
    mailboxNumber: "101",
    type: "PACKAGE",
    channel: "SMS",
    subject: null,
    message: "Hey Maria! A package is waiting at your mailbox #101. Questions? Call 305-555-0001.",
    status: "SENT",
    sentAt: new Date("2026-06-05T11:30:00"),
  },
];
