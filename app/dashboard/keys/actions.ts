"use server";

import { revalidatePath } from "next/cache";
import { backend } from "@/lib/backend";

export async function rotateKeyAction(): Promise<void> {
  await backend<unknown>("/admin/keys/rotate", { method: "POST" });
  revalidatePath("/dashboard/keys");
}
