import Link from "next/link";
import { backend } from "@/lib/backend";
import type { ClientSummary } from "@/lib/types";
import {
  addRedirectUriAction,
  deleteClientAction,
  removeRedirectUriAction,
  updateClientAction,
} from "../actions";
import ClientForm from "../client-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const res = await backend<ClientSummary>(`/admin/clients/${id}`);

  if (!res.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">
          Failed to load client
        </h2>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          {res.error}
        </p>
      </div>
    );
  }

  const client = res.data;
  const boundUpdate = updateClientAction.bind(null, client.id);

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/dashboard/clients"
          className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Back to clients
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {client.name ?? client.clientId}
            </h1>
            <p className="mt-1 font-mono text-sm text-zinc-500 dark:text-zinc-400">
              {client.clientId}
            </p>
          </div>
          <form action={deleteClientAction}>
            <input type="hidden" name="id" value={client.id} />
            <button
              type="submit"
              className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
            >
              Delete client
            </button>
          </form>
        </div>
      </header>

      <ClientForm
        action={boundUpdate}
        existing={client}
        submitLabel="Save changes"
      />

      <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
          Redirect URIs
        </h2>

        <ul className="mb-4 space-y-2">
          {client.redirectUris.length === 0 && (
            <li className="text-sm text-zinc-500 dark:text-zinc-400">
              No redirect URIs registered. Authorization-code flows will fail
              until at least one is added.
            </li>
          )}
          {client.redirectUris.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800"
            >
              <code className="break-all text-xs text-zinc-700 dark:text-zinc-300">
                {r.uri}
              </code>
              <form action={removeRedirectUriAction}>
                <input type="hidden" name="clientId" value={client.id} />
                <input type="hidden" name="uriId" value={r.id} />
                <button
                  type="submit"
                  className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>

        <form action={addRedirectUriAction} className="flex gap-2">
          <input type="hidden" name="clientId" value={client.id} />
          <input
            name="uri"
            required
            placeholder="https://app.example.com/callback"
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Add
          </button>
        </form>
      </section>
    </div>
  );
}
