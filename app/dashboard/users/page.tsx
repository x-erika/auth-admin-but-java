import Link from "next/link";
import { backend } from "@/lib/backend";
import type { AdminUserSummary, RoleSummary } from "@/lib/types";
import { toggleRoleAction } from "./actions";

export default async function UsersPage() {
  const [usersRes, rolesRes] = await Promise.all([
    backend<AdminUserSummary[]>("/admin/users"),
    backend<RoleSummary[]>("/admin/roles"),
  ]);

  if (!usersRes.ok) {
    return (
      <ErrorPanel title="Failed to load users" message={usersRes.error} />
    );
  }
  if (!rolesRes.ok) {
    return (
      <ErrorPanel title="Failed to load roles" message={rolesRes.error} />
    );
  }

  const users = usersRes.data;
  const roles = rolesRes.data;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Users
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {users.length} user{users.length === 1 ? "" : "s"} · click the
            username to manage, role chips to assign/revoke
          </p>
        </div>
        <Link
          href="/dashboard/users/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          New user
        </Link>
      </header>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Roles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/users/${user.id}`}
                    className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                  >
                    {user.username}
                  </Link>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <StatusBadge
                      label={user.enabled ? "Enabled" : "Disabled"}
                      tone={user.enabled ? "success" : "muted"}
                    />
                    <StatusBadge
                      label={user.emailVerified ? "Verified" : "Unverified"}
                      tone={user.emailVerified ? "success" : "warning"}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => {
                      const assigned = user.roles.includes(role.name);
                      return (
                        <RoleToggle
                          key={role.id}
                          userId={user.id}
                          roleName={role.name}
                          assigned={assigned}
                        />
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoleToggle({
  userId,
  roleName,
  assigned,
}: {
  userId: string;
  roleName: string;
  assigned: boolean;
}) {
  return (
    <form action={toggleRoleAction}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="roleName" value={roleName} />
      <input
        type="hidden"
        name="action"
        value={assigned ? "revoke" : "assign"}
      />
      <button
        type="submit"
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          assigned
            ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            : "border border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
        }`}
      >
        {roleName}
      </button>
    </form>
  );
}

type Tone = "success" | "warning" | "muted";

function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  const toneClasses: Record<Tone, string> = {
    success:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    warning:
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    muted:
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}

function ErrorPanel({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
      <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">
        {title}
      </h2>
      <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
    </div>
  );
}
