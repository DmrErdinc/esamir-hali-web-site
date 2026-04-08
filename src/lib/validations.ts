import { z } from "zod";

// Auth
export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(1, "Şifre boş olamaz"),
});

// Category
export const categorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalı").max(100),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().max(1000).optional().nullable(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDesc: z.string().max(160).optional().nullable(),
  coverImage: z.string().optional().nullable(),
  bannerImage: z.string().optional().nullable(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  promoText: z.string().max(2000).optional().nullable(),
  parentId: z.string().optional().nullable(),
});

// Product
export const productSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı").max(200),
  sku: z.string().max(100).optional().nullable(),
  slug: z.string().min(2).max(200).optional(),
  shortDesc: z.string().max(500).optional().nullable(),
  description: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional().nullable(),
  })).optional().nullable(),
  dimensions: z.string().max(200).optional().nullable(),
  material: z.string().max(200).optional().nullable(),
  color: z.string().max(100).optional().nullable(),
  inStock: z.boolean().default(true),
  price: z.number().min(0).optional().nullable(),
  showPrice: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDesc: z.string().max(160).optional().nullable(),
  specs: z.record(z.string()).optional().nullable(),
  trendyolUrl: z.string().url("Geçerli bir URL girin").optional().nullable().or(z.literal("")),
  hepsiburadaUrl: z.string().url("Geçerli bir URL girin").optional().nullable().or(z.literal("")),
  shopierUrl: z.string().url("Geçerli bir URL girin").optional().nullable().or(z.literal("")),
});

// Blog Post
export const blogPostSchema = z.object({
  title: z.string().min(5, "Başlık en az 5 karakter olmalı").max(200),
  slug: z.string().min(5).max(200).optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(10, "İçerik en az 10 karakter olmalı"),
  coverImage: z.string().optional().nullable(),
  authorName: z.string().max(100).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDesc: z.string().max(160).optional().nullable(),
  publishedAt: z.date().optional().nullable(),
});

// Blog Category
export const blogCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
});

// Site Settings
export const siteSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().optional().nullable(),
});

// Contact Form
export const contactFormSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalı").max(100),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  phone: z.string().max(20).optional(),
  subject: z.string().min(5, "Konu en az 5 karakter olmalı").max(200),
  message: z.string().min(20, "Mesaj en az 20 karakter olmalı").max(5000),
});

// User
export const userSchema = z.object({
  name: z.string().min(2).max(100).optional().nullable(),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalı")
    .regex(/[A-Z]/, "Şifre en az bir büyük harf içermeli")
    .regex(/[0-9]/, "Şifre en az bir rakam içermeli"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]).default("ADMIN"),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = userSchema.partial().extend({
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .optional()
    .nullable(),
});

// Page
export const pageSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).optional(),
  content: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDesc: z.string().max(160).optional().nullable(),
  template: z.string().max(50).optional().nullable(),
  order: z.number().int().min(0).default(0),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogCategoryInput = z.infer<typeof blogCategorySchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type PageInput = z.infer<typeof pageSchema>;
