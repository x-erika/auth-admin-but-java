import { backend } from "@/lib/backend";
import type { SessionSummary } from "@/lib/types";
import { revokeSessionAction } from "./actions";

export default async function SessionsPage() {
  const res = await backend<SessionSummary[]>("/admin/sessions");

  if (!res.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">
          Failed to load sessions
        </h2>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          {res.error}
        </p>
      </div>
    );
  }

  const sessions = res.data;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Active sessions
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {sessions.length} session{sessions.length === 1 ? "" : "s"} currently
          active across all users · revoking a session also revokes its refresh
          tokens
        </p>
      </header>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">IP / Agent</th>
              <th className="px-6 py-3">Last accessed</th>
              <th className="px-6 py-3">Expires</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {sessions.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {s.username ?? "—"}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {s.email ?? ""}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                    {s.ipAddress ?? "—"}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {s.userAgent ?? ""}
                  </p>
                </td>
                <td className="px-6 py-4 text-xs text-zinc-600 dark:text-zinc-400">
                  {formatDate(s.lastAccessedAt)}
                </td>
                <td className="px-6 py-4 text-xs text-zinc-600 dark:text-zinc-400">
                  {formatDate(s.expiresAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={revokeSessionAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Revoke
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No active sessions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}
