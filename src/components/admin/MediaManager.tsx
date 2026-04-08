"use client";
import React, { useState, useRef, useTransition } from "react";
import { Upload, Trash2, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Asset { id: string; url: string; filename: string; mimeType: string | null; size: number | null; createdAt: Date }

interface UploadedFile {
  url: string;
  originalName: string;
  size: number;
}

interface UploadResponse {
  success?: boolean;
  files?: UploadedFile[];
  error?: string;
}

export function MediaManager({ initialAssets }: { initialAssets: Asset[] }) {
  const router = useRouter();
  const [assets, setAssets] = useState(initialAssets);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data: UploadResponse = await res.json();
      if (data.files) {
        const newAssets = data.files.map((f) => ({
          id: f.url, url: f.url, filename: f.originalName,
          mimeType: "image/webp", size: f.size, createdAt: new Date(),
        }));
        setAssets((prev) => [...newAssets, ...prev]);
        toast.success(`${data.files.length} dosya yüklendi.`);
        router.refresh();
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch {
      toast.error("Yükleme başarısız.");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
    toast.success("URL kopyalandı.");
  }

  async function deleteAsset(id: string) {
    const res = await fetch("/api/media", { method: "DELETE", body: JSON.stringify({ id }), headers: { "Content-Type": "application/json" } });
    const data = await res.json();
    if (data.success) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
      toast.success("Silindi.");
    } else {
      toast.error(data.error || "Silinemedi.");
    }
  }

  async function deleteSelected() {
    startTransition(async () => {
      for (const id of Array.from(selected)) {
        await deleteAsset(id);
      }
    });
  }

  function _formatSize(bytes: number | null) {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-700 text-white text-sm rounded-sm hover:bg-brand-800 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Yükle
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />

        {selected.size > 0 && (
          <button
            onClick={deleteSelected}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-sm hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Seçilenleri Sil ({selected.size})
          </button>
        )}

        <p className="text-sm text-gray-500 ml-auto">{assets.length} dosya</p>
      </div>

      {/* Grid */}
      {assets.length === 0 ? (
        <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-sm">
          <Upload className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>Henüz medya yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {assets.map((asset) => {
            const isSelected = selected.has(asset.id);
            return (
              <div
                key={asset.id}
                className={cn("group relative aspect-square bg-gray-100 overflow-hidden rounded-sm border-2 transition-all cursor-pointer", isSelected ? "border-brand-600 ring-2 ring-brand-300" : "border-transparent hover:border-gray-300")}
                onClick={() => toggleSelect(asset.id)}
              >
                <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                {isSelected && (
                  <div className="absolute inset-0 bg-brand-600/20 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-1.5">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); copyUrl(asset.url); }}
                    className="p-1 bg-white/90 text-gray-700 rounded-sm hover:bg-white"
                    title="URL Kopyala"
                  >
                    {copiedUrl === asset.url ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteAsset(asset.id); }}
                    className="p-1 bg-red-500/90 text-white rounded-sm hover:bg-red-600"
                    title="Sil"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
