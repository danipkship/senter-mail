import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CustomerStatus } from "@/lib/types";

interface TableCustomer {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string | null;
  mailboxNumber: string;
  status: CustomerStatus;
}

interface RecentCustomersTableProps {
  customers: TableCustomer[];
  title: string;
  emptyMessage?: string;
}

const statusConfig: Record<
  CustomerStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Active",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  },
  EXPIRED: {
    label: "Expired",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  },
  PENDING: {
    label: "Pending",
    className:
      "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100",
  },
};

export function RecentCustomersTable({
  customers,
  title,
  emptyMessage = "No customers to display.",
}: RecentCustomersTableProps) {
  return (
    <Card className="border border-slate-200 shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-base font-semibold text-slate-800">
          {title}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 text-xs font-medium"
        >
          <Link href="/customers">
            View all
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
        {customers.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">
            {emptyMessage}
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {customers.map((customer) => {
              const config = statusConfig[customer.status];
              const initials = `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase();
              return (
                <div
                  key={customer.id}
                  className="flex items-center justify-between py-3 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        Box #{customer.mailboxNumber}
                        {customer.companyName && ` · ${customer.companyName}`}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs flex-shrink-0 ${config.className}`}
                  >
                    {config.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
