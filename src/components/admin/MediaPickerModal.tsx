"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MediaAsset {
  id: string;
  url: string;
  filename: string;
}

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

interface MediaResponse {
  assets?: MediaAsset[];
}

interface MediaPickerModalProps {
  onSelect: (urls: string[]) => void;
  onClose: () => void;
  multiple?: boolean;
}

export function MediaPickerModal({ onSelect, onClose, multiple = false }: MediaPickerModalProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((d: MediaResponse) => {
        setAssets(d.assets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function toggleSelect(url: string) {
    if (multiple) {
      setSelected((prev) =>
        prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
      );
    } else {
      onSelect([url]);
    }
  }

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
        const newAssets: MediaAsset[] = data.files.map((f) => ({
          id: f.url,
          url: f.url,
          filename: f.originalName,
        }));
        setAssets((prev) => [...newAssets, ...prev]);
        toast.success(`${data.files.length} dosya yüklendi.`);
      }
    } catch {
      toast.error("Yükleme başarısız.");
    }
    setUploading(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Medya Seç</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-brand-700 text-white rounded-sm hover:bg-brand-800 transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              Yükle
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Upload className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>Henüz medya yok. Yükleyin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {assets.map((asset) => {
                const isSelected = selected.includes(asset.url);
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => toggleSelect(asset.url)}
                    className={`relative aspect-square overflow-hidden border-2 transition-all ${
                      isSelected ? "border-brand-700 ring-2 ring-brand-400" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-700/30 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {multiple && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">{selected.length} seçildi</p>
            <button
              onClick={() => onSelect(selected)}
              disabled={selected.length === 0}
              className="px-4 py-2 bg-brand-700 text-white text-sm rounded-sm hover:bg-brand-800 transition-colors disabled:opacity-50"
            >
              Seçimi Onayla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
