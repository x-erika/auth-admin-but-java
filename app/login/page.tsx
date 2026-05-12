import { redirect } from "next/navigation";
import { backend } from "@/lib/backend";
import { getSessionToken } from "@/lib/session";
import type { MeResponse } from "@/lib/types";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const token = await getSessionToken();
  if (token) {
    const me = await backend<MeResponse>("/auth/me");
    if (me.ok && me.data.user.roles.includes("admin")) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <LoginForm />
    </div>
  );
}
