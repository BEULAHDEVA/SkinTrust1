import Image from "next/image";
import Link from "next/link";
import { TrustBadge } from "./TrustBadge";
import { ScoreIndicator } from "./ScoreIndicator";
import { ProductScoreData } from "@/lib/api";
import { Users } from "lucide-react";

export function ProductCard({ product }: { product: ProductScoreData | any }) {
  return (
    <Link href={`/product/${product.id}`} className="block w-full">
      <div className="bg-white border text-left border-gray-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] flex gap-4 h-full relative">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-50">
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        </div>
        <div className="flex flex-col flex-1">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{product.brand}</p>
          <h3 className="font-semibold text-gray-900 leading-tight mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-400 font-medium tracking-wide">
            <Users className="w-3.5 h-3.5 text-gray-300" /> {product.sampleSize || 'N/A'} MATCHING PROFILES
          </div>
          <div className="mt-auto flex items-center justify-between">
             <TrustBadge level={product.trustLevel} />
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <ScoreIndicator score={product.suitabilityScore} size="sm" />
        </div>
      </div>
    </Link>
  );
}
