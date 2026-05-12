"use client";

import { useActionState } from "react";
import type { ClientSummary } from "@/lib/types";

type FormState = { error: string | null };

const INITIAL_STATE: FormState = { error: null };

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

export default function ClientForm({
  action,
  existing,
  submitLabel,
}: {
  action: Action;
  existing?: ClientSummary;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </div>
      )}

      <Section title="Identity">
        <Field label="Client ID" required>
          <input
            name="clientId"
            defaultValue={existing?.clientId ?? ""}
            disabled={!!existing}
            required
            className={inputClasses}
          />
        </Field>
        <Field label="Name (display)">
          <input
            name="name"
            defaultValue={existing?.name ?? ""}
            className={inputClasses}
          />
        </Field>
        <Field
          label={existing ? "Client secret (leave blank to keep)" : "Client secret"}
        >
          <input
            name="clientSecret"
            type="text"
            defaultValue=""
            className={inputClasses}
          />
        </Field>
        <Field label="Type">
          <select
            name="type"
            defaultValue={existing?.type ?? "public"}
            className={inputClasses}
          >
            <option value="public">public</option>
            <option value="confidential">confidential</option>
          </select>
        </Field>
      </Section>

      <Section title="Flow configuration">
        <Field label="Scopes (space-separated)">
          <input
            name="scopes"
            defaultValue={existing?.scopes ?? ""}
            placeholder="openid profile email offline_access"
            className={inputClasses}
          />
        </Field>
        <Field label="Grant types">
          <input
            name="grantTypes"
            defaultValue={existing?.grantTypes ?? ""}
            placeholder="authorization_code refresh_token"
            className={inputClasses}
          />
        </Field>
        <Field label="Response types">
          <input
            name="responseTypes"
            defaultValue={existing?.responseTypes ?? ""}
            placeholder="code"
            className={inputClasses}
          />
        </Field>
        <div className="flex flex-wrap gap-4">
          <Checkbox
            name="pkceRequired"
            defaultChecked={existing?.pkceRequired ?? true}
            label="PKCE required"
          />
          <Checkbox
            name="enabled"
            defaultChecked={existing?.enabled ?? true}
            label="Enabled"
          />
        </div>
      </Section>

      <Section title="Metadata">
        <Field label="Base URL">
          <input
            name="baseUrl"
            defaultValue={existing?.baseUrl ?? ""}
            className={inputClasses}
          />
        </Field>
        <Field label="Description">
          <textarea
            name="description"
            defaultValue={existing?.description ?? ""}
            rows={2}
            className={inputClasses}
          />
        </Field>
      </Section>

      <Section title="Logout propagation">
        <Field label="Front-channel logout URI">
          <input
            name="frontchannelLogoutUri"
            defaultValue={existing?.frontchannelLogoutUri ?? ""}
            placeholder="https://app.example.com/logout-iframe"
            className={inputClasses}
          />
        </Field>
        <Field label="Back-channel logout URI">
          <input
            name="backchannelLogoutUri"
            defaultValue={existing?.backchannelLogoutUri ?? ""}
            placeholder="https://app.example.com/oidc/backchannel-logout"
            className={inputClasses}
          />
        </Field>
      </Section>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

const inputClasses =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none disabled:bg-zinc-50 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:disabled:bg-zinc-900";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </span>
      {children}
    </label>
  );
}

function Checkbox({
  name,
  defaultChecked,
  label,
}: {
  name: string;
  defaultChecked: boolean;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700"
      />
      {label}
    </label>
  );
}
