// @ts-nocheck
import { CollectionKind, Prisma, PrismaClient, ProductStatus, SelectionMode, TagKind } from "@prisma/client";

import { hashPassword } from "../src/lib/auth.js";
import { env } from "../src/config.js";
import * as shopData from "../../frontend/src/lib/shopAllItems.js";
import { seedArticles } from "./seed-data/articles.js";
import * as retreatData from "../../frontend/src/lib/retreats.js";

const prisma = new PrismaClient();
const shop = ((shopData as any).default ?? shopData) as typeof shopData & Record<string, any>;
const retreatCatalog = ((retreatData as any).default ?? retreatData) as typeof retreatData & Record<string, any>;
type ShopBridgeSlug = (typeof shop.canonicalBridgeSlugs)[number];

const programs = [
  {
    slug: "adult-unwind",
    name: "Adult Unwind",
    shortDescription: "Urban reset for working adults. Breath, scent, reflection, tactile grounding.",
    detailDescription:
      "Urban reset for working adults built around breath, scent, reflection, and tactile grounding.",
    durationLabel: "Half-day",
    groupSizeLabel: "10–15 participants",
    status: "UPCOMING" as const,
  },
  {
    slug: "elder-reset",
    name: "Elder Reset",
    shortDescription: "Gentle movement, memory dialogue, sensory anchoring.",
    detailDescription:
      "A structured half-day guided program for gentle regulation, memory dialogue, and sensory anchoring.",
    durationLabel: "Half-day",
    groupSizeLabel: "12 participants",
    status: "BOOKING_OPEN" as const,
  },
  {
    slug: "teen-senses",
    name: "Teen Senses",
    shortDescription: "Digital detox and embodied awareness through craft and guided reflection.",
    detailDescription:
      "A three-hour digital detox format focused on embodied awareness through craft and guided reflection.",
    durationLabel: "3 hours",
    groupSizeLabel: "8–12 participants",
    status: "UPCOMING" as const,
  },
];

const programSessions = [
  {
    programSlug: "elder-reset",
    startsAt: "2026-04-14T10:00:00+05:30",
    endsAt: "2026-04-14T14:00:00+05:30",
    timezone: "Asia/Kolkata",
    city: "Kolkata",
    venueName: "Kolkata",
    capacity: 12,
    spotsRemaining: 12,
    status: "BOOKING_OPEN" as const,
  },
];

const siteSettings = {
  footerEmail: "lifeatseijaku@gmail.com",
  footerPhone: "91-9432804418",
  addressLines: ["Registered Office:", "2A, F 154, B.P. Township,", "Kolkata 700094 India"],
  newsletterHeading: "Seijaku Weeklies",
  newsletterBody: "Mid-week stillness for the modern life. A quiet reset delivered every Wednesday.",
  misc: {
    journalNewsletterTitle: "Stay close to the season.",
    journalNewsletterBody:
      "Receive occasional notes from Seijaku on new writings, seasonal releases, and quiet offerings.",
  },
};

const lifestyleSections = [
  {
    title: "Morning & Pause",
    items: [
      {
        id: "kolkata-chai-calm-box",
        backingSlug: "quiet-tea-ritual-box",
        title: "Kolkata Chai Calm Box",
      },
      {
        id: "coffee-break-box",
        backingSlug: "evening-unwind-gift-set",
        title: "Coffee Break Box",
      },
    ],
  },
  {
    title: "Personal Rituals",
    items: [
      {
        id: "unfold-ritual-box-01",
        backingSlug: "dawn-reset-box",
        title: "Unfold Ritual Box 01",
      },
      {
        id: "listen-ritual-box-02",
        backingSlug: "reading-hour-set",
        title: "Listen Ritual Box 02",
      },
      {
        id: "attune-ritual-box-03",
        backingSlug: "evening-unwind-gift-set",
        title: "Attune Ritual Box 03",
      },
    ],
  },
  {
    title: "Gifting",
    items: [
      {
        id: "live-calm-gift-pouch",
        backingSlug: "dawn-reset-box",
        title: "Live Calm Gift Pouch",
      },
    ],
  },
];

const productOptionsBySlug: Record<
  string,
  Array<{
    code: string;
    label: string;
    selectionMode?: SelectionMode;
    required?: boolean;
    values: string[];
  }>
> = {
  "quiet-tea-ritual-box": [
    {
      code: "oils",
      label: "Choose your oils",
      required: true,
      values: ["Lavender Green", "Chamomile", "Spearmint", "Ginger Lemon", "Jasmine"],
    },
  ],
  "evening-unwind-gift-set": [
    {
      code: "wax-blend",
      label: "Select wax blend",
      required: true,
      values: ["Cool Caramel", "Coffee Break", "Choco Dark"],
    },
  ],
  "dawn-reset-box": [
    {
      code: "perfume",
      label: "Choose your perfume",
      required: true,
      values: ["Breath of Pines (10 ml / 50 ml)", "Summer Held Close (10 ml / 50 ml)", "The Morning Desk (10 ml / 50 ml)"],
    },
    {
      code: "textile",
      label: "Choose your textile",
      required: true,
      values: [
        "A Pine Forest scarf",
        "A Pine Forest pocket square",
        "Coffee Art scarf",
        "Coffee Art pocket square",
        "A Kolkata Summer scarf",
        "A Kolkata Summer pocket square",
      ],
    },
    {
      code: "brooch",
      label: "Choose your brooch",
      required: true,
      values: ["Japan handfan", "Bengal handfan", "Conch", "Temple bell"],
    },
  ],
  "clay-vessel-diffuser": [
    {
      code: "variant",
      label: "Choose your finish",
      required: true,
      values: ["Matte Clay", "Smoke Clay", "Tea Glaze"],
    },
  ],
  "stone-oil-diffuser": [
    {
      code: "variant",
      label: "Choose your scent vessel",
      required: true,
      values: ["Floral & Fruity", "Tea & Steam", "Green & Resin"],
    },
  ],
  "jasmine-neroli-textile-oil": [
    {
      code: "format",
      label: "Choose your format",
      required: true,
      values: ["Scarf", "Pocket Square"],
    },
  ],
};

const bridgePageContentBySlug: Record<string, Record<string, unknown>> = {
  lifestyle: {
    lifestyleSections,
  },
};

const bridgePageMeta: Record<
  ShopBridgeSlug,
  {
    navLabel: string;
    heroEyebrow: string;
    heroTitle: string;
    heroDescription: string[];
    heroQuote: string;
    introEyebrow: string;
    introTitle: string;
    introDescription: string;
  }
> = {
  lifestyle: {
    navLabel: "Lifestyle",
    heroEyebrow: "Curated Gifts",
    heroTitle: "Lifestyle sets composed as quiet rituals.",
    heroDescription: [
      "Curated Seijaku boxes bring together fragrance, textile, and crafted object into small repeatable gestures."
    ],
    heroQuote: "Objects arranged to slow the pace of daily life.",
    introEyebrow: "Lifestyle",
    introTitle: "Composed sets for pause, gifting, and ritual.",
    introDescription: "These pages help a visitor move from broad interest into a more grounded selection of Seijaku ritual sets.",
  },
  perfumes: {
    navLabel: "Perfumes",
    heroEyebrow: "Fragrance for Skin",
    heroTitle: "Perfumes composed for close, quiet wear.",
    heroDescription: ["A slower fragrance wardrobe with oils and fine mists designed to sit near the body."],
    heroQuote: "Scent that stays intimate, soft, and close to the pulse.",
    introEyebrow: "Perfumes",
    introTitle: "A calmer fragrance bridge",
    introDescription: "This page is designed as a decision-light threshold between discovery and purchase.",
  },
  "scarves-and-squares": {
    navLabel: "Scarves & Squares",
    heroEyebrow: "Textiles in Ritual",
    heroTitle: "Scarves and squares that bring scent into movement.",
    heroDescription: ["Hand-finished textiles for pocket, neck, table, and travel."],
    heroQuote: "A textile can hold memory, atmosphere, and gesture at once.",
    introEyebrow: "Textiles",
    introTitle: "Textiles as bridge objects",
    introDescription: "These pages help the shopper move from broad interest in fragrance textiles into concrete choices.",
  },
  diffusers: {
    navLabel: "Diffusers",
    heroEyebrow: "Home Fragrance",
    heroTitle: "Diffusers that shape room atmosphere without noise.",
    heroDescription: ["For desks, bedside tables, and entry rituals, these diffusers bring fragrance into the room."],
    heroQuote: "Home scent should settle the room before it tries to fill it.",
    introEyebrow: "Diffusers",
    introTitle: "A lower-friction home fragrance flow",
    introDescription: "The diffuser bridge groups products by placement and atmosphere so shoppers can choose by room and tempo.",
  },
  "dokra-ornaments": {
    navLabel: "Dokra Ornaments",
    heroEyebrow: "Metal Ritual Objects",
    heroTitle: "Dokra ornaments shaped for stillness and memory.",
    heroDescription: ["Small metal objects that function as talisman, accent, and slow ritual companion."],
    heroQuote: "An object can hold memory long after the moment passes.",
    introEyebrow: "Dokra",
    introTitle: "Objects with quiet symbolic charge",
    introDescription: "These ornament pages help visitors move from form and story into a specific object choice.",
  },
};

function normalizeProductStatus(status?: string | null) {
  if (!status) return ProductStatus.IN_STOCK;

  const normalized = status.toUpperCase().replace(/\s+/g, "_");
  return ProductStatus[normalized as keyof typeof ProductStatus] ?? ProductStatus.IN_STOCK;
}

function inferCollections(product: (typeof shop.shopProducts)[number]) {
  const set = new Set<CollectionKind>();

  if (product.slug.includes("hemanta") || product.image.includes("Hemanta")) {
    set.add(CollectionKind.HEMANTA);
  }

  if (product.slug.includes("season") || product.image.includes("Seasonal")) {
    set.add(CollectionKind.SEASONAL_DROP);
  }

  if (set.size === 0) {
    set.add(CollectionKind.CORE_COLLECTION);
  }

  return Array.from(set);
}

async function upsertMedia(url: string, altText?: string) {
  return prisma.mediaAsset.upsert({
    where: { url },
    update: { altText: altText ?? undefined },
    create: {
      url,
      altText,
    },
  });
}

async function main() {
  const passwordHash = await hashPassword(env.ADMIN_PASSWORD);

  await prisma.admin.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: {
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
    create: {
      email: env.ADMIN_EMAIL,
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: "default" },
    update: {
      footerEmail: siteSettings.footerEmail,
      footerPhone: siteSettings.footerPhone,
      addressLinesJson: siteSettings.addressLines,
      newsletterHeading: siteSettings.newsletterHeading,
      newsletterBody: siteSettings.newsletterBody,
      miscJson: siteSettings.misc,
    },
    create: {
      key: "default",
      footerEmail: siteSettings.footerEmail,
      footerPhone: siteSettings.footerPhone,
      addressLinesJson: siteSettings.addressLines,
      newsletterHeading: siteSettings.newsletterHeading,
      newsletterBody: siteSettings.newsletterBody,
      miscJson: siteSettings.misc,
    },
  });

  const categoryBySlug = new Map<string, string>();
  for (const slug of shop.canonicalBridgeSlugs) {
    const category = await prisma.productCategory.upsert({
      where: { slug },
      update: {
        name: bridgePageMeta[slug].navLabel,
        kind: "SHOP_BRIDGE",
      },
      create: {
        slug,
        name: bridgePageMeta[slug].navLabel,
        kind: "SHOP_BRIDGE",
      },
    });
    categoryBySlug.set(slug, category.id);
  }

  const collectionByKind = new Map<CollectionKind, string>();
  for (const [slug, name, kind] of [
    ["core-collection", "Core Collection", CollectionKind.CORE_COLLECTION],
    ["seasonal-drop", "Seasonal Drop", CollectionKind.SEASONAL_DROP],
    ["hemanta", "Hemanta", CollectionKind.HEMANTA],
  ] as const) {
    const collection = await prisma.collection.upsert({
      where: { slug },
      update: { name, kind },
      create: { slug, name, kind },
    });
    collectionByKind.set(kind, collection.id);
  }

  const productIdBySlug = new Map<string, string>();
  for (const product of shop.shopProducts) {
    const primaryImage = await upsertMedia(product.image, product.imageAlt ?? product.title);

    const savedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        type: product.type,
        material: product.material,
        useCase: product.useCase,
        priceAmount: product.price,
        currency: "INR",
        status: normalizeProductStatus(product.status),
        releaseDate: null,
        seoTitle: product.title,
        seoDescription: product.shortDescription ?? product.longDescription ?? undefined,
        imageAlt: product.imageAlt,
        ctaLabel: product.ctaLabel,
        metadataJson: {
          ritualTag: product.ritualTag ?? null,
          ritualTagHref: product.ritualTagHref ?? null,
          gallery: product.gallery ?? [],
          videoUrl: product.videoUrl ?? null,
        },
        primaryImageId: primaryImage.id,
        publishedAt: new Date(),
      },
      create: {
        slug: product.slug,
        title: product.title,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        type: product.type,
        material: product.material,
        useCase: product.useCase,
        priceAmount: product.price,
        currency: "INR",
        status: normalizeProductStatus(product.status),
        seoTitle: product.title,
        seoDescription: product.shortDescription ?? product.longDescription ?? undefined,
        imageAlt: product.imageAlt,
        ctaLabel: product.ctaLabel,
        metadataJson: {
          ritualTag: product.ritualTag ?? null,
          ritualTagHref: product.ritualTagHref ?? null,
          gallery: product.gallery ?? [],
          videoUrl: product.videoUrl ?? null,
        },
        primaryImageId: primaryImage.id,
        publishedAt: new Date(),
      },
    });

    productIdBySlug.set(product.slug, savedProduct.id);

    await prisma.productMedia.deleteMany({ where: { productId: savedProduct.id } });

    const gallery = product.gallery?.length ? product.gallery : [product.image];
    for (const [index, url] of gallery.entries()) {
      const mediaAsset = await upsertMedia(url, product.imageAlt ?? product.title);
      await prisma.productMedia.create({
        data: {
          productId: savedProduct.id,
          mediaAssetId: mediaAsset.id,
          sortOrder: index,
          mediaType: index === 0 ? "PRIMARY" : "GALLERY",
        },
      });
    }

    if (product.bridgeCategory) {
      const categoryId = categoryBySlug.get(product.bridgeCategory);
      if (categoryId) {
        await prisma.productCategoryMembership.upsert({
          where: {
            productId_categoryId: {
              productId: savedProduct.id,
              categoryId,
            },
          },
          update: {},
          create: {
            productId: savedProduct.id,
            categoryId,
          },
        });
      }
    }

    for (const kind of inferCollections(product)) {
      const collectionId = collectionByKind.get(kind);
      if (!collectionId) continue;

      await prisma.collectionProductLink.upsert({
        where: {
          collectionId_productId: {
            collectionId,
            productId: savedProduct.id,
          },
        },
        update: {},
        create: {
          collectionId,
          productId: savedProduct.id,
        },
      });
    }

    if (product.ritualTag) {
      const tag = await prisma.productTag.upsert({
        where: { slug: product.ritualTag.toLowerCase().replace(/\s+/g, "-") },
        update: {
          name: product.ritualTag,
          kind: TagKind.RITUAL,
        },
        create: {
          slug: product.ritualTag.toLowerCase().replace(/\s+/g, "-"),
          name: product.ritualTag,
          kind: TagKind.RITUAL,
        },
      });

      await prisma.productTagLink.upsert({
        where: {
          productId_tagId: {
            productId: savedProduct.id,
            tagId: tag.id,
          },
        },
        update: {},
        create: {
          productId: savedProduct.id,
          tagId: tag.id,
        },
      });
    }

    const optionDefinitions = productOptionsBySlug[product.slug] ?? [];
    for (const [optionIndex, option] of optionDefinitions.entries()) {
      const savedOption = await prisma.productOption.upsert({
        where: {
          productId_code: {
            productId: savedProduct.id,
            code: option.code,
          },
        },
        update: {
          label: option.label,
          selectionMode: option.selectionMode ?? SelectionMode.SINGLE,
          required: option.required ?? false,
          sortOrder: optionIndex,
        },
        create: {
          productId: savedProduct.id,
          code: option.code,
          label: option.label,
          selectionMode: option.selectionMode ?? SelectionMode.SINGLE,
          required: option.required ?? false,
          sortOrder: optionIndex,
        },
      });

      for (const [valueIndex, value] of option.values.entries()) {
        await prisma.productOptionValue.upsert({
          where: {
            productOptionId_value: {
              productOptionId: savedOption.id,
              value,
            },
          },
          update: {
            label: value,
            sortOrder: valueIndex,
            isActive: true,
          },
          create: {
            productOptionId: savedOption.id,
            value,
            label: value,
            sortOrder: valueIndex,
            isActive: true,
          },
        });
      }
    }
  }

  for (const slug of shop.canonicalBridgeSlugs) {
    const meta = bridgePageMeta[slug];
    const page = await prisma.shopBridgePage.upsert({
      where: { slug },
      update: {
        navLabel: meta.navLabel,
        heroEyebrow: meta.heroEyebrow,
        heroTitle: meta.heroTitle,
        heroDescriptionJson: meta.heroDescription,
        heroQuote: meta.heroQuote,
        introEyebrow: meta.introEyebrow,
        introTitle: meta.introTitle,
        introDescription: meta.introDescription,
        seoTitle: meta.heroTitle,
        seoDescription: meta.heroDescription.join(" "),
        contentJson: (bridgePageContentBySlug[slug] ?? undefined) as Prisma.InputJsonValue | undefined,
      },
      create: {
        slug,
        navLabel: meta.navLabel,
        heroEyebrow: meta.heroEyebrow,
        heroTitle: meta.heroTitle,
        heroDescriptionJson: meta.heroDescription,
        heroQuote: meta.heroQuote,
        introEyebrow: meta.introEyebrow,
        introTitle: meta.introTitle,
        introDescription: meta.introDescription,
        seoTitle: meta.heroTitle,
        seoDescription: meta.heroDescription.join(" "),
        contentJson: (bridgePageContentBySlug[slug] ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });

    await prisma.shopBridgePageProduct.deleteMany({ where: { bridgePageId: page.id } });

    const products = shop.getShopBridgeProducts(slug);
    for (const [index, product] of products.entries()) {
      const productId = productIdBySlug.get(product.slug);
      if (!productId) continue;

      await prisma.shopBridgePageProduct.create({
        data: {
          bridgePageId: page.id,
          productId,
          sortOrder: index,
        },
      });
    }
  }

  for (const article of seedArticles) {
    const primaryImage = article.image ? await upsertMedia(article.image, article.imageAlt ?? article.title) : null;

    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        category: article.category,
        excerpt: article.excerpt,
        bodyMarkdown: `${article.excerpt}\n\nFull editorial article template prepared for future long-form publication.`,
        featured: Boolean(article.featured),
        status: "PUBLISHED",
        publishedAt: new Date(article.date.includes("2026") ? `${article.date.replace(" ", "-")}-01` : "2026-01-01"),
        primaryImageId: primaryImage?.id,
        seoTitle: article.title,
        seoDescription: article.excerpt,
      },
      create: {
        slug: article.slug,
        title: article.title,
        category: article.category,
        excerpt: article.excerpt,
        bodyMarkdown: `${article.excerpt}\n\nFull editorial article template prepared for future long-form publication.`,
        featured: Boolean(article.featured),
        status: "PUBLISHED",
        publishedAt: new Date(article.date.includes("2026") ? `${article.date.replace(" ", "-")}-01` : "2026-01-01"),
        primaryImageId: primaryImage?.id,
        seoTitle: article.title,
        seoDescription: article.excerpt,
      },
    });
  }

  for (const retreat of retreatCatalog.retreats) {
    const primaryImage = await upsertMedia(retreat.image, retreat.name);
    await prisma.retreat.upsert({
      where: { slug: retreat.slug },
      update: {
        name: retreat.name,
        shortDescription: retreat.shortDescription,
        detailDescription: retreat.detailDescription,
        location: retreat.location,
        season: retreat.season,
        format: retreat.format,
        groupSize: retreat.groupSize,
        status: "UPCOMING",
        primaryImageId: primaryImage.id,
      },
      create: {
        slug: retreat.slug,
        name: retreat.name,
        shortDescription: retreat.shortDescription,
        detailDescription: retreat.detailDescription,
        location: retreat.location,
        season: retreat.season,
        format: retreat.format,
        groupSize: retreat.groupSize,
        status: "UPCOMING",
        primaryImageId: primaryImage.id,
      },
    });
  }

  for (const program of programs) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      update: program,
      create: program,
    });
  }

  for (const session of programSessions) {
    const program = await prisma.program.findUniqueOrThrow({
      where: { slug: session.programSlug },
    });

    await prisma.programSession.create({
      data: {
        programId: program.id,
        startsAt: new Date(session.startsAt),
        endsAt: new Date(session.endsAt),
        timezone: session.timezone,
        city: session.city,
        venueName: session.venueName,
        capacity: session.capacity,
        spotsRemaining: session.spotsRemaining,
        status: session.status,
      },
    });
  }

  await prisma.seasonalDrop.upsert({
    where: { slug: "hemanta" },
    update: {
      name: "Hemanta",
      description: "Seasonal drop placeholder seeded from frontend storytelling flows.",
      status: "ACTIVE",
      publishedAt: new Date("2026-03-01"),
    },
    create: {
      slug: "hemanta",
      name: "Hemanta",
      description: "Seasonal drop placeholder seeded from frontend storytelling flows.",
      status: "ACTIVE",
      publishedAt: new Date("2026-03-01"),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
