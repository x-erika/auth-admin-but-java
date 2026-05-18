"use server";

import { revalidatePath } from "next/cache";
import { backend } from "@/lib/backend";

export async function rotateKeyAction(): Promise<void> {
  const res = await backend<unknown>("/admin/keys/rotate", { method: "POST" });
  if (!res.ok) {
    console.error(`[rotateKeyAction] POST /admin/keys/rotate failed: ${res.error}`);
    return;
  }
  revalidatePath("/dashboard/keys");
}
