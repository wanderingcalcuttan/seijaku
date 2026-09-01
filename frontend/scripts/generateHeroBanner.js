const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const bannerWidth = 2560;
const bannerHeight = 1100;
const gap = 40;
const slotWidth = Math.floor((bannerWidth - gap) / 2);
const background = "#F3EFE8";

const leftSource = path.join("public", "images", "DSC_8017.JPG");
const rightSource = path.join("public", "images", "DSC_8097.JPG");
const outputPath = path.join("public", "images", "our-story-hero-banner.png");

async function prepareImage(sourcePath) {
  const image = sharp(sourcePath).rotate();
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to read dimensions for ${sourcePath}`);
  }

  const scale = Math.min(slotWidth / metadata.width, bannerHeight / metadata.height, 1);
  const width = Math.round(metadata.width * scale);
  const height = Math.round(metadata.height * scale);
  const buffer = await image
    .resize({
      width: slotWidth,
      height: bannerHeight,
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();

  return { buffer, width, height };
}

async function buildBanner() {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const [leftImage, rightImage] = await Promise.all([
    prepareImage(leftSource),
    prepareImage(rightSource),
  ]);

  const leftOffsetX = Math.round((slotWidth - leftImage.width) / 2);
  const rightOffsetX = Math.round((slotWidth - rightImage.width) / 2);
  const leftTop = Math.round((bannerHeight - leftImage.height) / 2);
  const rightTop = Math.round((bannerHeight - rightImage.height) / 2);

  await sharp({
    create: {
      width: bannerWidth,
      height: bannerHeight,
      channels: 3,
      background,
    },
  })
    .composite([
      { input: leftImage.buffer, left: leftOffsetX, top: leftTop },
      { input: rightImage.buffer, left: slotWidth + gap + rightOffsetX, top: rightTop },
    ])
    .png({ palette: true, quality: 80, compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toFile(outputPath);

  console.log(`Hero banner generated at ${outputPath}`);
}

buildBanner().catch((error) => {
  console.error("Failed to generate hero banner.");
  console.error(error);
  process.exit(1);
});
