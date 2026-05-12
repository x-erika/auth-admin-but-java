import { redirect } from "next/navigation";
import { backend } from "@/lib/backend";
import { getSessionToken } from "@/lib/session";
import type { MeResponse } from "@/lib/types";
import Sidebar from "./sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  const me = await backend<MeResponse>("/auth/me");
  if (!me.ok || !me.data.user.roles.includes("admin")) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 bg-zinc-50 dark:bg-zinc-950">
      <Sidebar user={me.data.user} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
