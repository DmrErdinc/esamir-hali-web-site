import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { WhatsAppProductButton } from "@/components/shared/WhatsAppProductButton";
import { getImageUrl } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc?: string | null;
  isFeatured: boolean;
  isNew: boolean;
  price?: number | null;
  showPrice: boolean;
  images: { url: string; alt: string | null }[];
}

interface ProductCardProps {
  product: Product;
  phone: string;
}

export function ProductCard({ product, phone }: ProductCardProps) {
  const img = product.images[0];

  return (
    <div className="card-product group">
      <Link href={`/urunler/${product.slug}`}>
        <div className="relative aspect-[3/4] bg-cream-100 overflow-hidden">
          {img ? (
            <Image
              src={getImageUrl(img.url)}
              alt={img.alt || product.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-cream-200 flex items-center justify-center">
              <span className="font-serif text-brand-300 text-xs">ESAMIR</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNew && <Badge variant="new">Yeni</Badge>}
            {product.isFeatured && <Badge variant="featured">Öne Çıkan</Badge>}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/urunler/${product.slug}`}>
          <h3 className="font-serif text-base text-brand-800 font-light leading-snug hover:text-gold transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {product.shortDesc && (
          <p className="text-xs font-sans text-brand-400 mt-1 line-clamp-2">{product.shortDesc}</p>
        )}
        {product.showPrice && product.price && (
          <p className="text-base md:text-lg font-serif text-gold mt-2 font-semibold">
            {Number(product.price).toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        )}
        <div className="mt-3">
          <WhatsAppProductButton
            phone={phone}
            productName={product.name}
            productSlug={product.slug}
            size="sm"
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
