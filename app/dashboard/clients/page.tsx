import Link from "next/link";
import { backend } from "@/lib/backend";
import type { ClientSummary } from "@/lib/types";

export default async function ClientsPage() {
  const res = await backend<ClientSummary[]>("/admin/clients");

  if (!res.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">
          Failed to load clients
        </h2>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          {res.error}
        </p>
      </div>
    );
  }

  const clients = res.data;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            OAuth clients
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {clients.length} client{clients.length === 1 ? "" : "s"} registered
          </p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          New client
        </Link>
      </header>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Scopes</th>
              <th className="px-6 py-3">Redirect URIs</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                  >
                    {client.name ?? client.clientId}
                  </Link>
                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {client.clientId}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {client.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-zinc-600 dark:text-zinc-400">
                  {client.scopes ?? (
                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-xs text-zinc-600 dark:text-zinc-400">
                  {client.redirectUris.length} URI
                  {client.redirectUris.length === 1 ? "" : "s"}
                </td>
                <td className="px-6 py-4">
                  {client.enabled ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      Disabled
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No clients yet. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
