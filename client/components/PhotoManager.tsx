"use client";

import Image from "next/image";
import { useState } from "react";
import type { VehicleImage } from "@/lib/api";
import { deleteVehicleImage, uploadVehicleImages } from "@/lib/admin";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_PHOTOS = 30;
const BATCH_SIZE = 10;

export default function PhotoManager({
  vehicleId,
  initialImages,
}: {
  vehicleId: string;
  initialImages: VehicleImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // lets you pick the same file again later
    if (files.length === 0) return;

    if (images.length + files.length > MAX_PHOTOS) {
  setError(
    `A vehicle can have at most ${MAX_PHOTOS} photos. You can add ${Math.max(0, MAX_PHOTOS - images.length)} more.`
  );
  return;
}
    const bad = files.find(
      (f) => !TYPES.includes(f.type) || f.size > MAX_BYTES,
    );
    if (bad) {
      setError(`"${bad.name}" must be a JPG, PNG, or WebP under 5 MB.`);
      return;
    }

    setBusy(true);
setError("");
for (let i = 0; i < files.length; i += BATCH_SIZE) {
  const end = Math.min(i + BATCH_SIZE, files.length);
  setProgress(`Uploading ${i + 1} to ${end} of ${files.length}...`);
  const result = await uploadVehicleImages(vehicleId, files.slice(i, i + BATCH_SIZE));
  if ("error" in result) {
    setError(i > 0 ? `${i} of ${files.length} photos uploaded. ${result.error}` : result.error);
    break;
  }
  setImages(result.data.images);
}
setProgress("");
setBusy(false);
  }

  async function handleRemove(imageId: string) {
    if (!window.confirm("Remove this photo permanently?")) return;
    setBusy(true);
    setError("");
    const result = await deleteVehicleImage(vehicleId, imageId);
    if ("error" in result) setError(result.error);
    else setImages(result.data.images);
    setBusy(false);
  }

  return (
    <section className="glass mb-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Photos</h2>
          <p className="text-sm text-gray-600">
            The first photo is the main one shown on the inventory page. JPG,
            PNG, or WebP, up to 5 MB each.
          </p>
        </div>
        <label
          className={`btn btn-primary ${busy ? "pointer-events-none opacity-60" : ""}`}
        >
          {busy ? progress || "Working..." : "Upload photos"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={busy}
            onChange={handleFiles}
            className="sr-only"
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {images.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          No photos yet.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, i) => (
            <li key={img._id} className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={img.url}
                  alt={`Photo ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 20vw, 50vw"
                  className="object-cover"
                />
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded bg-orange-400 px-2 py-0.5 text-xs font-semibold text-gray-900">
                    Main
                  </span>
                )}
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => handleRemove(img._id)}
                className="mt-1 text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
