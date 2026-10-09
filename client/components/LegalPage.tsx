export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="glass">
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">Last updated: {updated}</p>
          <div className="mt-6 space-y-6 text-gray-700 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}