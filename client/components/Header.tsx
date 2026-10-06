import Link from "next/link";
import HeaderNav from "@/components/HeaderNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
          One Best Price{" "}
          <span className="bg-gradient-to-r from-orange-500 to-teal-500 bg-clip-text text-transparent">
            Autos
          </span>
        </Link>
        <HeaderNav />
      </nav>
    </header>
  );
}