import Link from "next/link";
import DateText from "@/components/DateText";
import Marquee from "react-fast-marquee";

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

// Fetch products and prices
async function getPrices() {
  try {
    const res = await fetch(
      "https://api.api-store.workers.dev/api/bazardor/products",
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Products API error: ${res.status}`);
    }

    const data = await res.json();

    const products = Array.isArray(data)
      ? data
      : data.data ?? data.products ?? data.prices ?? [];

    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error("Price fetch error:", error);
    return [];
  }
}

// Convert unit into Bangla
function formatUnit(unit) {
  const units = {
    kg: "কেজি",
    gram: "গ্রাম",
    liter: "লিটার",
    piece: "পিস",
    pcs: "পিস",
  };

  return units[unit] || unit || "একক";
}

const Navbar = async () => {
  const [categories, prices] = await Promise.all([
    getCategories(),
    getPrices(),
  ]);

  return (
    <nav className="border-b border-gray-200 bg-white">
      {/* Top Section */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Logo and Date */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2"
          >
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
      <div className="overflow-hidden border-t border-gray-100 bg-gray-50">
        {prices.length > 0 ? (
          <Marquee
            speed={100}
            pauseOnHover={true}
            gradient={false}
            autoFill={true}
          >
            {prices.map((item) => {
              const isUp = item.change?.dir === "up";
              const isDown = item.change?.dir === "down";

              return (
                <div
                  key={item.id}
                  className="flex shrink-0 items-center gap-1.5 border-r border-gray-200 px-4 py-2 text-xs sm:gap-2 sm:px-5 sm:text-sm"
                >
                  {/* Product Emoji */}
                  <span className="text-sm sm:text-base">
                    {item.image || item.categoryIcon || "🛒"}
                  </span>

                  {/* Product Name */}
                  <span className="whitespace-nowrap font-semibold text-gray-700">
                    {item.nameBn}
                  </span>

                  {/* Current Price */}
                  <span className="whitespace-nowrap font-medium text-gray-800">
                    {item.today ?? "—"} টাকা/
                    {formatUnit(item.unit)}
                  </span>

                  {/* Price Change */}
                  {item.change && (
                    <span
                      className={`whitespace-nowrap font-bold ${
                        isUp
                          ? "text-red-600"
                          : isDown
                            ? "text-green-600"
                            : "text-gray-500"
                      }`}
                    >
                      {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                      {Math.abs(
                        Number(item.change.pct) || 0
                      ).toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </span>
                  )}
                </div>
              );
            })}
          </Marquee>
        ) : (
          <div className="px-4 py-2 text-xs text-gray-500">
            বর্তমানে পণ্যের দামের তথ্য পাওয়া যাচ্ছে না।
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

