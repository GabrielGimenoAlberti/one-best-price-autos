const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
};

type Result = { user: User } | { error: string };

async function send(path: string, body?: unknown): Promise<Result> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      credentials: "include", // sends and receives the login cookie
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => null);
    if (res.ok) return { user: json.user };
    return { error: json?.errors?.[0] ?? json?.message ?? "Something went wrong." };
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }
}

export const login = (email: string, password: string) =>
  send("/auth/login", { email, password });

export const register = (data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) => send("/auth/register", data);

export async function logout(): Promise<void> {
  await send("/auth/logout");
}

export async function getMe(): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()).user;
  } catch {
    return null;
  }
}