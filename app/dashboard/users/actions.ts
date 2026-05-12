"use server";

import { revalidatePath } from "next/cache";
import { backend } from "@/lib/backend";

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
}
