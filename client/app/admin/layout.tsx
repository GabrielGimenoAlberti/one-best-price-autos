import AdminGuard from "@/components/AdminGuard";

export const metadata = {
  title: "Admin | One Best Price Autos",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </AdminGuard>
  );
}