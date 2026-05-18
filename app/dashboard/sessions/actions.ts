"use server";

import { revalidatePath } from "next/cache";
import { backend } from "@/lib/backend";

export async function revokeSessionAction(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString();
  if (!id) return;
  const res = await backend<unknown>(
    `/admin/sessions/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
  if (!res.ok) {
    console.error(
      `[revokeSessionAction] DELETE /admin/sessions/${id} failed: ${res.error}`,
    );
    return;
  }
  revalidatePath("/dashboard/sessions");
  const userId = formData.get("userId")?.toString();
  if (userId) {
    revalidatePath(`/dashboard/users/${userId}`);
  }
}
