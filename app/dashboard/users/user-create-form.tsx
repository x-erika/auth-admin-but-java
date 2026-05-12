"use client";

import { useActionState } from "react";
import { createUserAction } from "./actions";

const INITIAL = { error: null };

export default function UserCreateForm() {
  const [state, formAction, pending] = useActionState(
    createUserAction,
    INITIAL,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </div>
      )}

      <Field label="Email" required>
        <input name="email" type="email" required className={input} />
      </Field>
      <Field label="Username" required>
        <input name="username" required className={input} />
      </Field>
      <Field label="Password" required>
        <input
          name="password"
          type="text"
          minLength={8}
          required
          placeholder="min 8 characters"
          className={input}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name">
          <input name="firstName" className={input} />
        </Field>
        <Field label="Last name">
          <input name="lastName" className={input} />
        </Field>
      </div>

      <div className="flex flex-wrap gap-4 pt-2">
        <Checkbox name="enabled" defaultChecked={true} label="Enabled" />
        <Checkbox
          name="emailVerified"
          defaultChecked={false}
          label="Email already verified"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Creating…" : "Create user"}
      </button>
    </form>
  );
}

const input =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600";

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
