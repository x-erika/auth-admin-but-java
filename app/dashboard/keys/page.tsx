import { backend } from "@/lib/backend";
import type { KeyListResponse } from "@/lib/types";
import { rotateKeyAction } from "./actions";

export default async function KeysPage() {
  const res = await backend<KeyListResponse>("/admin/keys");

  if (!res.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">
          Failed to load keys
        </h2>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          {res.error}
        </p>
      </div>
    );
  }

  const { active_kid, keys } = res.data;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Signing keys
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            RSA-2048 / RS256 · {keys.length} key
            {keys.length === 1 ? "" : "s"} loaded · rotation generates a new
            keypair and marks it active while keeping old kids in the JWKS so
            in-flight tokens still verify
          </p>
        </div>
        <form action={rotateKeyAction}>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Rotate now
          </button>
        </form>
      </header>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Active kid:{" "}
        <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
          {active_kid}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-3">Kid</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {keys.map((key) => (
              <tr key={key.kid}>
                <td className="px-6 py-4 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {key.kid}
                </td>
                <td className="px-6 py-4">
                  {key.active ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Active (signing)
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      Retired (verify only)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
