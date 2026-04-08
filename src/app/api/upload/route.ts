import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { getSession } from "@/lib/auth";
import sharp from "sharp";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "public/uploads";
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

function generateFilename(originalName: string): string {
  const ext = extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${timestamp}-${random}${ext}`;
}

function sanitizeFilename(filename: string): string {
  // Remove any path traversal attempts and dangerous characters
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "Dosya seçilmedi." }, { status: 400 });
  }

  const uploadDir = join(process.cwd(), UPLOAD_DIR);
  await mkdir(uploadDir, { recursive: true });

  const uploaded: { url: string; originalName: string; size: number }[] = [];

  for (const file of files) {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Desteklenmeyen dosya türü: ${file.type}` },
        { status: 400 }
      );
    }

    // Validate file extension
    const ext = extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Desteklenmeyen dosya uzantısı: ${ext}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `Dosya çok büyük (max 10MB): ${file.name}` }, { status: 400 });
    }

    // Sanitize and generate filename
    const sanitizedName = sanitizeFilename(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = generateFilename(sanitizedName).replace(/\.[^.]+$/, ".webp");
    const filePath = join(uploadDir, filename);

    // Ensure the file path is within the upload directory (prevent path traversal)
    const resolvedPath = join(uploadDir, filename);
    if (!resolvedPath.startsWith(uploadDir)) {
      return NextResponse.json({ error: "Geçersiz dosya yolu" }, { status: 400 });
    }

    try {
      await sharp(buffer)
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(filePath);
    } catch {
      await writeFile(filePath, buffer);
    }

    const url = `/uploads/${filename}`;
    uploaded.push({ url, originalName: file.name, size: file.size });

    await (await import("@/lib/prisma")).prisma.mediaAsset.create({
      data: { url, filename, mimeType: "image/webp", size: file.size },
    });
  }

  return NextResponse.json({ success: true, files: uploaded });
}
