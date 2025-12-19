import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const offers = await prisma.offer.findMany({
    where: {
      status: "ACTIVE",
      merchant: { kycStatus: "APPROVED" },
    },
    include: { merchant: true },
  });

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Available Offers</h1>

      <div className="grid gap-4">
        {offers.map((offer) => (
          <a
            key={offer.id}
            href={`/redeem/${offer.id}`}
            className="block border p-4 rounded hover:bg-slate-50"
          >
            <h3 className="font-medium">{offer.title}</h3>
            <p className="text-sm text-slate-600">{offer.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
