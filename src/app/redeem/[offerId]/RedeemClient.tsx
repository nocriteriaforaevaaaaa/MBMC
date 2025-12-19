"use client";

import { useState } from "react";

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
  };

  return (
    <div className="space-y-3">
      {/* Copy Code */}
      <button
        type="button"
        onClick={copyCode}
        className="w-full border border-slate-300 rounded-md py-2
                   text-sm font-medium hover:bg-slate-50 transition"
      >
        {copied ? "Code copied ✓" : "Copy code"}
      </button>

      {/* GUARANTEED REDIRECT */}
      <a
        href={redirectUrl}
        className="block w-full text-center
                   bg-indigo-600 text-white py-2.5 rounded-md
                   hover:bg-indigo-500 transition text-sm font-medium"
      >
        Redeem & Visit Store
      </a>
    </div>
  );
}
