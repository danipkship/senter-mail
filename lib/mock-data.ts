import { CustomerStatus } from "@/lib/types";

export interface MockCustomer {
  id: string;
  storeId: string;
  firstName: string;
  lastName: string;
  companyName: string | null;
  mailboxNumber: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  preferredContact: "EMAIL" | "SMS" | null;
  startDate: Date;
  endDate: Date | null;
  status: CustomerStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const mockCustomers: MockCustomer[] = [
  {
    id: "c1", storeId: "store_seed_001",
    firstName: "Maria", lastName: "Gonzalez", companyName: "Gonzalez LLC",
    mailboxNumber: "101", address1: "456 Oak Ave", address2: null,
    city: "Miami", state: "FL", zip: "33101", country: "US",
    phone: "305-555-0101", email: "maria@gonzalezllc.com",
    preferredContact: "EMAIL",
    startDate: new Date("2023-03-15"), endDate: null, status: "ACTIVE",
    notes: "Prefers email notifications.",
    createdAt: new Date("2023-03-15"), updatedAt: new Date("2026-06-01"),
  },
  {
    id: "c2", storeId: "store_seed_001",
    firstName: "James", lastName: "Williams", companyName: null,
    mailboxNumber: "204", address1: "789 Pine St", address2: "Apt 3B",
    city: "Miami", state: "FL", zip: "33102", country: "US",
    phone: "305-555-0202", email: "jwilliams@email.com",
    preferredContact: null,
    startDate: new Date("2024-11-01"), endDate: null, status: "ACTIVE",
    notes: null,
    createdAt: new Date("2024-11-01"), updatedAt: new Date("2026-06-01"),
  },
  {
    id: "c3", storeId: "store_seed_001",
    firstName: "Sarah", lastName: "Chen", companyName: "Chen Consulting",
    mailboxNumber: "318", address1: "321 Maple Dr", address2: null,
    city: "Miami", state: "FL", zip: "33103", country: "US",
    phone: "305-555-0303", email: "sarah@chenconsulting.com",
    preferredContact: null,
    startDate: new Date("2026-06-01"), endDate: null, status: "PENDING",
    notes: "Waiting for first payment.",
    createdAt: new Date("2026-06-01"), updatedAt: new Date("2026-06-01"),
  },
  {
    id: "c4", storeId: "store_seed_001",
    firstName: "David", lastName: "Kim", companyName: "DK Imports",
    mailboxNumber: "412", address1: "654 Cedar Ln", address2: null,
    city: "Coral Gables", state: "FL", zip: "33134", country: "US",
    phone: "305-555-0404", email: "david@dkimports.com",
    preferredContact: null,
    startDate: new Date("2024-07-20"), endDate: new Date("2026-01-20"), status: "EXPIRED",
    notes: "Did not renew — may return.",
    createdAt: new Date("2024-07-20"), updatedAt: new Date("2026-01-20"),
  },
  {
    id: "c5", storeId: "store_seed_001",
    firstName: "Robert", lastName: "Davis", companyName: null,
    mailboxNumber: "055", address1: "12 Elm St", address2: null,
    city: "Hialeah", state: "FL", zip: "33010", country: "US",
    phone: "305-555-0505", email: "rdavis@email.com",
    preferredContact: null,
    startDate: new Date("2024-01-10"), endDate: new Date("2026-06-05"), status: "CANCELLED",
    notes: "Moved out of state.",
    createdAt: new Date("2024-01-10"), updatedAt: new Date("2026-06-05"),
  },
  {
    id: "c6", storeId: "store_seed_001",
    firstName: "Lisa", lastName: "Thompson", companyName: "LT Designs",
    mailboxNumber: "177", address1: "88 Birch Ave", address2: "Suite 200",
    city: "Miami Beach", state: "FL", zip: "33139", country: "US",
    phone: "305-555-0606", email: "lisa@ltdesigns.com",
    preferredContact: null,
    startDate: new Date("2025-10-01"), endDate: new Date("2026-03-15"), status: "CANCELLED",
    notes: "Contract ended early.",
    createdAt: new Date("2025-10-01"), updatedAt: new Date("2026-03-15"),
  },
  {
    id: "c7", storeId: "store_seed_001",
    firstName: "Carlos", lastName: "Rodriguez", companyName: "CR Tech",
    mailboxNumber: "223", address1: "500 Brickell Ave", address2: null,
    city: "Miami", state: "FL", zip: "33131", country: "US",
    phone: "305-555-0707", email: "carlos@crtech.io",
    preferredContact: null,
    startDate: new Date("2025-06-15"), endDate: null, status: "ACTIVE",
    notes: null,
    createdAt: new Date("2025-06-15"), updatedAt: new Date("2026-06-01"),
  },
  {
    id: "c8", storeId: "store_seed_001",
    firstName: "Angela", lastName: "Brown", companyName: null,
    mailboxNumber: "339", address1: "77 Coconut Grove", address2: null,
    city: "Coconut Grove", state: "FL", zip: "33133", country: "US",
    phone: "305-555-0808", email: "angela.brown@gmail.com",
    preferredContact: "SMS",
    startDate: new Date("2025-09-01"), endDate: null, status: "ACTIVE",
    notes: "Notified by SMS only.",
    createdAt: new Date("2025-09-01"), updatedAt: new Date("2026-06-01"),
  },
  {
    id: "c9", storeId: "store_seed_001",
    firstName: "Michael", lastName: "Lee", companyName: "Lee & Associates",
    mailboxNumber: "450", address1: "200 Aventura Blvd", address2: null,
    city: "Aventura", state: "FL", zip: "33180", country: "US",
    phone: "305-555-0909", email: "mlee@leeassoc.com",
    preferredContact: "EMAIL",
    startDate: new Date("2020-04-01"), endDate: null, status: "ACTIVE",
    notes: "Long-term customer.",
    createdAt: new Date("2020-04-01"), updatedAt: new Date("2026-06-01"),
  },
  {
    id: "c10", storeId: "store_seed_001",
    firstName: "Patricia", lastName: "Martinez", companyName: null,
    mailboxNumber: "062", address1: "33 Sunset Dr", address2: null,
    city: "Doral", state: "FL", zip: "33178", country: "US",
    phone: "305-555-1010", email: "pmartinez@email.com",
    preferredContact: null,
    startDate: new Date("2026-03-05"), endDate: null, status: "ACTIVE",
    notes: null,
    createdAt: new Date("2026-03-05"), updatedAt: new Date("2026-06-01"),
  },
  {
    id: "c11", storeId: "store_seed_001",
    firstName: "Thomas", lastName: "Wilson", companyName: "Wilson Realty",
    mailboxNumber: "511", address1: "900 Biscayne Blvd", address2: "Floor 3",
    city: "Miami", state: "FL", zip: "33132", country: "US",
    phone: "305-555-1111", email: "tom@wilsonrealty.com",
    preferredContact: null,
    startDate: new Date("2026-01-15"), endDate: null, status: "ACTIVE",
    notes: null,
    createdAt: new Date("2026-01-15"), updatedAt: new Date("2026-06-01"),
  },
  {
    id: "c12", storeId: "store_seed_001",
    firstName: "Jennifer", lastName: "Garcia", companyName: "JG Boutique",
    mailboxNumber: "128", address1: "45 Miracle Mile", address2: null,
    city: "Coral Gables", state: "FL", zip: "33134", country: "US",
    phone: "305-555-1212", email: "jen@jgboutique.com",
    preferredContact: null,
    startDate: new Date("2026-05-20"), endDate: null, status: "ACTIVE",
    notes: "New signup, setup complete.",
    createdAt: new Date("2026-05-20"), updatedAt: new Date("2026-05-20"),
  },
  {
    id: "c13", storeId: "store_seed_001",
    firstName: "Kevin", lastName: "Taylor", companyName: null,
    mailboxNumber: "387", address1: "101 Flagler St", address2: null,
    city: "Miami", state: "FL", zip: "33130", country: "US",
    phone: "305-555-1313", email: "ktaylor@email.com",
    preferredContact: null,
    startDate: new Date("2025-07-01"), endDate: new Date("2026-06-30"), status: "ACTIVE",
    notes: "Annual plan expiring soon — follow up for renewal.",
    createdAt: new Date("2025-07-01"), updatedAt: new Date("2026-06-01"),
  },
  {
    id: "c14", storeId: "store_seed_001",
    firstName: "Nancy", lastName: "White", companyName: "White Imports",
    mailboxNumber: "244", address1: "620 Lincoln Rd", address2: null,
    city: "Miami Beach", state: "FL", zip: "33139", country: "US",
    phone: "305-555-1414", email: "nancy@whiteimports.com",
    preferredContact: null,
    startDate: new Date("2026-05-10"), endDate: null, status: "ACTIVE",
    notes: null,
    createdAt: new Date("2026-05-10"), updatedAt: new Date("2026-05-10"),
  },
  {
    id: "c15", storeId: "store_seed_001",
    firstName: "Daniel", lastName: "Harris", companyName: null,
    mailboxNumber: "099", address1: "55 SW 8th St", address2: "Apt 12",
    city: "Miami", state: "FL", zip: "33130", country: "US",
    phone: "305-555-1515", email: "dharris@email.com",
    preferredContact: null,
    startDate: new Date("2026-06-08"), endDate: null, status: "ACTIVE",
    notes: "VIP customer.",
    createdAt: new Date("2026-06-08"), updatedAt: new Date("2026-06-08"),
  },
];
