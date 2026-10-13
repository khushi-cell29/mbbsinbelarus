import { prisma } from "@/lib/prisma";
import FmgeRatesTable from "./FmgeRatesTable";
import Link from "next/link";

export default async function FmgeSection() {
    const rows = await prisma.universityFmgeRate.findMany({
        where: { status: true },
        select: {
            year: true, appeared: true, passed: true, passPercentage: true,
            university: { select: { name: true, slug: true } },
        },
        orderBy: { year: "desc" },
    }).catch(() => []);

    const data = rows.map((r) => ({
        universityName: r.university.name,
        slug: r.university.slug,
        year: r.year,
        appeared: r.appeared,
        passed: r.passed,
        passPercentage: r.passPercentage ? Number(r.passPercentage) : null,
    }));

    // Build year overview cards (like old React Newanup.tsx)
    const yearMap: Record<number, { total: number; accepted: number }> = {};
    for (const r of data) {
        if (!yearMap[r.year]) yearMap[r.year] = { total: 0, accepted: 0 };
        yearMap[r.year].total += r.appeared ?? 0;
        yearMap[r.year].accepted += r.passed ?? 0;
    }
    const yearOverviews = Object.entries(yearMap)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([year, vals]) => ({
            year,
            total: vals.total,
            accepted: vals.accepted,
            rate: vals.total > 0 ? (vals.accepted / vals.total) * 100 : 0,
        }));

    return (
        <section className="bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_42%,#f0fdf4_100%)] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FmgeRatesTable data={data} />

                {/* Year-wise Overview Cards — mirrors old React Newanup.tsx */}
                {yearOverviews.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {yearOverviews.map(({ year, total, accepted, rate }) => (
                            <div
                                key={year}
                                className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/60 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-blue-200 hover:bg-white/72 hover:shadow-2xl hover:shadow-blue-100/80"
                            >
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/65 via-white/10 to-blue-100/35 opacity-100" />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 via-white/0 to-amber-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <div className="relative">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-700">{year} Overview</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between rounded-lg border border-white/50 bg-white/40 px-3 py-2 shadow-sm transition-colors duration-300 group-hover:bg-blue-50/60">
                                            <span className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">Applications:</span>
                                            <span className="font-semibold text-gray-900 transition-transform duration-300 group-hover:translate-x-0.5">{total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between rounded-lg border border-white/50 bg-white/40 px-3 py-2 shadow-sm transition-colors duration-300 group-hover:bg-blue-50/60">
                                            <span className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">Accepted:</span>
                                            <span className="font-semibold text-gray-900 transition-transform duration-300 group-hover:translate-x-0.5">{accepted.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between rounded-lg border border-white/50 bg-white/40 px-3 py-2 shadow-sm transition-colors duration-300 group-hover:bg-blue-50/60">
                                            <span className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">Rate:</span>
                                            <span className="font-semibold text-blue-600 transition-colors duration-300 group-hover:text-blue-700">{rate.toFixed(2)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-8">
                    <Link href="/fmge-rates" className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                        View Full FMGE Data →
                    </Link>
                </div>
            </div>
        </section>
    );
}
