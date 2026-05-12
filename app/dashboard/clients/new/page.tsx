import Link from "next/link";
import { createClientAction } from "../actions";
import ClientForm from "../client-form";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/dashboard/clients"
          className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Back to clients
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          New client
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Register a new OAuth/OIDC relying party. You can add redirect URIs
          after the client is created.
        </p>
      </header>

      <ClientForm action={createClientAction} submitLabel="Create client" />
    </div>
  );
}
