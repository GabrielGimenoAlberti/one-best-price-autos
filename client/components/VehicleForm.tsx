"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Vehicle } from "@/lib/api";
import {
  createAdminVehicle,
  updateAdminVehicle,
  uploadVehicleImages,
  type VehicleInput,
} from "@/lib/admin";

const BODY_TYPES = [
  "sedan",
  "suv",
  "truck",
  "coupe",
  "hatchback",
  "van",
  "convertible",
  "wagon",
];
const FUEL_TYPES = ["gasoline", "diesel", "hybrid", "electric"];
const TRANSMISSIONS = ["automatic", "manual"];
const DRIVETRAINS = ["fwd", "rwd", "awd", "4wd"];

const input = "field";
const label = "mb-1 block text-sm font-medium";

function Select({
  name,
  label: text,
  options,
  defaultValue,
  required,
  allowEmpty,
}: {
  name: string;
  label: string;
  options: string[];
  defaultValue?: string;
  required?: boolean;
  allowEmpty?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className={label}>
        {text}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className={`${input} capitalize`}
      >
        {allowEmpty && <option value="">Not specified</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "fwd" || o === "rwd" || o === "awd" || o === "4wd"
              ? o.toUpperCase()
              : o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const router = useRouter();
  const editing = Boolean(vehicle);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Preview URLs for the chosen photos, cleaned up when the list changes
  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files],
  );
  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  function addFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // lets you pick the same file again later
    if (picked.length === 0) return;

    const bad = picked.find(
      (f) =>
        !["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
        f.size > 5 * 1024 * 1024,
    );
    if (bad) {
      setError(`"${bad.name}" must be a JPG, PNG, or WebP under 5 MB.`);
      return;
    }
    if (files.length + picked.length > 10) {
      setError("You can add up to 10 photos at a time.");
      return;
    }
    setError("");
    setFiles((prev) => [...prev, ...picked]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const text = (k: string) => String(d.get(k) ?? "").trim();

    const body: VehicleInput = {
      vin: text("vin"),
      make: text("make"),
      model: text("model"),
      year: Number(d.get("year")),
      price: Number(d.get("price")),
      mileage: Number(d.get("mileage")),
      bodyType: text("bodyType"),
      status: text("status"),
      features: text("features")
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    // Dropdowns: only send a value if one was chosen
    for (const key of ["fuelType", "transmission", "drivetrain"]) {
      if (text(key)) body[key] = text(key);
    }
    // Free text: when editing, send empty values so a field can be cleared
    for (const key of [
      "trim",
      "exteriorColor",
      "interiorColor",
      "description",
    ]) {
      if (text(key) || editing) body[key] = text(key);
    }

    setSubmitting(true);
    setError("");
    const result = vehicle
      ? await updateAdminVehicle(vehicle._id, body)
      : await createAdminVehicle(body);

    if ("error" in result) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    if (!editing && files.length > 0) {
      const upload = await uploadVehicleImages(result.data._id, files);
      if ("error" in upload) {
        // The car is saved, so send the admin to the edit page to retry the photos
        router.push(`/admin/vehicles/${result.data._id}/edit`);
        router.refresh();
        return;
      }
    }
    router.push("/admin");
    router.refresh();
  }

  const v = vehicle;

  return (
    <form onSubmit={handleSubmit} className="glass space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="vin" className={label}>
            VIN (17 characters)
          </label>
          <input
            id="vin"
            name="vin"
            required
            minLength={17}
            maxLength={17}
            defaultValue={v?.vin}
            className={`${input} uppercase`}
          />
        </div>
        <div>
          <label htmlFor="make" className={label}>
            Make
          </label>
          <input
            id="make"
            name="make"
            required
            maxLength={50}
            defaultValue={v?.make}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="model" className={label}>
            Model
          </label>
          <input
            id="model"
            name="model"
            required
            maxLength={50}
            defaultValue={v?.model}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="year" className={label}>
            Year
          </label>
          <input
            id="year"
            name="year"
            type="number"
            required
            min={1980}
            max={new Date().getFullYear() + 1}
            defaultValue={v?.year}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="trim" className={label}>
            Trim (optional)
          </label>
          <input
            id="trim"
            name="trim"
            maxLength={50}
            defaultValue={v?.trim}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="price" className={label}>
            Price ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            min={0}
            defaultValue={v?.price}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="mileage" className={label}>
            Mileage
          </label>
          <input
            id="mileage"
            name="mileage"
            type="number"
            required
            min={0}
            defaultValue={v?.mileage}
            className={input}
          />
        </div>
        <Select
          name="bodyType"
          label="Body type"
          options={BODY_TYPES}
          defaultValue={v?.bodyType ?? "sedan"}
          required
        />
        <Select
          name="status"
          label="Status"
          options={["available", "pending", "sold"]}
          defaultValue={v?.status ?? "available"}
          required
        />
        <Select
          name="fuelType"
          label="Fuel type"
          options={FUEL_TYPES}
          defaultValue={v?.fuelType ?? "gasoline"}
          allowEmpty
        />
        <Select
          name="transmission"
          label="Transmission"
          options={TRANSMISSIONS}
          defaultValue={v?.transmission ?? "automatic"}
          allowEmpty
        />
        <Select
          name="drivetrain"
          label="Drivetrain"
          options={DRIVETRAINS}
          defaultValue={v?.drivetrain}
          allowEmpty
        />
        <div>
          <label htmlFor="exteriorColor" className={label}>
            Exterior color
          </label>
          <input
            id="exteriorColor"
            name="exteriorColor"
            maxLength={50}
            defaultValue={v?.exteriorColor}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="interiorColor" className={label}>
            Interior color
          </label>
          <input
            id="interiorColor"
            name="interiorColor"
            maxLength={50}
            defaultValue={v?.interiorColor}
            className={input}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={label}>
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          maxLength={5000}
          defaultValue={v?.description}
          className={input}
        />
      </div>

      <div>
        <label htmlFor="features" className={label}>
          Features (one per line)
        </label>
        <textarea
          id="features"
          name="features"
          rows={5}
          defaultValue={v?.features.join("\n")}
          placeholder={"Backup camera\nSunroof"}
          className={input}
        />
      </div>
      {!editing && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className={label}>Photos (optional, up to 10)</p>
              <p className="text-xs text-gray-500">
                The first photo is the main one. JPG, PNG, or WebP, up to 5 MB
                each.
              </p>
            </div>
            <label className="btn btn-secondary">
              Choose photos
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={addFiles}
                className="sr-only"
              />
            </label>
          </div>

          {files.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {files.map((f, i) => (
                <li key={`${f.name}-${f.lastModified}-${i}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previews[i]}
                      alt={f.name}
                      className="h-full w-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute left-2 top-2 rounded bg-orange-400 px-2 py-0.5 text-xs font-semibold text-gray-900">
                        Main
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="mt-1 text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? "Saving..." : editing ? "Save changes" : "Add vehicle"}
        </button>
        <Link href="/admin" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
