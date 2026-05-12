import Link from "next/link";
import { backend } from "@/lib/backend";
import type {
  AdminUserSummary,
  ConsentSummary,
  SessionSummary,
} from "@/lib/types";
import {
  deleteUserAction,
  revokeConsentAction,
  updateUserAction,
} from "../actions";
import { revokeSessionAction } from "../../sessions/actions";
import UserEditForm from "../user-edit-form";

type Props = { params: Promise<{ id: string }> };

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;

  const [userRes, sessionsRes, consentsRes] = await Promise.all([
    backend<AdminUserSummary>(`/admin/users/${id}`),
    backend<SessionSummary[]>(`/admin/users/${id}/sessions`),
    backend<ConsentSummary[]>(`/admin/users/${id}/consents`),
  ]);

  if (!userRes.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">
          Failed to load user
        </h2>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          {userRes.error}
        </p>
      </div>
    );
  }

  const user = userRes.data;
  const sessions = sessionsRes.ok ? sessionsRes.data : [];
  const consents = consentsRes.ok ? consentsRes.data : [];
  const boundUpdate = updateUserAction.bind(null, user.id);

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/dashboard/users"
          className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Back to users
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {user.username}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {user.email}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge
                tone={user.enabled ? "success" : "muted"}
                label={user.enabled ? "Enabled" : "Disabled"}
              />
              <Badge
                tone={user.emailVerified ? "success" : "warning"}
                label={user.emailVerified ? "Verified" : "Unverified"}
              />
              {user.roles.map((role) => (
                <Badge key={role} tone="info" label={role} />
              ))}
            </div>
          </div>
          <form action={deleteUserAction}>
            <input type="hidden" name="id" value={user.id} />
            <button
              type="submit"
              className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
            >
              Delete user
            </button>
          </form>
        </div>
      </header>

      <Section title="Profile and credentials">
        <UserEditForm action={boundUpdate} existing={user} />
      </Section>

      <Section
        title={`Active sessions (${sessions.length})`}
        description="Revoking a session also revokes any refresh tokens issued to it."
      >
        {sessions.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No active sessions.
          </p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800"
              >
                <div>
                  <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                    {s.ipAddress ?? "—"}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {s.userAgent ?? ""} · last accessed{" "}
                    {formatDate(s.lastAccessedAt)}
                  </p>
                </div>
                <form action={revokeSessionAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="userId" value={user.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Revoke
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title={`Granted consents (${consents.length})`}
        description="Applications this user has authorized via OAuth/OIDC. Revoking forces a fresh consent prompt next time the app requests access."
      >
        {consents.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No consents on file.
          </p>
        ) : (
          <ul className="space-y-2">
            {consents.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {c.clientName ?? c.clientId ?? "(unknown client)"}
                  </p>
                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {c.scopes} · granted {formatDate(c.grantedAt)}
                  </p>
                </div>
                <form action={revokeConsentAction}>
                  <input type="hidden" name="consentId" value={c.id} />
                  <input type="hidden" name="userId" value={user.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Revoke
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
        {title}
      </h2>
      {description && (
        <p className="mb-4 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      )}
      <div className={description ? "" : "mt-4"}>{children}</div>
    </section>
  );
}

type Tone = "success" | "warning" | "muted" | "info";

function Badge({ label, tone }: { label: string; tone: Tone }) {
  const toneClasses: Record<Tone, string> = {
    success:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    warning:
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    muted: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    info: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}
