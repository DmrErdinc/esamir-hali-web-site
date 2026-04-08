"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@prisma/client";

interface FeaturedCategoriesProps {
  categories: Category[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  if (categories.length === 0) return null;

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
    <section className="section-padding bg-cream-50">
      <div className="container-brand px-4">
        {/* Header */}
        <div className="text-center mb-14 lg:mb-18">
          <p className="text-overline mb-4">Koleksiyonumuz</p>
          <h2 className="heading-xl text-brand-800 mb-4">
            Öne Çıkan Kategoriler
          </h2>
          <div className="gold-divider" />
          <p className="mt-6 text-brand-500 font-sans max-w-xl mx-auto leading-relaxed">
            El dokuması İran halılarından modern aksesuarlara uzanan geniş
            koleksiyonumuzla yaşam alanlarınıza değer katın.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Buttons */}
          {categories.length > 3 && (
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
            <motion.div
              className="flex gap-4 lg:gap-6 touch-pan-y"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex-[0_0_calc(50%-8px)] sm:flex-[0_0_calc(33.333%-11px)] md:flex-[0_0_280px] lg:flex-[0_0_320px] min-w-0"
                >
                  <motion.div variants={item} className="h-full">
                    <Link
                      href={`/kategoriler/${cat.slug}`}
                      className="group block relative overflow-hidden bg-brand-100 aspect-[3/4] rounded-sm"
                    >
                      {cat.coverImage ? (
                        <Image
                          src={cat.coverImage}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 320px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-cream-200 to-brand-200" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="font-serif text-xl text-cream-50 font-light mb-1">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-cream-300 text-sm font-sans line-clamp-2 mb-2">
                            {cat.description}
                          </p>
                        )}
                        <span className="flex items-center gap-1 text-gold-light text-xs font-sans uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Keşfet <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/kategoriler"
            className="inline-flex items-center gap-2 text-sm font-sans font-medium text-brand-600 hover:text-brand-800 transition-colors group"
          >
            Tüm kategorileri görüntüle
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
