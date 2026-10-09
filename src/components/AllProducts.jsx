import Link from "next/link";

const API_URL = "https://api.api-store.workers.dev/api/bazardor/products";

// Convert English digits to Bengali digits
const toBanglaNumber = (number) => {
    return String(number).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);
};

// Format price with Bengali digits
const formatPrice = (price) => {
    return `${toBanglaNumber(Number(price).toLocaleString("en-US"))} টাকা`;
};

// Convert API unit into Bengali
const getUnit = (unit) => {
    const units = {
        kg: "প্রতি কেজি",
        liter: "প্রতি লিটার",
        litre: "প্রতি লিটার",
        dozen: "প্রতি ডজন",
        piece: "প্রতি পিস",
        pcs: "প্রতি পিস",
        gm: "প্রতি গ্রাম",
    };

    return units[unit?.toLowerCase()] || `প্রতি ${unit || "পণ্য"}`;
};

// Fetch all products
async function getProducts() {
    try {
        const res = await fetch(API_URL, {
            next: {
                revalidate: 3600,
            },
        });


        if (!res.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        // Support both array responses and { data: [...] }
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.data)) return data.data;

        return [];


    } catch (error) {
        console.error("Products fetch error:", error);
        return [];
    }
}

// Product card
function ProductCard({ product }) {
    const { slug, nameBn, image, unit, today, change } = product;

    const direction = change?.dir;
    const percentage = Math.abs(Number(change?.pct ?? 0));

    const badgeStyle =
        direction === "up"
            ? "bg-red-50 text-red-500"
            : direction === "down"
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-500";

    const arrow =
        direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

    return (
        <Link
            href={`/products/${slug}`}
            className="group rounded-xl border border-[#e5ebe5] bg-[#fbfdfb] p-3 transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-md sm:p-4"
        > <div className="flex items-start gap-3"> <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl">
            {image || product.categoryIcon || "🛒"} </div>


                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-[#303a32] group-hover:text-green-700">
                        {nameBn}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        {getUnit(unit)}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-2">
                <div>
                    <p className="text-[11px] text-gray-500">আজকের দাম</p>

                    <p className="mt-1 text-sm font-bold text-[#303a32]">
                        {formatPrice(today)}
                    </p>
                </div>

                <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${badgeStyle}`}
                >
                    {arrow} {toBanglaNumber(percentage.toFixed(1))}%
                </span>
            </div>
        </Link>


    );
}

// Product section
function ProductSection({ title, products, subtitle, type }) {
    return (<section className="mb-7 sm:mb-8"> <div className="mb-4"> <h2 className="text-base font-bold text-[#303a32] sm:text-lg">
        <span
            className={
                type === "up"
                    ? "text-red-500"
                    : type === "down"
                        ? "text-green-600"
                        : ""
            }
        >
            {type === "up" ? "▲ " : type === "down" ? "▼ " : ""} </span>
        {title} </h2>


        {subtitle && (
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        )}
    </div>

        {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            <p className="rounded-xl border border-gray-200 p-4 text-sm text-gray-500">
                এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
            </p>
        )}
    </section>


    );
}

const AllProducts = async () => {
    const products = await getProducts();

    const risingProducts = products
        .filter((product) => product.change?.dir === "up")
        .sort(
            (a, b) =>
                Number(b.change?.pct ?? 0) - Number(a.change?.pct ?? 0)
        )
        .slice(0, 6);

    const fallingProducts = products
        .filter((product) => product.change?.dir === "down")
        .sort(
            (a, b) =>
                Number(a.change?.pct ?? 0) - Number(b.change?.pct ?? 0)
        )
        .slice(0, 6);

    return (<main className="min-h-screen bg-[#f0f5f0]"> <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"> <ProductSection
        title="আজ দাম বেড়েছে"
        products={risingProducts}
        type="up"
    />


        <ProductSection
            title="আজ দাম কমেছে"
            products={fallingProducts}
            type="down"
        />

        <ProductSection
            title="সব পণ্য"
            subtitle={`মোট ${toBanglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে`}
            products={products}
        />

        {products.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">
                পণ্যের তথ্য লোড করা যায়নি। API URL পরীক্ষা করো।
            </p>
        )}
    </div>
    </main>


    );
};

export default AllProducts;
