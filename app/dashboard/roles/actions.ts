"use server";

import { revalidatePath } from "next/cache";
import { backend } from "@/lib/backend";

export async function setParentAction(formData: FormData): Promise<void> {
  const child = formData.get("child")?.toString() ?? "";
  const parent = formData.get("parent")?.toString() ?? "";
  if (!child) return;

  const res = !parent
    ? await backend<unknown>(
        `/admin/roles/${encodeURIComponent(child)}/parent`,
        { method: "DELETE" },
      )
    : await backend<unknown>(
        `/admin/roles/${encodeURIComponent(child)}/parent/${encodeURIComponent(parent)}`,
        { method: "POST" },
      );

  if (!res.ok) {
    const path = parent
      ? `POST /admin/roles/${child}/parent/${parent}`
      : `DELETE /admin/roles/${child}/parent`;
    console.error(`[setParentAction] ${path} failed: ${res.error}`);
    return;
  }

  revalidatePath("/dashboard/roles");
}
