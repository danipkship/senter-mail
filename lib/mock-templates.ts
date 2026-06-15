import { NotificationTemplate, StoreSettings, NotificationSettings } from "@/lib/types";

export const TEMPLATE_VARIABLES = [
  { key: "{{customerName}}", label: "Customer Name", preview: "Maria Gonzalez" },
  { key: "{{firstName}}", label: "First Name", preview: "Maria" },
  { key: "{{mailboxNumber}}", label: "Mailbox #", preview: "101" },
  { key: "{{storeName}}", label: "Store Name", preview: "Main Street Mailbox" },
  { key: "{{storePhone}}", label: "Store Phone", preview: "305-555-0001" },
  { key: "{{storeAddress}}", label: "Store Address", preview: "100 Main St, Miami FL" },
] as const;

export type TemplateVariable = (typeof TEMPLATE_VARIABLES)[number]["key"];

export function renderPreview(text: string): string {
  let result = text;
  for (const v of TEMPLATE_VARIABLES) {
    result = result.replaceAll(v.key, v.preview);
  }
  return result;
}

export const mockTemplates: NotificationTemplate[] = [
  {
    id: "t1",
    name: "Mail Arrived (SMS)",
    type: "MAIL",
    channel: "SMS",
    subject: null,
    body: "Hi {{firstName}}! You have mail at mailbox #{{mailboxNumber}} at {{storeName}}. Come pick it up anytime during business hours.",
    isDefault: true,
  },
  {
    id: "t2",
    name: "Package Ready (Email)",
    type: "PACKAGE",
    channel: "EMAIL",
    subject: "Package ready for pickup — Mailbox #{{mailboxNumber}}",
    body: "Dear {{customerName}},\n\nA package has arrived and is ready for pickup at your mailbox #{{mailboxNumber}}.\n\nPlease visit us at your earliest convenience.\n\nBest regards,\n{{storeName}}\n{{storePhone}}",
    isDefault: true,
  },
  {
    id: "t3",
    name: "Package Ready (SMS)",
    type: "PACKAGE",
    channel: "SMS",
    subject: null,
    body: "Hey {{firstName}}! A package is waiting at your mailbox #{{mailboxNumber}}. Questions? Call {{storePhone}}.",
    isDefault: false,
  },
  {
    id: "t4",
    name: "General Notice (Email)",
    type: "GENERAL",
    channel: "EMAIL",
    subject: "Important notice from {{storeName}}",
    body: "Dear {{customerName}},\n\nThis is an important notice regarding your mailbox #{{mailboxNumber}} at {{storeName}}.\n\nPlease contact us if you have any questions.\n\n{{storeName}}\n{{storePhone}}\n{{storeAddress}}",
    isDefault: false,
  },
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: "Main Street Mailbox",
  storeEmail: "info@mainstreetmailbox.com",
  storePhone: "305-555-0001",
  storeAddress: "100 Main Street, Miami, FL 33101",
};

export const INITIAL_NOTIFICATION_SETTINGS: NotificationSettings = {
  senderName: "Main Street Mailbox",
  senderEmail: "notifications@mainstreetmailbox.com",
  senderPhone: "+13055550001",
  emailProvider: "sendgrid",
  smsProvider: "twilio",
};
