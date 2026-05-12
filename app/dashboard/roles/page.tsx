import { backend } from "@/lib/backend";
import type { RoleSummary } from "@/lib/types";

export default async function RolesPage() {
  const res = await backend<RoleSummary[]>("/admin/roles");

  if (!res.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">
          Failed to load roles
        </h2>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          {res.error}
        </p>
      </div>
    );
  }

  const roles = res.data;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Roles
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {roles.length} role{roles.length === 1 ? "" : "s"} seeded at startup
        </p>
      </header>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {roles.map((role) => (
              <tr key={role.id}>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-zinc-50 dark:text-zinc-900">
                    {role.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                  {role.description ?? (
                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {role.id}
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No roles seeded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
