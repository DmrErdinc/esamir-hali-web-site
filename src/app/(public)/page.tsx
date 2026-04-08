import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { InteriorSection } from "@/components/home/InteriorSection";
import { QualitySection } from "@/components/home/QualitySection";
import { GoogleReviewCTA } from "@/components/home/GoogleReviewCTA";
import { BlogPreview } from "@/components/home/BlogPreview";
import { ContactSection } from "@/components/home/ContactSection";
import { WhatsAppCTA } from "@/components/home/WhatsAppCTA";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.seo_title || DEFAULT_SETTINGS.seo_title,
    description: settings.seo_description || DEFAULT_SETTINGS.seo_description,
  };
}

export default async function HomePage() {
  const [settings, featuredCategories, rawFeaturedProducts, recentPosts] =
    await Promise.all([
      getSettings(),
      prisma.category.findMany({
        where: { isFeatured: true, isActive: true, parentId: null },
        orderBy: { order: "asc" },
        take: 6,
      }),
      prisma.product.findMany({
        where: { isFeatured: true, isActive: true },
        include: {
          images: { where: { isCover: true }, take: 1 },
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: { category: true },
      }),
    ]);

  // Convert Decimal to string for client components
  const featuredProducts = rawFeaturedProducts.map(p => ({
    ...p,
    price: p.price ? p.price.toString() : null,
  }));

  const filteredSettings = Object.fromEntries(
    Object.entries(settings).filter(([, v]) => v !== null)
  ) as Record<string, string>;
  const merged = { ...DEFAULT_SETTINGS, ...filteredSettings };

  return (
    <>
      <HeroSection settings={merged} />
      <FeaturedCategories categories={featuredCategories} />
      <FeaturedProducts products={featuredProducts} settings={merged} />
      <InteriorSection settings={merged} />
      <QualitySection />
      {merged.google_review_show === "true" && merged.google_review_show_home === "true" && merged.google_review_link && (
        <GoogleReviewCTA settings={merged} />
      )}
      <WhatsAppCTA settings={merged} />
      {merged.blog_show_homepage === "true" && (
        <BlogPreview posts={recentPosts} settings={merged} />
      )}
      <ContactSection settings={merged} />
    </>
  );
}
