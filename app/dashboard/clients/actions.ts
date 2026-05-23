"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { backend } from "@/lib/backend";
import type { ClientSummary } from "@/lib/types";

type ClientFormState = { error: string | null };

function readBool(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

function readString(formData: FormData, name: string): string | null {
  const value = formData.get(name)?.toString().trim();
  return value && value.length > 0 ? value : null;
}

export async function createClientAction(
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const clientId = readString(formData, "clientId");
  if (!clientId) return { error: "clientId is required" };

  const payload = {
    clientId,
    clientSecret: readString(formData, "clientSecret"),
    name: readString(formData, "name"),
    type: readString(formData, "type") ?? "public",
    scopes: readString(formData, "scopes"),
    grantTypes: readString(formData, "grantTypes"),
    responseTypes: readString(formData, "responseTypes"),
    pkceRequired: readBool(formData, "pkceRequired"),
    enabled: readBool(formData, "enabled"),
    baseUrl: readString(formData, "baseUrl"),
    description: readString(formData, "description"),
    frontchannelLogoutUri: readString(formData, "frontchannelLogoutUri"),
    backchannelLogoutUri: readString(formData, "backchannelLogoutUri"),
  };

  const res = await backend<ClientSummary>("/admin/clients", {
    method: "POST",
    body: payload,
  });

  if (!res.ok) {
    return { error: res.error };
  }

  revalidatePath("/dashboard/clients");
  redirect(`/dashboard/clients/${res.data.id}`);
}

export async function updateClientAction(
  clientId: string,
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const payload = {
    clientSecret: readString(formData, "clientSecret"),
    name: readString(formData, "name"),
    type: readString(formData, "type"),
    scopes: readString(formData, "scopes"),
    grantTypes: readString(formData, "grantTypes"),
    responseTypes: readString(formData, "responseTypes"),
    pkceRequired: readBool(formData, "pkceRequired"),
    enabled: readBool(formData, "enabled"),
    baseUrl: readString(formData, "baseUrl"),
    description: readString(formData, "description"),
    frontchannelLogoutUri: readString(formData, "frontchannelLogoutUri"),
    backchannelLogoutUri: readString(formData, "backchannelLogoutUri"),
  };

  const res = await backend<ClientSummary>(
    `/admin/clients/${encodeURIComponent(clientId)}`,
    { method: "PUT", body: payload },
  );

  if (!res.ok) {
    return { error: res.error };
  }

  revalidatePath("/dashboard/clients");
  revalidatePath(`/dashboard/clients/${clientId}`);
  return { error: null };
}

export async function deleteClientAction(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString();
  if (!id) return;
  const res = await backend<unknown>(
    `/admin/clients/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
  if (!res.ok) {
    console.error(
      `[deleteClientAction] DELETE /admin/clients/${id} failed: ${res.error}`,
    );
    // Bounce back to the detail page with the backend's error message in the
    // querystring so the admin can see why the delete failed instead of being
    // silently kicked back to the list as if nothing happened.
    revalidatePath(`/dashboard/clients/${id}`);
    redirect(`/dashboard/clients/${id}?error=${encodeURIComponent(res.error)}`);
  }
  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
}

export async function addRedirectUriAction(formData: FormData): Promise<void> {
  const clientId = formData.get("clientId")?.toString();
  const uri = formData.get("uri")?.toString().trim();
  if (!clientId || !uri) return;
  const res = await backend<unknown>(
    `/admin/clients/${encodeURIComponent(clientId)}/redirect-uris`,
    { method: "POST", body: { uri } },
  );
  if (!res.ok) {
    console.error(
      `[addRedirectUriAction] POST /admin/clients/${clientId}/redirect-uris failed: ${res.error}`,
    );
    return;
  }
  revalidatePath(`/dashboard/clients/${clientId}`);
}

export async function removeRedirectUriAction(
  formData: FormData,
): Promise<void> {
  const clientId = formData.get("clientId")?.toString();
  const uriId = formData.get("uriId")?.toString();
  if (!clientId || !uriId) return;
  const res = await backend<unknown>(
    `/admin/clients/${encodeURIComponent(clientId)}/redirect-uris/${encodeURIComponent(uriId)}`,
    { method: "DELETE" },
  );
  if (!res.ok) {
    console.error(
      `[removeRedirectUriAction] DELETE /admin/clients/${clientId}/redirect-uris/${uriId} failed: ${res.error}`,
    );
    return;
  }
  revalidatePath(`/dashboard/clients/${clientId}`);
}
