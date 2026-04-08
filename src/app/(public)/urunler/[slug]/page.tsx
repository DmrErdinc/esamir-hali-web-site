import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { absoluteUrl, safeJson, formatPrice } from "@/lib/utils";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProductGallery } from "@/components/products/ProductGallery";
import { WhatsAppProductButton } from "@/components/shared/WhatsAppProductButton";
import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Ruler, Palette, Package, ExternalLink } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { where: { isCover: true }, take: 1 } },
  });
  if (!product) return { title: "Ürün Bulunamadı" };

  const img = product.images[0];
  return {
    title: product.seoTitle || product.name,
    description: product.seoDesc || product.shortDesc || undefined,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDesc || product.shortDesc || undefined,
      images: img ? [absoluteUrl(img.url)] : [],
    },
  };
}

export default async function UrunDetailPage({ params }: Props) {
  const { slug } = await params;

  const [product, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: [{ isCover: "desc" }, { order: "asc" }] },
        category: { include: { parent: true } },
      },
    }),
    getSettings(),
  ]);

  if (!product) notFound();

  const merged = { ...DEFAULT_SETTINGS, ...settings };

  const related = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { images: { where: { isCover: true }, take: 1 } },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const specs = safeJson<Record<string, string>>(product.specs, {});

  const breadcrumbs = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Ürünler", href: "/urunler" },
    ...(product.category?.parent
      ? [{ label: product.category.parent.name, href: `/kategoriler/${product.category.parent.slug}` }]
      : []),
    ...(product.category
      ? [{ label: product.category.name, href: `/kategoriler/${product.category.slug}` }]
      : []),
    { label: product.name },
  ];

  return (
    <>
      <section className="section-padding bg-cream-50">
        <div className="container-brand">
          <Breadcrumb items={breadcrumbs} className="text-brand-400 mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <ProductGallery images={product.images} productName={product.name} />

            {/* Info */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                {product.isNew && <Badge variant="new">Yeni</Badge>}
                {product.isFeatured && <Badge variant="featured">Öne Çıkan</Badge>}
                {!product.inStock && (
                  <Badge variant="secondary">Stokta Yok</Badge>
                )}
              </div>

              {product.category && (
                <p className="text-overline mb-3 text-gold">
                  {product.category.name}
                </p>
              )}

              <h1 className="font-serif text-3xl md:text-4xl text-brand-800 font-light leading-tight mb-4">
                {product.name}
              </h1>

              {product.showPrice && product.price && (
                <p className="text-2xl font-serif text-gold mb-4">
                  {formatPrice(Number(product.price))}
                </p>
              )}

              {product.sku && (
                <p className="text-xs font-sans text-brand-400 mb-4 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> SKU: {product.sku}
                </p>
              )}

              {product.shortDesc && (
                <p className="text-brand-600 font-sans leading-relaxed mb-6 text-sm">
                  {product.shortDesc}
                </p>
              )}

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {product.material && (
                  <div className="flex items-start gap-2 text-sm">
                    <Package className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-brand-400 font-sans">Malzeme</p>
                      <p className="text-brand-700 font-sans">{product.material}</p>
                    </div>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex items-start gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-brand-400 font-sans">Boyut</p>
                      <p className="text-brand-700 font-sans">{product.dimensions}</p>
                    </div>
                  </div>
                )}
                {product.color && (
                  <div className="flex items-start gap-2 text-sm">
                    <Palette className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-brand-400 font-sans">Renk</p>
                      <p className="text-brand-700 font-sans">{product.color}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* WhatsApp CTA */}
              <div className="border-t border-cream-200 pt-6 mb-6">
                {!product.showPrice && (
                  <p className="text-xs font-sans text-brand-400 mb-3">
                    Fiyat bilgisi ve detaylar için WhatsApp&apos;tan ulaşın
                  </p>
                )}
                <WhatsAppProductButton
                  phone={merged.whatsapp || merged.phone || ""}
                  productName={product.name}
                  productSlug={product.slug}
                  size="lg"
                  fullWidth
                />
              </div>

              {/* E-commerce Platform Links */}
              {(product.trendyolUrl || product.hepsiburadaUrl || product.shopierUrl) && (
                <div className="border-t border-cream-200 pt-6 mb-6">
                  <h3 className="text-sm font-sans font-medium text-brand-700 mb-3">
                    Diğer Platformlardan Alışveriş Yapın
                  </h3>
                  <div className="flex flex-col gap-2">
                    {product.trendyolUrl && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-between border-orange-200 hover:bg-orange-50 hover:border-orange-300 text-orange-700"
                      >
                        <a href={product.trendyolUrl} target="_blank" rel="noopener noreferrer">
                          <span className="font-medium">Trendyol&apos;da Gör</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {product.hepsiburadaUrl && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-between border-orange-200 hover:bg-orange-50 hover:border-orange-300 text-orange-600"
                      >
                        <a href={product.hepsiburadaUrl} target="_blank" rel="noopener noreferrer">
                          <span className="font-medium">Hepsiburada&apos;da Gör</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {product.shopierUrl && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-between border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700"
                      >
                        <a href={product.shopierUrl} target="_blank" rel="noopener noreferrer">
                          <span className="font-medium">Shopier&apos;de Gör</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="border-t border-cream-200 pt-6">
                  <h2 className="font-serif text-lg text-brand-800 font-light mb-3">
                    Ürün Açıklaması
                  </h2>
                  <div className="prose-brand text-sm">
                    <p>{product.description}</p>
                  </div>
                </div>
              )}

              {/* Specs */}
              {Object.keys(specs).length > 0 && (
                <div className="border-t border-cream-200 pt-6 mt-4">
                  <h2 className="font-serif text-lg text-brand-800 font-light mb-4">
                    Teknik Özellikler
                  </h2>
                  <dl className="space-y-2">
                    {Object.entries(specs).map(([k, v]) => (
                      <div key={k} className="flex gap-2 text-sm">
                        <dt className="text-brand-400 font-sans w-36 flex-shrink-0">{k}:</dt>
                        <dd className="text-brand-700 font-sans">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20 pt-12 border-t border-cream-200">
              <h2 className="font-serif text-2xl text-brand-800 font-light mb-8">
                Benzer Ürünler
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((r) => (
                  <ProductCard
                    key={r.id}
                    product={{
                      ...r,
                      price: r.price ? Number(r.price) : null,
                    }}
                    phone={merged.whatsapp || merged.phone || ""}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
