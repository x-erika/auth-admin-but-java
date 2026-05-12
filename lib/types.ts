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
  parentId: string | null;
};

export type KeyEntry = {
  kid: string;
  active: boolean;
};

export type KeyListResponse = {
  active_kid: string;
  keys: KeyEntry[];
};

export type RedirectUriSummary = {
  id: string;
  uri: string;
};

export type SessionSummary = {
  id: string;
  userId: string | null;
  username: string | null;
  email: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string | null;
  lastAccessedAt: string | null;
  expiresAt: string | null;
};

export type ConsentSummary = {
  id: string;
  clientUuid: string;
  clientId: string | null;
  clientName: string | null;
  scopes: string;
  grantedAt: string | null;
  updatedAt: string | null;
};

export type ClientSummary = {
  id: string;
  clientId: string;
  name: string | null;
  type: "confidential" | "public";
  scopes: string | null;
  grantTypes: string | null;
  responseTypes: string | null;
  pkceRequired: boolean;
  enabled: boolean;
  baseUrl: string | null;
  description: string | null;
  frontchannelLogoutUri: string | null;
  backchannelLogoutUri: string | null;
  redirectUris: RedirectUriSummary[];
};

export type AdminUserSummary = {
  id: string;
  email: string;
  username: string;
  enabled: boolean;
  emailVerified: boolean;
  roles: string[];
};
