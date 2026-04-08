import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Ürün Düzenle" };

interface Props { params: Promise<{ id: string }> }

export default async function UrunEditPage({ params }: Props) {
  const { id } = await params;
  const [productRaw, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: [{ isCover: "desc" }, { order: "asc" }] } },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ parentId: "asc" }, { order: "asc" }],
      select: { id: true, name: true, slug: true, parentId: true },
    }),
  ]);

  if (!productRaw) notFound();

  // Convert Decimal to number and specs to proper type
  const product = {
    ...productRaw,
    price: productRaw.price ? Number(productRaw.price) : null,
    specs: productRaw.specs as Record<string, string> | null,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/urunler" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold font-sans text-gray-900 truncate">{product.name}</h1>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
