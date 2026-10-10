
import Link from "next/link";
import { notFound } from "next/navigation";

const API_URL =
  "https://api.api-store.workers.dev/api/bazardor/products";

const toBanglaNumber = (value) =>
  String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);

const formatPrice = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    !Number.isFinite(Number(value))
  ) {
    return "—";
  }

  const price = Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });

  return `${toBanglaNumber(price)} টাকা`;
};

const getUnit = (unit) => {
  const units = {
    kg: "প্রতি কেজি",
    kilogram: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    l: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
    gm: "প্রতি গ্রাম",
    g: "প্রতি গ্রাম",
  };

  return (
    units[String(unit || "").toLowerCase()] ||
    `প্রতি ${unit || "ইউনিট"}`
  );
};

function extractProducts(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data?.products)) return data.data.products;

  return [];
}

async function getProduct(slug) {
  const res = await fetch(API_URL, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Products API error: ${res.status}`);
  }

  const data = await res.json();
  const products = extractProducts(data);

  const product = products.find(
    (item) =>
      String(item.slug) === String(slug) ||
      String(item.id) === String(slug)
  );

  return product ?? null;
} // এই closing brace-টি অবশ্যই থাকতে হবে

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const markets = Array.isArray(product.markets)
    ? product.markets
    : [];

  const validMarkets = markets.filter((market) => {
    if (
      market.min === null ||
      market.min === undefined ||
      market.min === "" ||
      market.max === null ||
      market.max === undefined ||
      market.max === ""
    ) {
      return false;
    }

    const min = Number(market.min);
    const max = Number(market.max);

    return (
      Number.isFinite(min) &&
      Number.isFinite(max) &&
      min <= max
    );
  });

  const lowestPrice =
    validMarkets.length > 0
      ? Math.min(
        ...validMarkets.map((market) => Number(market.min))
      )
      : null;

  const highestPrice =
    validMarkets.length > 0
      ? Math.max(
        ...validMarkets.map((market) => Number(market.max))
      )
      : null;

  const averagePrice =
    validMarkets.length > 0
      ? validMarkets.reduce(
        (sum, market) =>
          sum +
          (Number(market.min) + Number(market.max)) / 2,
        0
      ) / validMarkets.length
      : null;

  const direction = product.change?.dir;
  const rawPercentage = Number(product.change?.pct ?? 0);

  const percentage = Number.isFinite(rawPercentage)
    ? Math.abs(rawPercentage)
    : 0;

  const isUp = direction === "up" && percentage > 0;
  const isDown = direction === "down" && percentage > 0;

  const changeColor = isUp
    ? "text-red-600"
    : isDown
      ? "text-green-700"
      : "text-gray-500";

  const changeArrow = isUp ? "▲" : isDown ? "▼" : "—";

  const productName =
    product.nameBn || product.name || "পণ্যের বিস্তারিত";

  const categoryName =
    product.categoryNameBn || product.category || "ক্যাটাগরি";

  const categorySlug =
    product.categorySlug ||
    (typeof product.category === "object"
      ? product.category?.slug
      : null) ||
    (typeof product.category === "string"
      ? product.category
      : "");

  const categoryHref = categorySlug
    ? `/category/${encodeURIComponent(categorySlug)}`
    : "/";

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-3 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm"
        >
          <Link href="/" className="transition hover:text-green-700">
            হোম
          </Link>

          <span>›</span>

          <Link
            href={categoryHref}
            className="transition hover:text-green-700"
          >
            {categoryName}
          </Link>

          <span>›</span>

          <span className="font-medium text-gray-700">
            {productName}
          </span>
        </nav>

        {/* Product Header */}
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f0f5ef] text-3xl sm:h-16 sm:w-16 sm:text-4xl">
              {product.categoryIcon || "🛒"}
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-extrabold text-[#303a32] sm:text-2xl">
                {productName}
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {getUnit(product.unit)} · {categoryName}
              </p>


              <p className="mt-1 text-xs text-gray-500">
                গতকালের তুলনায় আজ দাম{" "}
                {isUp ? (
                  <span className="font-bold text-red-600">
                    বেড়েছে {toBanglaNumber(percentage.toFixed(1))}%
                  </span>
                ) : isDown ? (
                  <span className="font-bold text-green-700">
                    কমেছে {toBanglaNumber(percentage.toFixed(1))}%
                  </span>
                ) : (
                  <span className="font-bold text-gray-500">
                    অপরিবর্তিত
                  </span>
                )}
              </p>


            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 rounded-xl bg-[#f0f5ef] px-4 py-3 sm:min-w-36 sm:flex-col sm:gap-1 sm:text-center">
            <div>
              <p className="text-xs text-gray-500">আজকের দাম</p>

              <p className="text-2xl font-extrabold text-[#303a32]">
                {formatPrice(product.today).replace(" টাকা", "")}
              </p>

              <p className="text-xs text-gray-500">
                টাকা / {product.unit || "ইউনিট"}
              </p>
            </div>

            <span className={`text-xs font-bold ${changeColor}`}>
              {changeArrow} {toBanglaNumber(percentage.toFixed(1))}%
            </span>
          </div>
        </section>

        {/* Price Summary */}
        <section className="mt-4 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-4 sm:p-5">
          <h2 className="mb-3 text-base font-bold text-[#303a32]">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div className="rounded-xl border border-[#e5ebe5] p-3 sm:p-4">
              <p className="text-xs text-gray-500">সর্বনিম্ন দাম</p>
              <p className="mt-1 text-xl font-extrabold text-green-700">
                {formatPrice(lowestPrice)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                বাজারের সর্বনিম্ন মূল্য
              </p>
            </div>

            <div className="rounded-xl border border-[#e5ebe5] p-3 sm:p-4">
              <p className="text-xs text-gray-500">সর্বোচ্চ দাম</p>
              <p className="mt-1 text-xl font-extrabold text-red-600">
                {formatPrice(highestPrice)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                বাজারের সর্বোচ্চ মূল্য
              </p>
            </div>

            <div className="rounded-xl border border-[#e5ebe5] p-3 sm:p-4">
              <p className="text-xs text-gray-500">আজকের দাম</p>
              <p className="mt-1 text-xl font-extrabold text-green-700">
                {formatPrice(product.today)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {getUnit(product.unit)} অনুযায়ী
              </p>
            </div>
          </div>



          {averagePrice !== null && (
            <p className="mt-3 text-xs leading-5 text-gray-500">
              বাজারগুলোর সর্বনিম্ন ও সর্বোচ্চ দামের মধ্যবিন্দুর গড়:{" "}
              <span className="font-semibold text-[#303a32]">
                {formatPrice(averagePrice)}
              </span>
            </p>
          )}
        </section>

        {/* Market Price Table */}
        <section className="mt-4 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-3 sm:p-5">
          <div className="mb-3">
            <h2 className="text-base font-bold text-[#303a32] sm:text-lg">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {toBanglaNumber(validMarkets.length)}টি বাজারের দামের তুলনা
            </p>
          </div>

          {validMarkets.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-[#e5ebe5]">
              <table className="w-full min-w-[540px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#f0f5f0] text-gray-500">
                    <th className="px-3 py-3 font-semibold sm:px-4">
                      বাজার
                    </th>
                    <th className="px-3 py-3 font-semibold sm:px-4">
                      বিভাগ
                    </th>
                    <th className="px-3 py-3 text-right font-semibold sm:px-4">
                      সর্বনিম্ন
                    </th>
                    <th className="px-3 py-3 text-right font-semibold sm:px-4">
                      সর্বোচ্চ
                    </th>
                    <th className="px-3 py-3 text-right font-semibold sm:px-4">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {validMarkets.map((market, index) => {
                    const marketAverage =
                      (Number(market.min) + Number(market.max)) / 2;

                    return (
                      <tr
                        key={`${market.market || "market"}-${index}`}
                        className={`border-t border-[#e1e8e1] ${index % 2 === 0
                          ? "bg-[#fbfdfb]"
                          : "bg-[#f0f5f0]"
                          }`}
                      >
                        <td className="px-3 py-3 font-medium text-[#303a32] sm:px-4">
                          {market.market || "—"}
                        </td>
                        <td className="px-3 py-3 text-gray-600 sm:px-4">
                          {market.division || "—"}
                        </td>
                        <td className="px-3 py-3 text-right text-gray-700 sm:px-4">
                          {formatPrice(market.min)}
                        </td>
                        <td className="px-3 py-3 text-right text-gray-700 sm:px-4">
                          {formatPrice(market.max)}
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-[#303a32] sm:px-4">
                          {formatPrice(marketAverage)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl bg-[#f0f5f0] p-5 text-center text-sm text-gray-500">
              এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
            </p>
          )}
        </section>

        <div className="mt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#dce6dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#303a32] transition hover:border-green-500 hover:text-green-700"
          >
            <span aria-hidden="true">←</span>
            সব পণ্যে ফিরে যাও
          </Link>
        </div>
      </div>
    </main>
  );
}
