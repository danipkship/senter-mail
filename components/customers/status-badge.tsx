import { cn } from "@/lib/utils";
import { CustomerStatus } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/customer-utils";

export function StatusBadge({ status }: { status: CustomerStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
