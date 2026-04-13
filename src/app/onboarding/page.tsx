"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

const STEPS = [
  {
    id: "skin_type",
    question: "What's your primary skin type?",
    options: [
      { label: "Oily", value: "oily", desc: "Shiny all over, prone to breakouts" },
      { label: "Dry", value: "dry", desc: "Flaky, tight, lacking moisture" },
      { label: "Combination", value: "combination", desc: "Oily T-zone, dry/normal cheeks" },
      { label: "Normal", value: "normal", desc: "Well balanced, no major issues" },
    ]
  },
  {
    id: "hormonal",
    question: "Do you have any hormonal conditions affecting your skin?",
    options: [
      { label: "Yes, PCOD/PCOS", value: "pcod", desc: "Diagnosed or suspected" },
      { label: "Other Hormonal", value: "other", desc: "Thyroid, pregnancy, etc." },
      { label: "None", value: "none", desc: "No known hormonal issues" },
      { label: "Prefer not to say", value: "skip", desc: "" },
    ]
  },
  {
    id: "acne",
    question: "How frequently do you experience breakouts?",
    options: [
      { label: "Never", value: "none", desc: "Clear skin most days" },
      { label: "Occasionally", value: "occasional", desc: "Mostly around my cycle" },
      { label: "Frequently", value: "frequent", desc: "Consistent active acne" },
    ]
  }
];

export default function Onboarding() {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const router = useRouter();

  const currentStep = STEPS[stepIdx];
  const progress = ((stepIdx + 1) / STEPS.length) * 100;

  const handleSelect = (value: string) => {
    setAnswers({ ...answers, [currentStep.id]: value });
    if (stepIdx < STEPS.length - 1) {
      setTimeout(() => setStepIdx(stepIdx + 1), 300);
    } else {
      setTimeout(() => router.push("/"), 500);
    }
  };

  return (
    <main className="flex-1 max-w-md mx-auto w-full px-6 py-12 bg-white min-h-screen flex flex-col">
      <div className="w-full bg-gray-100 h-2 rounded-full mb-12 overflow-hidden">
        <div 
          className="bg-skin-lavender h-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex-1 mt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
          {currentStep.question}
        </h1>

        <div className="flex flex-col gap-4">
          {currentStep.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`text-left p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                answers[currentStep.id] === opt.value 
                  ? "border-skin-lavender bg-purple-50 shadow-sm" 
                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <h3 className="font-semibold text-lg text-gray-900">{opt.label}</h3>
              {opt.desc && <p className="text-gray-500 mt-1">{opt.desc}</p>}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8 text-center bg-white flex flex-col items-center">
         {stepIdx === STEPS.length - 1 && answers[currentStep.id] && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
             <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
               <Sparkles className="w-8 h-8" />
             </div>
             <p className="font-bold text-gray-900 text-lg">Building your skin profile...</p>
           </div>
         )}
      </div>
    </main>
  );
}
