"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, FolderOpen, FileText, Users,
  Image as ImageIcon, ChevronDown, Menu, X, LogOut,
  Layers, SlidersHorizontal, ChevronRight, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";
import { useSidebar } from "@/components/admin/context/SidebarContext";

type NavChild = { label: string; href: string };
type NavItem = {
  label: string;
  icon: React.ElementType;
  href?: string;
  exact?: boolean;
  children?: NavChild[];
};

type NavSection = {
  section: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    section: "Genel",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    section: "İçerik",
    items: [
      {
        label: "Ürünler", icon: Package,
        children: [
          { label: "Tüm Ürünler", href: "/admin/urunler" },
          { label: "Yeni Ürün", href: "/admin/urunler/yeni" },
        ],
      },
      {
        label: "Kategoriler", icon: FolderOpen,
        children: [
          { label: "Tüm Kategoriler", href: "/admin/kategoriler" },
          { label: "Yeni Kategori", href: "/admin/kategoriler/yeni" },
        ],
      },
      {
        label: "Blog", icon: FileText,
        children: [
          { label: "Tüm Yazılar", href: "/admin/blog" },
          { label: "Yeni Yazı", href: "/admin/blog/yeni" },
          { label: "Kategoriler", href: "/admin/blog/kategoriler" },
        ],
      },
      { label: "Medya Kütüphanesi", href: "/admin/medya", icon: ImageIcon },
    ],
  },
  {
    section: "Site Yönetimi",
    items: [
      { label: "Site Ayarları", href: "/admin/ayarlar", icon: SlidersHorizontal },
      { label: "İçerik Blokları", href: "/admin/icerik-bloklari", icon: Layers },
    ],
  },
  {
    section: "Sistem",
    items: [
      { label: "Kullanıcılar", href: "/admin/kullanicilar", icon: Users },
    ],
  },
];

function NavLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const anyChildActive = item.children?.some((c) => isActive(c.href)) ?? false;
  const selfActive = item.href ? isActive(item.href, item.exact) : false;

  useEffect(() => {
    if (anyChildActive) setOpen(true);
  }, [anyChildActive]);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          title={collapsed ? item.label : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group",
            anyChildActive
              ? "bg-slate-800 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          )}
        >
          <item.icon className="h-4 w-4 flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
            </>
          )}
        </button>
        {!collapsed && open && (
          <div className="ml-4 mt-1 pl-3 border-l border-slate-700 space-y-0.5">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  "block py-1.5 px-2 text-xs rounded-md transition-colors",
                  isActive(child.href)
                    ? "text-white bg-slate-700 font-medium"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
        selfActive
          ? "bg-white/10 text-white font-medium shadow-sm"
          : "text-slate-400 hover:text-white hover:bg-slate-800"
      )}
    >
      <item.icon className="h-4 w-4 flex-shrink-0" />
      {!collapsed && <span className="font-medium">{item.label}</span>}
    </Link>
  );
}

function SidebarInner({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Logo area */}
      <div className={cn(
        "flex items-center h-16 border-b border-slate-800 flex-shrink-0 transition-all duration-200",
        collapsed ? "px-3 justify-center" : "px-5"
      )}>
        <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-serif text-xs font-bold">E</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm tracking-wide leading-none">ESAMIR</p>
              <p className="text-slate-500 text-xs mt-0.5">Yönetim Paneli</p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5 scrollbar-hide">
        {navSections.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {section.section}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink key={item.label} item={item} collapsed={collapsed} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn(
        "border-t border-slate-800 p-2 space-y-0.5 flex-shrink-0",
      )}>
        <Link
          href="/"
          target="_blank"
          title={collapsed ? "Siteyi Görüntüle" : undefined}
          className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Siteyi Görüntüle</span>}
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            title={collapsed ? "Çıkış Yap" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Çıkış Yap</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col flex-shrink-0 transition-all duration-200 ease-in-out relative",
          collapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        <SidebarInner collapsed={collapsed} />
        {/* Collapse toggle button */}
        <button
          onClick={toggleCollapsed}
          className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-600 flex items-center justify-center shadow-md transition-colors"
        >
          <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", !collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
        onClick={openMobile}
        aria-label="Menüyü aç"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 bottom-0 w-[240px] z-50 shadow-2xl transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          className="absolute top-4 right-3 z-10 p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          onClick={closeMobile}
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarInner collapsed={false} onNavigate={closeMobile} />
      </aside>
    </>
  );
}
