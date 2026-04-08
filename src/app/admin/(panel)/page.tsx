import type { Metadata } from "next";
import Link from "next/link";
import {
  Package, FolderOpen, FileText, ImageIcon, ArrowRight,
  Eye, Settings, TrendingUp, LayoutDashboard, Layers,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, blogCount, mediaCount, recentProducts, recentPosts] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.mediaAsset.count(),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" }, take: 6,
      select: { id: true, name: true, isActive: true, createdAt: true },
    }),
    prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" }, take: 6,
      select: { id: true, title: true, isPublished: true, createdAt: true },
    }),
  ]);

  const stats = [
    { label: "Aktif Ürün", value: productCount, icon: Package, href: "/admin/urunler", accent: "bg-blue-500", light: "bg-blue-50 text-blue-600" },
    { label: "Kategori", value: categoryCount, icon: FolderOpen, href: "/admin/kategoriler", accent: "bg-emerald-500", light: "bg-emerald-50 text-emerald-600" },
    { label: "Blog Yazısı", value: blogCount, icon: FileText, href: "/admin/blog", accent: "bg-violet-500", light: "bg-violet-50 text-violet-600" },
    { label: "Medya Dosyası", value: mediaCount, icon: ImageIcon, href: "/admin/medya", accent: "bg-amber-500", light: "bg-amber-50 text-amber-600" },
  ];

  const quickActions = [
    { label: "Yeni Ürün", href: "/admin/urunler/yeni", icon: Package, desc: "Ürün ekle" },
    { label: "Yeni Blog Yazısı", href: "/admin/blog/yeni", icon: FileText, desc: "Yazı yaz" },
    { label: "Yeni Kategori", href: "/admin/kategoriler/yeni", icon: FolderOpen, desc: "Kategori oluştur" },
    { label: "İçerik Blokları", href: "/admin/icerik-bloklari", icon: Layers, desc: "Ana sayfa düzenle" },
    { label: "Site Ayarları", href: "/admin/ayarlar", icon: Settings, desc: "Genel ayarlar" },
    { label: "Siteyi Görüntüle", href: "/", icon: Eye, desc: "Canlıya bak", external: true },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="h-5 w-5 text-gray-400" />
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <p className="text-sm text-gray-500">Genel bakış ve hızlı erişim</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Eye className="h-4 w-4" />
          Siteyi Gör
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${s.light}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
              <TrendingUp className="h-3 w-3" />
              <span>Tümünü görüntüle</span>
              <ArrowRight className="h-3 w-3 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Hızlı Eylemler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              target={a.external ? "_blank" : undefined}
              className="flex flex-col items-center gap-2.5 p-4 border border-gray-100 rounded-xl text-center hover:border-slate-300 hover:bg-slate-50 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                <a.icon className="h-4.5 w-4.5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 leading-tight">{a.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {/* Recent Products */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Son Eklenen Ürünler</h2>
            <Link href="/admin/urunler" className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium">
              Tümü <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProducts.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-400 text-center">Henüz ürün yok</p>
            ) : recentProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="min-w-0">
                  <Link href={`/admin/urunler/${p.id}`} className="text-sm font-medium text-gray-800 hover:text-slate-900 line-clamp-1 block">
                    {p.name}
                  </Link>
                  <p className="text-xs text-gray-400">{formatDate(p.createdAt)}</p>
                </div>
                <StatusBadge variant={p.isActive ? "active" : "inactive"} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Son Blog Yazıları</h2>
            <Link href="/admin/blog" className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium">
              Tümü <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPosts.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-400 text-center">Henüz yazı yok</p>
            ) : recentPosts.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="min-w-0">
                  <Link href={`/admin/blog/${p.id}`} className="text-sm font-medium text-gray-800 hover:text-slate-900 line-clamp-1 block">
                    {p.title}
                  </Link>
                  <p className="text-xs text-gray-400">{formatDate(p.createdAt)}</p>
                </div>
                <StatusBadge variant={p.isPublished ? "published" : "draft"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
