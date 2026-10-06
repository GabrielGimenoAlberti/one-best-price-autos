"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Vehicle } from "@/lib/api";
import { createAdminVehicle, updateAdminVehicle, type VehicleInput } from "@/lib/admin";

const BODY_TYPES = ["sedan", "suv", "truck", "coupe", "hatchback", "van", "convertible", "wagon"];
const FUEL_TYPES = ["gasoline", "diesel", "hybrid", "electric"];
const TRANSMISSIONS = ["automatic", "manual"];
const DRIVETRAINS = ["fwd", "rwd", "awd", "4wd"];

const input = "field";
const label = "mb-1 block text-sm font-medium";

function Select({
  name, label: text, options, defaultValue, required, allowEmpty,
}: {
  name: string; label: string; options: string[]; defaultValue?: string;
  required?: boolean; allowEmpty?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className={label}>{text}</label>
      <select id={name} name={name} defaultValue={defaultValue ?? ""} required={required} className={`${input} capitalize`}>
        {allowEmpty && <option value="">Not specified</option>}
        {options.map((o) => (
          <option key={o} value={o}>{o === "fwd" || o === "rwd" || o === "awd" || o === "4wd" ? o.toUpperCase() : o}</option>
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
      features: text("features").split("\n").map((f) => f.trim()).filter(Boolean),
    };

    // Dropdowns: only send a value if one was chosen
    for (const key of ["fuelType", "transmission", "drivetrain"]) {
      if (text(key)) body[key] = text(key);
    }
    // Free text: when editing, send empty values so a field can be cleared
    for (const key of ["trim", "exteriorColor", "interiorColor", "description"]) {
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
    router.push("/admin");
    router.refresh();
  }

  const v = vehicle;

  return (
    <form onSubmit={handleSubmit} className="glass space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="vin" className={label}>VIN (17 characters)</label>
          <input id="vin" name="vin" required minLength={17} maxLength={17} defaultValue={v?.vin} className={`${input} uppercase`} />
        </div>
        <div>
          <label htmlFor="make" className={label}>Make</label>
          <input id="make" name="make" required maxLength={50} defaultValue={v?.make} className={input} />
        </div>
        <div>
          <label htmlFor="model" className={label}>Model</label>
          <input id="model" name="model" required maxLength={50} defaultValue={v?.model} className={input} />
        </div>
        <div>
          <label htmlFor="year" className={label}>Year</label>
          <input id="year" name="year" type="number" required min={1980} max={new Date().getFullYear() + 1} defaultValue={v?.year} className={input} />
        </div>
        <div>
          <label htmlFor="trim" className={label}>Trim (optional)</label>
          <input id="trim" name="trim" maxLength={50} defaultValue={v?.trim} className={input} />
        </div>
        <div>
          <label htmlFor="price" className={label}>Price ($)</label>
          <input id="price" name="price" type="number" required min={0} defaultValue={v?.price} className={input} />
        </div>
        <div>
          <label htmlFor="mileage" className={label}>Mileage</label>
          <input id="mileage" name="mileage" type="number" required min={0} defaultValue={v?.mileage} className={input} />
        </div>
        <Select name="bodyType" label="Body type" options={BODY_TYPES} defaultValue={v?.bodyType ?? "sedan"} required />
        <Select name="status" label="Status" options={["available", "pending", "sold"]} defaultValue={v?.status ?? "available"} required />
        <Select name="fuelType" label="Fuel type" options={FUEL_TYPES} defaultValue={v?.fuelType ?? "gasoline"} allowEmpty />
        <Select name="transmission" label="Transmission" options={TRANSMISSIONS} defaultValue={v?.transmission ?? "automatic"} allowEmpty />
        <Select name="drivetrain" label="Drivetrain" options={DRIVETRAINS} defaultValue={v?.drivetrain} allowEmpty />
        <div>
          <label htmlFor="exteriorColor" className={label}>Exterior color</label>
          <input id="exteriorColor" name="exteriorColor" maxLength={50} defaultValue={v?.exteriorColor} className={input} />
        </div>
        <div>
          <label htmlFor="interiorColor" className={label}>Interior color</label>
          <input id="interiorColor" name="interiorColor" maxLength={50} defaultValue={v?.interiorColor} className={input} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={label}>Description (optional)</label>
        <textarea id="description" name="description" rows={5} maxLength={5000} defaultValue={v?.description} className={input} />
      </div>

      <div>
        <label htmlFor="features" className={label}>Features (one per line)</label>
        <textarea id="features" name="features" rows={5} defaultValue={v?.features.join("\n")} placeholder={"Backup camera\nSunroof"} className={input} />
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? "Saving..." : editing ? "Save changes" : "Add vehicle"}
        </button>
        <Link href="/admin" className="btn btn-secondary">Cancel</Link>
      </div>
    </form>
  );
}