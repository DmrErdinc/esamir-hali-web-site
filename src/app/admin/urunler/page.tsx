import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getImageUrl, formatDate } from "@/lib/utils";
import { AdminProductActions } from "@/components/admin/AdminProductActions";
import { BulkActivateButton } from "@/components/admin/BulkActivateButton";

export const metadata: Metadata = { title: "Ürünler" };

export default async function AdminUrunlerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string; sayfa?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.sayfa) || 1;
  const PER_PAGE = 20;

  const where: any = {};
  if (sp.q) where.OR = [{ name: { contains: sp.q, mode: "insensitive" } }, { sku: { contains: sp.q } }];
  if (sp.kategori) where.category = { slug: sp.kategori };

  const [products, total, categories, inactiveCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isCover: true }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } }),
    prisma.product.count({ where: { isActive: false } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Inactive warning */}
      {inactiveCount > 0 && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-sm text-amber-800 font-medium">
            {inactiveCount} ürün pasif durumda — sitede gözükmüyor.
          </p>
          <BulkActivateButton count={inactiveCount} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
            <Package className="h-4.5 w-4.5 text-slate-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Ürünler</h1>
            <p className="text-sm text-gray-500">{total} ürün</p>
          </div>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Yeni Ürün
        </Link>
      </div>

      {/* Filters */}
      <form className="bg-white rounded-xl border border-gray-100 p-3 flex flex-wrap gap-2.5">
        <input
          name="q"
          defaultValue={sp.q}
          placeholder="Ürün adı veya SKU ara..."
          className="h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 min-w-[200px] flex-1"
        />
        <select
          name="kategori"
          defaultValue={sp.kategori}
          className="h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className="h-9 px-4 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
          Filtrele
        </button>
        {(sp.q || sp.kategori) && (
          <Link href="/admin/urunler" className="h-9 px-3 flex items-center text-sm text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg">
            Temizle
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-14">Görsel</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Kategori</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tarih</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => {
                const img = p.images[0];
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {img ? (
                          <Image src={getImageUrl(img.url)} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1">{p.name}</p>
                      {p.sku && <p className="text-xs text-gray-400 mt-0.5">SKU: {p.sku}</p>}
                      <div className="flex gap-1 mt-1">
                        {p.isFeatured && <span className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded-full font-medium">Öne Çıkan</span>}
                        {p.isNew && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">Yeni</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-sm hidden lg:table-cell">{p.category?.name || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                        {p.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 hidden md:table-cell">{formatDate(p.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/urunler/${p.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Görüntüle">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link href={`/admin/urunler/${p.id}`} className="p-1.5 text-gray-400 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors" title="Düzenle">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <AdminProductActions productId={p.id} productName={p.name} isActive={p.isActive} isFeatured={p.isFeatured} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Package className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 mb-2">Ürün bulunamadı.</p>
                    <Link href="/admin/urunler/yeni" className="text-xs font-medium text-slate-700 underline">İlk ürünü ekle</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
            <p className="text-xs text-gray-500">{total} üründen {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} arası</p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <Link
                  key={pg}
                  href={`/admin/urunler?sayfa=${pg}${sp.q ? `&q=${sp.q}` : ""}${sp.kategori ? `&kategori=${sp.kategori}` : ""}`}
                  className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${
                    pg === page ? "bg-slate-900 text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {pg}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
