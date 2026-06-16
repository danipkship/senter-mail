"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAvatar } from "@/lib/hooks/use-avatar";
import {
  LayoutDashboard,
  Users,
  Bell,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/customers", label: "Customers", icon: Users, exact: false },
  { href: "/notifications", label: "Notifications", icon: Bell, exact: false },
  { href: "/settings", label: "Settings", icon: Settings, exact: false },
];

interface SidebarUser {
  name: string;
  email: string;
  storeName: string;
  role: string;
  initials: string;
}

interface SidebarProps {
  user: SidebarUser;
  expiringCount?: number;
}

const SEEN_KEY = "customersBadgeSeenCount";

export function Sidebar({ user, expiringCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const { avatarUrl } = useAvatar();
  const [seenCount, setSeenCount] = useState<number | null>(null);

  // Load seen count from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SEEN_KEY);
    setSeenCount(stored !== null ? Number(stored) : null);
  }, []);

  // When user visits /customers, mark current count as seen
  useEffect(() => {
    if (pathname.startsWith("/customers")) {
      localStorage.setItem(SEEN_KEY, String(expiringCount));
      setSeenCount(expiringCount);
    }
  }, [pathname, expiringCount]);

  // Show badge only if there are expiring customers and count changed since last seen
  const showBadge = expiringCount > 0 && seenCount !== expiringCount;

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden md:flex w-64 flex-shrink-0 flex-col bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-9 h-9 flex-shrink-0"
        >
          <Image src="/2.png" alt="SENTER MAIL" width={36} height={36} priority />
        </motion.div>
        <div>
          <p className="text-sm font-bold text-slate-900 tracking-wide leading-tight">
            SENTER MAIL
          </p>
          <p className="text-xs text-slate-400 leading-tight">Mailbox CRM</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link key={item.href} href={item.href} className="block">
              <motion.div
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium",
                  active
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-md bg-[#4361EE]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 flex-shrink-0 relative z-10" />
                <span className="relative z-10 flex-1">{item.label}</span>
                {item.href === "/customers" && showBadge && (
                  <span className="relative z-10 flex-shrink-0 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-amber-400 text-white rounded-full px-1">
                    {expiringCount}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Store / User footer */}
      <div className="px-3 py-4 border-t border-slate-100">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 bg-[#4361EE] rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user.initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">
              {user.storeName}
            </p>
            <p className="text-xs text-slate-400 truncate capitalize">
              {user.role.toLowerCase()}
            </p>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}
