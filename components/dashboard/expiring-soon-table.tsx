import Link from "next/link";
import { AlertTriangle, ArrowRight, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MockCustomer } from "@/lib/mock-data";
import { differenceInDays } from "date-fns";

interface ExpiringSoonTableProps {
  customers: MockCustomer[];
}

export function ExpiringSoonTable({ customers }: ExpiringSoonTableProps) {
  return (
    <Card className="border border-amber-100 shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Expiring Soon
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 text-xs font-medium"
        >
          <Link href="/customers?status=ACTIVE">
            View all
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
        {customers.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-400">No subscriptions expiring in the next 30 days</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {customers.map((customer) => {
              const daysLeft = differenceInDays(customer.endDate!, new Date());
              const urgent = daysLeft <= 7;
              const initials = `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase();
              return (
                <div
                  key={customer.id}
                  className="flex items-center justify-between py-3 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        Box #{customer.mailboxNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                        urgent
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {daysLeft === 0
                        ? "Today"
                        : daysLeft === 1
                        ? "1 day"
                        : `${daysLeft} days`}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-7 w-7 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Link href={`/customers/${customer.id}`}>
                        <Bell className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
