"use server";

import { revalidatePath } from "next/cache";
import { backend } from "@/lib/backend";

export async function setParentAction(formData: FormData): Promise<void> {
  const child = formData.get("child")?.toString() ?? "";
  const parent = formData.get("parent")?.toString() ?? "";
  if (!child) return;

  if (!parent) {
    await backend<unknown>(
      `/admin/roles/${encodeURIComponent(child)}/parent`,
      { method: "DELETE" },
    );
  } else {
    await backend<unknown>(
      `/admin/roles/${encodeURIComponent(child)}/parent/${encodeURIComponent(parent)}`,
      { method: "POST" },
    );
  }

  revalidatePath("/dashboard/roles");
}
