"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Vehicles" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex gap-2">
      {TABS.map((t) => {
        const active =
          t.href === "/admin"
            ? pathname === "/admin" || pathname.startsWith("/admin/vehicles")
            : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`btn ${active ? "btn-primary" : "btn-secondary"}`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}