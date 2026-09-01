const path = require('path');
// Add backend node_modules to resolution path so S3 and other dependencies can load successfully
module.paths.push(path.resolve(__dirname, '../backend/node_modules'));

const fs = require('fs/promises');
const { existsSync } = require('fs');

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

async function main() {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) {
    console.error("S3_BUCKET environment variable is missing.");
    process.exit(1);
  }

  // Target download folder: downloaded_images at the root
  const destDir = path.resolve(__dirname, '../downloaded_images');
  console.log(`Target directory: ${destDir}`);
  await fs.mkdir(destDir, { recursive: true });

  const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');

  const s3 = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }
  });

  console.log(`Connecting to S3 endpoint: ${process.env.S3_ENDPOINT}`);
  console.log(`Bucket: ${bucket}`);
  console.log("Listing objects...");

  let continuationToken = undefined;
  let allObjects = [];

  do {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      ContinuationToken: continuationToken
    });
    const response = await s3.send(listCommand);
    if (response.Contents) {
      allObjects.push(...response.Contents);
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  if (allObjects.length === 0) {
    console.log("No objects found in the S3 bucket.");
    return;
  }

  console.log(`Found ${allObjects.length} total objects in bucket.`);

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const imageObjects = allObjects.filter(item => {
    const ext = path.extname(item.Key).toLowerCase();
    return imageExtensions.includes(ext);
  });

  console.log(`Filtered down to ${imageObjects.length} image files.`);

  if (imageObjects.length === 0) {
    console.log("No image files to download.");
    return;
  }

  let downloadedCount = 0;
  let downloadedBytes = 0;
  let skippedCount = 0;

  for (let i = 0; i < imageObjects.length; i++) {
    const item = imageObjects[i];
    const key = item.Key;
    const size = item.Size;
    const progress = `[${i + 1}/${imageObjects.length}]`;

    // Local target path
    const localFilePath = path.join(destDir, key);
    const localFileDir = path.dirname(localFilePath);

    // Skip if directory key (S3 key ends with '/')
    if (key.endsWith('/')) {
      continue;
    }

    try {
      // Ensure local subdirectories exist
      await fs.mkdir(localFileDir, { recursive: true });

      console.log(`${progress} Downloading: ${key} (${(size / 1024).toFixed(2)} KB)...`);

      const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
      const s3Object = await s3.send(getCommand);

      const chunks = [];
      for await (const chunk of s3Object.Body) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      await fs.writeFile(localFilePath, buffer);
      downloadedCount++;
      downloadedBytes += buffer.length;
    } catch (err) {
      console.error(`  Error downloading ${key}:`, err.message);
      skippedCount++;
    }
  }

  console.log("\nDownload complete!");
  console.log(`Successfully downloaded ${downloadedCount} images.`);
  if (skippedCount > 0) {
    console.log(`Failed to download ${skippedCount} files.`);
  }
  console.log(`Total downloaded size: ${(downloadedBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Files saved to: ${destDir}`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
