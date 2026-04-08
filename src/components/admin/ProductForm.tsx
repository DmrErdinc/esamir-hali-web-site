"use client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/actions/products";
import { generateSlug } from "@/lib/utils";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";

interface Category { id: string; name: string; slug: string; parentId: string | null; }

interface ProductImage {
  url: string;
  alt: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  description: string | null;
  material: string | null;
  dimensions: string | null;
  color: string | null;
  sku: string | null;
  price: number | null;
  showPrice: boolean;
  categoryId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  inStock: boolean;
  seoTitle: string | null;
  seoDesc: string | null;
  specs: Record<string, string> | null;
  trendyolUrl: string | null;
  hepsiburadaUrl: string | null;
  shopierUrl: string | null;
  images?: ProductImage[];
}

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    product?.images?.map((i) => ({ url: i.url, alt: i.alt || "" })) || []
  );

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    shortDesc: product?.shortDesc || "",
    description: product?.description || "",
    material: product?.material || "",
    dimensions: product?.dimensions || "",
    color: product?.color || "",
    sku: product?.sku || "",
    price: product?.price ? product.price.toString() : "",
    showPrice: product?.showPrice ?? false,
    categoryId: product?.categoryId || "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    isNew: product?.isNew ?? false,
    inStock: product?.inStock ?? true,
    seoTitle: product?.seoTitle || "",
    seoDesc: product?.seoDesc || "",
    specs: product?.specs ? (typeof product.specs === 'string' ? product.specs : JSON.stringify(product.specs, null, 2)) : "",
    trendyolUrl: product?.trendyolUrl || "",
    hepsiburadaUrl: product?.hepsiburadaUrl || "",
    shopierUrl: product?.shopierUrl || "",
  });

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setForm((f) => ({
      ...f,
      name,
      slug: !product ? generateSlug(name) : f.slug,
    }));
  }

  function handleMediaSelect(urls: string[]) {
    setImages((prev) => [
      ...prev,
      ...urls.map((url) => ({ url, alt: "" })),
    ]);
    setShowMediaPicker(false);
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      // Parse specs from string to object
      let specsData = null;
      if (form.specs && form.specs.trim()) {
        try {
          specsData = JSON.parse(form.specs);
        } catch {
          toast.error("Ek Özellikler geçerli bir JSON formatında değil.");
          return;
        }
      }

      // Parse price
      const priceValue = form.price ? parseFloat(form.price) : null;

      const data = { ...form, price: priceValue, images, specs: specsData };
      const res = product
        ? await updateProduct(product.id, data)
        : await createProduct(data);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(product ? "Ürün güncellendi." : "Ürün oluşturuldu.");
        router.push("/admin/urunler");
        router.refresh();
      }
    });
  }

  const parentCats = categories.filter((c) => !c.parentId);
  const childCats = categories.filter((c) => c.parentId);

  return (
    <>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Temel Bilgiler</h2>

            <div className="space-y-2">
              <Label htmlFor="name">Ürün Adı *</Label>
              <Input id="name" value={form.name} onChange={handleNameChange} required placeholder="Ürün adı" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                required
                placeholder="urun-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDesc">Kısa Açıklama</Label>
              <Input id="shortDesc" value={form.shortDesc} onChange={(e) => setForm((f) => ({ ...f, shortDesc: e.target.value }))} placeholder="Kısa açıklama" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={5} placeholder="Ürün açıklaması" />
            </div>
          </div>

          {/* Specs */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Teknik Özellikler</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material">Malzeme</Label>
                <Input id="material" value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} placeholder="İpek, Yün..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensions">Boyut</Label>
                <Input id="dimensions" value={form.dimensions} onChange={(e) => setForm((f) => ({ ...f, dimensions: e.target.value }))} placeholder="200x300 cm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Renk</Label>
                <Input id="color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} placeholder="Kırmızı, Lacivert..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} placeholder="ESM-001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (₺)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    id="showPrice"
                    checked={form.showPrice}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, showPrice: v }))}
                  />
                  <Label htmlFor="showPrice" className="cursor-pointer">Fiyatı Göster</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specs">Ek Özellikler (JSON)</Label>
              <Textarea id="specs" value={form.specs} onChange={(e) => setForm((f) => ({ ...f, specs: e.target.value }))} rows={3} placeholder='{"Düğüm/m²": "160.000", "Menşei": "İran"}' />
            </div>
          </div>

          {/* E-commerce Platform Links */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">E-Ticaret Platform Linkleri</h2>
            <p className="text-xs text-gray-500">Ürününüzün diğer platformlardaki satış linklerini ekleyin. Müşteriler bu linklerden de alışveriş yapabilir.</p>
            <div className="space-y-2">
              <Label htmlFor="trendyolUrl">Trendyol Linki</Label>
              <Input
                id="trendyolUrl"
                type="url"
                value={form.trendyolUrl}
                onChange={(e) => setForm((f) => ({ ...f, trendyolUrl: e.target.value }))}
                placeholder="https://www.trendyol.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hepsiburadaUrl">Hepsiburada Linki</Label>
              <Input
                id="hepsiburadaUrl"
                type="url"
                value={form.hepsiburadaUrl}
                onChange={(e) => setForm((f) => ({ ...f, hepsiburadaUrl: e.target.value }))}
                placeholder="https://www.hepsiburada.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopierUrl">Shopier Linki</Label>
              <Input
                id="shopierUrl"
                type="url"
                value={form.shopierUrl}
                onChange={(e) => setForm((f) => ({ ...f, shopierUrl: e.target.value }))}
                placeholder="https://www.shopier.com/..."
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">SEO</h2>
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Başlık</Label>
              <Input id="seoTitle" value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} placeholder="SEO başlık (boş bırakılırsa ürün adı kullanılır)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDesc">SEO Açıklama</Label>
              <Textarea id="seoDesc" value={form.seoDesc} onChange={(e) => setForm((f) => ({ ...f, seoDesc: e.target.value }))} rows={2} placeholder="SEO açıklama" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Görseller</h2>
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square bg-gray-100 overflow-hidden group">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-brand-700 text-white text-xs px-1 py-0.5 rounded-sm leading-none">Kapak</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="aspect-square border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors"
              >
                <Upload className="h-5 w-5 mb-1" />
                <span className="text-xs">Ekle</span>
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Kategori</h2>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Kategori seçin</option>
              {parentCats.map((cat) => (
                <optgroup key={cat.id} label={cat.name}>
                  <option value={cat.id}>{cat.name} (tümü)</option>
                  {childCats.filter((c) => c.parentId === cat.id).map((sub) => (
                    <option key={sub.id} value={sub.id}>↳ {sub.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Ayarlar</h2>
            {[
              { key: "isActive", label: "Aktif" },
              { key: "isFeatured", label: "Öne Çıkan" },
              { key: "isNew", label: "Yeni" },
              { key: "inStock", label: "Stokta Var" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="text-sm text-gray-700 cursor-pointer">{label}</Label>
                <Switch
                  checked={form[key as keyof typeof form] as boolean}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, [key]: v }))}
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              İptal
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1 bg-brand-700 hover:bg-brand-800 text-white">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (product ? "Güncelle" : "Kaydet")}
            </Button>
          </div>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPickerModal
          onSelect={handleMediaSelect}
          onClose={() => setShowMediaPicker(false)}
          multiple
        />
      )}
    </>
  );
}
