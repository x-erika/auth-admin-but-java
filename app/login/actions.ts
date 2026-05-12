"use server";

import { redirect } from "next/navigation";
import { backend } from "@/lib/backend";
import { setSessionToken } from "@/lib/session";
import type { LoginResponse } from "@/lib/types";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const result = await backend<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    skipAuth: true,
  });

  if (!result.ok) {
    return { error: result.error || "Login failed" };
  }

  if (!result.data.user.roles.includes("admin")) {
    return { error: "This account does not have admin access" };
  }

  await setSessionToken(
    result.data.session.sessionToken,
    result.data.session.expiresAt,
  );
  redirect("/dashboard");
}
