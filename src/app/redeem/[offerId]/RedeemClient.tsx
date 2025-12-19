"use client";

import { useState } from "react";
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Ticket,
  Zap
} from "lucide-react";

export default function RedeemClient({
  couponCode,
  redirectUrl,
}: {
  couponCode: string;
  redirectUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* COUPON DISPLAY BOX */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-[24px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        
        <div className="relative bg-white border-2 border-dashed border-slate-200 rounded-[24px] p-8 text-center overflow-hidden">
          {/* Decorative Corner Notch */}
          <div className="absolute top-1/2 -left-3 h-6 w-6 bg-[#FDFDFF] border-r border-slate-200 rounded-full -translate-y-1/2" />
          <div className="absolute top-1/2 -right-3 h-6 w-6 bg-[#FDFDFF] border-l border-slate-200 rounded-full -translate-y-1/2" />

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center justify-center gap-2">
            <Ticket size={12} /> Your Unique Code
          </p>

          <div className="flex flex-col items-center gap-4">
            <span className="text-4xl md:text-5xl font-black tracking-widest text-slate-900 font-mono italic">
              {couponCode}
            </span>

            <button
              type="button"
              onClick={copyCode}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                copied 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" 
                : "bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-slate-200"
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} strokeWidth={3} /> Code Copied
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-4 pt-2">
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center gap-3 w-full bg-indigo-600 text-white py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-100 overflow-hidden"
        >
          {/* Animated Shine Effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          
          <Zap size={16} className="fill-current" />
          Redeem & Visit Store
          <ExternalLink size={14} className="opacity-50" />
        </a>

        <div className="flex items-center justify-center gap-4 py-2">
            <div className="h-[1px] w-8 bg-slate-100" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-400" /> 
                Applied at checkout
            </p>
            <div className="h-[1px] w-8 bg-slate-100" />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}