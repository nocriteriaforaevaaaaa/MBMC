"use client";

import { useState } from "react";
import Link from "next/link";
import Tesseract from "tesseract.js";
import {
  ShieldCheck,
  Upload,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  X,
  Fingerprint,
  Zap,
} from "lucide-react";

export default function RegisterPage() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "id-upload">("form");

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    college: "",
    program: "",
    year: "",
  });

  // ID verification
  const [idImage, setIdImage] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  // Logic: Handle form submission
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    setFormData({
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      college: (form.elements.namedItem("college") as HTMLInputElement).value,
      program: (form.elements.namedItem("program") as HTMLInputElement).value,
      year: (form.elements.namedItem("year") as HTMLInputElement).value,
    });

    setStep("id-upload");
  }

  // Logic: Handle ID image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdImage(file);
      setIdPreview(URL.createObjectURL(file));
      setExtractedData(null);
    }
  };

  // Logic: Rotate image for vertical text
  const rotateImage = async (imageFile: File, angle: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        const rad = (angle * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));

        canvas.width = img.width * cos + img.height * sin;
        canvas.height = img.width * sin + img.height * cos;

        ctx!.translate(canvas.width / 2, canvas.height / 2);
        ctx!.rotate(rad);
        ctx!.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.toBlob((blob) => resolve(blob as Blob), "image/png");
      };

      img.src = URL.createObjectURL(imageFile);
    });
  };

  // Logic: Extract information
  const extractInfo = (horizontalText: string, verticalText: string) => {
    const info = {
      validTill: null as string | null,
      dob: null as string | null,
      citizenshipNo: null as string | null,
      collegeName: null as string | null,
      program: null as string | null,
      studentName: null as string | null,
    };

    const dobMatch = horizontalText.match(/Date of Birth[:\s]+(\d{4}[-/.]\d{2}[-/.]\d{2})/i);
    if (dobMatch) info.dob = dobMatch[1];

    const citizenMatch = horizontalText.match(/Citizenship No[.:\s]+(\d+)/i);
    if (citizenMatch) info.citizenshipNo = citizenMatch[1];

    const collegeMatch = horizontalText.match(/(TRIBHUVAN UNIVERSITY[\s\S]*?CAMPUS)/i);
    if (collegeMatch) {
      info.collegeName = collegeMatch[1].replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    }

    const programMatch = horizontalText.match(/BACHELOR\s+([\s\S]*?)(?:\n|Date)/i) || horizontalText.match(/(ELECTRONICS[\s\S]*?ENGINEERING)/i);
    if (programMatch) {
      info.program = programMatch[1].replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    }

    const nameMatch = horizontalText.match(/([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})?)\s*(?:FT|BACHELOR|Date)/i);
    if (nameMatch) {
      info.studentName = nameMatch[1].trim();
    }

    const validMatch = verticalText.match(/valid\s*till\s*(\d{4}[\/\-\.]\d{2}[\/\-\.]\d{2})/i) || verticalText.match(/(\d{4}[\/\-\.]\d{2}[\/\-\.]\d{2})/);
    if (validMatch) info.validTill = validMatch[1];

    return info;
  };

  // Logic: Process ID card
  const processIDCard = async () => {
    if (!idImage) return;
    setProcessing(true);
    setMsg("");

    try {
      const horizontalResult = await Tesseract.recognize(idImage, "eng", {
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      } as any);

      const rotatedBlob = await rotateImage(idImage, 90);
      const rotatedImage = new File([rotatedBlob], "rotated.png");
      const verticalResult = await Tesseract.recognize(rotatedImage, "eng", {
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      } as any);

      const extracted = extractInfo(horizontalResult.data.text, verticalResult.data.text);
      setExtractedData(extracted);
      setProcessing(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setMsg("Failed to scan ID: " + message);
      setProcessing(false);
    }
  };

  // Logic: Submit registration
  const submitRegistration = async () => {
    if (!extractedData?.validTill) {
      setMsg("Could not extract validity date from ID card");
      return;
    }

    const validTillDate = new Date(extractedData.validTill.replace(/[\/\.]/g, "-"));
    const today = new Date();

    if (validTillDate < today) {
      setMsg("Your student ID has expired.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, idVerification: extractedData }),
      });

      const data = await res.json();
      setMsg(data.message || data.error);
      setLoading(false);
    } catch (error) {
      setMsg("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF5EE] text-[#3C1A0D] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-200/30 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-300/20 blur-[120px]" />

      <div className={`w-full transition-all duration-700 ${step === "form" ? "max-w-md" : "max-w-6xl"} relative z-10`}>
        {/* Branding */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="h-14 w-14 rounded-2xl bg-orange-600 flex items-center justify-center shadow-xl shadow-orange-200 mb-4">
            <ShieldCheck className="text-white" size={30} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-[#3C1A0D]">
            EduPerks<span className="text-orange-600">.</span>
          </h1>
          <p className="text-[#3C1A0D]/60 font-bold uppercase tracking-widest text-[10px] mt-2">
            {step === "form" ? "Join the elite student club" : "Digital Identity Verification"}
          </p>
        </div>

        {/* STEP 1: BASIC FORM */}
        {step === "form" && (
          <form
            onSubmit={handleFormSubmit}
            className="bg-white/80 backdrop-blur-2xl border border-white p-10 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(255,120,0,0.1)] space-y-6"
          >
            <div className="space-y-4">
              <Input name="email" label="Institutional Email" placeholder="you@college.edu.np" required />
              <Input name="password" type="password" label="Password" required />
              <div className="grid grid-cols-2 gap-4">
                <Input name="college" label="College" placeholder="e.g. Pulchowk" />
                <Input name="program" label="Program" placeholder="e.g. BCT" />
              </div>
              <Input name="year" label="Current Year" placeholder="e.g. 3rd Year" />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-orange-600 py-5 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-[#3C1A0D] transition-all shadow-lg active:scale-95 shadow-orange-100"
            >
              Verify Student ID →
            </button>
          </form>
        )}

        {/* STEP 2: BIG VERIFICATION DASHBOARD */}
        {step === "id-upload" && (
          <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* LEFT SIDE: PHOTO VIEWPORT (Bigger) */}
            <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 rounded-[48px] shadow-sm flex flex-col min-h-[550px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Fingerprint size={20} className="text-orange-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#3C1A0D]/40">ID Viewport</span>
                </div>
                {idPreview && (
                  <button onClick={() => setIdPreview(null)} className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="flex-1 relative rounded-[32px] overflow-hidden border-2 border-dashed border-orange-100 bg-orange-50/20 flex items-center justify-center group">
                {!idPreview ? (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50/50 transition-all text-center px-10">
                    <div className="p-6 rounded-full bg-white shadow-xl mb-4 text-orange-600 group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <p className="font-black text-[#3C1A0D]">Upload Card Photo</p>
                    <p className="text-xs text-[#3C1A0D]/40 mt-2 italic">PNG or JPG accepted</p>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                ) : (
                  <div className="w-full h-full p-4 flex items-center justify-center">
                    <img src={idPreview} alt="ID" className="max-w-full max-h-[480px] object-contain rounded-xl shadow-2xl" />
                    {processing && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-orange-600 mb-2" size={48} />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3C1A0D]">Analyzing...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE: DATA PANEL (Bigger) */}
            <div className="bg-white/80 backdrop-blur-2xl border border-white p-10 rounded-[48px] shadow-sm min-h-[550px] flex flex-col">
              <div className="flex items-center gap-2 mb-10">
                <Zap size={20} className="text-orange-600 fill-orange-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#3C1A0D]/40">Extraction Metrics</h3>
              </div>

              {!idPreview ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 px-10 space-y-6">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#3C1A0D] flex items-center justify-center">
                    <Upload size={36} />
                  </div>
                  <p className="text-base font-bold leading-relaxed">Please upload your ID card to<br/>begin automated verification.</p>
                </div>
              ) : !extractedData ? (
                <div className="flex-1 flex flex-col justify-center space-y-10">
                  <div className="space-y-4">
                    <p className="text-3xl font-black leading-tight text-[#3C1A0D]">Verify Identity</p>
                    <p className="text-sm font-medium text-[#3C1A0D]/60 leading-relaxed">
                      Our system will scan institutional markers and validity dates to activate your account.
                    </p>
                  </div>
                  <button
                    onClick={processIDCard}
                    disabled={processing}
                    className="w-full bg-[#3C1A0D] text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 disabled:opacity-50 transition-all shadow-xl"
                  >
                    {processing ? "OCR Scanning..." : "Start AI Extraction"}
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
                  {/* The Result Card */}
                  <div className="p-8 bg-[#3C1A0D] rounded-[32px] text-white shadow-2xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-orange-600 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-orange-200" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Extracted</span>
                    </div>

                    <div className="space-y-6">
                      <InfoRow label="Full Name" value={extractedData.studentName} isDark />
                      <InfoRow label="Educational Institution" value={extractedData.collegeName} isDark />
                      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                        <InfoRow label="Program" value={extractedData.program} isDark />
                        <InfoRow label="Valid Until" value={extractedData.validTill} isDark isHighlight />
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto space-y-4 pt-8">
                    <button
                      onClick={submitRegistration}
                      disabled={loading}
                      className="w-full bg-orange-600 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : "Complete Registration →"}
                    </button>
                    <button onClick={() => setStep("form")} className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/40 hover:text-orange-600 transition-colors flex items-center justify-center gap-2">
                      <ArrowLeft size={14} /> Back to details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="mt-12 text-sm text-[#3C1A0D]/60 text-center font-medium">
          Already a member?{" "}
          <Link href="/login" className="text-orange-600 font-bold hover:underline">
            Sign in here
          </Link>
        </p>

        {msg && (
          <div className="mt-8 p-5 rounded-3xl bg-[#3C1A0D] text-white text-center text-[10px] font-black uppercase tracking-widest shadow-xl animate-in zoom-in-95">
            {msg}
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------- UI COMPONENTS ---------- */
function Input({ label, name, placeholder, type = "text", required = false }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black uppercase tracking-widest text-[#3C1A0D]/40 ml-2">{label}</label>
      <input
        name={name} type={type} placeholder={placeholder} required={required}
        className="w-full rounded-2xl border border-orange-100 bg-white/50 px-5 py-4 text-sm font-bold text-[#3C1A0D] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-[#3C1A0D]/20"
      />
    </div>
  );
}

function InfoRow({ label, value, isDark, isHighlight }: { label: string; value: string | null; isDark?: boolean; isHighlight?: boolean }) {
  return (
    <div className="space-y-1">
      <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? "text-orange-200/50" : "text-slate-400"}`}>
        {label}
      </p>
      <p className={`text-base font-bold leading-tight break-words ${isHighlight ? "text-orange-500" : isDark ? "text-white" : "text-[#3C1A0D]"}`}>
        {value || "Not Detected"}
      </p>
    </div>
  );
}