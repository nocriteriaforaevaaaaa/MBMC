"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Camera, Upload, CheckCircle2, XCircle, Loader2, ScanLine, AlertCircle, User, Ticket, Percent, Image as ImageIcon 
} from "lucide-react";
import jsQR from "jsqr";

interface VerificationResult {
  success: boolean;
  message?: string;
  error?: string;
  redemption?: {
    id: string;
    couponCode: string;
    studentName: string;
    studentEmail: string;
    offerTitle: string;
    discountPercent: number;
    redeemedAt: string;
    status: string;
  };
}

export default function ScannerClient({ merchantName }: { merchantName: string }) {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [useManual, setUseManual] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /** ------------------ CAMERA SCAN ------------------ */
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        scanQRCode();
      }
    } catch (error) {
      console.error("Camera access error:", error);
      alert("Unable to access camera. Please allow camera permissions.");
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        verifyQRCode(code.data);
        stopScanning();
        return;
      }
    }
    requestAnimationFrame(scanQRCode);
  };

  /** ------------------ IMAGE UPLOAD ------------------ */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img.src);
        scanImageForQR(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const scanImageForQR = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      verifyQRCode(code.data);
    } else {
      setLoading(false);
      setResult({ success: false, error: "No QR code found. Please upload a clearer image." });
    }
  };

  /** ------------------ MANUAL ENTRY ------------------ */
  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    await verifyQRCode(manualCode.trim());
    setManualCode("");
  };

  /** ------------------ VERIFY QR ------------------ */
  const verifyQRCode = async (qrData: string) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/verify-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData })
      });
      const data = await response.json();
      if (response.ok) {
        setResult({ success: true, ...data });
      } else {
        setResult({ success: false, error: data.error || "Verification failed" });
      }
    } catch {
      setResult({ success: false, error: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  /** ------------------ RESET ------------------ */
  const resetScanner = () => {
    setResult(null);
    setManualCode("");
    setUploadedImage(null);
    stopScanning();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => stopScanning();
  }, []);

  /** ------------------ RENDER ------------------ */
  return (
    <div className="space-y-8">

      {/* Mode Toggle */}
      <div className="flex gap-3 p-2 bg-orange-50 rounded-2xl">
        <button
          type="button"
          onClick={() => { resetScanner(); setUseManual(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!useManual ? "bg-white text-[#3C1A0D] shadow-lg" : "text-[#3C1A0D]/40 hover:text-[#3C1A0D]"}`}
        >
          <ImageIcon size={14} /> Upload / Camera
        </button>
        <button
          type="button"
          onClick={() => { resetScanner(); setUseManual(true); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${useManual ? "bg-white text-[#3C1A0D] shadow-lg" : "text-[#3C1A0D]/40 hover:text-[#3C1A0D]"}`}
        >
          <Ticket size={14} /> Manual Entry
        </button>
      </div>

      {/* UPLOAD / CAMERA MODE */}
      {!useManual && (
        <div className="space-y-6">
          {/* File Input */}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="qr-upload" />

          {/* Upload Card */}
          {!uploadedImage && !result && !isScanning && (
            <label htmlFor="qr-upload" className="cursor-pointer block">
              <div className="w-full h-64 bg-orange-50 rounded-3xl flex items-center justify-center border-4 border-dashed border-orange-200 hover:border-orange-400 hover:bg-orange-100/50 transition-all">
                <div className="space-y-4 text-center">
                  <Upload size={48} className="text-orange-600 mx-auto" />
                  <p className="text-[12px] font-bold text-[#3C1A0D]/60">Click to upload QR image</p>
                  <p className="text-[10px] text-[#3C1A0D]/40 mt-2">PNG, JPG, JPEG</p>
                </div>
              </div>
            </label>
          )}

          {/* Uploaded Image Preview */}
          {uploadedImage && !result && (
            <div className="space-y-4">
              <img src={uploadedImage} alt="Uploaded QR" className="w-full h-auto rounded-2xl border-4 border-orange-200" />
              <button type="button" onClick={resetScanner} className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all">
                Upload Another Image
              </button>
            </div>
          )}

          {/* Camera Scanner */}
          {!uploadedImage && !result && (
            <div className="space-y-4">
              {!isScanning && (
                <button type="button" onClick={startScanning} className="w-full flex items-center justify-center gap-3 bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#3C1A0D] transition-all shadow-xl">
                  <Camera size={18} /> Start Camera
                </button>
              )}
              {isScanning && (
                <div className="relative rounded-3xl overflow-hidden border-4 border-orange-200">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 border-4 border-orange-600 rounded-2xl animate-pulse" />
                  </div>
                  <button type="button" onClick={stopScanning} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white py-2 px-6 rounded-xl font-bold">Stop</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MANUAL ENTRY MODE */}
      {useManual && (
        <form onSubmit={handleManualVerify} className="space-y-6">
          <input type="text" value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Paste QR code data here..." className="w-full px-6 py-4 rounded-2xl border-2 border-orange-100 focus:border-orange-600 focus:outline-none font-mono" />
          <button type="submit" disabled={!manualCode.trim() || loading} className="w-full flex items-center justify-center gap-3 bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#3C1A0D] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />} Verify
          </button>
        </form>
      )}

      {/* Result Display */}
      {result && (
        <div className={`p-6 rounded-3xl border-4 space-y-4 ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <div className="flex items-center gap-4">
            {result.success ? <CheckCircle2 size={32} className="text-green-600" /> : <XCircle size={32} className="text-red-600" />}
            <h3 className="font-black uppercase">{result.success ? "Verified!" : "Verification Failed"}</h3>
          </div>
          <p>{result.success ? result.message || "Redemption successful" : result.error}</p>
          <button type="button" onClick={resetScanner} className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold">Scan / Verify Again</button>
        </div>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
