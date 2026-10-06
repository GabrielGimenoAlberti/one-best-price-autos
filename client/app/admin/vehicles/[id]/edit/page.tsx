"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import VehicleForm from "@/components/VehicleForm";
import type { Vehicle } from "@/lib/api";
import { getAdminVehicle } from "@/lib/admin";
import PhotoManager from "@/components/PhotoManager";

export default function EditVehiclePage() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminVehicle(id).then((result) => {
      if ("error" in result) setError(result.error);
      else setVehicle(result.data);
    });
  }, [id]);

  if (error) return <p role="alert" className="text-red-600">{error}</p>;
  if (!vehicle) return <p className="text-gray-600">Loading...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">
        Edit {vehicle.year} {vehicle.make} {vehicle.model}
      </h1>
      <PhotoManager vehicleId={vehicle._id} initialImages={vehicle.images} />
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}