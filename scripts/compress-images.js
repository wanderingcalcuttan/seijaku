const path = require('path');
// Add backend node_modules to resolution path so S3 and other dependencies can load successfully
module.paths.push(path.resolve(__dirname, '../backend/node_modules'));

const fs = require('fs/promises');
const sharp = require('sharp');

// Load environment variables from backend/.env manually to avoid dotenv dependency issues
try {
  const envPath = path.resolve(__dirname, '../backend/.env');
  const content = require('fs').readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  }
} catch (err) {
  console.warn("Could not load backend/.env file:", err.message);
}

async function compressImage(buffer, extension) {
  const ext = extension.toLowerCase();
  let img = sharp(buffer);
  
  if (ext === '.jpg' || ext === '.jpeg') {
    return img.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  } else if (ext === '.png') {
    return img.png({ quality: 80, compressionLevel: 9, palette: true }).toBuffer();
  } else if (ext === '.webp') {
    return img.webp({ quality: 80 }).toBuffer();
  } else if (ext === '.gif') {
    // check if sharp instance can reuse frame data for gif compression
    try {
      return img.gif({ reuse: true }).toBuffer();
    } catch {
      return img.toBuffer();
    }
  }
  
  return buffer;
}

async function handleS3() {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) {
    console.error("S3_BUCKET environment variable is missing.");
    return;
  }
  
  console.log(`Using S3 storage driver. Bucket: ${bucket}`);
  
  const { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
  
  const s3 = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }
  });

  const listCommand = new ListObjectsV2Command({ Bucket: bucket });
  const response = await s3.send(listCommand);
  
  if (!response.Contents || response.Contents.length === 0) {
    console.log("No files found in S3 bucket.");
    return;
  }

  let totalOriginal = 0;
  let totalCompressed = 0;
  let filesProcessed = 0;

  for (const item of response.Contents) {
    const key = item.Key;
    const ext = path.extname(key).toLowerCase();
    const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    
    if (!isImage) {
      console.log(`Skipping non-image file: ${key}`);
      continue;
    }

    console.log(`Processing S3 image: ${key} (${(item.Size / 1024).toFixed(2)} KB)`);
    
    // 1. Download
    try {
      const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
      const s3Object = await s3.send(getCommand);
      
      const chunks = [];
      for await (const chunk of s3Object.Body) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      const originalSize = buffer.length;
      totalOriginal += originalSize;

      // 2. Compress
      const compressedBuffer = await compressImage(buffer, ext);
      const compressedSize = compressedBuffer.length;
      totalCompressed += compressedSize;
      filesProcessed++;

      const percentSaved = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      console.log(`  Compressed: ${(originalSize / 1024).toFixed(2)} KB -> ${(compressedSize / 1024).toFixed(2)} KB (${percentSaved}% saved)`);

      // 3. Upload back if size is smaller
      if (compressedSize < originalSize) {
        const putCommand = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: compressedBuffer,
          ContentType: s3Object.ContentType
        });
        await s3.send(putCommand);
        console.log(`  Successfully overwrote: ${key}`);
      } else {
        console.log(`  Compression did not reduce size. Keeping original.`);
        totalCompressed -= compressedSize;
        totalCompressed += originalSize;
      }
    } catch (err) {
      console.error(`  Error processing S3 asset ${key}:`, err.message);
      if (item.Size) totalCompressed += item.Size;
    }
  }

  const saved = totalOriginal - totalCompressed;
  console.log(`\nS3 Process Complete.`);
  console.log(`Processed ${filesProcessed} images.`);
  console.log(`Original total size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Compressed total size: ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total saved: ${(saved / 1024 / 1024).toFixed(2)} MB`);
}

async function handleLocal() {
  const uploadDir = path.resolve(__dirname, '../backend', process.env.LOCAL_UPLOAD_DIR || 'uploads');
  console.log(`Using Local storage driver. Directory: ${uploadDir}`);
  
  try {
    const files = await fs.readdir(uploadDir);
    let totalOriginal = 0;
    let totalCompressed = 0;
    let filesProcessed = 0;

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stat = await fs.stat(filePath);
      
      if (!stat.isFile()) continue;
      
      const ext = path.extname(file).toLowerCase();
      const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
      
      if (!isImage) {
        console.log(`Skipping non-image file: ${file}`);
        continue;
      }

      console.log(`Processing local image: ${file} (${(stat.size / 1024).toFixed(2)} KB)`);
      
      const buffer = await fs.readFile(filePath);
      const originalSize = buffer.length;
      totalOriginal += originalSize;

      try {
        const compressedBuffer = await compressImage(buffer, ext);
        const compressedSize = compressedBuffer.length;
        totalCompressed += compressedSize;
        filesProcessed++;

        const percentSaved = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
        console.log(`  Compressed: ${(originalSize / 1024).toFixed(2)} KB -> ${(compressedSize / 1024).toFixed(2)} KB (${percentSaved}% saved)`);

        if (compressedSize < originalSize) {
          await fs.writeFile(filePath, compressedBuffer);
          console.log(`  Successfully overwrote: ${file}`);
        } else {
          console.log(`  Compression did not reduce size. Keeping original.`);
          totalCompressed -= compressedSize;
          totalCompressed += originalSize;
        }
      } catch (err) {
        console.error(`  Error compressing ${file}:`, err.message);
        totalCompressed += originalSize;
      }
    }

    const saved = totalOriginal - totalCompressed;
    console.log(`\nLocal Process Complete.`);
    console.log(`Processed ${filesProcessed} images.`);
    console.log(`Original total size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Compressed total size: ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total saved: ${(saved / 1024 / 1024).toFixed(2)} MB`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`Upload directory does not exist: ${uploadDir}`);
    } else {
      console.error("Error reading local upload directory:", err);
    }
  }
}

async function main() {
  const driver = process.env.STORAGE_DRIVER || 'local';
  
  if (driver === 's3') {
    await handleS3();
  } else {
    await handleLocal();
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
