import ScannerClient from "./ScannerClient";

export default function Page() {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-black mb-6 text-center">QR Code Redemption</h1>
      <ScannerClient merchantName="Demo Merchant" />
    </div>
  );
}
