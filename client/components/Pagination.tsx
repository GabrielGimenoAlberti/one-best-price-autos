import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  params: Record<string, string>;
};

export default function Pagination({ page, totalPages, params }: Props) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const q = new URLSearchParams({ ...params, page: String(p) });
    return `/inventory?${q.toString()}`;
  };

  const btn = "btn btn-secondary";
  const disabled = "btn btn-secondary opacity-50 pointer-events-none";

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-4"
      aria-label="Pagination"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={btn}>
          Previous
        </Link>
      ) : (
        <span className={disabled}>Previous</span>
      )}
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={btn}>
          Next
        </Link>
      ) : (
        <span className={disabled}>Next</span>
      )}
    </nav>
  );
}
