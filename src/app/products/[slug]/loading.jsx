'use client'
export default function Loading() {
return ( <main className="min-h-screen bg-[#f0f5f0] px-4 py-6 sm:px-6"> <div className="mx-auto max-w-5xl animate-pulse">
{/* Breadcrumb Skeleton */} <div className="mb-5 h-4 w-48 rounded bg-gray-200" />

    {/* Product Header Skeleton */}
    <section className="flex items-center gap-4 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-5">
      <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200" />

      <div className="flex-1 space-y-3">
        <div className="h-6 w-48 max-w-full rounded bg-gray-200" />
        <div className="h-3 w-32 rounded bg-gray-200" />
        <div className="h-3 w-52 max-w-full rounded bg-gray-200" />
      </div>

      <div className="hidden h-20 w-28 rounded-xl bg-gray-200 sm:block" />
    </section>

    {/* Price Summary Skeleton */}
    <section className="mt-4 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-5">
      <div className="mb-4 h-5 w-40 rounded bg-gray-200" />

      <div className="grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="space-y-3 rounded-xl border border-[#e5ebe5] p-4"
          >
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="h-6 w-28 rounded bg-gray-200" />
            <div className="h-3 w-32 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </section>

    {/* Market Table Skeleton */}
    <section className="mt-4 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-5">
      <div className="mb-4 h-5 w-48 rounded bg-gray-200" />

      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-10 rounded-lg bg-gray-100"
          />
        ))}
      </div>
    </section>

    <p className="mt-5 text-center text-sm text-gray-500">
      পণ্যের তথ্য লোড হচ্ছে...
    </p>
  </div>
</main>


);
}
