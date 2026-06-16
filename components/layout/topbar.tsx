"use client";

import { Bell, Search, LogOut, User, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAvatar } from "@/lib/hooks/use-avatar";

interface TopBarUser {
  name: string;
  email: string;
  storeName: string;
  initials: string;
}

export function TopBar({ user }: { user: TopBarUser }) {
  const router = useRouter();
  const { avatarUrl } = useAvatar();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-blue-100 flex-shrink-0">
      <div className="flex items-center gap-3 max-w-xs w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />
          <Input
            placeholder="Search customers..."
            className="pl-9 h-9 bg-blue-50/50 border-blue-100 text-sm focus-visible:ring-blue-400 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
        >
          <Bell className="w-5 h-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-blue-50"
            >
              <Avatar className="w-8 h-8">
                {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile" />}
                <AvatarFallback className="bg-[#4361EE] text-white text-xs font-bold">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="font-semibold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-400 font-normal truncate">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => router.push("/settings?tab=account")}
            >
              <User className="w-4 h-4 text-slate-400" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => router.push("/settings?tab=store")}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Store Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
