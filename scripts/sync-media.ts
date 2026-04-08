import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function syncMedia() {
  console.log("🔄 Syncing media files to database...");

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  
  if (!fs.existsSync(uploadsDir)) {
    console.log("❌ Uploads directory not found");
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  console.log(`📁 Found ${files.length} files in uploads directory`);

  for (const filename of files) {
    if (!filename.endsWith(".webp")) continue;

    const url = `/uploads/${filename}`;
    const filePath = path.join(uploadsDir, filename);
    const stats = fs.statSync(filePath);

    // Check if already exists
    const existing = await prisma.mediaAsset.findFirst({
      where: { url },
    });

    if (existing) {
      console.log(`⏭️  Skipping ${filename} (already exists)`);
      continue;
    }

    // Create media asset
    await prisma.mediaAsset.create({
      data: {
        url,
        filename,
        mimeType: "image/webp",
        size: stats.size,
        alt: null,
      },
    });

    console.log(`✅ Added ${filename} to database`);
  }

  console.log("🎉 Media sync complete!");
}

syncMedia()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });