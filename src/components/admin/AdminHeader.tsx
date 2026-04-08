"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, LogOut, Settings, User, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";
import { useSidebar } from "@/components/admin/context/SidebarContext";
import type { SessionUser } from "@/lib/auth";

interface AdminHeaderProps {
  user: SessionUser;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { openMobile: _openMobile } = useSidebar();

  const initials = (user.name ?? user.email)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-20">
      {/* Left: mobile hamburger spacer */}
      <div className="flex items-center gap-3">
        <div className="w-9 lg:hidden" />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 ml-auto">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Siteyi Gör
        </Link>

        <div className="w-px h-5 bg-gray-200" />

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px] bg-slate-800 text-white font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-800 leading-none">{user.name ?? user.email}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-none">
                {user.role === "ADMIN" ? "Yönetici" : "Editör"}
              </p>
            </div>
            <ChevronDown className={cn("h-3.5 w-3.5 text-gray-400 transition-transform hidden sm:block", userMenuOpen && "rotate-180")} />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-800">{user.name}</p>
                  <p className="text-[10px] text-gray-400">{user.email}</p>
                </div>
                <Link
                  href="/admin/kullanicilar"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  Profil
                </Link>
                <Link
                  href="/admin/ayarlar"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Ayarlar
                </Link>
                <div className="border-t border-gray-50 mt-1 pt-1">
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Çıkış Yap
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
