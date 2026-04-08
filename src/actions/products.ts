"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function createProduct(data: Record<string, unknown>) {
  await requireAuth();
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message };

  const slug = parsed.data.slug || generateSlug(parsed.data.name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) return { error: "Bu slug zaten kullanılıyor." };

  const { images, ...rest } = parsed.data;

  const product = await prisma.product.create({
    data: {
      name: rest.name,
      sku: rest.sku || null,
      slug,
      shortDesc: rest.shortDesc || null,
      description: rest.description || null,
      categoryId: rest.categoryId || null,
      dimensions: rest.dimensions || null,
      material: rest.material || null,
      color: rest.color || null,
      inStock: rest.inStock,
      price: rest.price || null,
      showPrice: rest.showPrice,
      isFeatured: rest.isFeatured,
      isNew: rest.isNew,
      isActive: rest.isActive,
      seoTitle: rest.seoTitle || null,
      seoDesc: rest.seoDesc || null,
      specs: rest.specs ?? undefined,
      trendyolUrl: rest.trendyolUrl || null,
      hepsiburadaUrl: rest.hepsiburadaUrl || null,
      shopierUrl: rest.shopierUrl || null,
      images: images?.length
        ? {
            create: images.map((img, i) => ({
              url: img.url,
              alt: img.alt || null,
              order: i,
              isCover: i === 0,
            })),
          }
        : undefined,
    },
    include: { images: true },
  });

  revalidatePath("/urunler");
  revalidatePath("/admin/urunler");
  return { success: true, product };
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  await requireAuth();
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message };

  const slug = parsed.data.slug || generateSlug(parsed.data.name);
  const conflict = await prisma.product.findFirst({ where: { slug, id: { not: id } } });
  if (conflict) return { error: "Bu slug başka bir ürün tarafından kullanılıyor." };

  const { images, ...rest } = parsed.data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: rest.name,
      sku: rest.sku || null,
      slug,
      shortDesc: rest.shortDesc || null,
      description: rest.description || null,
      categoryId: rest.categoryId || null,
      dimensions: rest.dimensions || null,
      material: rest.material || null,
      color: rest.color || null,
      inStock: rest.inStock,
      price: rest.price || null,
      showPrice: rest.showPrice,
      isFeatured: rest.isFeatured,
      isNew: rest.isNew,
      isActive: rest.isActive,
      seoTitle: rest.seoTitle || null,
      seoDesc: rest.seoDesc || null,
      specs: rest.specs ?? undefined,
      trendyolUrl: rest.trendyolUrl || null,
      hepsiburadaUrl: rest.hepsiburadaUrl || null,
      shopierUrl: rest.shopierUrl || null,
    },
  });

  // Sync images: delete all then recreate from form
  await prisma.productImage.deleteMany({ where: { productId: id } });
  if (images?.length) {
    await prisma.productImage.createMany({
      data: images.map((img, i) => ({
        productId: id,
        url: img.url,
        alt: img.alt || null,
        order: i,
        isCover: i === 0,
      })),
    });
  }

  revalidatePath("/urunler");
  revalidatePath(`/urunler/${slug}`);
  revalidatePath("/admin/urunler");
  return { success: true, product };
}

export async function deleteProduct(id: string) {
  await requireAuth();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { error: "Ürün bulunamadı." };

  await prisma.productImage.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  revalidatePath("/urunler");
  revalidatePath("/admin/urunler");
  return { success: true };
}

export async function toggleProductActive(id: string, isActive: boolean) {
  await requireAuth();
  await prisma.product.update({ where: { id }, data: { isActive } });
  revalidatePath("/urunler");
  revalidatePath("/admin/urunler");
  return { success: true };
}

export async function toggleProductFeatured(id: string, isFeatured: boolean) {
  await requireAuth();
  await prisma.product.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/urunler");
  revalidatePath("/admin/urunler");
  return { success: true };
}

export async function setProductCoverImage(productId: string, imageId: string) {
  await requireAuth();
  await prisma.productImage.updateMany({ where: { productId }, data: { isCover: false } });
  await prisma.productImage.update({ where: { id: imageId }, data: { isCover: true } });
  revalidatePath("/admin/urunler");
  return { success: true };
}

export async function deleteProductImage(id: string) {
  await requireAuth();
  await prisma.productImage.delete({ where: { id } });
  revalidatePath("/admin/urunler");
  return { success: true };
}

export async function addProductImages(
  productId: string,
  images: { url: string; alt?: string }[]
) {
  await requireAuth();
  const existing = await prisma.productImage.count({ where: { productId } });
  await prisma.productImage.createMany({
    data: images.map((img, i) => ({
      productId,
      url: img.url,
      alt: img.alt || null,
      order: existing + i,
      isCover: existing === 0 && i === 0,
    })),
  });
  revalidatePath("/admin/urunler");
  return { success: true };
}

export async function bulkActivateAllProducts() {
  await requireAuth();
  await prisma.product.updateMany({ where: { isActive: false }, data: { isActive: true } });
  revalidatePath("/urunler");
  revalidatePath("/admin/urunler");
  return { success: true };
}

export async function bulkDeleteProducts(ids: string[]) {
  await requireAuth();
  await prisma.productImage.deleteMany({ where: { productId: { in: ids } } });
  await prisma.product.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/urunler");
  revalidatePath("/admin/urunler");
  return { success: true };
}
