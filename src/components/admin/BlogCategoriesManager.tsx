"use client";
import React, { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createBlogCategory, updateBlogCategory, deleteBlogCategory } from "@/actions/blog";
import { generateSlug } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface BlogCategory { id: string; name: string; slug: string; _count: { posts: number } }

export function BlogCategoriesManager({ categories: initialCategories }: { categories: BlogCategory[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categories, _setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");
  const [addingNew, setAddingNew] = useState(false);

  function handleCreate() {
    if (!newName.trim()) return;
    startTransition(async () => {
      const res = await createBlogCategory({ name: newName, slug: generateSlug(newName) }) as any;
      if (res.error) toast.error(res.error);
      else {
        toast.success("Kategori oluşturuldu.");
        setNewName("");
        setAddingNew(false);
        router.refresh();
      }
    });
  }

  function handleUpdate(id: string) {
    if (!editName.trim()) return;
    startTransition(async () => {
      const res = await updateBlogCategory(id, { name: editName, slug: generateSlug(editName) }) as any;
      if (res.error) toast.error(res.error);
      else {
        toast.success("Kategori güncellendi.");
        setEditingId(null);
        router.refresh();
      }
    });
  }

  function handleDelete(id: string, name: string) {
    startTransition(async () => {
      const res = await deleteBlogCategory(id) as any;
      if (res.error) toast.error(res.error);
      else {
        toast.success(`"${name}" silindi.`);
        router.refresh();
      }
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm max-w-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">{categories.length} kategori</h2>
        <button
          onClick={() => setAddingNew(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-700 text-white text-sm rounded-sm hover:bg-brand-800"
        >
          <Plus className="h-3.5 w-3.5" /> Yeni
        </button>
      </div>

      <ul className="divide-y divide-gray-100">
        {addingNew && (
          <li className="px-5 py-3 flex items-center gap-3 bg-blue-50">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Kategori adı"
              autoFocus
              className="h-8 text-sm"
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setAddingNew(false); }}
            />
            <button onClick={handleCreate} disabled={isPending} className="p-1.5 text-green-600 hover:text-green-700">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </button>
            <button onClick={() => setAddingNew(false)} className="p-1.5 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </li>
        )}

        {categories.map((cat) => (
          <li key={cat.id} className="px-5 py-3 flex items-center gap-3">
            {editingId === cat.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8 text-sm flex-1"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(cat.id); if (e.key === "Escape") setEditingId(null); }}
                />
                <button onClick={() => handleUpdate(cat.id)} disabled={isPending} className="p-1.5 text-green-600 hover:text-green-700">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </button>
                <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <span className="text-sm font-sans text-gray-800">{cat.name}</span>
                  <span className="ml-2 text-xs text-gray-400">({cat._count.posts} yazı)</span>
                </div>
                <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); }} className="p-1.5 text-gray-400 hover:text-brand-700">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  disabled={isPending || cat._count.posts > 0}
                  className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-30"
                  title={cat._count.posts > 0 ? "Yazıları olan kategori silinemez" : "Sil"}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </li>
        ))}

        {categories.length === 0 && !addingNew && (
          <li className="px-5 py-8 text-center text-gray-400 text-sm">Henüz kategori yok.</li>
        )}
      </ul>
    </div>
  );
}
