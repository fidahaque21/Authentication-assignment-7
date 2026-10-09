import Link from "next/link";
import DateText from "@/components/DateText";
import Marquree from "@/app/Marquree/page";

// Fetch categories
async function getCategories() {
  try {
    const res = await fetch(
      "https://api.api-store.workers.dev/api/bazardor/categories",
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Categories API error: ${res.status}`);
    }

    const data = await res.json();

    const categories = Array.isArray(data)
      ? data
      : data.data ?? data.categories ?? [];

    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error("Category fetch error:", error);
    return [];
  }
}

const Navbar = async () => {
  const categories = await getCategories();

  return (
    <nav className=" border-b border-gray-200 bg-white">
      {/* Top Section */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Logo and Date */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-xl shadow-sm">
              🛒
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-extrabold leading-tight text-gray-900 sm:text-xl">
                বাজার দর
              </span>

              <span className="mt-0.5 text-[10px] font-medium text-gray-600 sm:text-xs">
                <DateText />
              </span>
            </div>
          </Link>

          {/* Authentication Buttons */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-6">
            <Link
              href="/login"
              className="rounded-md px-2 py-2 text-xs font-semibold text-gray-800 transition hover:text-green-700 sm:text-sm"
            >
              সাইন ইন
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-green-700 px-3 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-green-800 sm:px-5 sm:text-sm"
            >
              সাইন আপ
            </Link>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-6 overflow-x-auto py-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-gray-700 transition hover:text-green-700"
            >
              <span>{category.icon}</span>
              <span>{category.nameBn}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Price Ticker */}
      <Marquree />
    </nav>
  );
};

export default Navbar;

