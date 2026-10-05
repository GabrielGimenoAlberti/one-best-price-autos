"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { login } from "@/lib/auth";

const input = "w-full rounded border border-gray-300 px-3 py-2 text-sm";
const label = "mb-1 block text-sm font-medium";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    setSubmitting(true);
    setError("");

    const result = await login(String(data.get("email")), String(data.get("password")));

    if ("error" in result) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setUser(result.user);
    router.push("/"); // admins will go to /admin once the dashboard exists
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">Log in</h1>
      <p className="mt-1 text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-700 hover:underline">
          Sign up
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
        <div>
          <label htmlFor="password" className={label}>Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className={input} />
        </div>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}