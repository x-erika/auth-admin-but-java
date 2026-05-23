"use client";

import type { ReactNode } from "react";

/**
 * Submit button that prompts window.confirm before letting the parent form
 * actually submit. Used to gate destructive admin operations (delete user,
 * delete client, revoke session, etc.) behind a deliberate second action so
 * a single misclick can't wipe data.
 *
 * Drop-in replacement for `<button type="submit">` inside an existing
 * `<form action={serverAction}>` — the server action does not need to know
 * about the confirm step.
 */
export default function ConfirmSubmit({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
