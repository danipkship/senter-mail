"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, MoreHorizontal, Pencil, Trash2,
  Eye, Users, Bell, CheckCircle2, XCircle, Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/customers/status-badge";
import { CustomerFormSheet } from "@/components/customers/customer-form-sheet";
import { DeleteDialog } from "@/components/customers/delete-dialog";
import { SendNotificationDialog } from "@/components/notifications/send-notification-dialog";
import { MockCustomer } from "@/lib/mock-data";
import { CustomerFormData } from "@/lib/validations/customer";
import { CustomerStatus, NotificationTemplate } from "@/lib/types";
import { calculateMonthsActive, formatDate, getInitials } from "@/lib/customer-utils";
import { createCustomer, updateCustomer, deleteCustomer, changeCustomerStatus } from "@/app/actions/customers";

const STATUS_TABS: { value: "ALL" | CustomerStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "EXPIRED", label: "Expired" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function CustomersClient({
  initial,
  templates,
  storeName,
}: {
  initial: MockCustomer[];
  templates: NotificationTemplate[];
  storeName?: string;
}) {
  const [customers, setCustomers] = useState<MockCustomer[]>(initial);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | CustomerStatus>("ALL");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<MockCustomer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MockCustomer | null>(null);
  const [notifyTarget, setNotifyTarget] = useState<MockCustomer | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter((c) => {
      const matchSearch =
        !q ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        (c.companyName?.toLowerCase().includes(q) ?? false) ||
        c.mailboxNumber.includes(q) ||
        (c.phone?.includes(q) ?? false) ||
        (c.email?.toLowerCase().includes(q) ?? false);
      const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [customers, search, statusFilter]);

  const counts = useMemo(() => ({
    ALL: customers.length,
    ACTIVE: customers.filter((c) => c.status === "ACTIVE").length,
    PENDING: customers.filter((c) => c.status === "PENDING").length,
    EXPIRED: customers.filter((c) => c.status === "EXPIRED").length,
    CANCELLED: customers.filter((c) => c.status === "CANCELLED").length,
  }), [customers]);

  async function handleSave(data: CustomerFormData, id?: string) {
    const now = new Date();
    if (id) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                ...data,
                companyName: data.companyName || null,
                address1: data.address1 || null,
                address2: data.address2 || null,
                city: data.city || null,
                state: data.state || null,
                zip: data.zip || null,
                phone: data.phone || null,
                email: data.email || null,
                preferredContact: data.preferredContact ?? null,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                notes: data.notes || null,
                updatedAt: now,
              }
            : c
        )
      );
      await updateCustomer(id, data);
    } else {
      const newCustomer: MockCustomer = {
        id: `c${Date.now()}`,
        storeId: "",
        ...data,
        companyName: data.companyName || null,
        address1: data.address1 || null,
        address2: data.address2 || null,
        city: data.city || null,
        state: data.state || null,
        zip: data.zip || null,
        phone: data.phone || null,
        email: data.email || null,
        preferredContact: data.preferredContact ?? null,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        notes: data.notes || null,
        country: data.country ?? "US",
        createdAt: now,
        updatedAt: now,
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      await createCustomer(data);
    }
  }

  async function handleDelete(id: string) {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    await deleteCustomer(id);
  }

  async function handleStatusChange(id: string, newStatus: CustomerStatus) {
    setCustomers((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: newStatus, updatedAt: new Date() } : c)
    );
    await changeCustomerStatus(id, newStatus);
  }

  function openAdd() {
    setEditingCustomer(null);
    setSheetOpen(true);
  }

  function openEdit(c: MockCustomer) {
    setEditingCustomer(c);
    setSheetOpen(true);
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, box, email, phone..."
            className="pl-9 h-9 bg-white border-blue-100 focus-visible:ring-blue-400"
          />
        </div>
        <Button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-9"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-white border border-blue-100 rounded-md p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              statusFilter === tab.value
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs ${statusFilter === tab.value ? "opacity-70" : "opacity-50"}`}>
              {counts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">No customers found</p>
            <p className="text-xs text-slate-400 mt-1">
              {search ? "Try a different search term" : "Add your first customer to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Box #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Start Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Months</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.map((customer, i) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15, delay: i * 0.02 }}
                      className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* Customer name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                            {getInitials(customer.firstName, customer.lastName)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 truncate">
                              {customer.firstName} {customer.lastName}
                            </p>
                            {customer.companyName && (
                              <p className="text-xs text-slate-400 truncate">{customer.companyName}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Box */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
                          #{customer.mailboxNumber}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="min-w-0 space-y-0.5">
                          {customer.email && (
                            <p className="text-xs text-slate-600 truncate">{customer.email}</p>
                          )}
                          {customer.phone && (
                            <p className="text-xs text-slate-400 truncate">{customer.phone}</p>
                          )}
                          {customer.preferredContact && (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                              customer.preferredContact === "EMAIL"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}>
                              {customer.preferredContact === "EMAIL" ? "✉ Email" : "💬 SMS"}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={customer.status} />
                      </td>

                      {/* Start Date */}
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-500">
                        {formatDate(customer.startDate)}
                      </td>

                      {/* Months */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm font-semibold text-slate-700">
                          {calculateMonthsActive(customer.startDate, customer.endDate)}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">mo</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            onClick={() => setNotifyTarget(customer)}
                            className="h-7 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5"
                          >
                            <Bell className="w-3 h-3" />
                            Notify
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem asChild className="gap-2">
                                <Link href={`/customers/${customer.id}`}>
                                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                                  View Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => openEdit(customer)}
                              >
                                <Pencil className="w-3.5 h-3.5 text-slate-400" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {customer.status !== "ACTIVE" && (
                                <DropdownMenuItem
                                  className="gap-2 text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
                                  onClick={() => handleStatusChange(customer.id, "ACTIVE")}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Mark Active
                                </DropdownMenuItem>
                              )}
                              {customer.status !== "PENDING" && (
                                <DropdownMenuItem
                                  className="gap-2 text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                                  onClick={() => handleStatusChange(customer.id, "PENDING")}
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  Mark Pending
                                </DropdownMenuItem>
                              )}
                              {customer.status !== "CANCELLED" && (
                                <DropdownMenuItem
                                  className="gap-2 text-orange-600 focus:text-orange-600 focus:bg-orange-50"
                                  onClick={() => handleStatusChange(customer.id, "CANCELLED")}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Cancel Subscription
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => setDeleteTarget(customer)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 px-1">
        Showing {filtered.length} of {customers.length} customers
      </p>

      {/* Add/Edit sheet */}
      <CustomerFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        customer={editingCustomer}
        onSave={handleSave}
      />

      {/* Delete confirmation */}
      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        customerName={deleteTarget ? `${deleteTarget.firstName} ${deleteTarget.lastName}` : ""}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
      />

      {/* Quick notify dialog */}
      {notifyTarget && (
        <SendNotificationDialog
          open={!!notifyTarget}
          onOpenChange={(open) => !open && setNotifyTarget(null)}
          customer={notifyTarget}
          templates={templates}
          storeName={storeName}
          onSent={() => {}}
        />
      )}
    </div>
  );
}
