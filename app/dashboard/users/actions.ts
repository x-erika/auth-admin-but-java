"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { backend } from "@/lib/backend";
import type { AdminUserSummary } from "@/lib/types";

type FormState = { error: string | null };

function readString(formData: FormData, name: string): string | null {
  const value = formData.get(name)?.toString().trim();
  return value && value.length > 0 ? value : null;
}

function readBool(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

export async function toggleRoleAction(formData: FormData): Promise<void> {
  const userId = formData.get("userId")?.toString() ?? "";
  const roleName = formData.get("roleName")?.toString() ?? "";
  const action = formData.get("action")?.toString() ?? "";

  if (!userId || !roleName) return;

  const method = action === "revoke" ? "DELETE" : "POST";
  await backend<unknown>(
    `/admin/users/${encodeURIComponent(userId)}/roles/${encodeURIComponent(roleName)}`,
    { method },
  );

  revalidatePath("/dashboard/users");
  revalidatePath(`/dashboard/users/${userId}`);
}

export async function createUserAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = readString(formData, "email");
  const username = readString(formData, "username");
  const password = readString(formData, "password");
  if (!email || !username || !password) {
    return { error: "email, username, and password are required" };
  }

  const payload = {
    email,
    username,
    password,
    firstName: readString(formData, "firstName"),
    lastName: readString(formData, "lastName"),
    enabled: readBool(formData, "enabled"),
    emailVerified: readBool(formData, "emailVerified"),
  };

  const res = await backend<AdminUserSummary>("/admin/users", {
    method: "POST",
    body: payload,
  });
  if (!res.ok) {
    return { error: res.error };
  }
  revalidatePath("/dashboard/users");
  redirect(`/dashboard/users/${res.data.id}`);
}

export async function updateUserAction(
  userId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const payload = {
    firstName: readString(formData, "firstName"),
    lastName: readString(formData, "lastName"),
    enabled: readBool(formData, "enabled"),
    emailVerified: readBool(formData, "emailVerified"),
    newPassword: readString(formData, "newPassword"),
  };

  const res = await backend<unknown>(
    `/admin/users/${encodeURIComponent(userId)}`,
    { method: "PATCH", body: payload },
  );
  if (!res.ok) {
    return { error: res.error };
  }
  revalidatePath("/dashboard/users");
  revalidatePath(`/dashboard/users/${userId}`);
  return { error: null };
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString();
  if (!id) return;
  await backend<unknown>(`/admin/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

export async function revokeConsentAction(formData: FormData): Promise<void> {
  const consentId = formData.get("consentId")?.toString();
  const userId = formData.get("userId")?.toString();
  if (!consentId) return;
  await backend<unknown>(`/admin/consents/${encodeURIComponent(consentId)}`, {
    method: "DELETE",
  });
  if (userId) {
    revalidatePath(`/dashboard/users/${userId}`);
  }
}
