import { notFound } from "next/navigation";
import CategoryProductList from "./CategoryProductList";

export const instant = false;

async function getCategories() {
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/categories",
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error("Categories fetch failed");
  }

  const data = await res.json();

  return Array.isArray(data)
    ? data
    : data.data ?? data.categories ?? [];
}

async function getProducts() {
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/products",
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    throw new Error("Products fetch failed");
  }

  const data = await res.json();

  return Array.isArray(data)
    ? data
    : data.data ?? data.products ?? [];
}

export default async function CategoryProducts({ params }) {
  const { slug } = await params;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const category = categories.find(
    (item) => item.slug === slug
  );

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) => product.category === slug
  );

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <section className="flex items-center gap-3 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-4 sm:p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f5ef] text-3xl">
            {category.icon || "🛒"}
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-gray-800 sm:text-2xl">
              {category.nameBn}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              মোট {categoryProducts.length}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </section>

        <CategoryProductList products={categoryProducts} />
      </div>
    </main>
  );
}

