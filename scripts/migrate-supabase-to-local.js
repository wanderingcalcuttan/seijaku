const path = require('path');
// Add backend node_modules to resolution path so Prisma can load successfully
module.paths.push(path.resolve(__dirname, '../backend/node_modules'));

// Load environment variables from backend/.env manually to ensure Prisma database connection details are set
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

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to the database...");
  await prisma.$connect();
  console.log("Connected.");

  console.log("Fetching all MediaAsset records...");
  const assets = await prisma.mediaAsset.findMany();
  console.log(`Found ${assets.length} total media assets in database.`);

  const supabaseAssets = assets.filter(asset => asset.url.includes("supabase.co") || asset.url.includes("supabase.in"));

  console.log(`Identified ${supabaseAssets.length} assets with Supabase URLs.`);

  if (supabaseAssets.length === 0) {
    console.log("No assets to migrate.");
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const asset of supabaseAssets) {
    // Extract relative path after the bucket marker
    const bucketMarker = "/seijaku-media-prod/";
    let relativePath = "";

    const markerIndex = asset.url.indexOf(bucketMarker);
    if (markerIndex !== -1) {
      relativePath = asset.url.substring(markerIndex + bucketMarker.length);
    } else {
      // Fallback: extract last path segment
      const lastSlash = asset.url.lastIndexOf('/');
      relativePath = asset.url.substring(lastSlash + 1);
    }

    // Decode URI component to get plain filenames
    try {
      relativePath = decodeURIComponent(relativePath);
    } catch (e) {
      // Use raw if decoding fails
    }

    const newUrl = `/uploads/${relativePath}`;
    console.log(`Migrating: ${asset.url} -> ${newUrl}`);

    try {
      await prisma.mediaAsset.update({
        where: { id: asset.id },
        data: { url: newUrl }
      });
      successCount++;
    } catch (err) {
      console.error(`  Failed to update asset ${asset.id}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\nMigration completed:`);
  console.log(`Successfully migrated: ${successCount} assets.`);
  if (errorCount > 0) {
    console.log(`Failed migrations: ${errorCount} assets.`);
  }
}

main()
  .catch(err => {
    console.error("Fatal error during migration:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
