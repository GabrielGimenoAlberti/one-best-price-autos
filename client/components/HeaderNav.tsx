"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function HeaderNav() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  const link = "text-sm font-medium text-gray-700 transition hover:text-orange-600";

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <Link href="/inventory" className={link}>
        Inventory
      </Link>

      {!loading && user?.role === "admin" && (
        <Link href="/admin" className={link}>
          Admin
        </Link>
      )}

      {!loading &&
        (user ? (
          <>
            <span className="text-sm font-medium text-gray-900">
              Hi, {user.name.split(" ")[0]}
            </span>
            <button type="button" onClick={handleLogout} className={link}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={link}>
              Login
            </Link>
            <Link href="/register" className="btn btn-primary !px-4 !py-1.5">
              Sign up
            </Link>
          </>
        ))}
    </div>
  );
}