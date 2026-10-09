import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-950 text-gray-300">
      <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-teal-400" />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm sm:grid-cols-2">
        <div>
          <p className="font-semibold text-white">One Best Price Autos</p>
          <p className="mt-1">5081 South State Road 7, Unit 822, Davie, FL 33314</p>
          <p>(954) 380-0311</p>
        </div>
        <div className="sm:text-right">
          <div className="flex gap-4 sm:justify-end">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
          <p className="mt-2">
            © {new Date().getFullYear()} One Best Price Autos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}