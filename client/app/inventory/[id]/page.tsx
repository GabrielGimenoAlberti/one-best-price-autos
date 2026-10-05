import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVehicle } from "@/lib/api";
import ImageGallery from "@/components/ImageGallery";
import InquiryForm from "@/components/InquiryForm";

// Lets the page and the title share one API request
const loadVehicle = cache(getVehicle);

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const v = await loadVehicle(id);
  if (!v) return { title: "Vehicle not found | One Best Price Autos" };
  return {
    title: `${v.year} ${v.make} ${v.model} | One Best Price Autos`,
    description: `${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ""} with ${v.mileage.toLocaleString("en-US")} miles for $${v.price.toLocaleString("en-US")}.`,
  };
}

export default async function VehicleDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const v = await loadVehicle(id);
  if (!v) notFound();

  const title = `${v.year} ${v.make} ${v.model}`;

  const specs: [string, string | undefined][] = [
    ["Mileage", `${v.mileage.toLocaleString("en-US")} miles`],
    ["Body type", v.bodyType],
    ["Fuel type", v.fuelType],
    ["Transmission", v.transmission],
    ["Drivetrain", v.drivetrain?.toUpperCase()],
    ["Exterior color", v.exteriorColor],
    ["Interior color", v.interiorColor],
    ["VIN", v.vin],
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/inventory" className="text-sm text-blue-700 hover:underline">
        ← Back to inventory
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ImageGallery images={v.images} title={title} />

          {v.description && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="mt-2 whitespace-pre-line text-gray-700">{v.description}</p>
            </section>
          )}

          {v.features.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold">Features</h2>
              <ul className="mt-2 grid gap-1 text-gray-700 sm:grid-cols-2">
                {v.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {v.trim && <p className="text-gray-500">{v.trim}</p>}
            <p className="mt-2 text-3xl font-bold text-blue-700">
              ${v.price.toLocaleString("en-US")}
            </p>
            {v.status === "pending" && (
              <p className="mt-2 inline-block rounded bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800">
                Sale pending
              </p>
            )}
          </div>

          <dl className="divide-y divide-gray-200 rounded-lg border border-gray-200 text-sm">
            {specs
              .filter(([, value]) => value)
              .map(([name, value]) => (
                <div key={name} className="flex justify-between gap-4 px-4 py-2">
                  <dt className="text-gray-500">{name}</dt>
                  <dd className="text-right font-medium capitalize">{value}</dd>
                </div>
              ))}
          </dl>

          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="mb-3 text-lg font-semibold">Ask about this vehicle</h2>
            <InquiryForm vehicleId={v._id} vehicleTitle={title} />
          </div>
        </aside>
      </div>
    </main>
  );
}