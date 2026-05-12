"use server";

import { revalidatePath } from "next/cache";
import { backend } from "@/lib/backend";

export async function revokeSessionAction(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString();
  if (!id) return;
  await backend<unknown>(`/admin/sessions/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  revalidatePath("/dashboard/sessions");
  const userId = formData.get("userId")?.toString();
  if (userId) {
    revalidatePath(`/dashboard/users/${userId}`);
  }
}
