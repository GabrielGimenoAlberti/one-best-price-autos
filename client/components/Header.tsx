import Link from "next/link";
import HeaderNav from "@/components/HeaderNav";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-blue-700">
          One Best Price Autos
        </Link>
        <HeaderNav />
      </nav>
    </header>
  );
}