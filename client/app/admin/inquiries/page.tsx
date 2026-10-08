"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Pagination } from "@/lib/api";
import { deleteInquiry, listInquiries, setInquiryStatus, type Inquiry } from "@/lib/admin";

const FILTERS = [
  { value: "new", label: "New" },
  { value: "handled", label: "Handled" },
  { value: "", label: "All" },
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [status, setStatus] = useState("new");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const result = await listInquiries({ status, page });
      if (cancelled) return;
      if ("error" in result) {
        setError(result.error);
      } else {
        setInquiries(result.data.inquiries);
        setPagination(result.data.pagination);
        setError("");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [status, page, reload]);

  async function toggle(i: Inquiry) {
    const result = await setInquiryStatus(
      i._id,
      i.status === "new" ? "handled" : "new",
    );
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setReload((n) => n + 1);
  }

  async function remove(i: Inquiry) {
    if (!window.confirm(`Delete the message from ${i.name} permanently?`)) return;
    const result = await deleteInquiry(i._id);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setReload((n) => n + 1);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Inquiries</h1>
      <p className="mt-1 text-sm text-gray-600">
        {pagination ? `${pagination.total} shown` : "Loading..."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => {
              setStatus(f.value);
              setPage(1);
            }}
            className={`btn ${status === f.value ? "btn-primary" : "btn-secondary"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && inquiries.length === 0 && (
        <p className="glass mt-6 p-8 text-center text-gray-500">
          No inquiries here.
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {inquiries.map((i) => (
          <li key={i._id} className="glass p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {i.name}
                  {i.status === "new" && (
                    <span className="ml-2 rounded bg-orange-400 px-2 py-0.5 align-middle text-xs font-semibold text-gray-900">
                      New
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm">
                  <a
                    href={`mailto:${i.email}`}
                    className="text-teal-700 hover:underline"
                  >
                    {i.email}
                  </a>
                  {i.phone && (
                    <>
                      {" · "}
                      <a
                        href={`tel:${i.phone}`}
                        className="text-teal-700 hover:underline"
                      >
                        {i.phone}
                      </a>
                    </>
                  )}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(i.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              About:{" "}
              {i.vehicle ? (
                <Link
                  href={`/admin/vehicles/${i.vehicle._id}/edit`}
                  className="text-teal-700 hover:underline"
                >
                  {i.vehicle.year} {i.vehicle.make} {i.vehicle.model}
                </Link>
              ) : (
                "General question"
              )}
            </p>

            <p className="mt-3 whitespace-pre-line text-sm">{i.message}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => toggle(i)}
                className={`btn ${i.status === "new" ? "btn-primary" : "btn-secondary"}`}
              >
                {i.status === "new" ? "Mark handled" : "Mark as new"}
              </button>
              <button type="button" onClick={() => remove(i)} className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
