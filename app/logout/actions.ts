"use server";

import { redirect } from "next/navigation";
import { backend } from "@/lib/backend";
import { clearSessionToken } from "@/lib/session";

export async function logoutAction(): Promise<void> {
  await backend<unknown>("/auth/logout", { method: "POST" });
  await clearSessionToken();
  redirect("/login");
}
