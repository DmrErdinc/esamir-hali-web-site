import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Eye, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AdminBlogActions } from "@/components/admin/AdminBlogActions";

export const metadata: Metadata = { title: "Blog Yazıları" };

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sayfa?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.sayfa) || 1;
  const PER_PAGE = 20;

  const where: any = sp.q
    ? { title: { contains: sp.q, mode: "insensitive" } }
    : {};

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
            <FileText className="h-4.5 w-4.5 text-slate-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Blog Yazıları</h1>
            <p className="text-sm text-gray-500">{total} yazı</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/blog/kategoriler" className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
            Kategoriler
          </Link>
          <Link href="/admin/blog/yeni" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors">
            <Plus className="h-4 w-4" />
            Yeni Yazı
          </Link>
        </div>
      </div>

      <form className="bg-white rounded-xl border border-gray-100 p-3 flex gap-2.5">
        <input
          name="q"
          defaultValue={sp.q}
          placeholder="Yazı başlığı ile ara..."
          className="h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 flex-1"
        />
        <button type="submit" className="h-9 px-4 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">Ara</button>
        {sp.q && <Link href="/admin/blog" className="h-9 px-3 flex items-center text-sm text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg">Temizle</Link>}
      </form>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Başlık</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Kategori</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tarih</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-1">{p.title}</p>
                    <code className="text-xs text-gray-400">{p.slug}</code>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 hidden sm:table-cell">{p.category?.name || "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      p.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
                      {p.isPublished ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400 hidden md:table-cell">
                    {p.publishedAt ? formatDate(p.publishedAt) : formatDate(p.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/blog/${p.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link href={`/admin/blog/${p.id}`} className="p-1.5 text-gray-400 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <AdminBlogActions postId={p.id} postTitle={p.title} isPublished={p.isPublished} />
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <FileText className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 mb-2">Yazı bulunamadı.</p>
                    <Link href="/admin/blog/yeni" className="text-xs font-medium text-slate-700 underline">Yazı ekle</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
