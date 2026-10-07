import { getVehicles } from "@/lib/api";
import VehicleCard from "@/components/VehicleCard";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";

export const metadata = {
  title: "Available Vehicles | One Best Price Autos",
};

const ALLOWED = [
  "make",
  "bodyType",
  "fuelType",
  "minPrice",
  "maxPrice",
  "minYear",
  "maxYear",
  "maxMileage",
  "sort",
  "page",
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;

  // Keep only known filters with real values (the API rejects empty strings)
  const params: Record<string, string> = {};
  for (const key of ALLOWED) {
    const value = raw[key];
    const single = Array.isArray(value) ? value[0] : value;
    if (single && single.trim() !== "") params[key] = single.trim();
  }

  const { vehicles, pagination } = await getVehicles(params);

  // Pagination links should keep the filters but not the old page number
  const { page: _page, ...filterParams } = params;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Available Vehicles</h1>
      <p className="mt-1 text-sm text-gray-600">
        {pagination.total} {pagination.total === 1 ? "vehicle" : "vehicles"}{" "}
        found
      </p>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <details className="glass p-4 lg:hidden">
            <summary className="cursor-pointer font-semibold">Filters</summary>
            <div className="mt-4">
              <Filters values={params} />
            </div>
          </details>
          <div className="hidden lg:block">
            <Filters values={params} />
          </div>
        </aside>

        <section className="flex-1">
          {vehicles.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
              No vehicles match those filters. Try widening your search.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => (
                <VehicleCard key={v._id} vehicle={v} />
              ))}
            </div>
          )}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            params={filterParams}
          />
        </section>
      </div>
    </main>
  );
}
