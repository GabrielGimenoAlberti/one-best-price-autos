import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "@/lib/api";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const photo = vehicle.images[0];
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  return (
    <Link
      href={`/inventory/${vehicle._id}`}
      className="glass glass-edge glass-hover block overflow-hidden"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        {photo ? (
          <Image
            src={photo.url}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Photo coming soon
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
        {vehicle.trim && (
          <p className="text-sm text-gray-500">{vehicle.trim}</p>
        )}
        <p className="mt-2 text-xl font-bold text-teal-700">
          ${vehicle.price.toLocaleString("en-US")}
        </p>
        <p className="text-sm text-gray-600">
          {vehicle.mileage.toLocaleString("en-US")} miles
          <span className="capitalize"> · {vehicle.bodyType}</span>
        </p>
      </div>
    </Link>
  );
}
