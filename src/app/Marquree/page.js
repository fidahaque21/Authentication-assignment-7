import Marquee from "react-fast-marquee";

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

const Marquree = async () => {
  const prices = await getPrices();

  return (
    <div className="overflow-hidden border-t border-gray-100 bg-gray-50">
      {prices.length > 0 ? (
        <Marquee
          speed={60}
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
                <span className="text-sm sm:text-base">
                  {item.categoryIcon || item.image || "🛒"}
                </span>

                <span className="whitespace-nowrap font-semibold text-gray-700">
                  {item.nameBn}
                </span>

                <span className="whitespace-nowrap font-medium text-gray-800">
                  {item.today ?? "—"} টাকা/{formatUnit(item.unit)}
                </span>

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
                    {Math.abs(Number(item.change.pct) || 0).toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 1,
                      }
                    )}
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
  );
};

export default Marquree;

