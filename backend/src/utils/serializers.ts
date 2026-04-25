export function serializeProduct(product: any) {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    type: product.type,
    material: product.material,
    useCase: product.useCase,
    priceAmount: product.priceAmount,
    currency: product.currency,
    status: product.status,
    workflowStatus: product.workflowStatus,
    releaseDate: product.releaseDate?.toISOString() ?? null,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    imageAlt: product.imageAlt,
    ctaLabel: product.ctaLabel,
    metadata: product.metadataJson,
    primaryImage: product.primaryImage
      ? {
          id: product.primaryImage.id,
          url: product.primaryImage.url,
          altText: product.primaryImage.altText,
        }
      : null,
    media: product.media
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
      .map((entry: any) => ({
        id: entry.id,
        type: entry.mediaType,
        sortOrder: entry.sortOrder,
        asset: {
          id: entry.mediaAsset.id,
          url: entry.mediaAsset.url,
          altText: entry.mediaAsset.altText,
          kind: entry.mediaAsset.kind,
        },
      })),
    options: product.options
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
      .map((option: any) => ({
        id: option.id,
        code: option.code,
        label: option.label,
        selectionMode: option.selectionMode,
        required: option.required,
        sortOrder: option.sortOrder,
        metadata: option.metadataJson,
        values: option.values
          .filter((value: any) => value.isActive)
          .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
          .map((value: any) => ({
            id: value.id,
            value: value.value,
            label: value.label,
            priceDeltaAmount: value.priceDeltaAmount,
            sortOrder: value.sortOrder,
          })),
      })),
    categories: product.categories.map((entry: any) => ({
      id: entry.category.id,
      slug: entry.category.slug,
      name: entry.category.name,
      kind: entry.category.kind,
      sortOrder: entry.sortOrder,
    })),
    collections: product.collections.map((entry: any) => ({
      id: entry.collection.id,
      slug: entry.collection.slug,
      name: entry.collection.name,
      kind: entry.collection.kind,
      sortOrder: entry.sortOrder,
    })),
    bridgePages: (product.bridgePages ?? []).map((entry: any) => ({
      id: entry.bridgePage.id,
      slug: entry.bridgePage.slug,
      navLabel: entry.bridgePage.navLabel,
      sortOrder: entry.sortOrder,
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    publishedAt: product.publishedAt?.toISOString() ?? null,
  };
}

export function serializeAdmin(admin: any) {
  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    status: admin.status,
    createdAt: admin.createdAt.toISOString(),
    updatedAt: admin.updatedAt.toISOString(),
  };
}

export function serializeMediaAsset(asset: any) {
  return {
    id: asset.id,
    url: asset.url,
    altText: asset.altText,
    kind: asset.kind,
    width: asset.width,
    height: asset.height,
    createdAt: asset.createdAt.toISOString(),
  };
}

export function serializeCategory(category: any) {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    kind: category.kind,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export function serializeCollection(collection: any) {
  return {
    id: collection.id,
    slug: collection.slug,
    name: collection.name,
    description: collection.description,
    kind: collection.kind,
    products: (collection.products ?? []).map((entry: any) => ({
      id: entry.id,
      sortOrder: entry.sortOrder,
      product: entry.product
        ? {
            id: entry.product.id,
            slug: entry.product.slug,
            title: entry.product.title,
          }
        : null,
    })),
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
  };
}

export function serializeBridgePage(page: any) {
  return {
    id: page.id,
    slug: page.slug,
    navLabel: page.navLabel,
    heroEyebrow: page.heroEyebrow,
    heroTitle: page.heroTitle,
    heroDescription: page.heroDescriptionJson,
    heroImage: page.heroImage,
    heroImageAlt: page.heroImageAlt,
    heroImagePosition: page.heroImagePosition,
    heroQuote: page.heroQuote,
    introEyebrow: page.introEyebrow,
    introTitle: page.introTitle,
    introDescription: page.introDescription,
    interludeImage: page.interludeImage,
    interludeImageAlt: page.interludeImageAlt,
    productSectionEyebrow: page.productSectionEyebrow,
    productSectionTitle: page.productSectionTitle,
    productSectionDescription: page.productSectionDescription,
    postCtaTitle: page.postCtaTitle,
    postCtaDescription: page.postCtaDescription,
    postCtaPrimaryLabel: page.postCtaPrimaryLabel,
    postCtaPrimaryHref: page.postCtaPrimaryHref,
    postCtaSecondaryLabel: page.postCtaSecondaryLabel,
    postCtaSecondaryHref: page.postCtaSecondaryHref,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    seoFootnote: page.seoFootnote,
    content: page.contentJson,
    products: page.products.sort((a: any, b: any) => a.sortOrder - b.sortOrder).map((entry: any) => serializeProduct(entry.product)),
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}

export function serializeArticle(article: any) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    category: article.category,
    excerpt: article.excerpt,
    bodyMarkdown: article.bodyMarkdown,
    featured: article.featured,
    status: article.status,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    primaryImage: article.primaryImage
      ? {
          id: article.primaryImage.id,
          url: article.primaryImage.url,
          altText: article.primaryImage.altText,
        }
      : null,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}

export function serializeRetreat(retreat: any) {
  return {
    id: retreat.id,
    slug: retreat.slug,
    name: retreat.name,
    shortDescription: retreat.shortDescription,
    detailDescription: retreat.detailDescription,
    location: retreat.location,
    season: retreat.season,
    format: retreat.format,
    groupSize: retreat.groupSize,
    status: retreat.status,
    primaryImage: retreat.primaryImage
      ? {
          id: retreat.primaryImage.id,
          url: retreat.primaryImage.url,
          altText: retreat.primaryImage.altText,
        }
      : null,
    createdAt: retreat.createdAt.toISOString(),
    updatedAt: retreat.updatedAt.toISOString(),
  };
}

export function serializeProgram(program: any) {
  return {
    id: program.id,
    slug: program.slug,
    name: program.name,
    shortDescription: program.shortDescription,
    detailDescription: program.detailDescription,
    durationLabel: program.durationLabel,
    groupSizeLabel: program.groupSizeLabel,
    status: program.status,
    sessions: program.sessions
      .sort((a: any, b: any) => a.startsAt.getTime() - b.startsAt.getTime())
      .map((session: any) => ({
        id: session.id,
        startsAt: session.startsAt.toISOString(),
        endsAt: session.endsAt.toISOString(),
        timezone: session.timezone,
        city: session.city,
        venueName: session.venueName,
        capacity: session.capacity,
        spotsRemaining: session.spotsRemaining,
        status: session.status,
      })),
    createdAt: program.createdAt.toISOString(),
    updatedAt: program.updatedAt.toISOString(),
  };
}

export function serializeSiteSettings(settings: any) {
  return {
    key: settings.key,
    footerEmail: settings.footerEmail,
    footerPhone: settings.footerPhone,
    addressLines: settings.addressLinesJson,
    newsletterHeading: settings.newsletterHeading,
    newsletterBody: settings.newsletterBody,
    misc: settings.miscJson,
    logoImage: settings.logoImage
      ? {
          id: settings.logoImage.id,
          url: settings.logoImage.url,
          altText: settings.logoImage.altText,
        }
      : null,
    createdAt: settings.createdAt.toISOString(),
    updatedAt: settings.updatedAt.toISOString(),
  };
}

export function serializeProductNotification(record: any) {
  return {
    id: record.id,
    email: record.email,
    source: record.source,
    status: record.status,
    notes: record.notes,
    createdAt: record.createdAt.toISOString(),
    notifiedAt: record.notifiedAt?.toISOString() ?? null,
    product: record.product
      ? {
          id: record.product.id,
          slug: record.product.slug,
          title: record.product.title,
          status: record.product.status,
        }
      : null,
  };
}

export function serializeStory(story: any) {
  return {
    id: story.id,
    launchDate: story.launchDate.toISOString(),
    videoUrl: story.videoUrl,
    status: story.status,
    perfumes: [story.perfume1, story.perfume2, story.perfume3].map(serializeProduct),
    artifacts: [story.artifact1, story.artifact2, story.artifact3].map(serializeProduct),
    createdAt: story.createdAt.toISOString(),
    updatedAt: story.updatedAt.toISOString(),
  };
}

// Lightweight summary for the admin index list — avoids dragging the full
// product include payload across the wire when only counts and titles are
// needed in the table.
export function serializeStorySummary(story: any) {
  return {
    id: story.id,
    launchDate: story.launchDate.toISOString(),
    status: story.status,
    videoUrl: story.videoUrl,
    perfumeTitles: [story.perfume1?.title, story.perfume2?.title, story.perfume3?.title].filter(Boolean),
    artifactTitles: [story.artifact1?.title, story.artifact2?.title, story.artifact3?.title].filter(Boolean),
    updatedAt: story.updatedAt.toISOString(),
  };
}
