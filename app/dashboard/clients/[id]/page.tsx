import Link from "next/link";
import { backend } from "@/lib/backend";
import type { ClientSummary } from "@/lib/types";
import {
  addRedirectUriAction,
  deleteClientAction,
  removeRedirectUriAction,
  updateClientAction,
} from "../actions";
import ConfirmSubmit from "../../_components/confirm-submit";
import ClientForm from "../client-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function ClientDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;
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
        {error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            Delete failed: {error}
          </div>
        )}
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
            <ConfirmSubmit
              message={`Delete OAuth client "${client.name ?? client.clientId}" (${client.clientId})?\n\nThis removes its redirect URIs and revokes every refresh token issued to it. Any application using this client_id will stop working immediately. This cannot be undone.`}
              className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
            >
              Delete client
            </ConfirmSubmit>
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
                <ConfirmSubmit
                  message={`Remove redirect URI?\n\n${r.uri}\n\nIf the client app is using this exact URI in its callback, authorization-code flows will fail.`}
                  className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Remove
                </ConfirmSubmit>
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
