import { NextResponse } from "next/server";

import { applyAdminSessionCookie, clearAdminSessionCookie, getCurrentAdminIdentity } from "@/src/lib/admin-session";
import { backendFetch } from "@/src/lib/backend";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await backendFetch("/admin/auth/login", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();

  if (!response.ok) {
    return NextResponse.json(payload, { status: response.status });
  }

  const nextResponse = NextResponse.json(payload);
  return applyAdminSessionCookie(nextResponse, payload.token as string);
}

export async function GET() {
  const session = await getCurrentAdminIdentity();

  if (!session) {
    return clearAdminSessionCookie(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  return NextResponse.json({ admin: session.admin });
}

export async function DELETE() {
  return clearAdminSessionCookie(NextResponse.json({ ok: true }));
}
