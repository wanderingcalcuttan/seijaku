const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const imagesDir = path.join(__dirname, "..", "public", "images");

async function main() {
  const files = fs.readdirSync(imagesDir);
  console.log(`Found ${files.length} files in ${imagesDir}`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      continue;
    }

    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    const originalSizeMb = (stats.size / (1024 * 1024)).toFixed(2);

    // Compress files larger than 400 KB
    if (stats.size < 400 * 1024) {
      console.log(`Skipping ${file} (${originalSizeMb} MB, below threshold)`);
      continue;
    }

    console.log(`Compressing ${file} (${originalSizeMb} MB)...`);
    const tempPath = filePath + ".tmp";

    try {
      let pipeline = sharp(filePath).rotate();

      // Get metadata to see if we should resize (limit max dimension to 2000px)
      const metadata = await pipeline.metadata();
      const maxDim = 2000;
      if (metadata.width > maxDim || metadata.height > maxDim) {
        pipeline = pipeline.resize({
          width: metadata.width > metadata.height ? maxDim : undefined,
          height: metadata.width > metadata.height ? undefined : maxDim,
          fit: "inside",
          withoutEnlargement: true
        });
      }

      if (ext === ".png") {
        await pipeline
          .png({ palette: true, quality: 80, compressionLevel: 9 })
          .toFile(tempPath);
      } else {
        await pipeline
          .jpeg({ quality: 80, mozjpeg: true })
          .toFile(tempPath);
      }

      // Verify the output exists and replace original
      if (fs.existsSync(tempPath)) {
        const newStats = fs.statSync(tempPath);
        if (newStats.size < stats.size) {
          fs.unlinkSync(filePath);
          fs.renameSync(tempPath, filePath);
          const newSizeMb = (newStats.size / (1024 * 1024)).toFixed(2);
          const percentSaved = (((stats.size - newStats.size) / stats.size) * 100).toFixed(1);
          console.log(`✓ Compressed ${file}: ${originalSizeMb} MB -> ${newSizeMb} MB (-${percentSaved}%)`);
        } else {
          fs.unlinkSync(tempPath);
          console.log(`× Compression did not reduce size for ${file}, skipped.`);
        }
      }
    } catch (err) {
      console.error(`Error compressing ${file}:`, err);
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }
}

main().catch(console.error);
