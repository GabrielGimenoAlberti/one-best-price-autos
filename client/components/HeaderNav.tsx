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

  return (
    <div className="flex items-center gap-6 text-sm font-medium">
      <Link href="/inventory" className="hover:text-blue-700">
        Inventory
      </Link>

      {/* While loading, show nothing here so the nav doesn't flash "Login" for logged-in users */}
      {!loading &&
        (user ? (
          <>
            <span className="hidden text-gray-500 sm:inline">
              Hi, {user.name.split(" ")[0]}
            </span>
            <button type="button" onClick={handleLogout} className="hover:text-blue-700">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-blue-700">
              Login
            </Link>
            <Link
              href="/register"
              className="rounded bg-blue-700 px-3 py-1.5 text-white hover:bg-blue-800"
            >
              Sign up
            </Link>
          </>
        ))}
    </div>
  );
}