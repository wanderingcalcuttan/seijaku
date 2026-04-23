import crypto from "node:crypto";

import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { isCacheTag, listCacheTags } from "@/src/lib/cache-tags";

export const runtime = "nodejs";

type RevalidateBody = {
  tags?: string[];
  paths?: string[];
};

function timingSafeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  const provided = request.headers.get("x-revalidate-secret") ?? "";
  if (!timingSafeEquals(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: RevalidateBody;
  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawTags = Array.isArray(body.tags) ? body.tags : [];
  const rawPaths = Array.isArray(body.paths) ? body.paths : [];

  const invalidTags = rawTags.filter((tag) => !isCacheTag(tag));
  if (invalidTags.length > 0) {
    return NextResponse.json(
      {
        error: "Unknown cache tag(s)",
        invalidTags,
        knownTags: listCacheTags(),
      },
      { status: 400 },
    );
  }

  for (const tag of rawTags) {
    revalidateTag(tag, "default");
  }
  for (const path of rawPaths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: { tags: rawTags, paths: rawPaths },
  });
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
