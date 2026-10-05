import { getVehicles } from "@/lib/api";

export default async function Home() {
  const { vehicles, pagination } = await getVehicles();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">One Best Price Autos</h1>
      <p className="mt-2">{pagination.total} vehicles available</p>
      <ul className="mt-4 space-y-1">
        {vehicles.map((v) => (
          <li key={v._id}>
            {v.year} {v.make} {v.model}: ${v.price.toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}