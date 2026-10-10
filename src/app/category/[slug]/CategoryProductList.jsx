"use client";

import { useState } from "react";
import Link from "next/link";

function toBanglaNumber(value) {
  return String(value).replace(
    /\d/g,
    (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]
  );
}

export default function CategoryProductList({ products }) {
  const [sortBy, setSortBy] = useState("default");

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "low") {
      return Number(a.today) - Number(b.today);
    }

    if (sortBy === "high") {
      return Number(b.today) - Number(a.today);
    }

    if (sortBy === "change") {
      return (
        Math.abs(Number(b.change?.pct ?? 0)) -
        Math.abs(Number(a.change?.pct ?? 0))
      );
    }

    return Number(a.id) - Number(b.id);
  });

  return (
    <>
      <section className="mt-5 flex min-h-14 items-center justify-end rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] px-4 py-3">
        <label htmlFor="sort" className="mr-2 text-sm text-gray-500">
          সাজান
        </label>

        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="max-w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-700 outline-none focus:border-green-600"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low">দাম: কম থেকে বেশি</option>
          <option value="high">দাম: বেশি থেকে কম</option>
          {/* <option value="change">দামের পরিবর্তন</option> */}
        </select>
      </section>

      <p className="my-4 text-sm text-gray-500">
        মোট {toBanglaNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      {sortedProducts.length > 0 ? (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => {
            const direction = product.change?.dir;

            const percentage = Math.abs(
              Number(product.change?.pct ?? 0)
            );

            const badgeClass =
              direction === "up"
                ? "bg-red-50 text-red-600"
                : direction === "down"
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-600";

            const badgeText =
              direction === "up"
                ? `▲ ${toBanglaNumber(percentage)}%`
                : direction === "down"
                  ? `▼ ${toBanglaNumber(percentage)}%`
                  : `— ${toBanglaNumber(percentage)}%`;

            const productHref = `/products/${encodeURIComponent(
              product.slug ?? product.id
            )}`;

            return (
              <Link
                key={product.id}
                href={productHref}
                className="block"
              >
                <article className="rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-3.5 transition hover:border-green-200 hover:shadow-sm sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f5ef] text-2xl">
                      {product.image || product.categoryIcon || "🛒"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-gray-800">
                        {product.nameBn}
                      </h2>

                      <p className="mt-0.5 text-xs text-gray-500">
                        প্রতি{" "}
                        {product.unit === "kg"
                          ? "কেজি"
                          : product.unit || "ইউনিট"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500">
                        আজকের দাম
                      </p>

                      <p className="text-lg font-extrabold text-gray-800">
                        {toBanglaNumber(product.today)} টাকা
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeClass}`}
                    >
                      {badgeText}
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </section>
      ) : (
        <div className="rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] px-4 py-12 text-center text-gray-600">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
        </div>
      )}
    </>
  );
}

