export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-950 text-gray-300">
      <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-teal-400" />
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
        © {new Date().getFullYear()} One Best Price Autos. All rights reserved.
      </div>
    </footer>
  );
}
