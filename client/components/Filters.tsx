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

const SORTS = [
  { value: "newest", label: "Newest listed" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "year_desc", label: "Year: newest first" },
  { value: "mileage_asc", label: "Mileage: lowest first" },
];

const input = "field";
const label = "mb-1 block text-sm font-medium";

export default function Filters({
  values,
}: {
  values: Record<string, string>;
}) {
  return (
    <form action="/inventory" method="get" className="space-y-4">
      <div>
        <label htmlFor="make" className={label}>
          Make
        </label>
        <input
          id="make"
          name="make"
          defaultValue={values.make ?? ""}
          placeholder="e.g. Toyota"
          className={input}
        />
      </div>

      <div>
        <label htmlFor="bodyType" className={label}>
          Body type
        </label>
        <select
          id="bodyType"
          name="bodyType"
          defaultValue={values.bodyType ?? ""}
          className={`${input} capitalize`}
        >
          <option value="">Any</option>
          {BODY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="fuelType" className={label}>
          Fuel type
        </label>
        <select
          id="fuelType"
          name="fuelType"
          defaultValue={values.fuelType ?? ""}
          className={`${input} capitalize`}
        >
          <option value="">Any</option>
          {FUEL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="minPrice" className={label}>
            Min price
          </label>
          <input
            id="minPrice"
            name="minPrice"
            type="number"
            min="0"
            defaultValue={values.minPrice ?? ""}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className={label}>
            Max price
          </label>
          <input
            id="maxPrice"
            name="maxPrice"
            type="number"
            min="0"
            defaultValue={values.maxPrice ?? ""}
            className={input}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="minYear" className={label}>
            Min year
          </label>
          <input
            id="minYear"
            name="minYear"
            type="number"
            defaultValue={values.minYear ?? ""}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="maxYear" className={label}>
            Max year
          </label>
          <input
            id="maxYear"
            name="maxYear"
            type="number"
            defaultValue={values.maxYear ?? ""}
            className={input}
          />
        </div>
      </div>

      <div>
        <label htmlFor="maxMileage" className={label}>
          Max mileage
        </label>
        <input
          id="maxMileage"
          name="maxMileage"
          type="number"
          min="0"
          defaultValue={values.maxMileage ?? ""}
          className={input}
        />
      </div>

      <div>
        <label htmlFor="sort" className={label}>
          Sort by
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={values.sort ?? "newest"}
          className={input}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary flex-1">
          Apply filters
        </button>
        <a href="/inventory" className="btn btn-secondary">
          Clear
        </a>
      </div>
    </form>
  );
}
