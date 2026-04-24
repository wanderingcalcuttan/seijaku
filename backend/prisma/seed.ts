import { CollectionKind, Prisma, PrismaClient } from "@prisma/client";

import { hashPassword } from "../src/lib/auth.js";
import { env } from "../src/config.js";
import { seedArticles } from "./seed-data/articles.js";
import { seedBridgePages } from "./seed-data/bridge-pages.js";
import { seedRetreats } from "./seed-data/retreats.js";

const prisma = new PrismaClient();

// Product content is no longer seeded. Since Phase 4b.final (Decision #26),
// the backend is the sole source of truth for Product records; local dev
// bootstraps admin + structural records (categories, collections, bridge
// pages) then admins create products via the /admin/products UI. This keeps
// the seed from drifting against a deleted frontend registry and makes the
// "log in and create" flow the same path a real content editor would use.

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


const bridgePageContentBySlug: Record<string, Record<string, unknown>> = {
  lifestyle: {
    lifestyleSections,
  },
};


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
  for (const page of seedBridgePages) {
    const slug = page.slug;
    const category = await prisma.productCategory.upsert({
      where: { slug },
      update: {
        name: page.navLabel,
        kind: "SHOP_BRIDGE",
      },
      create: {
        slug,
        name: page.navLabel,
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

  for (const seed of seedBridgePages) {
    const slug = seed.slug;
    const bridgeData = {
      navLabel: seed.navLabel,
      heroEyebrow: seed.heroEyebrow,
      heroTitle: seed.heroTitle,
      heroDescriptionJson: seed.heroDescription,
      heroImage: seed.heroImage,
      heroImageAlt: seed.heroImageAlt,
      heroImagePosition: seed.heroImagePosition,
      heroQuote: seed.heroQuote,
      introEyebrow: seed.introEyebrow,
      introTitle: seed.introTitle,
      introDescription: seed.introDescription,
      interludeImage: seed.interludeImage,
      interludeImageAlt: seed.interludeImageAlt,
      productSectionEyebrow: seed.productSectionEyebrow,
      productSectionTitle: seed.productSectionTitle,
      productSectionDescription: seed.productSectionDescription,
      postCtaTitle: seed.postCtaTitle,
      postCtaDescription: seed.postCtaDescription,
      postCtaPrimaryLabel: seed.postCtaPrimaryLabel,
      postCtaPrimaryHref: seed.postCtaPrimaryHref,
      postCtaSecondaryLabel: seed.postCtaSecondaryLabel,
      postCtaSecondaryHref: seed.postCtaSecondaryHref,
      seoTitle: seed.seoTitle ?? seed.heroTitle,
      seoDescription: seed.seoDescription ?? seed.heroDescription.join(" "),
      seoFootnote: seed.seoFootnote,
      contentJson: (bridgePageContentBySlug[slug] ?? undefined) as Prisma.InputJsonValue | undefined,
    };

    await prisma.shopBridgePage.upsert({
      where: { slug },
      update: bridgeData,
      create: { slug, ...bridgeData },
    });

    // Product → bridge-page links are no longer seeded. Admins assign
    // products to bridge pages via /admin/bridge-pages after creating
    // products in /admin/products.
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

  for (const retreat of seedRetreats) {
    const primaryImage = await upsertMedia(retreat.image, retreat.imageAlt ?? retreat.name);
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
