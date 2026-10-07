"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Pagination, Vehicle } from "@/lib/api";
import {
  deleteAdminVehicle,
  listAdminVehicles,
  setVehicleStatus,
  type VehicleStatus,
} from "@/lib/admin";

const FILTERS = [
  { value: "", label: "All" },
  { value: "available", label: "Available" },
  { value: "pending", label: "Pending" },
  { value: "sold", label: "Sold" },
];

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const result = await listAdminVehicles({ status, page });
      if (cancelled) return;
      if ("error" in result) {
        setError(result.error);
      } else {
        setVehicles(result.data.vehicles);
        setPagination(result.data.pagination);
        setError("");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [status, page, reload]);

  async function changeStatus(id: string, next: VehicleStatus) {
    const result = await setVehicleStatus(id, next);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setReload((n) => n + 1);
  }

  async function handleDelete(v: Vehicle) {
    const ok = window.confirm(
      `Delete the ${v.year} ${v.make} ${v.model} permanently?\n\nIf it was sold, mark it Sold instead so you keep the record.`,
    );
    if (!ok) return;
    const result = await deleteAdminVehicle(v._id);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setReload((n) => n + 1);
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vehicles</h1>
          <p className="mt-1 text-sm text-gray-600">
            {pagination ? `${pagination.total} total` : "Loading..."}
          </p>
        </div>
        <Link href="/admin/vehicles/new" className="btn btn-primary">
          Add vehicle
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setStatus(f.value);
              setPage(1);
            }}
            className={`btn ${status === f.value ? "btn-primary" : "btn-secondary"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="glass mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-gray-200 text-gray-500">
            <tr>
              <th className="w-24 px-4 py-3 text-left font-medium">Photo</th>
              <th className="px-4 py-3 text-left font-medium">Vehicle</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!loading && vehicles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No vehicles found.
                </td>
              </tr>
            )}
            {vehicles.map((v) => (
              <tr key={v._id}>
                <td className="px-4 py-3 text-left align-middle">
                  <div className="relative h-12 w-16 overflow-hidden rounded bg-gray-100">
                    {v.images[0] && (
                      <Image
                        src={v.images[0].url}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-left align-middle">
                  <p className="font-medium">
                    {v.year} {v.make} {v.model}
                  </p>
                  <p className="text-xs text-gray-500">{v.vin}</p>
                </td>
                <td className="px-4 py-3 text-left align-middle font-medium">
                  ${v.price.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3 text-left align-middle">
                  <select
                    value={v.status}
                    onChange={(e) =>
                      changeStatus(v._id, e.target.value as VehicleStatus)
                    }
                    aria-label={`Status for ${v.year} ${v.make} ${v.model}`}
                    className="field !w-auto capitalize"
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
                </td>
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/vehicles/${v._id}/edit`}
                      className="text-teal-700 hover:underline"
                    >
                      Edit
                    </Link>
                    {v.status === "available" && (
                      <Link
                        href={`/inventory/${v._id}`}
                        className="text-teal-700 hover:underline"
                      >
                        View
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(v)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
