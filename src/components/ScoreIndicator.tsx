import { cn } from "@/lib/utils";

export function ScoreIndicator({ score, size = "md" }: { score: number, size?: "sm" | "md" | "lg" }) {
  const getColor = (s: number) => {
    if (s >= 70) return "text-emerald-600 bg-emerald-50";
    if (s >= 40) return "text-amber-600 bg-amber-50";
    return "text-rose-600 bg-rose-50";
  };

  const ringColor = (s: number) => {
    if (s >= 70) return "ring-emerald-200";
    if (s >= 40) return "ring-amber-200";
    return "ring-rose-200";
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-full font-bold shadow-sm ring-4",
      getColor(score),
      ringColor(score),
      size === "sm" ? "w-10 h-10 text-xs" : "",
      size === "md" ? "w-16 h-16 text-xl" : "",
      size === "lg" ? "w-24 h-24 text-3xl ring-8" : ""
    )}>
      {score}%
    </div>
  );
}
