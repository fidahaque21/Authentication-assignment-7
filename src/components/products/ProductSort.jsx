"use client";

import Link from "next/link";
import { useState } from "react";

const toBanglaNumber = (number) =>
  String(number).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);

const formatPrice = (price) => {
  if (
    price === null ||
    price === undefined ||
    price === "" ||
    !Number.isFinite(Number(price))
  ) {
    return "দাম পাওয়া যায়নি";
  }

  return `${toBanglaNumber(
    Number(price).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })
  )} টাকা`;
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
    piece_s: "প্রতি পিস",
    gm: "প্রতি গ্রাম",
    g: "প্রতি গ্রাম",
  };

  return units[String(unit || "").toLowerCase()] ||
    `প্রতি ${unit || "পণ্য"}`;
};

const getChange = (product) => {
  const dir = String(product.change?.dir || "").toLowerCase();
  const pct = Number(product.change?.pct ?? 0);

  if (
    !Number.isFinite(pct) ||
    dir === "flat" ||
    dir === "same" ||
    pct === 0
  ) {
    return { direction: "flat", percentage: 0 };
  }

  if (dir === "up") {
    return { direction: "up", percentage: Math.abs(pct) };
  }

  if (dir === "down") {
    return { direction: "down", percentage: Math.abs(pct) };
  }

  return { direction: "flat", percentage: 0 };
};

function ProductCard({ product }) {
  const { direction, percentage } = getChange(product);

  // ছবির মতো: দাম বাড়লে লাল, কমলে সবুজ
  const badgeStyle = {
    up: "bg-red-50 text-red-500",
    down: "bg-green-50 text-green-600",
    flat: "bg-gray-100 text-gray-500",
  };

  const arrow = {
    up: "▲",
    down: "▼",
    flat: "—",
  };

  const emoji =
    product.categoryIcon ||
    product.emoji ||
    "🛒";

  const image = product.image;

  const isImageUrl =
    typeof image === "string" &&
    /^https?:\/\//i.test(image);

  // const productHref = `/products/${product.slug ?? product.id}`;
 const productHref = `/products/${encodeURIComponent(
  product.slug ?? product.id
)}`;

  return (

    <Link
      href={productHref}
      className="group flex min-w-0 flex-col rounded-xl border border-gray-200 !bg-white p-3 text-gray-800 shadow-sm transition hover:border-green-300 hover:shadow-md sm:p-4"
    >


      {/* Product information */}
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f0f5f0] text-xl sm:h-11 sm:w-11 sm:text-2xl">
          {isImageUrl ? (
            <img
              src={image}
              alt={product.nameBn || "পণ্য"}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            image || emoji
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 text-sm font-bold text-[#303a32] group-hover:text-green-700">
            {product.nameBn || "নাম পাওয়া যায়নি"}
          </h3>

          <p className="mt-0.5 text-[11px] text-gray-500">
            {getUnit(product.unit)}
          </p>
        </div>
      </div>

      {/* Price and change badge */}
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] text-gray-500 sm:text-[11px]">
            আজকের দাম
          </p>

          <p className="mt-0.5 text-sm font-bold text-[#303a32] sm:text-base">
            {formatPrice(product.today)}
          </p>
        </div>

        <span
          className={`mb-0.5 shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${badgeStyle[direction]}`}
        >
          {arrow[direction]}{" "}
          {toBanglaNumber(percentage.toFixed(1))}%
        </span>
      </div>
    </Link>
  );
}

function SectionHeading({ title, subtitle, color }) {
  return (
    <div className="mb-3">
      <h2 className="flex items-center gap-1.5 text-base font-bold text-[#303a32] sm:text-lg">
        {color && (
          <span className={color}>
            {color.includes("red") ? "▲" : "▼"}
          </span>
        )}
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <p className="rounded-xl border border-[#e5ebe5] bg-white p-4 text-sm text-gray-500">
        এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard
          key={product.id ?? product.slug ?? index}
          product={product}
        />
      ))}
    </div>
  );
}

export default function ProductSort({ products = [] }) {
  const [sortBy, setSortBy] = useState("default");

  const risers = products
    .filter(
      (product) => getChange(product).direction === "up"
    )
    .sort(
      (a, b) =>
        getChange(b).percentage -
        getChange(a).percentage
    )
    .slice(0, 6);

  const fallers = products
    .filter(
      (product) => getChange(product).direction === "down"
    )
    .sort(
      (a, b) =>
        getChange(b).percentage -
        getChange(a).percentage
    )
    .slice(0, 6);

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = Number(a.today);
    const priceB = Number(b.today);

    if (sortBy === "low") {
      return (
        (Number.isFinite(priceA) ? priceA : Infinity) -
        (Number.isFinite(priceB) ? priceB : Infinity)
      );
    }

    if (sortBy === "high") {
      return (
        (Number.isFinite(priceB) ? priceB : -Infinity) -
        (Number.isFinite(priceA) ? priceA : -Infinity)
      );
    }

    return 0;
  });

  return (
    <div className="space-y-7 sm:space-y-8">

      {/* Section A: Price increased */}
      <section>
        <SectionHeading
          title="আজ দাম বেড়েছে"
          color="text-red-500"
          subtitle="যেসব পণ্যের দাম আজ সবচেয়ে বেশি বেড়েছে"
        />

        <ProductGrid products={risers} />
      </section>

      {/* Section B: Price decreased */}
      <section>
        <SectionHeading
          title="আজ দাম কমেছে"
          color="text-green-600"
          subtitle="যেসব পণ্যের দাম আজ সবচেয়ে বেশি কমেছে"
        />

        <ProductGrid products={fallers} />
      </section>

      {/* Section C: All products */}
      <section>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionHeading title="সব পণ্য" />

            <p className="-mt-2 text-xs text-gray-500">
              মোট {toBanglaNumber(products.length)}টি পণ্য
              দেখানো হচ্ছে
            </p>
          </div>

          {/* Sort By: functionality preserved */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="product-sort"
              className="shrink-0 text-xs text-gray-500 sm:text-sm"
            >
              সাজান:
            </label>

            <select
              id="product-sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              className="min-w-0 rounded-lg border border-[#e1e8e1] bg-white px-3 py-2 text-xs text-[#303a32] outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:text-sm"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low">
                দাম: কম থেকে বেশি
              </option>
              <option value="high">
                দাম: বেশি থেকে কম
              </option>
            </select>
          </div>
        </div>

        <ProductGrid products={sortedProducts} />
      </section>
    </div>
  );
}

