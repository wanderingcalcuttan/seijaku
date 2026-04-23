import { AdminRole, AdminStatus, CategoryKind, CollectionKind, MediaKind, Prisma, ProductMediaType, ProductStatus, ProductWorkflowStatus } from "@prisma/client";
import { Router } from "express";
import multer from "multer";
import { z } from "zod";

import { signAdminToken, verifyPassword, hashPassword } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";
import { storeUpload } from "../lib/storage.js";
import { requireAdmin, requireAdminRole } from "../middleware/requireAdmin.js";
import {
  serializeAdmin,
  serializeArticle,
  serializeBridgePage,
  serializeCategory,
  serializeCollection,
  serializeMediaAsset,
  serializeProduct,
  serializeProductNotification,
  serializeProgram,
  serializeRetreat,
  serializeSiteSettings,
} from "../utils/serializers.js";
import { asyncHandler, HttpError, parseBody } from "../utils/http.js";

export const adminRouter = Router();

// 50 MB cap covers short product-marketing video clips (15-30s typical) while
// still rejecting obviously-wrong payloads. Images comfortably sit well below.
// If a limit change is needed, also update `AddMediaDialog`'s helper copy and
// backend/CLAUDE.md.
// Narrow helper: maps a Prisma unique-constraint violation on Product.slug to
// HttpError(409) with a precise message. Any other Prisma error is rethrown
// untouched so the generic error middleware handles it. Always throws, so TS
// treats code after the call site as unreachable.
function throwIfSlugCollision(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    (error.meta as { target?: string[] | string } | undefined)?.target &&
    String((error.meta as { target?: string[] | string }).target).includes("slug")
  ) {
    throw new HttpError(409, "Slug already taken — pick a different slug.");
  }
  throw error;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const optionalString = z.string().optional().nullable();
const optionalDateTime = z.string().datetime().optional().nullable();
const optionalJsonRecord = z.record(z.any()).optional();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const adminCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(AdminRole).default("EDITOR"),
  status: z.nativeEnum(AdminStatus).default("ACTIVE"),
});

const adminUpdateSchema = z.object({
  email: z.string().email().optional(),
  role: z.nativeEnum(AdminRole).optional(),
  status: z.nativeEnum(AdminStatus).optional(),
});

const adminPasswordSchema = z.object({
  password: z.string().min(8),
});

const mediaCreateSchema = z.object({
  url: z.string().url(),
  altText: optionalString,
  kind: z.nativeEnum(MediaKind).default("IMAGE"),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
});

const mediaUpdateSchema = z.object({
  url: z.string().url().optional(),
  altText: optionalString,
  kind: z.nativeEnum(MediaKind).optional(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
});

const siteSettingsSchema = z.object({
  footerEmail: z.string().email().optional().nullable(),
  footerPhone: optionalString,
  addressLines: z.array(z.string()).optional(),
  newsletterHeading: optionalString,
  newsletterBody: optionalString,
  misc: optionalJsonRecord,
  logoImageId: z.string().optional().nullable(),
});

const categorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  kind: z.nativeEnum(CategoryKind),
});

const productInputSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  shortDescription: optionalString,
  longDescription: optionalString,
  type: z.string().min(1),
  material: z.string().min(1),
  useCase: optionalString,
  priceAmount: z.number().int().nonnegative(),
  currency: z.string().default("INR"),
  status: z.nativeEnum(ProductStatus),
  workflowStatus: z.nativeEnum(ProductWorkflowStatus).optional(),
  releaseDate: optionalDateTime,
  seoTitle: optionalString,
  seoDescription: optionalString,
  imageAlt: optionalString,
  ctaLabel: optionalString,
  metadata: optionalJsonRecord,
  publishedAt: optionalDateTime,
  primaryImageId: z.string().optional().nullable(),
});

const productMediaSchema = z.object({
  primaryImageId: z.string().optional().nullable(),
  items: z.array(
    z.object({
      mediaAssetId: z.string().min(1),
      sortOrder: z.number().int().default(0),
      mediaType: z.nativeEnum(ProductMediaType).default("GALLERY"),
    })
  ),
});

const categoryAssignmentsSchema = z.object({
  assignments: z.array(
    z.object({
      categoryId: z.string().min(1),
      sortOrder: z.number().int().default(0),
    })
  ),
});

const collectionAssignmentsSchema = z.object({
  assignments: z.array(
    z.object({
      collectionId: z.string().min(1),
      sortOrder: z.number().int().default(0),
    })
  ),
});

const bridgePageAssignmentsSchema = z.object({
  assignments: z.array(
    z.object({
      bridgePageId: z.string().min(1),
      sortOrder: z.number().int().default(0),
    })
  ),
});

const productOptionSchema = z.object({
  productId: z.string().min(1),
  code: z.string().min(1),
  label: z.string().min(1),
  selectionMode: z.enum(["SINGLE", "MULTI"]).default("SINGLE"),
  required: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  metadata: optionalJsonRecord,
});

const productOptionValueSchema = z.object({
  productOptionId: z.string().min(1),
  value: z.string().min(1),
  label: z.string().min(1),
  priceDeltaAmount: z.number().int().default(0),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

const bridgePageSchema = z.object({
  slug: z.string().min(1),
  navLabel: z.string().min(1),
  heroEyebrow: z.string().min(1),
  heroTitle: z.string().min(1),
  heroDescription: z.array(z.string()),
  heroImage: z.string().default(""),
  heroImageAlt: z.string().default(""),
  heroImagePosition: optionalString,
  heroQuote: z.string().min(1),
  introEyebrow: optionalString,
  introTitle: z.string().min(1),
  introDescription: z.string().min(1),
  interludeImage: optionalString,
  interludeImageAlt: optionalString,
  productSectionEyebrow: optionalString,
  productSectionTitle: optionalString,
  productSectionDescription: optionalString,
  postCtaTitle: optionalString,
  postCtaDescription: optionalString,
  postCtaPrimaryLabel: optionalString,
  postCtaPrimaryHref: optionalString,
  postCtaSecondaryLabel: optionalString,
  postCtaSecondaryHref: optionalString,
  seoTitle: optionalString,
  seoDescription: optionalString,
  seoFootnote: optionalString,
  content: optionalJsonRecord,
});

const bridgePageProductsSchema = z.object({
  assignments: z.array(
    z.object({
      productId: z.string().min(1),
      sortOrder: z.number().int().default(0),
    })
  ),
});

const articleSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  excerpt: z.string().min(1),
  bodyMarkdown: optionalString,
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  publishedAt: optionalDateTime,
  primaryImageId: z.string().optional().nullable(),
  seoTitle: optionalString,
  seoDescription: optionalString,
});

const retreatSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  detailDescription: z.string().min(1),
  location: z.string().min(1),
  season: z.string().min(1),
  format: z.string().min(1),
  groupSize: z.string().min(1),
  status: z.enum(["DRAFT", "UPCOMING", "INQUIRY_OPEN", "CLOSED"]).default("DRAFT"),
  primaryImageId: z.string().optional().nullable(),
});

const programSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  detailDescription: optionalString,
  durationLabel: optionalString,
  groupSizeLabel: optionalString,
  status: z.enum(["DRAFT", "UPCOMING", "BOOKING_OPEN", "CLOSED"]).default("DRAFT"),
});

const programSessionSchema = z.object({
  programId: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  timezone: z.string().min(1),
  city: z.string().min(1),
  venueName: optionalString,
  capacity: z.number().int().positive(),
  spotsRemaining: z.number().int().nonnegative(),
  status: z.enum(["UPCOMING", "BOOKING_OPEN", "FULL", "CLOSED", "CANCELLED"]).default("UPCOMING"),
});

const collectionSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: optionalString,
  kind: z.nativeEnum(CollectionKind),
});

const leadStatusSchema = z.object({
  status: z.enum(["NEW", "REVIEWED", "CONTACTED", "CLOSED"]),
});

const productInclude = {
  primaryImage: true,
  media: { include: { mediaAsset: true } },
  options: { include: { values: true } },
  collections: { include: { collection: true } },
  categories: { include: { category: true } },
  bridgePages: { include: { bridgePage: true } },
} satisfies Prisma.ProductInclude;

const bridgePageInclude = {
  products: {
    include: {
      product: {
        include: productInclude,
      },
    },
  },
} satisfies Prisma.ShopBridgePageInclude;

function routeParam(req: { params: Record<string, string | string[] | undefined> }, key: string) {
  const value = req.params[key];
  const normalized = Array.isArray(value) ? value[0] : value;

  if (!normalized) {
    throw new HttpError(400, `Missing route param: ${key}`);
  }

  return normalized;
}

function assertSuperAdmin(role?: AdminRole) {
  if (role !== "SUPER_ADMIN") {
    throw new HttpError(403, "Super admin access required");
  }
}

function assertCanManagePublishing(
  role: AdminRole | undefined,
  details: { status?: string | null; publishedAt?: string | null; workflowStatus?: string | null }
) {
  if (role === "SUPER_ADMIN") {
    return;
  }

  if (
    (details.status && details.status !== "DRAFT") ||
    details.publishedAt ||
    (details.workflowStatus && details.workflowStatus !== "DRAFT")
  ) {
    throw new HttpError(403, "Only super admins can publish content");
  }
}

async function ensureAdminUpdateAllowed(currentAdminId: string, targetId: string, nextRole?: AdminRole, nextStatus?: AdminStatus) {
  const targetAdmin = await prisma.admin.findUnique({ where: { id: targetId } });

  if (!targetAdmin) {
    throw new HttpError(404, "Admin not found");
  }

  const resultingRole = nextRole ?? targetAdmin.role;
  const resultingStatus = nextStatus ?? targetAdmin.status;
  const isDowngradingActiveSuper = targetAdmin.role === "SUPER_ADMIN" && (resultingRole !== "SUPER_ADMIN" || resultingStatus !== "ACTIVE");

  if (currentAdminId === targetId && isDowngradingActiveSuper) {
    throw new HttpError(400, "You cannot remove your own super admin access");
  }

  if (isDowngradingActiveSuper) {
    const activeSuperAdminCount = await prisma.admin.count({
      where: {
        role: "SUPER_ADMIN",
        status: "ACTIVE",
      },
    });

    if (activeSuperAdminCount <= 1) {
      throw new HttpError(400, "At least one active super admin must remain");
    }
  }
}

async function ensureAdminExists(adminId: string) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });

  if (!admin || admin.status !== "ACTIVE") {
    throw new HttpError(401, "Unauthorized");
  }

  return admin;
}

adminRouter.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const payload = parseBody(loginSchema, req.body);
    const admin = await prisma.admin.findUnique({ where: { email: payload.email } });

    if (!admin || admin.status !== "ACTIVE") {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await verifyPassword(payload.password, admin.passwordHash);

    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signAdminToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    res.json({
      token,
      admin: serializeAdmin(admin),
    });
  })
);

adminRouter.use(requireAdmin);

adminRouter.get(
  "/auth/me",
  asyncHandler(async (req, res) => {
    const admin = await ensureAdminExists(req.admin!.adminId);
    res.json({ admin: serializeAdmin(admin) });
  })
);

adminRouter.get(
  "/dashboard",
  asyncHandler(async (_req, res) => {
    const [
      products,
      articles,
      retreats,
      programs,
      mediaAssets,
      orderRequests,
      newsletterSubscriptions,
      programReservations,
      retreatInquiries,
      recentOrders,
      recentReservations,
      recentRetreats,
    ] = await prisma.$transaction([
      prisma.product.count(),
      prisma.article.count(),
      prisma.retreat.count(),
      prisma.program.count(),
      prisma.mediaAsset.count(),
      prisma.orderRequest.count(),
      prisma.newsletterSubscription.count(),
      prisma.programReservation.count(),
      prisma.retreatInquiry.count(),
      prisma.orderRequest.findMany({ include: { items: { include: { product: true } } }, orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.programReservation.findMany({ include: { program: true, programSession: true }, orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.retreatInquiry.findMany({ include: { retreat: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    res.json({
      counts: {
        products,
        articles,
        retreats,
        programs,
        mediaAssets,
        orderRequests,
        newsletterSubscriptions,
        programReservations,
        retreatInquiries,
      },
      recent: {
        orderRequests: recentOrders,
        programReservations: recentReservations,
        retreatInquiries: recentRetreats,
      },
    });
  })
);

adminRouter.get(
  "/admins",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (_req, res) => {
    const admins = await prisma.admin.findMany({ orderBy: { createdAt: "asc" } });
    res.json({ items: admins.map(serializeAdmin) });
  })
);

adminRouter.post(
  "/admins",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    const payload = parseBody(adminCreateSchema, req.body);
    const admin = await prisma.admin.create({
      data: {
        email: payload.email,
        passwordHash: await hashPassword(payload.password),
        role: payload.role,
        status: payload.status,
      },
    });

    res.status(201).json({ item: serializeAdmin(admin) });
  })
);

adminRouter.patch(
  "/admins/:id",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    const targetId = routeParam(req, "id");
    const payload = parseBody(adminUpdateSchema, req.body);
    await ensureAdminUpdateAllowed(req.admin!.adminId, targetId, payload.role, payload.status);

    const admin = await prisma.admin.update({
      where: { id: targetId },
      data: {
        ...(payload.email !== undefined ? { email: payload.email } : {}),
        ...(payload.role !== undefined ? { role: payload.role } : {}),
        ...(payload.status !== undefined ? { status: payload.status } : {}),
      },
    });

    res.json({ item: serializeAdmin(admin) });
  })
);

adminRouter.post(
  "/admins/:id/password",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    const targetId = routeParam(req, "id");
    await ensureAdminUpdateAllowed(req.admin!.adminId, targetId);
    const payload = parseBody(adminPasswordSchema, req.body);
    const admin = await prisma.admin.update({
      where: { id: targetId },
      data: {
        passwordHash: await hashPassword(payload.password),
      },
    });

    res.json({ item: serializeAdmin(admin) });
  })
);

adminRouter.get(
  "/media",
  asyncHandler(async (_req, res) => {
    const items = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ items: items.map(serializeMediaAsset) });
  })
);

adminRouter.post(
  "/media",
  asyncHandler(async (req, res) => {
    const payload = parseBody(mediaCreateSchema, req.body);
    const item = await prisma.mediaAsset.create({
      data: {
        url: payload.url,
        altText: payload.altText,
        kind: payload.kind,
        width: payload.width,
        height: payload.height,
      },
    });

    res.status(201).json({ item: serializeMediaAsset(item) });
  })
);

adminRouter.post(
  "/media/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new HttpError(400, "A file is required");
    }

    const kind = req.body.kind && z.nativeEnum(MediaKind).safeParse(req.body.kind).success ? req.body.kind : "IMAGE";
    const uploadResult = await storeUpload({
      buffer: req.file.buffer,
      contentType: req.file.mimetype,
      originalName: req.file.originalname,
    });

    const item = await prisma.mediaAsset.create({
      data: {
        url: uploadResult.url,
        altText: typeof req.body.altText === "string" ? req.body.altText : null,
        kind,
        width: uploadResult.width,
        height: uploadResult.height,
      },
    });

    res.status(201).json({ item: serializeMediaAsset(item) });
  })
);

adminRouter.patch(
  "/media/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(mediaUpdateSchema, req.body);
    const item = await prisma.mediaAsset.update({
      where: { id: routeParam(req, "id") },
      data: {
        ...(payload.url !== undefined ? { url: payload.url } : {}),
        ...(payload.altText !== undefined ? { altText: payload.altText } : {}),
        ...(payload.kind !== undefined ? { kind: payload.kind } : {}),
        ...(payload.width !== undefined ? { width: payload.width } : {}),
        ...(payload.height !== undefined ? { height: payload.height } : {}),
      },
    });

    res.json({ item: serializeMediaAsset(item) });
  })
);

adminRouter.delete(
  "/media/:id",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.mediaAsset.delete({ where: { id: routeParam(req, "id") } });
    res.status(204).send();
  })
);

adminRouter.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    const items = await prisma.productCategory.findMany({ orderBy: { name: "asc" } });
    res.json({ items: items.map(serializeCategory) });
  })
);

adminRouter.post(
  "/categories",
  asyncHandler(async (req, res) => {
    const payload = parseBody(categorySchema, req.body);
    const item = await prisma.productCategory.create({ data: payload });
    res.status(201).json({ item: serializeCategory(item) });
  })
);

adminRouter.patch(
  "/categories/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(categorySchema.partial(), req.body);
    const item = await prisma.productCategory.update({
      where: { id: routeParam(req, "id") },
      data: payload,
    });
    res.json({ item: serializeCategory(item) });
  })
);

adminRouter.delete(
  "/categories/:id",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.productCategory.delete({ where: { id: routeParam(req, "id") } });
    res.status(204).send();
  })
);

adminRouter.get(
  "/products",
  asyncHandler(async (req, res) => {
    const workflowParam = typeof req.query.workflow === "string" ? req.query.workflow : undefined;
    const statusParam = typeof req.query.status === "string" ? req.query.status : undefined;
    const searchParam = typeof req.query.search === "string" ? req.query.search.trim() : undefined;
    const categoryParam = typeof req.query.category === "string" ? req.query.category : undefined;

    const where: Prisma.ProductWhereInput = {};

    if (workflowParam && workflowParam !== "all") {
      const normalized = workflowParam.toUpperCase() as ProductWorkflowStatus;
      if (normalized in ProductWorkflowStatus) {
        where.workflowStatus = normalized;
      }
    }

    if (statusParam) {
      const normalized = statusParam.toUpperCase().replace(/\s+/g, "_") as ProductStatus;
      if (normalized in ProductStatus) {
        where.status = normalized;
      }
    }

    if (searchParam) {
      where.OR = [
        { title: { contains: searchParam, mode: "insensitive" } },
        { slug: { contains: searchParam, mode: "insensitive" } },
      ];
    }

    if (categoryParam) {
      where.categories = { some: { category: { slug: categoryParam } } };
    }

    const items = await prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { updatedAt: "desc" },
    });

    // Counts per workflow bucket for the admin list UI ("All / Draft / Published" tabs).
    const [draftCount, publishedCount] = await Promise.all([
      prisma.product.count({ where: { workflowStatus: "DRAFT" } }),
      prisma.product.count({ where: { workflowStatus: "PUBLISHED" } }),
    ]);

    res.json({
      items: items.map(serializeProduct),
      counts: {
        all: draftCount + publishedCount,
        draft: draftCount,
        published: publishedCount,
      },
    });
  })
);

const productBulkSchema = z.object({
  action: z.enum(["publish", "unpublish", "delete"]),
  ids: z.array(z.string().min(1)).min(1),
});

adminRouter.post(
  "/products/bulk",
  asyncHandler(async (req, res) => {
    const payload = parseBody(productBulkSchema, req.body);

    if (payload.action === "delete") {
      // Deletes are SUPER_ADMIN-only, matching the single-delete route.
      if (req.admin?.role !== "SUPER_ADMIN") {
        throw new HttpError(403, "Only super admins can delete products");
      }
      await prisma.product.deleteMany({ where: { id: { in: payload.ids } } });
      res.json({ ok: true, count: payload.ids.length });
      return;
    }

    // Publish + unpublish require publishing privileges (same as single-product updates).
    assertCanManagePublishing(req.admin?.role, {
      workflowStatus: payload.action === "publish" ? "PUBLISHED" : "DRAFT",
    });

    const now = new Date();

    if (payload.action === "publish") {
      // Stamp publishedAt only for rows that don't have one yet, preserving
      // first-publish semantics. Two-step because Prisma updateMany cannot
      // express "set field only where currently null" inline.
      await prisma.product.updateMany({
        where: { id: { in: payload.ids }, publishedAt: null },
        data: { publishedAt: now },
      });
      await prisma.product.updateMany({
        where: { id: { in: payload.ids } },
        data: { workflowStatus: "PUBLISHED" },
      });
    } else {
      await prisma.product.updateMany({
        where: { id: { in: payload.ids } },
        data: { workflowStatus: "DRAFT" },
      });
    }

    res.json({ ok: true, count: payload.ids.length });
  })
);

adminRouter.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const item = await prisma.product.findUnique({
      where: { id: routeParam(req, "id") },
      include: productInclude,
    });

    if (!item) {
      throw new HttpError(404, "Product not found");
    }

    res.json({ item: serializeProduct(item) });
  })
);

adminRouter.post(
  "/products",
  asyncHandler(async (req, res) => {
    const payload = parseBody(productInputSchema, req.body);
    assertCanManagePublishing(req.admin?.role, {
      publishedAt: payload.publishedAt,
      workflowStatus: payload.workflowStatus,
    });

    const isPublishing = payload.workflowStatus === "PUBLISHED";

    let item;
    try {
      item = await prisma.product.create({
        data: {
          slug: payload.slug,
          title: payload.title,
          shortDescription: payload.shortDescription,
          longDescription: payload.longDescription,
          type: payload.type,
          material: payload.material,
          useCase: payload.useCase,
          priceAmount: payload.priceAmount,
          currency: payload.currency,
          status: payload.status,
          workflowStatus: payload.workflowStatus ?? "DRAFT",
          releaseDate: payload.releaseDate ? new Date(payload.releaseDate) : null,
          seoTitle: payload.seoTitle,
          seoDescription: payload.seoDescription,
          imageAlt: payload.imageAlt,
          ctaLabel: payload.ctaLabel,
          metadataJson: payload.metadata,
          // Auto-stamp publishedAt on first publish if not explicitly supplied.
          publishedAt: payload.publishedAt
            ? new Date(payload.publishedAt)
            : isPublishing
              ? new Date()
              : null,
          primaryImageId: payload.primaryImageId,
        },
        include: productInclude,
      });
    } catch (error) {
      throwIfSlugCollision(error);
    }

    res.status(201).json({ item: serializeProduct(item) });
  })
);

adminRouter.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(productInputSchema.partial(), req.body);
    assertCanManagePublishing(req.admin?.role, {
      publishedAt: payload.publishedAt ?? undefined,
      workflowStatus: payload.workflowStatus ?? undefined,
    });

    const id = routeParam(req, "id")!;

    // If caller is transitioning to PUBLISHED and did not explicitly supply
    // publishedAt, stamp it with now() on first publish (leave untouched if
    // the product was already published before).
    let publishedAtUpdate: Prisma.ProductUpdateInput["publishedAt"] = undefined;
    if (payload.publishedAt !== undefined) {
      publishedAtUpdate = payload.publishedAt ? new Date(payload.publishedAt) : null;
    } else if (payload.workflowStatus === "PUBLISHED") {
      const existing = await prisma.product.findUnique({
        where: { id },
        select: { publishedAt: true },
      });
      if (existing && !existing.publishedAt) {
        publishedAtUpdate = new Date();
      }
    }

    let item;
    try {
      item = await prisma.product.update({
        where: { id },
        data: {
          ...(payload.slug !== undefined ? { slug: payload.slug } : {}),
          ...(payload.title !== undefined ? { title: payload.title } : {}),
          ...(payload.shortDescription !== undefined ? { shortDescription: payload.shortDescription } : {}),
          ...(payload.longDescription !== undefined ? { longDescription: payload.longDescription } : {}),
          ...(payload.type !== undefined ? { type: payload.type } : {}),
          ...(payload.material !== undefined ? { material: payload.material } : {}),
          ...(payload.useCase !== undefined ? { useCase: payload.useCase } : {}),
          ...(payload.priceAmount !== undefined ? { priceAmount: payload.priceAmount } : {}),
          ...(payload.currency !== undefined ? { currency: payload.currency } : {}),
          ...(payload.status !== undefined ? { status: payload.status } : {}),
          ...(payload.workflowStatus !== undefined ? { workflowStatus: payload.workflowStatus } : {}),
          ...(payload.releaseDate !== undefined ? { releaseDate: payload.releaseDate ? new Date(payload.releaseDate) : null } : {}),
          ...(payload.seoTitle !== undefined ? { seoTitle: payload.seoTitle } : {}),
          ...(payload.seoDescription !== undefined ? { seoDescription: payload.seoDescription } : {}),
          ...(payload.imageAlt !== undefined ? { imageAlt: payload.imageAlt } : {}),
          ...(payload.ctaLabel !== undefined ? { ctaLabel: payload.ctaLabel } : {}),
          ...(payload.metadata !== undefined ? { metadataJson: payload.metadata } : {}),
          ...(publishedAtUpdate !== undefined ? { publishedAt: publishedAtUpdate } : {}),
          ...(payload.primaryImageId !== undefined ? { primaryImageId: payload.primaryImageId } : {}),
        },
        include: productInclude,
      });
    } catch (error) {
      throwIfSlugCollision(error);
    }

    res.json({ item: serializeProduct(item) });
  })
);

adminRouter.delete(
  "/products/:id",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.product.delete({ where: { id: routeParam(req, "id") } });
    res.status(204).send();
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// One-shot "sync new products from frontend registry" endpoint.
//
// Safe-by-design: only CREATES products whose slugs don't already exist in the
// DB. Existing admin-edited products are never touched. Caller posts the
// registry payload (the frontend already imports `shopProducts` client-side,
// so this avoids a cross-workspace backend import). Everything wrapped in a
// single Prisma $transaction — atomic either all new slugs land or none.
//
// Guardrail notes: loop is bounded by Zod .max(200); no retries, no polling,
// no background work, no external calls.
// ─────────────────────────────────────────────────────────────────────────────

const syncProductInput = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1),
  shortDescription: z.string().nullable().optional(),
  longDescription: z.string().nullable().optional(),
  type: z.string().min(1),
  material: z.string().min(1),
  useCase: z.string().nullable().optional(),
  priceAmount: z.number().int().nonnegative(),
  image: z.string().min(1),
  imageAlt: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  bridgeCategory: z.string().nullable().optional(),
});

const syncRegistrySchema = z.object({
  products: z.array(syncProductInput).max(200),
});

function inferCollectionKindsForSyncItem(
  item: z.infer<typeof syncProductInput>,
): CollectionKind[] {
  const kinds = new Set<CollectionKind>();
  if (item.slug.includes("hemanta") || item.image.includes("Hemanta")) {
    kinds.add(CollectionKind.HEMANTA);
  }
  if (item.slug.includes("season") || item.image.includes("Seasonal")) {
    kinds.add(CollectionKind.SEASONAL_DROP);
  }
  if (kinds.size === 0) {
    kinds.add(CollectionKind.CORE_COLLECTION);
  }
  return Array.from(kinds);
}

function normalizeSyncStatus(value?: string | null): ProductStatus {
  if (!value) return ProductStatus.IN_STOCK;
  const normalized = value.toUpperCase().replace(/\s+/g, "_").replace(/\//g, "_");
  return ProductStatus[normalized as keyof typeof ProductStatus] ?? ProductStatus.IN_STOCK;
}

adminRouter.post(
  "/products/sync-new",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    const payload = parseBody(syncRegistrySchema, req.body);

    // Three up-front queries so the transaction body has everything it needs
    // by id without re-querying per item.
    const [existing, bridgePages, collections] = await Promise.all([
      prisma.product.findMany({ select: { slug: true } }),
      prisma.shopBridgePage.findMany({ select: { id: true, slug: true } }),
      prisma.collection.findMany({ select: { id: true, kind: true } }),
    ]);

    const existingSlugs = new Set(existing.map((p) => p.slug));
    const bridgeBySlug = new Map(bridgePages.map((b) => [b.slug, b.id]));
    const collectionByKind = new Map(collections.map((c) => [c.kind, c.id]));

    const toCreate = payload.products.filter((item) => !existingSlugs.has(item.slug));
    const skipped = payload.products
      .filter((item) => existingSlugs.has(item.slug))
      .map((item) => item.slug);

    if (toCreate.length === 0) {
      res.json({
        created: [],
        skipped,
        totals: { created: 0, skipped: skipped.length },
      });
      return;
    }

    // Atomic: any failure rolls the entire batch back — no partial catalogue.
    const created = await prisma.$transaction(async (tx) => {
      const createdSlugs: string[] = [];

      for (const item of toCreate) {
        const mediaAsset = await tx.mediaAsset.upsert({
          where: { url: item.image },
          update: { altText: item.imageAlt ?? undefined },
          create: { url: item.image, altText: item.imageAlt ?? undefined },
        });

        const product = await tx.product.create({
          data: {
            slug: item.slug,
            title: item.title,
            shortDescription: item.shortDescription ?? null,
            longDescription: item.longDescription ?? null,
            type: item.type,
            material: item.material,
            useCase: item.useCase ?? null,
            priceAmount: item.priceAmount,
            currency: "INR",
            status: normalizeSyncStatus(item.status),
            workflowStatus: "PUBLISHED",
            imageAlt: item.imageAlt ?? null,
            primaryImageId: mediaAsset.id,
            publishedAt: new Date(),
          },
        });

        if (item.bridgeCategory) {
          const bridgePageId = bridgeBySlug.get(item.bridgeCategory);
          if (bridgePageId) {
            await tx.shopBridgePageProduct.create({
              data: { bridgePageId, productId: product.id },
            });
          }
        }

        for (const kind of inferCollectionKindsForSyncItem(item)) {
          const collectionId = collectionByKind.get(kind);
          if (collectionId) {
            await tx.collectionProductLink.create({
              data: { collectionId, productId: product.id },
            });
          }
        }

        createdSlugs.push(item.slug);
      }

      return createdSlugs;
    });

    res.json({
      created,
      skipped,
      totals: { created: created.length, skipped: skipped.length },
    });
  })
);

adminRouter.put(
  "/products/:id/media",
  asyncHandler(async (req, res) => {
    const payload = parseBody(productMediaSchema, req.body);
    const productId = routeParam(req, "id");

    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: {
          primaryImageId: payload.primaryImageId ?? null,
        },
      }),
      prisma.productMedia.deleteMany({ where: { productId } }),
      ...(payload.items.length > 0
        ? [
            prisma.productMedia.createMany({
              data: payload.items.map((item) => ({
                productId,
                mediaAssetId: item.mediaAssetId,
                sortOrder: item.sortOrder,
                mediaType: item.mediaType,
              })),
            }),
          ]
        : []),
    ]);

    const item = await prisma.product.findUnique({
      where: { id: productId },
      include: productInclude,
    });

    if (!item) {
      throw new HttpError(404, "Product not found");
    }

    res.json({ item: serializeProduct(item) });
  })
);

adminRouter.put(
  "/products/:id/categories",
  asyncHandler(async (req, res) => {
    const payload = parseBody(categoryAssignmentsSchema, req.body);
    const productId = routeParam(req, "id");

    await prisma.$transaction([
      prisma.productCategoryMembership.deleteMany({ where: { productId } }),
      ...(payload.assignments.length > 0
        ? [
            prisma.productCategoryMembership.createMany({
              data: payload.assignments.map((assignment) => ({
                productId,
                categoryId: assignment.categoryId,
                sortOrder: assignment.sortOrder,
              })),
            }),
          ]
        : []),
    ]);

    const item = await prisma.product.findUnique({
      where: { id: productId },
      include: productInclude,
    });

    if (!item) {
      throw new HttpError(404, "Product not found");
    }

    res.json({ item: serializeProduct(item) });
  })
);

adminRouter.put(
  "/products/:id/collections",
  asyncHandler(async (req, res) => {
    const payload = parseBody(collectionAssignmentsSchema, req.body);
    const productId = routeParam(req, "id");

    await prisma.$transaction([
      prisma.collectionProductLink.deleteMany({ where: { productId } }),
      ...(payload.assignments.length > 0
        ? [
            prisma.collectionProductLink.createMany({
              data: payload.assignments.map((assignment) => ({
                productId,
                collectionId: assignment.collectionId,
                sortOrder: assignment.sortOrder,
              })),
            }),
          ]
        : []),
    ]);

    const item = await prisma.product.findUnique({
      where: { id: productId },
      include: productInclude,
    });

    if (!item) {
      throw new HttpError(404, "Product not found");
    }

    res.json({ item: serializeProduct(item) });
  })
);

adminRouter.put(
  "/products/:id/bridge-pages",
  asyncHandler(async (req, res) => {
    const payload = parseBody(bridgePageAssignmentsSchema, req.body);
    const productId = routeParam(req, "id");

    await prisma.$transaction([
      prisma.shopBridgePageProduct.deleteMany({ where: { productId } }),
      ...(payload.assignments.length > 0
        ? [
            prisma.shopBridgePageProduct.createMany({
              data: payload.assignments.map((assignment) => ({
                productId,
                bridgePageId: assignment.bridgePageId,
                sortOrder: assignment.sortOrder,
              })),
            }),
          ]
        : []),
    ]);

    const item = await prisma.product.findUnique({
      where: { id: productId },
      include: productInclude,
    });

    if (!item) {
      throw new HttpError(404, "Product not found");
    }

    res.json({ item: serializeProduct(item) });
  })
);

adminRouter.post(
  "/product-options",
  asyncHandler(async (req, res) => {
    const payload = parseBody(productOptionSchema, req.body);
    const item = await prisma.productOption.create({
      data: {
        productId: payload.productId,
        code: payload.code,
        label: payload.label,
        selectionMode: payload.selectionMode,
        required: payload.required,
        sortOrder: payload.sortOrder,
        metadataJson: payload.metadata,
      },
      include: { values: true },
    });

    res.status(201).json({ item });
  })
);

adminRouter.patch(
  "/product-options/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(productOptionSchema.partial(), req.body);
    const item = await prisma.productOption.update({
      where: { id: routeParam(req, "id") },
      data: {
        ...(payload.productId !== undefined ? { productId: payload.productId } : {}),
        ...(payload.code !== undefined ? { code: payload.code } : {}),
        ...(payload.label !== undefined ? { label: payload.label } : {}),
        ...(payload.selectionMode !== undefined ? { selectionMode: payload.selectionMode } : {}),
        ...(payload.required !== undefined ? { required: payload.required } : {}),
        ...(payload.sortOrder !== undefined ? { sortOrder: payload.sortOrder } : {}),
        ...(payload.metadata !== undefined ? { metadataJson: payload.metadata } : {}),
      },
      include: { values: true },
    });

    res.json({ item });
  })
);

adminRouter.delete(
  "/product-options/:id",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.productOption.delete({ where: { id: routeParam(req, "id") } });
    res.status(204).send();
  })
);

adminRouter.post(
  "/product-option-values",
  asyncHandler(async (req, res) => {
    const payload = parseBody(productOptionValueSchema, req.body);
    const item = await prisma.productOptionValue.create({ data: payload });
    res.status(201).json({ item });
  })
);

adminRouter.patch(
  "/product-option-values/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(productOptionValueSchema.partial(), req.body);
    const item = await prisma.productOptionValue.update({
      where: { id: routeParam(req, "id") },
      data: payload,
    });
    res.json({ item });
  })
);

adminRouter.delete(
  "/product-option-values/:id",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.productOptionValue.delete({ where: { id: routeParam(req, "id") } });
    res.status(204).send();
  })
);

adminRouter.get(
  "/bridge-pages",
  asyncHandler(async (_req, res) => {
    const items = await prisma.shopBridgePage.findMany({
      include: bridgePageInclude,
      orderBy: { navLabel: "asc" },
    });
    res.json({ items: items.map(serializeBridgePage) });
  })
);

adminRouter.get(
  "/bridge-pages/:id",
  asyncHandler(async (req, res) => {
    const item = await prisma.shopBridgePage.findUnique({
      where: { id: routeParam(req, "id") },
      include: bridgePageInclude,
    });

    if (!item) {
      throw new HttpError(404, "Bridge page not found");
    }

    res.json({ item: serializeBridgePage(item) });
  })
);

adminRouter.post(
  "/bridge-pages",
  asyncHandler(async (req, res) => {
    const payload = parseBody(bridgePageSchema, req.body);
    const item = await prisma.shopBridgePage.create({
      data: {
        slug: payload.slug,
        navLabel: payload.navLabel,
        heroEyebrow: payload.heroEyebrow,
        heroTitle: payload.heroTitle,
        heroDescriptionJson: payload.heroDescription,
        heroImage: payload.heroImage ?? "",
        heroImageAlt: payload.heroImageAlt ?? "",
        heroImagePosition: payload.heroImagePosition,
        heroQuote: payload.heroQuote,
        introEyebrow: payload.introEyebrow,
        introTitle: payload.introTitle,
        introDescription: payload.introDescription,
        interludeImage: payload.interludeImage,
        interludeImageAlt: payload.interludeImageAlt,
        productSectionEyebrow: payload.productSectionEyebrow,
        productSectionTitle: payload.productSectionTitle,
        productSectionDescription: payload.productSectionDescription,
        postCtaTitle: payload.postCtaTitle,
        postCtaDescription: payload.postCtaDescription,
        postCtaPrimaryLabel: payload.postCtaPrimaryLabel,
        postCtaPrimaryHref: payload.postCtaPrimaryHref,
        postCtaSecondaryLabel: payload.postCtaSecondaryLabel,
        postCtaSecondaryHref: payload.postCtaSecondaryHref,
        seoTitle: payload.seoTitle,
        seoDescription: payload.seoDescription,
        seoFootnote: payload.seoFootnote,
        contentJson: payload.content,
      },
      include: bridgePageInclude,
    });

    res.status(201).json({ item: serializeBridgePage(item) });
  })
);

adminRouter.patch(
  "/bridge-pages/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(bridgePageSchema.partial(), req.body);
    const item = await prisma.shopBridgePage.update({
      where: { id: routeParam(req, "id") },
      data: {
        ...(payload.slug !== undefined ? { slug: payload.slug } : {}),
        ...(payload.navLabel !== undefined ? { navLabel: payload.navLabel } : {}),
        ...(payload.heroEyebrow !== undefined ? { heroEyebrow: payload.heroEyebrow } : {}),
        ...(payload.heroTitle !== undefined ? { heroTitle: payload.heroTitle } : {}),
        ...(payload.heroDescription !== undefined ? { heroDescriptionJson: payload.heroDescription } : {}),
        ...(payload.heroImage !== undefined ? { heroImage: payload.heroImage } : {}),
        ...(payload.heroImageAlt !== undefined ? { heroImageAlt: payload.heroImageAlt } : {}),
        ...(payload.heroImagePosition !== undefined ? { heroImagePosition: payload.heroImagePosition } : {}),
        ...(payload.heroQuote !== undefined ? { heroQuote: payload.heroQuote } : {}),
        ...(payload.introEyebrow !== undefined ? { introEyebrow: payload.introEyebrow } : {}),
        ...(payload.introTitle !== undefined ? { introTitle: payload.introTitle } : {}),
        ...(payload.introDescription !== undefined ? { introDescription: payload.introDescription } : {}),
        ...(payload.interludeImage !== undefined ? { interludeImage: payload.interludeImage } : {}),
        ...(payload.interludeImageAlt !== undefined ? { interludeImageAlt: payload.interludeImageAlt } : {}),
        ...(payload.productSectionEyebrow !== undefined ? { productSectionEyebrow: payload.productSectionEyebrow } : {}),
        ...(payload.productSectionTitle !== undefined ? { productSectionTitle: payload.productSectionTitle } : {}),
        ...(payload.productSectionDescription !== undefined ? { productSectionDescription: payload.productSectionDescription } : {}),
        ...(payload.postCtaTitle !== undefined ? { postCtaTitle: payload.postCtaTitle } : {}),
        ...(payload.postCtaDescription !== undefined ? { postCtaDescription: payload.postCtaDescription } : {}),
        ...(payload.postCtaPrimaryLabel !== undefined ? { postCtaPrimaryLabel: payload.postCtaPrimaryLabel } : {}),
        ...(payload.postCtaPrimaryHref !== undefined ? { postCtaPrimaryHref: payload.postCtaPrimaryHref } : {}),
        ...(payload.postCtaSecondaryLabel !== undefined ? { postCtaSecondaryLabel: payload.postCtaSecondaryLabel } : {}),
        ...(payload.postCtaSecondaryHref !== undefined ? { postCtaSecondaryHref: payload.postCtaSecondaryHref } : {}),
        ...(payload.seoTitle !== undefined ? { seoTitle: payload.seoTitle } : {}),
        ...(payload.seoDescription !== undefined ? { seoDescription: payload.seoDescription } : {}),
        ...(payload.seoFootnote !== undefined ? { seoFootnote: payload.seoFootnote } : {}),
        ...(payload.content !== undefined ? { contentJson: payload.content } : {}),
      },
      include: bridgePageInclude,
    });

    res.json({ item: serializeBridgePage(item) });
  })
);

adminRouter.put(
  "/bridge-pages/:id/products",
  asyncHandler(async (req, res) => {
    const payload = parseBody(bridgePageProductsSchema, req.body);
    const bridgePageId = routeParam(req, "id");

    await prisma.$transaction([
      prisma.shopBridgePageProduct.deleteMany({ where: { bridgePageId } }),
      ...(payload.assignments.length > 0
        ? [
            prisma.shopBridgePageProduct.createMany({
              data: payload.assignments.map((assignment) => ({
                bridgePageId,
                productId: assignment.productId,
                sortOrder: assignment.sortOrder,
              })),
            }),
          ]
        : []),
    ]);

    const item = await prisma.shopBridgePage.findUnique({
      where: { id: bridgePageId },
      include: bridgePageInclude,
    });

    if (!item) {
      throw new HttpError(404, "Bridge page not found");
    }

    res.json({ item: serializeBridgePage(item) });
  })
);

adminRouter.delete(
  "/bridge-pages/:id",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.shopBridgePage.delete({ where: { id: routeParam(req, "id") } });
    res.status(204).send();
  })
);

adminRouter.get(
  "/articles",
  asyncHandler(async (_req, res) => {
    const items = await prisma.article.findMany({
      include: { primaryImage: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    res.json({ items: items.map(serializeArticle) });
  })
);

adminRouter.post(
  "/articles",
  asyncHandler(async (req, res) => {
    const payload = parseBody(articleSchema, req.body);
    assertCanManagePublishing(req.admin?.role, payload);
    const item = await prisma.article.create({
      data: {
        ...payload,
        publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : null,
      },
      include: { primaryImage: true },
    });
    res.status(201).json({ item: serializeArticle(item) });
  })
);

adminRouter.patch(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(articleSchema.partial(), req.body);
    assertCanManagePublishing(req.admin?.role, {
      status: payload.status,
      publishedAt: payload.publishedAt ?? undefined,
    });
    const item = await prisma.article.update({
      where: { id: routeParam(req, "id") },
      data: {
        ...payload,
        ...(payload.publishedAt !== undefined ? { publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : null } : {}),
      },
      include: { primaryImage: true },
    });
    res.json({ item: serializeArticle(item) });
  })
);

adminRouter.delete(
  "/articles/:id",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.article.delete({ where: { id: routeParam(req, "id") } });
    res.status(204).send();
  })
);

adminRouter.get(
  "/retreats",
  asyncHandler(async (_req, res) => {
    const items = await prisma.retreat.findMany({ include: { primaryImage: true }, orderBy: { name: "asc" } });
    res.json({ items: items.map(serializeRetreat) });
  })
);

adminRouter.post(
  "/retreats",
  asyncHandler(async (req, res) => {
    const payload = parseBody(retreatSchema, req.body);
    assertCanManagePublishing(req.admin?.role, { status: payload.status });
    const item = await prisma.retreat.create({
      data: payload,
      include: { primaryImage: true },
    });
    res.status(201).json({ item: serializeRetreat(item) });
  })
);

adminRouter.patch(
  "/retreats/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(retreatSchema.partial(), req.body);
    assertCanManagePublishing(req.admin?.role, { status: payload.status });
    const item = await prisma.retreat.update({
      where: { id: routeParam(req, "id") },
      data: payload,
      include: { primaryImage: true },
    });
    res.json({ item: serializeRetreat(item) });
  })
);

adminRouter.delete(
  "/retreats/:id",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.retreat.delete({ where: { id: routeParam(req, "id") } });
    res.status(204).send();
  })
);

adminRouter.get(
  "/programs",
  asyncHandler(async (_req, res) => {
    const items = await prisma.program.findMany({ include: { sessions: true }, orderBy: { name: "asc" } });
    res.json({ items: items.map(serializeProgram) });
  })
);

adminRouter.post(
  "/programs",
  asyncHandler(async (req, res) => {
    const payload = parseBody(programSchema, req.body);
    assertCanManagePublishing(req.admin?.role, { status: payload.status });
    const item = await prisma.program.create({
      data: payload,
      include: { sessions: true },
    });
    res.status(201).json({ item: serializeProgram(item) });
  })
);

adminRouter.patch(
  "/programs/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(programSchema.partial(), req.body);
    assertCanManagePublishing(req.admin?.role, { status: payload.status });
    const item = await prisma.program.update({
      where: { id: routeParam(req, "id") },
      data: payload,
      include: { sessions: true },
    });
    res.json({ item: serializeProgram(item) });
  })
);

adminRouter.delete(
  "/programs/:id",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.program.delete({ where: { id: routeParam(req, "id") } });
    res.status(204).send();
  })
);

adminRouter.get(
  "/program-sessions",
  asyncHandler(async (_req, res) => {
    const items = await prisma.programSession.findMany({
      include: { program: true },
      orderBy: { startsAt: "asc" },
    });
    res.json({ items });
  })
);

adminRouter.post(
  "/program-sessions",
  asyncHandler(async (req, res) => {
    const payload = parseBody(programSessionSchema, req.body);
    const item = await prisma.programSession.create({
      data: {
        ...payload,
        startsAt: new Date(payload.startsAt),
        endsAt: new Date(payload.endsAt),
      },
      include: { program: true },
    });
    res.status(201).json({ item });
  })
);

adminRouter.patch(
  "/program-sessions/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(programSessionSchema.partial(), req.body);
    const item = await prisma.programSession.update({
      where: { id: routeParam(req, "id") },
      data: {
        ...(payload.programId !== undefined ? { programId: payload.programId } : {}),
        ...(payload.startsAt !== undefined ? { startsAt: new Date(payload.startsAt) } : {}),
        ...(payload.endsAt !== undefined ? { endsAt: new Date(payload.endsAt) } : {}),
        ...(payload.timezone !== undefined ? { timezone: payload.timezone } : {}),
        ...(payload.city !== undefined ? { city: payload.city } : {}),
        ...(payload.venueName !== undefined ? { venueName: payload.venueName } : {}),
        ...(payload.capacity !== undefined ? { capacity: payload.capacity } : {}),
        ...(payload.spotsRemaining !== undefined ? { spotsRemaining: payload.spotsRemaining } : {}),
        ...(payload.status !== undefined ? { status: payload.status } : {}),
      },
      include: { program: true },
    });
    res.json({ item });
  })
);

adminRouter.delete(
  "/program-sessions/:id",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.programSession.delete({ where: { id: routeParam(req, "id") } });
    res.status(204).send();
  })
);

adminRouter.get(
  "/collections",
  asyncHandler(async (_req, res) => {
    const items = await prisma.collection.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
    res.json({ items: items.map(serializeCollection) });
  })
);

adminRouter.post(
  "/collections",
  asyncHandler(async (req, res) => {
    const payload = parseBody(collectionSchema, req.body);
    const item = await prisma.collection.create({ data: payload, include: { products: { include: { product: true } } } });
    res.status(201).json({ item: serializeCollection(item) });
  })
);

adminRouter.patch(
  "/collections/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(collectionSchema.partial(), req.body);
    const item = await prisma.collection.update({
      where: { id: routeParam(req, "id") },
      data: payload,
      include: { products: { include: { product: true } } },
    });
    res.json({ item: serializeCollection(item) });
  })
);

adminRouter.delete(
  "/collections/:id",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.collection.delete({ where: { id: routeParam(req, "id") } });
    res.status(204).send();
  })
);

adminRouter.get(
  "/site-settings",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (_req, res) => {
    const item = await prisma.siteSetting.findUnique({
      where: { key: "default" },
      include: { logoImage: true },
    });

    if (!item) {
      throw new HttpError(404, "Site settings not found");
    }

    res.json({ item: serializeSiteSettings(item) });
  })
);

adminRouter.put(
  "/site-settings",
  requireAdminRole("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    const payload = parseBody(siteSettingsSchema, req.body);
    const item = await prisma.siteSetting.upsert({
      where: { key: "default" },
      update: {
        footerEmail: payload.footerEmail,
        footerPhone: payload.footerPhone,
        addressLinesJson: payload.addressLines,
        newsletterHeading: payload.newsletterHeading,
        newsletterBody: payload.newsletterBody,
        miscJson: payload.misc,
        logoImageId: payload.logoImageId,
      },
      create: {
        key: "default",
        footerEmail: payload.footerEmail,
        footerPhone: payload.footerPhone,
        addressLinesJson: payload.addressLines,
        newsletterHeading: payload.newsletterHeading,
        newsletterBody: payload.newsletterBody,
        miscJson: payload.misc,
        logoImageId: payload.logoImageId,
      },
      include: { logoImage: true },
    });

    res.json({ item: serializeSiteSettings(item) });
  })
);

adminRouter.get(
  "/lead/order-requests",
  asyncHandler(async (_req, res) => {
    const items = await prisma.orderRequest.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ items });
  })
);

adminRouter.patch(
  "/lead/order-requests/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(leadStatusSchema, req.body);
    const item = await prisma.orderRequest.update({
      where: { id: routeParam(req, "id") },
      data: { status: payload.status },
    });
    res.json({ item });
  })
);

adminRouter.get(
  "/lead/newsletter-subscriptions",
  asyncHandler(async (_req, res) => {
    const items = await prisma.newsletterSubscription.findMany({
      orderBy: { subscribedAt: "desc" },
    });
    res.json({ items });
  })
);

adminRouter.get(
  "/lead/program-reservations",
  asyncHandler(async (_req, res) => {
    const items = await prisma.programReservation.findMany({
      include: { program: true, programSession: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ items });
  })
);

adminRouter.patch(
  "/lead/program-reservations/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(leadStatusSchema, req.body);
    const item = await prisma.programReservation.update({
      where: { id: routeParam(req, "id") },
      data: { status: payload.status },
    });
    res.json({ item });
  })
);

adminRouter.get(
  "/lead/retreat-inquiries",
  asyncHandler(async (_req, res) => {
    const items = await prisma.retreatInquiry.findMany({
      include: { retreat: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ items });
  })
);

adminRouter.patch(
  "/lead/retreat-inquiries/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(leadStatusSchema, req.body);
    const item = await prisma.retreatInquiry.update({
      where: { id: routeParam(req, "id") },
      data: { status: payload.status },
    });
    res.json({ item });
  })
);

adminRouter.get(
  "/lead/product-notifications",
  asyncHandler(async (_req, res) => {
    const items = await prisma.productNotification.findMany({
      include: { product: { select: { id: true, slug: true, title: true, status: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ items: items.map(serializeProductNotification) });
  })
);

adminRouter.patch(
  "/lead/product-notifications/:id",
  asyncHandler(async (req, res) => {
    const payload = parseBody(leadStatusSchema, req.body);
    const item = await prisma.productNotification.update({
      where: { id: routeParam(req, "id") },
      data: { status: payload.status },
      include: { product: { select: { id: true, slug: true, title: true, status: true } } },
    });
    res.json({ item: serializeProductNotification(item) });
  })
);

adminRouter.use((_req, res) => {
  res.status(404).json({ error: "Admin endpoint not found" });
});
