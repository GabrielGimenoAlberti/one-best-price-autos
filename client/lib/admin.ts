import type { Vehicle, Pagination } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

export type VehicleStatus = "available" | "pending" | "sold";

type Result<T> = { data: T } | { error: string };

async function request<T>(path: string, init: RequestInit = {}): Promise<Result<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include", // sends the admin login cookie
      cache: "no-store",
      headers:
        init.body && !(init.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : undefined,
    });
    const json = await res.json().catch(() => null);
    if (res.ok) return { data: json as T };
    return { error: json?.errors?.[0] ?? json?.message ?? "Something went wrong." };
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }
}

export function listAdminVehicles(params: { status?: string; page?: number }) {
  const q = new URLSearchParams();
  if (params.status) q.set("status", params.status);
  q.set("page", String(params.page ?? 1));
  return request<{ vehicles: Vehicle[]; pagination: Pagination }>(
    `/admin/vehicles?${q.toString()}`
  );
}

export function setVehicleStatus(id: string, status: VehicleStatus) {
  return request<Vehicle>(`/admin/vehicles/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export function deleteAdminVehicle(id: string) {
  return request<{ message: string }>(`/admin/vehicles/${id}`, { method: "DELETE" });
}

export type VehicleInput = Record<string, string | number | string[]>;

export function getAdminVehicle(id: string) {
  return request<Vehicle>(`/admin/vehicles/${id}`);
}

export function createAdminVehicle(body: VehicleInput) {
  return request<Vehicle>("/admin/vehicles", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateAdminVehicle(id: string, body: VehicleInput) {
  return request<Vehicle>(`/admin/vehicles/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function uploadVehicleImages(id: string, files: File[]) {
  const form = new FormData();
  files.forEach((f) => form.append("images", f));
  return request<Vehicle>(`/admin/vehicles/${id}/images`, {
    method: "POST",
    body: form,
  });
}

export function deleteVehicleImage(id: string, imageId: string) {
  return request<Vehicle>(`/admin/vehicles/${id}/images/${imageId}`, {
    method: "DELETE",
  });
}