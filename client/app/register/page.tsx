"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { register } from "@/lib/auth";

const input = "field";
const label = "mb-1 block text-sm font-medium";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const phone = String(data.get("phone") ?? "").trim();

    setSubmitting(true);
    setError("");

    const result = await register({
      name: String(data.get("name")),
      email: String(data.get("email")),
      password: String(data.get("password")),
      ...(phone ? { phone } : {}),
    });

    if ("error" in result) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setUser(result.user);
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <p className="mt-1 text-sm text-gray-600">
        Already have one?{" "}
        <Link href="/login" className="text-teal-700 hover:underline">
          Log in
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={label}>
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            className={input}
          />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={input}
          />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={30}
            autoComplete="tel"
            className={input}
          />
        </div>
        <div>
          <label htmlFor="password" className={label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            className={input}
          />
          <p className="mt-1 text-xs text-gray-500">At least 8 characters.</p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full"
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </main>
  );
}
