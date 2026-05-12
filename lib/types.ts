export type UserPayload = {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  roles: string[];
};

export type SessionPayload = {
  sessionToken: string;
  expiresAt: string | null;
  lastAccessedAt: string | null;
};

export type LoginResponse = {
  message: string;
  session: SessionPayload;
  user: UserPayload;
};

export type MeResponse = {
  session: SessionPayload;
  user: UserPayload;
};

export type RoleSummary = {
  id: string;
  name: string;
  description: string | null;
};

export type AdminUserSummary = {
  id: string;
  email: string;
  username: string;
  enabled: boolean;
  emailVerified: boolean;
  roles: string[];
};
