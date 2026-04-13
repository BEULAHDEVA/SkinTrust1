import { fetchProductDetail } from "@/lib/api";
import { TrustBadge } from "@/components/TrustBadge";
import { ScoreIndicator } from "@/components/ScoreIndicator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Sparkles, Users } from "lucide-react";
import Link from "next/link";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await fetchProductDetail(resolvedParams.id);

  return (
    <main className="flex-1 max-w-lg mx-auto w-full bg-white min-h-screen pb-24">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <TrustBadge level={product.trustLevel as any} />
      </header>

      <div className="px-4 py-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-40 h-40 rounded-3xl overflow-hidden bg-gray-50 shadow-sm mb-6">
            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-2">{product.brand}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{product.name}</h1>
          <ScoreIndicator score={product.suitabilityScore} size="lg" />
           <div className="mt-4 flex items-center gap-1.5 justify-center text-sm font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full mb-2">
            <Users className="w-4 h-4" /> Based on {product.sampleSize} similar profiles
          </div>
          <p className="text-emerald-600 font-medium">82% Match for Combination + PCOD Skin</p>
        </div>

        <div className="bg-gray-50 rounded-3xl p-6 mb-8">
          <div className="flex gap-2 h-4 rounded-full overflow-hidden mb-4">
            <div style={{ width: `${product.workedPercentage}%` }} className="bg-emerald-400"></div>
            <div style={{ width: `${product.neutralPercentage}%` }} className="bg-amber-400"></div>
            <div style={{ width: `${product.failedPercentage}%` }} className="bg-rose-400"></div>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> {product.workedPercentage}% Worked
            </div>
            <div className="flex items-center gap-1.5 text-amber-700">
              <AlertCircle className="w-4 h-4" /> {product.neutralPercentage}% Neutral
            </div>
            <div className="flex items-center gap-1.5 text-rose-700">
              <XCircle className="w-4 h-4" /> {product.failedPercentage}% Failed
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-skin-lavender" />
            Ingredient Intelligence
          </h2>
          <div className="flex flex-col gap-3">
            {product.ingredientFlags.map((flag, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border ${
                flag.status === 'positive' ? 'bg-emerald-50 border-emerald-100' :
                flag.status === 'warning' ? 'bg-amber-50 border-amber-100' :
                'bg-rose-50 border-rose-100'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${
                    flag.status === 'positive' ? 'text-emerald-600' :
                    flag.status === 'warning' ? 'text-amber-600' :
                    'text-rose-600'
                  }`}>
                    {flag.status === 'positive' ? <CheckCircle2 className="w-5 h-5" /> :
                     flag.status === 'warning' ? <AlertCircle className="w-5 h-5" /> :
                     <XCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{flag.ingredient}</h4>
                    <p className="text-sm text-gray-600 mt-1">{flag.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews from Similar Profiles</h2>
          <div className="flex flex-col gap-4">
            {product.reviews.map((review: any) => (
              <div key={review.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                    <span className="inline-block mt-1 text-xs font-medium bg-skin-lavender/30 text-purple-700 px-2 py-0.5 rounded-md">
                      {review.similarity}
                    </span>
                  </div>
                  {review.outcome === 'worked' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                   review.outcome === 'neutral' ? <AlertCircle className="w-5 h-5 text-amber-500" /> :
                   <XCircle className="w-5 h-5 text-rose-500" />}
                </div>
                <p className="text-gray-600 text-sm">{review.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 max-w-lg mx-auto">
        <Button size="lg" className="w-full flex gap-2">
          Will it suit me? <Sparkles className="w-5 h-5" />
        </Button>
      </div>
    </main>
  );
}
