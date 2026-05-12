# auth-admin-but-java

Admin console for [`auth-server-but-java`](https://github.com/x-erika/auth-server-but-java) — Next.js 16 (App Router, React 19, Tailwind v4, Server Actions).

Login as an admin user, list users and roles, and assign/revoke roles via point-and-click.

## Quick start

```bash
npm install
npm run dev
# → http://localhost:3000
```

Requires [`auth-server-but-java`](https://github.com/x-erika/auth-server-but-java)
running and reachable at `AUTH_BACKEND_URL` (defaults to
`http://localhost:8080`).

Login with the bootstrap admin: `admin@gmail.com` / `admin123`.

## Configuration

Single env var, defaults to localhost backend:

```bash
# .env.local
AUTH_BACKEND_URL=http://localhost:8080
```

## Architecture

**BFF (Backend-for-Frontend)** pattern. The browser never talks to the auth server directly — only to Next.js, which proxies to the auth server server-side.

Flow:
1. Browser submits login form → Server Action (`app/login/actions.ts`)
2. Server Action calls `POST /auth/login` on the auth server, receives a session token
3. Server Action sets an HttpOnly cookie (`auth_session`) and redirects to `/dashboard`
4. All subsequent dashboard pages are Server Components that read the cookie server-side and call `/admin/*` endpoints with `Authorization: Bearer <session-token>`
5. Mutations (assign/revoke role) go through Server Actions that hit `/admin/users/{id}/roles/{name}` and `revalidatePath` to refresh the UI

The session token cookie is HttpOnly + SameSite=Lax, so it cannot be read by JavaScript. No tokens are ever exposed to the browser.

## File layout

```
app/
├── layout.tsx                  root layout (Geist font, dark/light auto)
├── page.tsx                    redirect → /dashboard or /login based on session
├── login/
│   ├── page.tsx                server component: skip form if already an admin
│   ├── login-form.tsx          client component: useActionState form
│   └── actions.ts              loginAction (calls auth server, sets cookie)
├── logout/
│   └── actions.ts              logoutAction (clears cookie + calls /auth/logout)
└── dashboard/
    ├── layout.tsx              auth guard (redirect to /login if not admin)
    ├── sidebar.tsx             client component with usePathname for active state
    ├── page.tsx                overview (user/role counts)
    ├── users/
    │   ├── page.tsx            table of users with role-toggle chips
    │   └── actions.ts          toggleRoleAction (POST/DELETE role assignment)
    └── roles/page.tsx          read-only list of roles

lib/
├── backend.ts                  fetch wrapper with auto-attached Bearer token
├── session.ts                  cookie helpers (getSessionToken / setSessionToken / clear)
└── types.ts                    response types matching backend records
```

## What it can do

- Sign in (only admins; non-admins are rejected with a clear error)
- See a dashboard overview with user and role counts
- List all users with their current role assignments shown as chips
- Click a role chip to toggle assignment (instant via Server Action + `revalidatePath`)
- List roles (read-only; roles are seeded in the backend bootstrap)
- Sign out (clears cookie + ends backend session)

## What it doesn't do (yet)

- Edit user details (firstName, lastName, enabled, emailVerified)
- Create new roles or edit role descriptions
- Sign up new users from the admin UI (use `POST /auth/signup` on the backend)
- Search / filter / pagination on the users list (capped at 100 most recent)
- Prevent self-revoke (an admin can revoke their own `admin` role and lock themselves out)
- Use OAuth/OIDC flow against the auth server — the admin UI logs in via session-based `/auth/login`, bypassing the OAuth machinery. The auth server's OAuth/OIDC endpoints are demoable via curl / Postman (see `auth-server-but-java/API.md`)

## Notes

- **Tailwind v4** via `@tailwindcss/postcss` — no `tailwind.config.js`; theme lives in `globals.css` via `@theme inline`.
- **Async request APIs** — `cookies()`, `headers()`, `params`, `searchParams` are all `Promise<...>` per Next.js 16. The `lib/session.ts` helpers handle this consistently.
- **Server Actions** are used for all mutations (login, logout, toggle role). Form `action` props point at server functions; no client-side fetch to `/api/*` route handlers needed.
- **No middleware** — auth guard is in `app/dashboard/layout.tsx`. It fetches `/auth/me` on every dashboard navigation; missing session or non-admin → redirect to `/login`.
