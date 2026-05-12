"use client";

import { useActionState } from "react";
import type { AdminUserSummary } from "@/lib/types";

type FormState = { error: string | null };

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

const INITIAL: FormState = { error: null };

export default function UserEditForm({
  action,
  existing,
}: {
  action: Action;
  existing: AdminUserSummary;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name">
          <input
            name="firstName"
            defaultValue=""
            placeholder="(unchanged)"
            className={input}
          />
        </Field>
        <Field label="Last name">
          <input
            name="lastName"
            defaultValue=""
            placeholder="(unchanged)"
            className={input}
          />
        </Field>
      </div>

      <Field label="Reset password (leave blank to keep)">
        <input
          name="newPassword"
          type="text"
          defaultValue=""
          placeholder="min 8 characters · invalidates active sessions"
          className={input}
        />
      </Field>

      <div className="flex flex-wrap gap-4 pt-2">
        <Checkbox
          name="enabled"
          defaultChecked={existing.enabled}
          label="Enabled"
        />
        <Checkbox
          name="emailVerified"
          defaultChecked={existing.emailVerified}
          label="Email verified"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

const input =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
        {label}
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
