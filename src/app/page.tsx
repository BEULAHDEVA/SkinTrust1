import { fetchDashboardData } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { Search } from "lucide-react";

export default async function Home() {
  const { bestMatches, trending, avoid } = await fetchDashboardData();

  return (
    <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">SkinTrust</h1>
        <p className="text-gray-500">Welcome back! Here's what works for your <span className="font-semibold text-skin-lavender bg-purple-50 px-2 py-0.5 rounded-full">Combination / PCOD</span> skin.</p>
      </header>

      <div className="relative mb-8 shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 bg-white border-none rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-skin-lavender text-base shadow-sm"
          placeholder="Search for a product or brand..."
        />
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Best for Your Skin</h2>
          <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">High Matches</span>
        </div>
        <div className="flex flex-col gap-4">
          {bestMatches.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Trending Right Now</h2>
        </div>
        <div className="flex flex-col gap-4">
          {trending.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Consider Avoiding</h2>
          <span className="text-sm font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">High Risk</span>
        </div>
        <div className="flex flex-col gap-4">
          {avoid.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
