const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

export type VehicleImage = { _id: string; url: string; publicId: string };

export type Vehicle = {
  _id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  price: number;
  mileage: number;
  bodyType: string;
  fuelType?: string;
  transmission?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  description?: string;
  features: string[];
  images: VehicleImage[];
  status: "available" | "pending" | "sold";
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type VehicleListResponse = {
  vehicles: Vehicle[];
  pagination: Pagination;
};

export async function getVehicles(
  params: Record<string, string> = {},
): Promise<VehicleListResponse> {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/vehicles${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load vehicles");
  return res.json();
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  const res = await fetch(`${API_URL}/vehicles/${id}`, { cache: "no-store" });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error("Failed to load vehicle");
  return res.json();
}
