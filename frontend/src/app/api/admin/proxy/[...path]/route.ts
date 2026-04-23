import { NextRequest, NextResponse } from "next/server";

import { clearAdminSessionCookie, getAdminSessionToken } from "@/src/lib/admin-session";
import { getBackendBaseUrl } from "@/src/lib/backend";
import { tagsForAdminWrite, type CacheTag } from "@/src/lib/cache-tags";

const REVALIDATE_TIMEOUT_MS = 2000;

function resolveSelfBaseUrl(request: NextRequest): string {
  const envBase = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (envBase) {
    return envBase.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return request.nextUrl.origin;
}

async function fireRevalidate(request: NextRequest, tags: CacheTag[]): Promise<void> {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    console.warn("[admin-proxy] skipping revalidate: REVALIDATE_SECRET not set", { tags });
    return;
  }

  const url = `${resolveSelfBaseUrl(request)}/api/revalidate`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REVALIDATE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ tags }),
    });
    if (!response.ok) {
      console.warn("[admin-proxy] revalidate returned non-2xx", {
        tags,
        status: response.status,
      });
    }
  } catch (err) {
    console.warn("[admin-proxy] revalidate failed", { tags, err });
  } finally {
    clearTimeout(timeout);
  }
}

async function proxyRequest(request: NextRequest, params: { path?: string[] }) {
  const token = await getAdminSessionToken();

  if (!token) {
    return clearAdminSessionCookie(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  const targetPath = params.path?.join("/") ?? "";
  const targetUrl = `${getBackendBaseUrl()}/admin/${targetPath}${request.nextUrl.search}`;
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");

  let body: BodyInit | undefined;
  const contentType = request.headers.get("content-type");

  if (contentType?.includes("multipart/form-data")) {
    const incomingFormData = await request.formData();
    const outgoingFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      outgoingFormData.append(key, value);
    }

    body = outgoingFormData;
  } else if (request.method !== "GET" && request.method !== "HEAD") {
    const text = await request.text();
    if (text) {
      body = text;
      if (contentType) {
        headers.set("Content-Type", contentType);
      }
    }
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  const responseText = await response.text();
  const nextResponse = new NextResponse(responseText, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });

  if (response.status === 401) {
    return clearAdminSessionCookie(nextResponse);
  }

  const isMutation =
    request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS";
  if (isMutation && response.ok) {
    const tags = tagsForAdminWrite(targetPath);
    if (tags.length > 0) {
      await fireRevalidate(request, tags);
    }
  }

  return nextResponse;
}

export async function GET(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return proxyRequest(request, await context.params);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return proxyRequest(request, await context.params);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return proxyRequest(request, await context.params);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return proxyRequest(request, await context.params);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return proxyRequest(request, await context.params);
}
