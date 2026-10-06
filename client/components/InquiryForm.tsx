"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

const input = "field";
const label = "mb-1 block text-sm font-medium";

export default function InquiryForm({
  vehicleId,
  vehicleTitle,
}: {
  vehicleId: string;
  vehicleTitle: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // capture before the await below
    const data = new FormData(form);
    const phone = String(data.get("phone") ?? "").trim();

    const body = {
      vehicleId,
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      ...(phone ? { phone } : {}),
    };

    setStatus("sending");
    setError("");

    try {
      const res = await fetch(`${API_URL}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        form.reset();
        setStatus("sent");
        return;
      }

      const json = await res.json().catch(() => null);
      setError(
        json?.errors?.[0] ??
          json?.message ??
          "Something went wrong. Please try again.",
      );
      setStatus("error");
    } catch {
      setError("Could not reach the server. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        <p className="font-semibold">Thanks! Your message was sent.</p>
        <p className="mt-1">We will be in touch soon.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-3 underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
        <label htmlFor="message" className={label}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          maxLength={2000}
          defaultValue={`I'm interested in the ${vehicleTitle}.`}
          className={input}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-primary w-full"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
