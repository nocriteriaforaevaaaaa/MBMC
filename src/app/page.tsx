import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-indigo-700">
            EduPerks
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Student-only access to verified offers
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
          <Link href="/register">
            <button className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition">
              Create student account
            </button>
          </Link>

          <Link href="/login">
            <button className="w-full rounded-md border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
              Sign in
            </button>
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          Only institutional emails are allowed.
        </p>
      </div>
    </main>
  );
}
