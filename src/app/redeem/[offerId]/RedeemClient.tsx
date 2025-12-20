"use client";

import { useState, useEffect } from "react";
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Ticket,
  Zap,
  QrCode
} from "lucide-react";

export default function RedeemClient({
  couponCode,
  redirectUrl,
  qrData,
  redemptionId,
}: {
  couponCode: string;
  redirectUrl: string;
  qrData: string;
  redemptionId: string;
}) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Generate QR code URL using a QR API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}`;
    setQrCodeUrl(qrUrl);
  }, [qrData]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* TAB SELECTOR */}
      <div className="flex gap-3 p-2 bg-orange-50 rounded-2xl">
        <button
          type="button"
          onClick={() => setShowQR(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            !showQR 
              ? "bg-white text-[#3C1A0D] shadow-lg" 
              : "text-[#3C1A0D]/40 hover:text-[#3C1A0D]"
          }`}
        >
          <Ticket size={14} /> Coupon Code
        </button>
        <button
          type="button"
          onClick={() => setShowQR(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            showQR 
              ? "bg-white text-[#3C1A0D] shadow-lg" 
              : "text-[#3C1A0D]/40 hover:text-[#3C1A0D]"
          }`}
        >
          <QrCode size={14} /> In-Store QR
        </button>
      </div>

      {!showQR ? (
        // COUPON CODE VIEW
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-[#3C1A0D] rounded-[32px] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
          
          <div className="relative bg-white border-4 border-dashed border-orange-100 rounded-[32px] p-10 text-center overflow-hidden shadow-2xl shadow-orange-900/5">
            <div className="absolute top-1/2 -left-4 h-8 w-8 bg-[#FFF5EE] border-r-4 border-orange-100 rounded-full -translate-y-1/2 shadow-inner" />
            <div className="absolute top-1/2 -right-4 h-8 w-8 bg-[#FFF5EE] border-l-4 border-orange-100 rounded-full -translate-y-1/2 shadow-inner" />

            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3C1A0D]/30 mb-6 flex items-center justify-center gap-2">
              <Ticket size={14} className="text-orange-600" /> Online Redemption Code
            </p>

            <div className="flex flex-col items-center gap-6">
              <span className="text-4xl md:text-5xl font-black tracking-tighter text-[#3C1A0D] font-mono italic select-all bg-orange-50/50 px-4 py-2 rounded-xl">
                {couponCode}
              </span>

              <button
                type="button"
                onClick={copyCode}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 active:scale-95 ${
                  copied 
                  ? "bg-orange-600 text-white shadow-xl shadow-orange-200" 
                  : "bg-[#3C1A0D] text-white hover:bg-orange-600 shadow-2xl shadow-orange-900/20"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={16} strokeWidth={4} /> Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy size={16} /> Copy Access Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // QR CODE VIEW
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-[#3C1A0D] rounded-[32px] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
          
          <div className="relative bg-white border-4 border-dashed border-orange-100 rounded-[32px] p-10 text-center overflow-hidden shadow-2xl shadow-orange-900/5">
            <div className="absolute top-1/2 -left-4 h-8 w-8 bg-[#FFF5EE] border-r-4 border-orange-100 rounded-full -translate-y-1/2 shadow-inner" />
            <div className="absolute top-1/2 -right-4 h-8 w-8 bg-[#FFF5EE] border-l-4 border-orange-100 rounded-full -translate-y-1/2 shadow-inner" />

            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3C1A0D]/30 mb-6 flex items-center justify-center gap-2">
              <QrCode size={14} className="text-orange-600" /> In-Store Verification QR
            </p>

            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-100">
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-64 h-64"
                  />
                )}
              </div>

              <div className="space-y-2 text-center">
                <p className="text-[11px] font-bold text-[#3C1A0D]">
                  Show this QR code to the merchant at checkout
                </p>
                <p className="text-[9px] text-[#3C1A0D]/50 uppercase tracking-wider">
                  Valid for in-store purchases only
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS - Only show for online redemption */}
      {!showQR && (
        <div className="space-y-5 pt-4">
          <a
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-4 w-full bg-orange-600 text-white py-6 rounded-[28px] font-black uppercase tracking-[0.3em] text-[11px] hover:bg-[#3C1A0D] transition-all shadow-2xl shadow-orange-600/30 overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            
            <Zap size={18} className="fill-current" />
            Redeem and Visit Store
            <ExternalLink size={16} className="opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>

          <div className="flex items-center justify-center gap-5 py-4">
              <div className="h-[2px] w-12 bg-orange-100" />
              <p className="text-[10px] font-black text-[#3C1A0D]/40 uppercase tracking-[0.25em] flex items-center gap-2">
                  <Sparkles size={14} className="text-orange-500 fill-orange-500" /> 
                  Enter at checkout
              </p>
              <div className="h-[2px] w-12 bg-orange-100" />
          </div>
        </div>
      )}

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