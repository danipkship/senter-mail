export type CustomerStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING'
export type UserRole = 'OWNER' | 'MANAGER' | 'EMPLOYEE'
export type NotificationType = 'MAIL' | 'PACKAGE' | 'GENERAL'
export type NotificationChannel = 'EMAIL' | 'SMS'
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED'

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject: string | null;
  body: string;
  isDefault: boolean;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
}

export interface NotificationSettings {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  emailProvider: string;
  smsProvider: string;
}

export interface Customer {
  id: string
  storeId: string
  firstName: string
  lastName: string
  companyName: string | null
  mailboxNumber: string
  address1: string | null
  address2: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string
  phone: string | null
  email: string | null
  startDate: Date
  endDate: Date | null
  status: CustomerStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
}
