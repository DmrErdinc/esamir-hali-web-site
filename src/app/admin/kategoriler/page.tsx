import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, FolderOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getImageUrl } from "@/lib/utils";
import { AdminCategoryActions } from "@/components/admin/AdminCategoryActions";

export const metadata: Metadata = { title: "Kategoriler" };

export default async function AdminKategorilerPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { order: "asc" }],
    include: { _count: { select: { products: true, children: true } } },
  });

  const parents = categories.filter((c) => !c.parentId);
  const children = categories.filter((c) => c.parentId);

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
            <FolderOpen className="h-4.5 w-4.5 text-slate-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Kategoriler</h1>
            <p className="text-sm text-gray-500">{categories.length} kategori ({parents.length} ana, {children.length} alt)</p>
          </div>
        </div>
        <Link
          href="/admin/kategoriler/yeni"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Yeni Kategori
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-14">Görsel</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Üst Kategori</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {parents.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-sm text-gray-400">Kategori bulunamadı.</td></tr>
              ) : parents.map((cat) => (
                <React.Fragment key={cat.id}>
                  <tr className="hover:bg-gray-50/50 bg-gray-50/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                        {cat.coverImage ? (
                          <Image src={getImageUrl(cat.coverImage)} alt={cat.name} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><FolderOpen className="h-4 w-4 text-gray-300" /></div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900">{cat.name}</p>
                      <code className="text-xs text-gray-400">{cat.slug}</code>
                    </td>
                    <td className="px-5 py-3 text-gray-400 hidden sm:table-cell">—</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{cat._count.products}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        cat.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                        {cat.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/kategoriler/${cat.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link href={`/admin/kategoriler/${cat.id}`} className="p-1.5 text-gray-400 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <AdminCategoryActions categoryId={cat.id} categoryName={cat.name} isActive={cat.isActive} />
                      </div>
                    </td>
                  </tr>

                  {children.filter((c) => c.parentId === cat.id).map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden ml-4">
                          {sub.coverImage ? (
                            <Image src={getImageUrl(sub.coverImage)} alt={sub.name} width={32} height={32} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><FolderOpen className="h-3 w-3 text-gray-300" /></div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 pl-10">
                        <p className="text-gray-700 text-sm">&#x21b3; {sub.name}</p>
                        <code className="text-xs text-gray-400">{sub.slug}</code>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400 hidden sm:table-cell">{cat.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{sub._count.products}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          sub.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sub.isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                          {sub.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/kategoriler/${sub.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link href={`/admin/kategoriler/${sub.id}`} className="p-1.5 text-gray-400 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <AdminCategoryActions categoryId={sub.id} categoryName={sub.name} isActive={sub.isActive} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
