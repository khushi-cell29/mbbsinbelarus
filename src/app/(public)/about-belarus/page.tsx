import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Bus,
    Building2,
    CheckCircle,
    Clock3,
    DollarSign,
    Flag,
    Globe,
    Heart,
    Landmark,
    Languages,
    MapPinned,
    Mountain,
    Music,
    TreePine,
    Plane,
    Stethoscope,
    Sparkles,
    Sun,
    Users,
    Utensils,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getAboutCountryContent } from "@/lib/public-page-content";
import { replaceCurrencySymbol } from "@/lib/currency";

export const metadata: Promise<Metadata> = buildMetadata({
    title: "About Belarus - Culture, Lifestyle and Education | mbbsinbelarus.com",
    description:
        "Discover Belarus - a safe, orderly, and affordable destination in Eastern Europe for MBBS aspirants with English-medium medical programs and strong clinical exposure.",
    entitySeo: {
        metaKeyword:
            "about Belarus, Belarus culture, life in Belarus for students, mbbs Belarus environment",
    },
    path: "/about-belarus",
    pageKey: "about-belarus",
});

const themeStyles = {
    red: {
        softPanel: "border-blue-100 bg-blue-50/80",
        iconWrap: "bg-blue-100 text-blue-600",
        iconHover: "group-hover:bg-blue-600 group-hover:text-white",
        titleHover: "group-hover:text-blue-700",
        wash: "from-blue-500/15 via-white/0 to-amber-400/10",
        ringHover: "hover:border-blue-200 hover:shadow-blue-100/80",
        pill: "bg-blue-100 text-blue-700",
    },
    blue: {
        softPanel: "border-blue-100 bg-blue-50/80",
        iconWrap: "bg-blue-100 text-blue-600",
        iconHover: "group-hover:bg-blue-600 group-hover:text-white",
        titleHover: "group-hover:text-blue-700",
        wash: "from-blue-500/15 via-white/0 to-cyan-400/10",
        ringHover: "hover:border-blue-200 hover:shadow-blue-100/80",
        pill: "bg-blue-100 text-blue-700",
    },
    green: {
        softPanel: "border-green-100 bg-green-50/80",
        iconWrap: "bg-green-100 text-green-600",
        iconHover: "group-hover:bg-green-600 group-hover:text-white",
        titleHover: "group-hover:text-green-700",
        wash: "from-green-500/15 via-white/0 to-emerald-400/10",
        ringHover: "hover:border-green-200 hover:shadow-green-100/80",
        pill: "bg-green-100 text-green-700",
    },
    amber: {
        softPanel: "border-amber-100 bg-amber-50/80",
        iconWrap: "bg-amber-100 text-amber-600",
        iconHover: "group-hover:bg-amber-500 group-hover:text-white",
        titleHover: "group-hover:text-amber-700",
        wash: "from-amber-400/15 via-white/0 to-orange-400/10",
        ringHover: "hover:border-amber-200 hover:shadow-amber-100/80",
        pill: "bg-amber-100 text-amber-700",
    },
    purple: {
        softPanel: "border-purple-100 bg-purple-50/80",
        iconWrap: "bg-purple-100 text-purple-600",
        iconHover: "group-hover:bg-purple-600 group-hover:text-white",
        titleHover: "group-hover:text-purple-700",
        wash: "from-purple-500/15 via-white/0 to-fuchsia-400/10",
        ringHover: "hover:border-purple-200 hover:shadow-purple-100/80",
        pill: "bg-purple-100 text-purple-700",
    },
} as const;

const highlightIcons = [Globe, Sun, Utensils, Mountain, Music, Landmark];
const overviewIcons = [Sparkles, Globe, Landmark, Sun, Users, Mountain];
const detailIcons = [Utensils, Mountain, Music];

// Fill this in once verified Belarus fee data is available (hidden while empty).
const comparisonRows: { label: string; belarus: string; india: string; uk: string }[] = [];

const geographyHighlights = [
    { icon: Globe, iconColor: "text-blue-600", text: "Landlocked country in Eastern Europe" },
    { icon: TreePine, iconColor: "text-emerald-600", text: "Broad plains, forests, and many lakes" },
    { icon: Mountain, iconColor: "text-violet-600", text: "Mostly flat landscape; highest point is Dzyarzhynskaya Hill (345 m)" },
    { icon: MapPinned, iconColor: "text-cyan-600", text: "Borders Poland, Lithuania, Latvia, Russia, and Ukraine" },
];

const climateZones = [
    { icon: Sun, iconColor: "text-amber-500", text: "Temperate continental climate" },
    { icon: Clock3, iconColor: "text-blue-500", text: "Cold winters and warm summers" },
    { icon: Sparkles, iconColor: "text-violet-500", text: "Four distinct seasons" },
    { icon: CheckCircle, iconColor: "text-emerald-500", text: "Snow is common in winter; pack warm clothing" },
];

const belarusAttractions = [
    { icon: Landmark, title: "Mir Castle Complex", description: "UNESCO World Heritage castle" },
    { icon: Landmark, title: "Nesvizh Castle", description: "Historic palace complex, UNESCO listed" },
    { icon: TreePine, title: "Belovezhskaya Pushcha", description: "Ancient forest and national park" },
    { icon: Landmark, title: "Brest Fortress", description: "Memorial complex in Brest" },
];

const transportPoints = [
    {
        icon: Plane,
        iconColor: "text-blue-600",
        text: "Students usually reach Belarus via connecting flights; check current flight and route options before booking",
    },
    {
        icon: Bus,
        iconColor: "text-orange-600",
        text: "Buses, trams, and trolleybuses serve daily student travel; Minsk also has a metro",
    },
    {
        icon: Globe,
        iconColor: "text-violet-600",
        text: "Rail and road links connect the main university cities",
    },
    {
        icon: MapPinned,
        iconColor: "text-emerald-600",
        text: "Practical local routes connect universities, hostels, and major hubs",
    },
];

const visaOnboardingPoints = [
    {
        icon: CheckCircle,
        iconColor: "text-emerald-600",
        text: "Students typically enter on a study visa supported by an invitation from the university",
    },
    {
        icon: Clock3,
        iconColor: "text-orange-600",
        text: "Processing times vary, so apply well ahead of the intake and confirm current rules with the embassy",
    },
    {
        icon: Plane,
        iconColor: "text-blue-600",
        text: "Universities assist with documentation and invitation-related requirements",
    },
    {
        icon: Heart,
        iconColor: "text-blue-500",
        text: "Arrival, onboarding, and registration support are provided by universities",
    },
];

const healthcareCards = [
    {
        title: "Public Healthcare",
        description:
            "Government hospitals and teaching institutions provide accessible medical services and foundational clinical exposure for students.",
        accent: "border-sky-200",
    },
    {
        title: "Private Healthcare",
        description:
            "Private hospitals in major cities offer advanced facilities, specialist care, and additional treatment pathways.",
        accent: "border-emerald-200",
    },
    {
        title: "Student Healthcare",
        description:
            "Universities support international students with basic healthcare guidance, referral support, and onboarding assistance.",
        accent: "border-violet-200",
    },
];

export default async function AboutBelarusPage() {
    const content = await getAboutCountryContent();

    const stats = content.summaryStats.map((item, index) => {
        const icons = [Building2, Users, Languages, DollarSign];
        const eyebrows = ["City", "People", "Language", "Currency"];
        return {
            ...item,
            eyebrow: eyebrows[index % eyebrows.length],
            icon: icons[index % icons.length]
        };
    });

    const highlights = [
        { title: "UNESCO Heritage", description: "Mir Castle, Nesvizh Castle, and Belovezhskaya Pushcha are UNESCO World Heritage sites.", theme: "blue" as const },
        { title: "Orderly and Safe", description: "Cities are known for being clean and orderly, which suits students living abroad for the first time.", theme: "green" as const },
        { title: "Cultural Blend", description: "Belarusian cuisine is built around potatoes, grains, and meats, with Slavic and Baltic influences.", theme: "amber" as const },
        { title: "Geography", description: "A landlocked country in Eastern Europe with plains, forests, and lakes, bordering Poland, Lithuania, Latvia, Russia, and Ukraine.", theme: "purple" as const },
        { title: "Economy", description: "An industrial and agricultural economy with notable machinery, manufacturing, and IT sectors.", theme: "red" as const },
        { title: "Climate", description: "Temperate continental climate with cold winters, warm summers, and four distinct seasons.", theme: "blue" as const },
    ].map((item, index) => ({
        ...item,
        icon: highlightIcons[index % highlightIcons.length],
        style: themeStyles[item.theme],
    }));

    const overviewCards = content.overviewCards.slice(0, 6).map((item, index) => ({
        ...item,
        icon: overviewIcons[index % overviewIcons.length],
        style: themeStyles[item.theme],
    }));

    const attractions = content.attractions.slice(0, 5).map((item, index) => {
        const icons = [Landmark, TreePine, Mountain];
        return {
            ...item,
            icon: icons[index % icons.length],
            style: themeStyles[item.theme],
        };
    });

    const cuisines = content.cuisines.slice(0, 5).map((item, index) => {
        return {
            ...item,
            icon: Utensils,
            style: themeStyles[item.theme],
        };
    });

    const quickFacts = [
        { title: "Capital", value: stats.find((stat) => stat.label === "Capital")?.value || "Minsk", icon: Building2, style: themeStyles.blue },
        { title: "Population", value: stats.find((stat) => stat.label === "Population")?.value || "About 9.1 million", icon: Users, style: themeStyles.green },
        { title: "Languages", value: stats.find((stat) => stat.label === "Languages")?.value || "Belarusian, Russian", icon: Languages, style: themeStyles.purple },
        { title: "Currency", value: stats.find((stat) => stat.label === "Currency")?.value || "Belarusian ruble (BYN)", icon: DollarSign, style: themeStyles.amber },
        { title: "Location", value: content.location, icon: MapPinned, style: themeStyles.red },
        { title: "Timezone", value: content.timezone, icon: Clock3, style: themeStyles.green },
        { title: "Independence", value: content.independenceDay, icon: Flag, style: themeStyles.amber },
        { title: "Highest Peak", value: `${content.highestPeak} (${content.highestPeakHeight})`, icon: Mountain, style: themeStyles.blue },
    ];

    return (
        <div className="min-h-screen bg-white">
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-600 to-blue-700 py-20 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(153,27,27,0.18),transparent_32%)]" />
                <div className="relative mx-auto max-w-7xl px-4 text-center">
                    <div className="mb-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-gradient-to-r from-blue-600/80 to-blue-500/70 px-6 py-2.5 text-xl font-semibold text-blue-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-sm">
                            <MapPinned className="h-5 w-5" />
                            About Belarus
                        </span>
                    </div>
                    <h1 className="mb-6 text-4xl font-bold lg:text-6xl">{content.heroTitle}</h1>
                    <p className="mx-auto max-w-3xl text-xl leading-relaxed text-blue-100">{content.heroDescription}</p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10">
                <div className="mb-8 text-center">
                    <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Country Snapshot</span>
                    <h2 className="mt-2 text-3xl font-bold text-gray-900 lg:text-4xl">Quick Facts About Belarus</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        People, area, capital, and student budget insights at a glance before you compare MBBS universities.
                    </p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                    {quickFacts.map((fact) => (
                        <article
                            key={fact.title}
                            className={`group relative overflow-hidden rounded-2xl border p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${fact.style.softPanel} ${fact.style.ringHover}`}
                        >
                            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${fact.style.wash}`} />
                            <div className="relative">
                                <div
                                    className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${fact.style.iconWrap} ${fact.style.iconHover}`}
                                >
                                    <fact.icon className="h-6 w-6" />
                                </div>
                                <h3 className={`text-lg font-bold text-gray-900 transition-colors duration-300 ${fact.style.titleHover}`}>{fact.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-900">{fact.value}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16">
                <div className="mb-12 text-center">
                    <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Why Belarus?</span>
                    <h2 className="mt-2 text-3xl font-bold text-gray-900 lg:text-4xl">A Premium Study Destination for MBBS</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Belarus offers internationally aligned medical education with modern infrastructure, English-medium programs, and a safe environment for international students.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {highlights.map((item) => (
                        <article
                            key={item.title}
                            className={`group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.style.ringHover}`}
                        >
                            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${item.style.wash}`} />
                            <div className="relative">
                                <div className="mb-4 flex items-center gap-4">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${item.style.iconWrap} ${item.style.iconHover}`}
                                    >
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className={`text-xl font-bold text-gray-900 transition-colors duration-300 ${item.style.titleHover}`}>{item.title}</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="bg-gray-50 py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <div className={`grid items-center gap-12 ${comparisonRows.length > 0 ? "lg:grid-cols-2" : ""}`}>
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Did You Know?</span>
                            <h2 className="mt-2 mb-8 text-3xl font-bold text-gray-900">Belarus Education Facts</h2>
                            <div className="space-y-4">
                                {[
                                    "Literacy- Adult literacy in Belarus is above 99%, among the highest in the world.",
                                    "Medical Universities- Four state medical universities (Minsk, Vitebsk, Grodno, and Gomel) train doctors and host international MBBS students.",
                                    "Language- International MBBS programs are taught in English, while Russian and Belarusian are the local languages.",
                                    "Government Role- Education is overseen by the Ministry of Education, and medical training by the Ministry of Health.",
                                    ...content.supportPoints.filter(p =>
                                        !p.includes("Medical support services are accessible") &&
                                        !p.includes("Private hospitals complement public care")
                                    )
                                ].map((fact) => (
                                    <div key={fact} className="flex items-start gap-3">
                                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                                        <p className="text-gray-700">{fact}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {comparisonRows.length > 0 ? (
                        <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-amber-50 p-8">
                            <h3 className="mb-6 text-xl font-bold text-gray-900">Cost Comparison</h3>
                            <div className="space-y-4">
                                {comparisonRows.map((row) => (
                                    <div key={row.label} className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                                        <div className="mb-3 text-sm font-bold text-gray-800">{row.label}</div>
                                        <div className="grid grid-cols-3 gap-3 text-xs leading-normal">
                                            <div className="text-center">
                                                <div className="font-bold text-green-600 mb-1">{row.belarus}</div>
                                                <div className="text-[10px] uppercase font-medium tracking-wider text-gray-400">Belarus</div>
                                            </div>
                                            <div className="text-center border-l border-gray-100">
                                                <div className="font-bold text-gray-700 mb-1">{row.india}</div>
                                                <div className="text-[10px] uppercase font-medium tracking-wider text-gray-400">India (Pvt)</div>
                                            </div>
                                            <div className="text-center border-l border-gray-100">
                                                <div className="font-bold text-gray-700 mb-1">{row.uk}</div>
                                                <div className="text-[10px] uppercase font-medium tracking-wider text-gray-400">UK</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        ) : null}
                    </div>
                </div>
            </section>

            {overviewCards.length > 0 ? (
                <section className="mx-auto max-w-7xl px-4 py-16">
                    <div className="mb-12 text-center">
                        <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">MBBS Education Hub</span>
                        <h2 className="mt-2 text-3xl font-bold text-gray-900 lg:text-4xl">International recognition with modern medical training</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                            Belarus is an emerging MBBS destination with globally aligned curriculum, English-medium pathways, and quality clinical exposure.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {overviewCards.map((item) => (
                            <article
                                key={item.title}
                                className={`group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.style.softPanel} ${item.style.ringHover}`}
                            >
                                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${item.style.wash}`} />
                                <div className="relative">
                                    <div
                                        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${item.style.iconWrap} ${item.style.iconHover}`}
                                    >
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className={`text-xl font-bold text-gray-900 transition-colors duration-300 ${item.style.titleHover}`}>{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-gray-700">{item.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}

            {content.universityCities.length > 0 ? (
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-12 text-center">
                            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Major University Cities</span>
                            <h2 className="mt-2 text-3xl font-bold text-gray-900 lg:text-4xl">Urban hubs for MBBS universities in Belarus</h2>
                            <p className="mx-auto mt-4 max-w-3xl text-gray-600">
                                City-level highlights based on live university records, including active institutions and study-friendly context.
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {content.universityCities.slice(0, 6).map((city, index) => {
                                const gradients = [
                                    "from-blue-600 to-blue-800",
                                    "from-emerald-600 to-green-700",
                                    "from-blue-600 to-violet-600",
                                ];
                                const gradient = gradients[index % gradients.length];

                                return (
                                    <article
                                        key={city.city}
                                        className={`rounded-[1.75rem] bg-gradient-to-br ${gradient} p-7 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                                    >
                                        <h3 className="text-2xl font-bold">{city.city}</h3>
                                        <p className="mt-4 text-sm leading-8 text-white/90">{city.description}</p>
                                        <div className="mt-6 space-y-3 text-white/90">
                                            <div className="flex items-center gap-2.5 text-sm">
                                                <Users className="h-5 w-5" />
                                                <span>
                                                    {city.universityCount} listed universit{city.universityCount === 1 ? "y" : "ies"}
                                                </span>
                                            </div>
                                            {city.universityNames.length > 0 ? (
                                                <div className="flex items-center gap-2.5 text-sm">
                                                    <Sparkles className="h-5 w-5" />
                                                    <span>{city.universityNames.slice(0, 2).join(" • ")}</span>
                                                </div>
                                            ) : null}
                                            {city.avgTuition ? (
                                                <div className="flex items-center gap-2.5 text-sm">
                                                    <DollarSign className="h-5 w-5" />
                                                    <span>Tuition: {city.avgTuition}</span>
                                                </div>
                                            ) : null}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>
            ) : null}

            <section className="bg-gradient-to-b from-slate-100 to-slate-200/70 py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="text-3xl font-bold text-slate-800 lg:text-4xl">Geography and Climate</h2>
                        <p className="mt-4 text-base leading-7 text-slate-700">
                            A landlocked Eastern European country of plains, forests, and lakes with a temperate continental climate.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 lg:grid-cols-2">
                        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
                            <h3 className="text-xl font-bold text-slate-900 lg:text-2xl">Geography Highlights</h3>
                            <ul className="mt-6 space-y-4">
                                {geographyHighlights.map((item) => (
                                    <li key={item.text} className="flex items-start gap-3.5">
                                        <item.icon className={`mt-0.5 h-6 w-6 shrink-0 ${item.iconColor}`} />
                                        <p className="text-base leading-7 text-slate-700">{item.text}</p>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
                            <h3 className="text-xl font-bold text-slate-900 lg:text-2xl">Climate Zones</h3>
                            <ul className="mt-6 space-y-4">
                                {climateZones.map((item) => (
                                    <li key={item.text} className="flex items-start gap-3.5">
                                        <item.icon className={`mt-0.5 h-6 w-6 shrink-0 ${item.iconColor}`} />
                                        <p className="text-base leading-7 text-slate-700">{item.text}</p>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </div>

                    <div className="mt-8 rounded-[2rem] border border-blue-300/20 bg-gradient-to-r from-green-700 to-green-600 px-6 py-8 text-white shadow-lg shadow-blue-200/40 lg:px-10">
                        <h3 className="text-center text-2xl font-bold lg:text-3xl">Top Tourist Attractions</h3>
                        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {belarusAttractions.map((item) => (
                                <article key={item.title} className="rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/15 backdrop-blur-sm">
                                    <item.icon className="mx-auto h-8 w-8 text-amber-100" />
                                    <h4 className="mt-3 text-xl font-semibold">{item.title}</h4>
                                    <p className="mt-2 text-sm leading-6 text-blue-50">{item.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-slate-100 py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mx-auto max-w-4xl text-center">
                        <Plane className="mx-auto h-10 w-10 text-blue-600" />
                        <h2 className="mt-4 text-3xl font-bold text-slate-800 lg:text-4xl">Travel and Connectivity</h2>
                        <p className="mt-4 text-base leading-7 text-slate-700">
                            International arrivals and local transport options make student onboarding practical and manageable.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 lg:grid-cols-2">
                        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
                            <h3 className="text-xl font-bold text-slate-900 lg:text-2xl">Transportation</h3>
                            <ul className="mt-6 space-y-4">
                                {transportPoints.map((item) => (
                                    <li key={item.text} className="flex items-start gap-3.5">
                                        <item.icon className={`mt-0.5 h-6 w-6 shrink-0 ${item.iconColor}`} />
                                        <p className="text-base leading-7 text-slate-700">{item.text}</p>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
                            <h3 className="text-xl font-bold text-slate-900 lg:text-2xl">Visa and Onboarding</h3>
                            <ul className="mt-6 space-y-4">
                                {visaOnboardingPoints.map((item) => (
                                    <li key={item.text} className="flex items-start gap-3.5">
                                        <item.icon className={`mt-0.5 h-6 w-6 shrink-0 ${item.iconColor}`} />
                                        <p className="text-base leading-7 text-slate-700">{item.text}</p>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-b from-teal-50 via-sky-50 to-indigo-100/70 py-14">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mx-auto max-w-4xl text-center">
                        <Stethoscope className="mx-auto h-11 w-11 text-emerald-600" />
                        <h2 className="mt-4 text-3xl font-bold text-slate-800 lg:text-4xl">Healthcare System</h2>
                        <p className="mt-4 text-base leading-7 text-slate-700">
                            Healthcare access for students is available through university support and city-wide medical networks.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {healthcareCards.map((card) => (
                            <article
                                key={card.title}
                                className={`rounded-3xl border-t-4 bg-white p-6 shadow-sm ring-1 ring-slate-100 ${card.accent}`}
                            >
                                <h3 className="text-2xl font-bold text-slate-900">{card.title}</h3>
                                <p className="mt-4 text-base leading-8 text-slate-700">{card.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {cuisines.length > 0 || attractions.length > 0 ? (
                <section className="mx-auto max-w-7xl px-4 py-16">
                    <div className="mb-12 text-center">
                        <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Cuisine and Student Life</span>
                        <h2 className="mt-2 text-3xl font-bold text-gray-900 lg:text-4xl">Food, culture, and lifestyle across Belarus</h2>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                                    <Utensils className="h-5 w-5" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Popular cuisines</h3>
                            </div>
                            <div className="space-y-4">
                                {cuisines.map((item) => (
                                    <article
                                        key={item.title}
                                        className={`group relative overflow-hidden rounded-[2rem] border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${item.style.ringHover}`}
                                    >
                                        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${item.style.wash}`} />
                                        <div className="relative">
                                            <div className="flex items-start gap-4 lg:gap-5">
                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${item.style.iconWrap} ${item.style.iconHover} shadow-sm`}
                                                >
                                                    <item.icon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1 pt-1">
                                                    <h4 className={`text-xl font-bold text-gray-900 transition-colors duration-300 ${item.style.titleHover}`}>{item.title}</h4>
                                                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.description}</p>
                                                    {item.image && (
                                                        <div className="relative mt-4 h-40 w-full overflow-hidden rounded-2xl">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.title}
                                                                fill
                                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                                sizes="(max-width: 768px) 100vw, 400px"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                                    <Mountain className="h-5 w-5" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Places and experiences</h3>
                            </div>
                            <div className="space-y-4">
                                {attractions.map((item) => (
                                    <article
                                        key={item.title}
                                        className={`group relative overflow-hidden rounded-[2rem] border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${item.style.ringHover}`}
                                    >
                                        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${item.style.wash}`} />
                                        <div className="relative">
                                            <div className="flex items-start gap-4 lg:gap-5">
                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${item.style.iconWrap} ${item.style.iconHover} shadow-sm`}
                                                >
                                                    <item.icon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1 pt-1">
                                                    <h4 className={`text-xl font-bold text-gray-900 transition-colors duration-300 ${item.style.titleHover}`}>{item.title}</h4>
                                                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.description}</p>
                                                    {item.image && (
                                                        <div className="relative mt-4 h-40 w-full overflow-hidden rounded-2xl">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.title}
                                                                fill
                                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                                sizes="(max-width: 768px) 100vw, 400px"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            <section className="bg-gradient-to-br from-blue-800 via-blue-600 to-blue-700 py-16 text-white">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-bold lg:text-4xl">Ready to choose Belarus for your MBBS journey?</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-blue-100">
                        Compare universities, tuition, and student support to move from research to confident admission planning.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/universities"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                        >
                            Explore Universities
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/contact-us"
                            className="rounded-full border border-white/40 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
