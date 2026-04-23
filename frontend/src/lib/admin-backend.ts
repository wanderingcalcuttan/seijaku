import "server-only";

import { redirect } from "next/navigation";

import { getAdminSessionToken } from "@/src/lib/admin-session";
import { backendJson } from "@/src/lib/backend";

export async function adminBackendJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAdminSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  try {
    return await backendJson<T>(`/admin${path.startsWith("/") ? path : `/${path}`}`, {
      ...init,
      cache: "no-store",
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.toLowerCase().includes("unauthorized")) {
      redirect("/admin/login");
    }

    throw error;
  }
}

