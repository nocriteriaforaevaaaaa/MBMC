// app/merchant/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Loader2, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Upload, 
  FileText, 
  X,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";

/* --- Reusable Input Component --- */
function Input({ label, name, type = "text", placeholder, required = false, maxLength }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black uppercase tracking-widest text-[#3C1A0D]/40 ml-2">
        {label} {required && <span className="text-orange-600">*</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="w-full rounded-2xl border border-orange-100 bg-white px-5 py-4 text-sm font-bold text-[#3C1A0D] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-[#3C1A0D]/20"
      />
    </div>
  );
}

export default function MerchantRegisterPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"error" | "success" | "info">("error");
  const [loading, setLoading] = useState(false);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMsg("File size must be less than 5MB");
        setMsgType("error");
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setMsg("Please upload a JPG, PNG, or PDF file");
        setMsgType("error");
        return;
      }
      
      setPanFile(file);
      setMsg("");
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const removeFile = () => {
    setPanFile(null);
    setPreviewUrl(null);
    setMsg("");
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const form = e.currentTarget;

    try {
      // Get PAN input (no format validation)
      const panInput = (form.elements.namedItem("pan") as HTMLInputElement).value.toUpperCase();

      // Upload PAN card directly to Cloudinary
      let panCardUrl = "";
      if (panFile) {
        setUploading(true);
        setMsg("Uploading document...");
        setMsgType("info");
        
        // Create form data for Cloudinary
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', panFile);
        cloudinaryFormData.append('upload_preset', 'student_verification');
        cloudinaryFormData.append('folder', 'eduperks/pancards');

        // Direct upload to Cloudinary
        const uploadRes = await fetch(
          'https://api.cloudinary.com/v1_1/dgn6phoed/auto/upload',
          {
            method: 'POST',
            body: cloudinaryFormData,
          }
        );

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error?.message || 'Failed to upload document');
        }

        const uploadData = await uploadRes.json();
        panCardUrl = uploadData.secure_url;
        
        setUploading(false);
        setMsg("Document uploaded! Creating account...");
      }

      // Register merchant
      const res = await fetch("/api/merchant/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: (form.elements.namedItem("email") as HTMLInputElement).value,
          password: (form.elements.namedItem("password") as HTMLInputElement).value,
          legalName: (form.elements.namedItem("legalName") as HTMLInputElement).value,
          tradeName: (form.elements.namedItem("tradeName") as HTMLInputElement).value,
          pan: panInput,
          panCardUrl,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMsg("Account created successfully! Redirecting...");
        setMsgType("success");
        setTimeout(() => router.push("/merchant"), 1000);
      } else {
        setMsg(data.error || "Registration failed");
        setMsgType("error");
      }
    } catch (err: any) {
      setLoading(false);
      setUploading(false);
      setMsg(err.message || "Connection error. Please try again.");
      setMsgType("error");
      console.error("Registration error:", err);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF5EE] text-[#3C1A0D] flex items-center justify-center py-12 px-6 relative overflow-hidden font-sans">
      {/* BACKGROUND ORBS */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-200/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-300/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[600px] relative z-10">
        {/* LOGO SECTION */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="h-14 w-14 rounded-2xl bg-orange-600 flex items-center justify-center shadow-xl shadow-orange-200 mb-4">
            <ShieldCheck className="text-white" size={30} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-[#3C1A0D]">
            EduPerks<span className="text-orange-600">.</span>
          </h1>
          <p className="text-[#3C1A0D]/60 font-bold uppercase tracking-widest text-[10px] mt-2">
            Global Merchant Partnership
          </p>
        </div>

        {/* REGISTRATION CARD */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(255,120,0,0.1)] border border-white relative overflow-hidden">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-orange-600 fill-orange-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Growth Portal</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#3C1A0D]">Partner with us</h2>
            <p className="text-sm font-medium text-[#3C1A0D]/50 mt-2 leading-relaxed">
              Reach thousands of verified students with exclusive targeted offers.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* BUSINESS INFORMATION */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input 
                  name="legalName" 
                  label="Legal Business Name" 
                  placeholder="Acme Corp Pvt Ltd" 
                  required 
                />
                <Input 
                  name="tradeName" 
                  label="Store/Trade Name" 
                  placeholder="Acme Fashion" 
                  required 
                />
              </div>
              
              <Input 
                name="pan" 
                label="PAN Number" 
                placeholder="ABCDE1234F" 
                maxLength={10}
                required 
              />
            </div>

            {/* PAN CARD UPLOAD SECTION */}
            <div className="space-y-3 p-6 bg-orange-50/50 rounded-[28px] border-2 border-orange-100/50">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-orange-600" />
                <label className="text-[10px] font-black uppercase tracking-widest text-[#3C1A0D]/60">
                  PAN Card Document <span className="text-orange-600">*</span>
                </label>
              </div>
              
              {!panFile ? (
                <label className="w-full cursor-pointer block">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  <div className="w-full rounded-2xl border-2 border-dashed border-orange-300 bg-white hover:border-orange-500 hover:bg-orange-50/30 transition-all px-6 py-10 flex flex-col items-center justify-center gap-3 group">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={26} className="text-orange-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-[#3C1A0D] mb-1">Click to upload PAN card</p>
                      <p className="text-[10px] font-bold text-[#3C1A0D]/40 uppercase tracking-wider">
                        JPG, PNG or PDF (max 5MB)
                      </p>
                    </div>
                  </div>
                </label>
              ) : (
                <div className="space-y-3">
                  {/* File Info Display */}
                  <div className="w-full rounded-2xl border-2 border-orange-200 bg-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center flex-shrink-0">
                        {panFile.type === 'application/pdf' ? (
                          <FileText size={22} className="text-orange-600" />
                        ) : (
                          <ImageIcon size={22} className="text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#3C1A0D] truncate">{panFile.name}</p>
                        <p className="text-[10px] font-medium text-[#3C1A0D]/40 uppercase tracking-wider">
                          {(panFile.size / 1024).toFixed(1)} KB • {panFile.type.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="h-10 w-10 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors ml-2 flex-shrink-0"
                      title="Remove file"
                    >
                      <X size={18} className="text-red-500" />
                    </button>
                  </div>

                  {/* Image Preview */}
                  {previewUrl && (
                    <div className="rounded-2xl border-2 border-orange-200 bg-white p-3 overflow-hidden">
                      <img 
                        src={previewUrl} 
                        alt="PAN Card Preview"
                        className="w-full h-auto max-h-[300px] object-contain rounded-xl"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ACCOUNT CREDENTIALS */}
            <div className="space-y-5">
              <Input 
                name="email" 
                type="email" 
                label="Business Email" 
                placeholder="partner@company.com" 
                required 
              />
              <Input 
                name="password" 
                type="password" 
                label="Create Password" 
                placeholder="Minimum 8 characters"
                required 
              />
            </div>

            {/* Benefit Bullets */}
            <div className="py-4 space-y-3 bg-gradient-to-br from-orange-50/80 to-orange-50/40 rounded-3xl px-6 border border-orange-100/50">
              <div className="flex items-center gap-3 text-[9px] font-black text-[#3C1A0D]/60 uppercase tracking-widest">
                <CheckCircle2 size={16} className="text-orange-600 flex-shrink-0" /> 
                <span>Instant verification access</span>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-black text-[#3C1A0D]/60 uppercase tracking-widest">
                <CheckCircle2 size={16} className="text-orange-600 flex-shrink-0" /> 
                <span>Full analytics dashboard</span>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-black text-[#3C1A0D]/60 uppercase tracking-widest">
                <CheckCircle2 size={16} className="text-orange-600 flex-shrink-0" /> 
                <span>Admin approval within 24-48 hours</span>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              disabled={loading || uploading}
              className="w-full group relative flex items-center justify-center gap-3 rounded-2xl bg-[#3C1A0D] py-5 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-900/10 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
            >
              {loading || uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {uploading ? "Uploading Document..." : "Creating Account..."}
                </>
              ) : (
                <>
                  Start Partnership
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* STATUS MESSAGE */}
            {msg && (
              <div className={`p-4 rounded-2xl border text-center animate-in fade-in zoom-in-95 ${
                msgType === "error" 
                  ? "bg-red-50 border-red-200" 
                  : msgType === "success"
                  ? "bg-green-50 border-green-200"
                  : "bg-blue-50 border-blue-200"
              }`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  {msgType === "error" && <AlertCircle size={16} className="text-red-600" />}
                  {msgType === "success" && <CheckCircle2 size={16} className="text-green-600" />}
                  {msgType === "info" && <Loader2 size={16} className="text-blue-600 animate-spin" />}
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${
                  msgType === "error" 
                    ? "text-red-600" 
                    : msgType === "success"
                    ? "text-green-600"
                    : "text-blue-600"
                }`}>
                  {msg}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center space-y-6">
          <p className="text-sm font-medium text-[#3C1A0D]/50">
            Already have a partner account?{" "}
            <Link href="/merchant/login" className="text-orange-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>

          <div className="h-[1px] w-12 bg-orange-200 mx-auto" />

          <Link
            href="/register"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3C1A0D]/30 hover:text-orange-600 transition-colors block"
          >
            Are you a student? Create Student Account
          </Link>
        </div>
      </div>
    </main>
  );
}