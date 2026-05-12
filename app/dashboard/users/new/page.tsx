import Link from "next/link";
import UserCreateForm from "../user-create-form";

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/dashboard/users"
          className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Back to users
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          New user
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Creates a user with a password credential. Default role
          assignment: <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">user</code>.
        </p>
      </header>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <UserCreateForm />
      </div>
    </div>
  );
}
