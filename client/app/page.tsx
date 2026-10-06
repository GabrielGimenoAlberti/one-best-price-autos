import Link from "next/link";
import { getVehicles, type Vehicle } from "@/lib/api";
import VehicleCard from "@/components/VehicleCard";

// Change this to the dealer's real email
const CONTACT_EMAIL = "example@email.com";

const TYPES = [
  { value: "sedan", label: "Sedans" },
  { value: "suv", label: "SUVs" },
  { value: "truck", label: "Trucks" },
  { value: "coupe", label: "Coupes" },
  { value: "hatchback", label: "Hatchbacks" },
  { value: "van", label: "Vans" },
];

const POINTS = [
  {
    title: "One best price",
    text: "Clear, upfront pricing on every vehicle.",
  },
  {
    title: "Hand-picked inventory",
    text: "A focused selection we'd be happy to drive ourselves.",
  },
  {
    title: "Easy to reach",
    text: "Send a message and we'll get back to you.",
  },
];

export default async function Home() {
  let featured: Vehicle[] = [];
  let failed = false;

  try {
    const data = await getVehicles({ limit: "6", sort: "newest" });
    featured = data.vehicles;
  } catch {
    failed = true;
  }

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-20 text-center sm:pt-28">
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Quality used cars,
          <br />
          <span className="bg-gradient-to-r from-orange-500 to-teal-500 bg-clip-text text-transparent">
            one best price.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-700">
          Browse our current selection and find your next vehicle with simple,
          honest pricing.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/inventory" className="btn btn-primary !px-6 !py-3 !text-base">
            Browse inventory
          </Link>
          <a href="#contact" className="btn btn-secondary !px-6 !py-3 !text-base">
            Contact us
          </a>
        </div>
      </section>

      {/* Browse by type */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-gray-600">
          Browse by type
        </h2>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          {TYPES.map((t) => (
            <Link
              key={t.value}
              href={`/inventory?bodyType=${t.value}`}
              className="glass glass-hover inline-block"
            >
              <span className="block px-7 py-3 text-sm font-medium">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured vehicles */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold">Newest arrivals</h2>
          <Link href="/inventory" className="text-sm font-medium text-teal-700 hover:underline">
            View all →
          </Link>
        </div>

        {failed ? (
          <div className="glass mt-6">
            <p className="p-8 text-center text-gray-600">
              We could not load vehicles right now. Please try again in a moment.
            </p>
          </div>
        ) : featured.length === 0 ? (
          <div className="glass mt-6">
            <p className="p-8 text-center text-gray-600">
              New vehicles are coming soon. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <VehicleCard key={v._id} vehicle={v} />
            ))}
          </div>
        )}
      </section>

      {/* Why us: three compact boxes side by side */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {POINTS.map((p) => (
            <div key={p.title} className="glass">
              <div className="px-5 py-5 text-center">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-gray-700">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16 pt-12">
        <div className="glass glass-edge">
          <div className="px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="text-2xl font-bold">Not sure which car is right for you?</h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-700">
              Browse the inventory and send us a message from any vehicle page.
              We will help you find the right fit.
            </p>
            <p className="mx-auto mt-3 max-w-lg text-gray-700">
              Or email us anytime at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-teal-700 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <Link href="/inventory" className="btn btn-primary mt-8 !px-6 !py-3 !text-base">
              See what is available
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}