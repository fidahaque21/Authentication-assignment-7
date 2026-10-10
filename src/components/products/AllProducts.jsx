
import ProductSort from "@/components/products/ProductSort";

const API_URL =
  "https://api.api-store.workers.dev/api/bazardor/products";

async function getProducts() {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;

    return [];
  } catch (error) {
    console.error("Products fetch error:", error);
    return [];
  }
}

const toBanglaNumber = (number) =>
  String(number).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);

export default async function AllProducts() {
  const products = await getProducts();

  return (
    <section className="mx-auto mb-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {products.length > 0 ? (
        <ProductSort products={products} />
      ) : (
        <div className="rounded-xl border border-gray-200 p-6 text-center text-sm text-gray-500">
          পণ্যের তথ্য লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করো।
        </div>
      )}

      </section>
  );
}