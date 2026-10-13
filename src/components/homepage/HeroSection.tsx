"use client";

import Link from "next/link";
import { ArrowRight, Users, GraduationCap, Globe, Award, Building2, Stethoscope } from "lucide-react";
import { useDownloadModal } from "@/lib/modalContext";
import { HomePageStats } from "@/lib/public-page-content";

const FALLBACK_BROCHURE = "/brochures/Belarus_university.pdf";

interface HeroSectionProps {
    stats: HomePageStats;
}

export default function HeroSection({ stats }: HeroSectionProps) {
    const { openModal } = useDownloadModal();

    return (
        <section id="home" className="relative bg-gradient-to-br from-blue-800 via-blue-600 to-blue-700 text-white">
            {/* Dot pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-blue-200">
                                <Globe className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    Explore leading medical universities in Belarus
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight drop-shadow-sm pb-1">
                                MBBS in Belarus
                            </h1>

                            <p className="text-xl text-slate-100 leading-relaxed">
                                Study MBBS in Belarus at medical universities offering English-medium programs, clinical training, and internationally oriented education.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/universities"
                                className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                            >
                                <span>Explore Universities</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <button
                                onClick={() =>
                                    openModal("MBBS in Belarus", FALLBACK_BROCHURE)
                                }
                                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors"
                                suppressHydrationWarning={true}
                            >
                                Download Brochure
                            </button>
                        </div>

                        {/* Stats (tiles without a verified value are hidden) */}
                        {[stats.universities, stats.students, stats.admissionSupport].some(Boolean) && (
                        <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-blue-500">
                            {[
                                { value: stats.universities, label: "Medical Universities" },
                                { value: stats.students, label: "Indian Students" },
                                { value: stats.admissionSupport, label: "Admission Support" },
                            ].filter((stat) => Boolean(stat.value)).map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-3xl font-bold text-white">
                                        {stat.value}
                                    </div>
                                    <div className="text-blue-200 text-sm">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}
                    </div>

                    {/* Right */}
                    <div className="relative">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">
                                    Why Choose Belarus?
                                </h3>
                                <p className="text-sm text-blue-100">
                                    Graduates should confirm licensing and registration requirements with the relevant authorities in their intended country of practice.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        icon: <Stethoscope className="w-6 h-6 text-white" />,
                                        title: "Internship & Hospital Training Opportunities",
                                        desc: "Clinical training gives students practical experience alongside academic study.",
                                    },
                                    {
                                        icon: <Globe className="w-6 h-6 text-white" />,
                                        title: "Curriculum Aligned with Global Standards",
                                        desc: "Medical programs follow international guidelines, preparing students for exams like NEXT (India), USMLE (USA), and PLAB (UK).",
                                    },
                                    {
                                        icon: <Award className="w-6 h-6 text-white" />,
                                        title: "Strong Internship & Licensing Opportunities",
                                        desc: "Graduates can explore licensing pathways in Belarus and other countries, subject to local requirements.",
                                    },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1">{item.title}</h4>
                                            <p className="text-blue-100 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-400 rounded-full opacity-20 animate-pulse" />
                        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full opacity-20 animate-pulse delay-1000" />
                    </div>
                </div>
            </div>
        </section>
    );
}
