"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <p className="p-8 text-center text-gray-600">Loading...</p>;
  }

  if (user.role !== "admin") {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-gray-600">
          This area is only for dealership staff.
        </p>
        <Link href="/" className="btn btn-secondary mt-6">
          Back to home
        </Link>
      </main>
    );
  }

  return <>{children}</>;
}
