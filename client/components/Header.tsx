import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-blue-700">
          One Best Price Autos
        </Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/inventory" className="hover:text-blue-700">
            Inventory
          </Link>
          <Link href="/login" className="hover:text-blue-700">
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}