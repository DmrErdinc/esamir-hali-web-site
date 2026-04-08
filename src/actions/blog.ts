"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { blogPostSchema, blogCategorySchema } from "@/lib/validations";
import { generateSlug, calcReadTime } from "@/lib/utils";

export async function createBlogPost(data: Record<string, unknown>) {
  await requireAuth();
  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message };

  const slug = parsed.data.slug || generateSlug(parsed.data.title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) return { error: "Bu slug zaten kullanılıyor." };

  const content = parsed.data.content || "";
  const post = await prisma.blogPost.create({
    data: {
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage,
      authorName: parsed.data.authorName,
      categoryId: parsed.data.categoryId,
      isPublished: parsed.data.isPublished,
      isFeatured: parsed.data.isFeatured,
      seoTitle: parsed.data.seoTitle,
      seoDesc: parsed.data.seoDesc,
      readTime: calcReadTime(content),
      publishedAt: parsed.data.isPublished ? new Date() : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { success: true, post };
}

export async function updateBlogPost(id: string, data: Record<string, unknown>) {
  await requireAuth();
  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message };

  const slug = parsed.data.slug || generateSlug(parsed.data.title);
  const conflict = await prisma.blogPost.findFirst({ where: { slug, id: { not: id } } });
  if (conflict) return { error: "Bu slug başka bir yazı tarafından kullanılıyor." };

  const content = parsed.data.content || "";
  const existing = await prisma.blogPost.findUnique({ where: { id } });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage,
      authorName: parsed.data.authorName,
      categoryId: parsed.data.categoryId,
      isPublished: parsed.data.isPublished,
      isFeatured: parsed.data.isFeatured,
      seoTitle: parsed.data.seoTitle,
      seoDesc: parsed.data.seoDesc,
      readTime: calcReadTime(content),
      publishedAt:
        parsed.data.isPublished && !existing?.publishedAt ? new Date() : existing?.publishedAt,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
  return { success: true, post };
}

export async function deleteBlogPost(id: string) {
  await requireAuth();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { success: true };
}

export async function togglePublish(id: string, isPublished: boolean) {
  await requireAuth();
  await prisma.blogPost.update({
    where: { id },
    data: {
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { success: true };
}

export async function createBlogCategory(data: Record<string, unknown>) {
  await requireAuth();
  const parsed = blogCategorySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message };

  const slug = parsed.data.slug || generateSlug(parsed.data.name);
  const existing = await prisma.blogCategory.findUnique({ where: { slug } });
  if (existing) return { error: "Bu slug zaten kullanılıyor." };

  const cat = await prisma.blogCategory.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
    },
  });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { success: true, cat };
}

export async function updateBlogCategory(id: string, data: Record<string, unknown>) {
  await requireAuth();
  const parsed = blogCategorySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message };

  const slug = parsed.data.slug || generateSlug(parsed.data.name);
  const conflict = await prisma.blogCategory.findFirst({ where: { slug, id: { not: id } } });
  if (conflict) return { error: "Bu slug başka bir kategori tarafından kullanılıyor." };

  const cat = await prisma.blogCategory.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
    },
  });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { success: true, cat };
}

export async function deleteBlogCategory(id: string) {
  await requireAuth();
  const count = await prisma.blogPost.count({ where: { categoryId: id } });
  if (count > 0) return { error: "Bu kategoride yazılar var. Önce yazıları taşıyın veya silin." };
  await prisma.blogCategory.delete({ where: { id } });
  revalidatePath("/admin/blog");
  return { success: true };
}
