"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İç Mimarlık", href: "/ic-mimarlik" },
  {
    label: "Ürünler",
    href: "/urunler",
    children: [
      { label: "Tüm Ürünler", href: "/urunler" },
      { label: "Koleksiyonlar", href: "/kategoriler" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
];

interface HeaderProps {
  phone?: string;
  logo?: string;
  siteName?: string;
  announcement?: string;
  announcementActive?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Header({
  phone,
  logo,
  siteName = "ESAMIR",
  announcement,
  announcementActive,
  ctaLabel,
  ctaHref,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [_openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <>
      {/* Announcement Bar */}
      {announcementActive && announcement && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-brand-800 text-cream-50 py-2 text-center text-sm font-sans">
          <div className="container-brand">
            {announcement}
          </div>
        </div>
      )}
      
      <header
        className={cn(
          "fixed left-0 right-0 z-40 transition-all duration-300",
          announcementActive && announcement ? "top-[36px]" : "top-0",
          isScrolled
            ? "bg-cream-50/95 backdrop-blur-md shadow-sm border-b border-cream-200"
            : "bg-cream-50/80 backdrop-blur-sm"
        )}
      >
      <div className="container-brand">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            {logo ? (
              <Image
                src={logo}
                alt={siteName}
                width={140}
                height={40}
                className="h-8 lg:h-10 w-auto object-contain"
              />
            ) : (
              <span className="font-serif text-2xl lg:text-3xl font-light tracking-[0.15em] text-brand-800">
                {siteName}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.href} className="relative group">
                  <button
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-sans font-medium transition-colors rounded-sm",
                      pathname.startsWith("/urunler") || pathname.startsWith(link.href)
                        ? "text-brand-800"
                        : "text-brand-600 hover:text-brand-800"
                    )}
                    onMouseEnter={() => setOpenDropdown(link.href)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  <div
                    className={cn(
                      "absolute top-full left-0 min-w-[200px] bg-white border border-cream-200 rounded-sm shadow-card-hover py-2",
                      "transition-all duration-200 origin-top",
                      "invisible opacity-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100"
                    )}
                    onMouseEnter={() => setOpenDropdown(link.href)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-4 py-2 text-sm font-sans transition-colors",
                          pathname === child.href
                            ? "text-brand-800 bg-cream-100"
                            : "text-brand-600 hover:text-brand-800 hover:bg-cream-100"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 text-sm font-sans font-medium transition-colors rounded-sm",
                    pathname === link.href
                      ? "text-brand-800"
                      : "text-brand-600 hover:text-brand-800"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 text-sm font-sans text-brand-600 hover:text-brand-800 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{phone}</span>
              </a>
            )}
            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="px-4 py-2 bg-brand-800 text-cream-50 text-sm font-sans font-medium rounded-sm hover:bg-brand-700 transition-colors"
              >
                {ctaLabel}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-brand-700 hover:text-brand-900"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden border-t border-cream-200 bg-cream-50/98 backdrop-blur-md overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-screen" : "max-h-0"
        )}
      >
        <nav className="container-brand py-4 space-y-1">
          {navLinks.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "block px-3 py-2.5 text-sm font-sans font-medium rounded-sm transition-colors",
                  pathname === link.href
                    ? "text-brand-800 bg-cream-200"
                    : "text-brand-600 hover:text-brand-800 hover:bg-cream-100"
                )}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="pl-4 space-y-1 mt-1">
                  {link.children.slice(1).map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block px-3 py-2 text-sm font-sans rounded-sm transition-colors",
                        pathname === child.href
                          ? "text-brand-800 bg-cream-200"
                          : "text-brand-500 hover:text-brand-800 hover:bg-cream-100"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-sans text-brand-600 hover:text-brand-800"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          )}
        </nav>
      </div>
    </header>
    </>
  );
}
