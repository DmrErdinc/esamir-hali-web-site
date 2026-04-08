"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl, getProductWhatsAppMessage, getImageUrl, absoluteUrl } from "@/lib/utils";
import type { Settings } from "@/lib/settings";

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  price: any;
  showPrice: boolean;
  isFeatured: boolean;
  isNew: boolean;
  images: { url: string; alt: string | null }[];
  category: { name: string; slug: string } | null;
}

interface FeaturedProductsProps {
  products: Product[];
  settings: Settings & Record<string, string>;
}

export function FeaturedProducts({ products, settings }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  const whatsapp = settings.whatsapp || settings.phone || "";
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="section-padding bg-white">
      <div className="container-brand px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-overline mb-3 md:mb-4 tracking-[0.2em] md:tracking-[0.25em]">Seçkin Ürünler</p>
          <h2 className="heading-xl text-brand-800 mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Öne Çıkan Ürünler</h2>
          <div className="gold-divider" />
          <p className="mt-4 md:mt-6 text-brand-500 font-sans max-w-xl mx-auto leading-relaxed text-sm md:text-base px-4">
            Her biri titizlikle seçilmiş, benzersiz dokuma teknikleri ve
            kalitesiyle yaşam alanlarınıza anlam katan parçalar.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Buttons */}
          {products.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-xl border-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex hover:scale-110"
                onClick={scrollPrev}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-xl border-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex hover:scale-110"
                onClick={scrollNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Embla Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 md:gap-4 lg:gap-6 touch-pan-y">
              {products.map((product, i) => {
                const coverImage = product.images[0]?.url
                  ? getImageUrl(product.images[0].url)
                  : null;
                const productUrl = absoluteUrl(`/urunler/${product.slug}`);
                const waMessage = getProductWhatsAppMessage(product.name, productUrl);
                const waUrl = whatsapp ? getWhatsAppUrl(whatsapp, waMessage) : "#";

                return (
                  <div
                    key={product.id}
                    className="flex-[0_0_calc(50%-6px)] sm:flex-[0_0_calc(33.333%-8px)] md:flex-[0_0_280px] lg:flex-[0_0_300px] min-w-0"
                  >
                    <motion.div
                      className="card-product group h-full"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                {/* Image */}
                <div className="relative aspect-[3/4] bg-cream-100 overflow-hidden rounded-sm">
                  {/* Invisible link overlay for the image area */}
                  <Link
                    href={`/urunler/${product.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={product.name}
                  />

                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={product.images[0]?.alt || product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-cream-200">
                      <span className="font-serif text-brand-400 text-xs">ESAMIR</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 md:gap-1.5 z-20">
                    {product.isNew && <Badge variant="new" className="text-[10px] md:text-xs px-2 py-0.5">Yeni</Badge>}
                    {product.isFeatured && <Badge variant="featured" className="text-[10px] md:text-xs px-2 py-0.5">Öne Çıkan</Badge>}
                  </div>

                  {/* WhatsApp hover — z-20 ensures it's above the link overlay */}
                  {whatsapp && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-brand-900/80 to-transparent z-20">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 md:gap-2 w-full py-1.5 md:py-2 bg-[#25D366] text-white text-[10px] md:text-xs font-sans rounded-sm"
                      >
                        <MessageCircle className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        <span className="hidden sm:inline">WhatsApp ile Sor</span>
                        <span className="sm:hidden">WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 md:p-4">
                  {product.category && (
                    <p className="text-[10px] md:text-xs font-sans text-brand-400 uppercase tracking-wider mb-1">
                      {product.category.name}
                    </p>
                  )}
                  <Link href={`/urunler/${product.slug}`}>
                    <h3 className="font-serif text-sm md:text-base text-brand-800 font-light leading-snug hover:text-gold transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  {product.shortDesc && (
                    <p className="text-[10px] md:text-xs font-sans text-brand-400 mt-1 line-clamp-2">
                      {product.shortDesc}
                    </p>
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
                </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8 md:mt-12">
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 text-sm md:text-base font-sans font-medium text-brand-600 hover:text-brand-800 transition-colors group"
          >
            Tüm ürünleri görüntüle
            <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
