import { cn } from "@/lib/utils";
import { CheckCircle2, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

export function TrustBadge({ level }: { level: "high" | "medium" | "low" }) {
  if (level === "high") {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
        <ShieldCheck className="w-3.5 h-3.5" />
        High Trust
      </div>
    );
  }
  
  if (level === "medium") {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
        <ShieldQuestion className="w-3.5 h-3.5" />
        Medium Trust
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">
      <ShieldAlert className="w-3.5 h-3.5" />
      Low Trust
    </div>
  );
}
