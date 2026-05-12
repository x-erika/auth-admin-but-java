import { backend } from "@/lib/backend";
import type { AdminUserSummary, MeResponse, RoleSummary } from "@/lib/types";

export default async function DashboardOverview() {
  const [me, users, roles] = await Promise.all([
    backend<MeResponse>("/auth/me"),
    backend<AdminUserSummary[]>("/admin/users"),
    backend<RoleSummary[]>("/admin/roles"),
  ]);

  const userCount = users.ok ? users.data.length : 0;
  const roleCount = roles.ok ? roles.data.length : 0;
  const displayName = me.ok ? me.data.user.username : "admin";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back, {displayName}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Manage users and roles for the auth server.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Users" value={userCount} href="/dashboard/users" />
        <StatCard label="Roles" value={roleCount} href="/dashboard/roles" />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
    </a>
  );
}
