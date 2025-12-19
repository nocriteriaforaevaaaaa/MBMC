import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MerchantPage() {
  // 1️⃣ Auth check
  const session = await getSessionUser();
  if (!session || session.role !== "MERCHANT") {
    redirect("/login");
  }

  // 2️⃣ Load merchant
  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.userId },
    include: {
      offers: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!merchant) {
    redirect("/login");
  }

  // 3️⃣ Block unapproved merchants
  if (merchant.kycStatus !== "APPROVED") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow max-w-md text-center">
          <h1 className="text-xl font-semibold mb-2">
            Merchant approval pending
          </h1>
          <p className="text-slate-600">
            An admin must approve your account before you can submit offers.
          </p>
        </div>
      </main>
    );
  }

  // 4️⃣ Approved merchant UI
  return (
    <main className="p-8 max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold">Merchant Dashboard</h1>
        <p className="text-slate-600">Submit offers and track redemptions</p>
      </header>

      {/* Submit Offer */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4">Submit New Offer</h2>

        <form action="/api/merchant/offers" method="POST" className="space-y-4">
          <input
            name="title"
            placeholder="Offer title"
            required
            className="w-full border rounded px-3 py-2"
          />

          <textarea
            name="description"
            placeholder="Offer description"
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="category"
            placeholder="Category (e.g. Food, Fashion)"
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="redirectUrl"
            placeholder="Merchant website (https://localhost:5173)"
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="discountPercent"
            type="number"
            placeholder="Discount percentage (e.g. 20)"
            required
          />

          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500">
            Publish offer
          </button>
        </form>
      </section>

      {/* Existing Offers */}
      <section>
        <h2 className="text-lg font-medium mb-3">Your Offers</h2>

        {merchant.offers.length === 0 && (
          <p className="text-slate-600">
            You haven’t published any offers yet.
          </p>
        )}

        <div className="space-y-3">
          {merchant.offers.map((offer) => (
            <div key={offer.id} className="border rounded-lg p-4 bg-white">
              <h3 className="font-medium">{offer.title}</h3>
              <p className="text-sm text-slate-600">{offer.description}</p>
              <p className="text-xs text-slate-400 mt-1">
                Redirects to: {offer.redirectUrl}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Redemptions */}
      <section>
        <a
          href="/merchant/redemptions"
          className="inline-block text-indigo-600 underline"
        >
          View redeemed coupons →
        </a>
      </section>
    </main>
  );
}
