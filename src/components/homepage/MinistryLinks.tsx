import { Prisma } from "@prisma/client";
import { ExternalLink, Building2, Globe, FileText, Phone, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";

type OfficialGovernmentLink = Prisma.OfficialGovernmentLinkGetPayload<{}>;

type MinistryCard = {
    id: number;
    name: string;
    subtitle: string;
    description: string;
    website: string;
    phone?: string;
    email?: string;
    services: string[];
};

// Source: https://india.mfa.gov.by/en/embassy/address/ (verified 2026-10-13).
// Re-check before launch; embassy details can change.
const EMBASSY_INFO = {
    name: "Embassy of the Republic of Belarus in India",
    address: "90 Poorvi Marg, Vasant Vihar, New Delhi - 110057",
    phone: "+91 11 40529338",
    email: "india@mfa.gov.by",
    website: "https://india.mfa.gov.by/en/",
    consular: "Consular queries: india.consul@mfa.gov.by. See the embassy website for the visa counter schedule.",
    hours: "Monday to Friday: 9:00 AM - 6:00 PM IST (lunch break 1:00 - 2:00 PM)",
};

const DB_FALLBACK_SERVICES = [
    "Official updates",
    "Policy notices",
    "Compliance information",
    "Reference links",
];

const IMPORTANT_NOTES = [
    "Confirm university recognition from official regulators",
    "Use embassy websites for visa process updates",
    "Cross-check exam and licensing notices from NMC",
];

function normalizeCountryText(value: string): string {
    return value;
}

function normalizeWebsite(url: string): string {
    return url;
}

// Contact details below were checked against each organisation's official site
// on 2026-10-13. Where a phone/email could not be verified it is intentionally
// omitted. If the Admin -> Government Links table has rows, those replace this list.
const FALLBACK_MINISTRIES: MinistryCard[] = [
    {
        id: 1,
        name: "Ministry of Health of Belarus",
        subtitle: "National Regulator",
        description: "Public authority overseeing healthcare services and the state medical universities that train doctors in Belarus.",
        website: "https://minzdrav.gov.by/en/",
        phone: "+375 17 373 70 80",
        services: [
            "Medical education oversight",
            "Healthcare regulation",
            "Public health policy",
            "Quality and standards",
        ],
    },
    {
        id: 2,
        name: "Ministry of Education of Belarus",
        subtitle: "Education Authority",
        description: "Responsible for education policy and higher education, including guidance for foreign citizens who wish to study in Belarus.",
        website: "https://edu.gov.by/en-uk/",
        phone: "+375 17 222 43 12",
        email: "info@edu.gov.by",
        services: [
            "Higher education policy",
            "University licensing",
            "Admission rules",
            "Study guidance for foreigners",
        ],
    },
    {
        id: 3,
        name: "Ministry of Foreign Affairs of Belarus",
        subtitle: "Visas and Consular Information",
        description: "Official source for entry visas, visa support documents, consular fees and the rules on stay and registration of foreigners.",
        website: "https://mfa.gov.by/en/visa/general/",
        services: [
            "Entry visa types",
            "Visa procedure",
            "Consular fee rates",
            "Registration of foreigners",
        ],
    },
    {
        id: 4,
        name: "National Medical Commission India",
        subtitle: "NMC India",
        description: "Indian authority for recognition, screening, and licensing pathways for foreign medical graduates.",
        website: "https://www.nmc.org.in",
        phone: "+91-11-25367033",
        services: [
            "FMGE/NExT pathways",
            "Recognition guidance",
            "Licensing framework",
            "Regulatory advisories",
        ],
    },
    {
        id: 5,
        name: "World Health Organization",
        subtitle: "WHO",
        description: "Global public health authority relevant to international medical education reference standards.",
        website: "https://www.who.int",
        phone: "+41 22 791 21 11",
        services: [
            "Global health standards",
            "Policy frameworks",
            "International collaboration",
            "Public health guidance",
        ],
    },
    {
        id: 6,
        name: "ECFMG (USA)",
        subtitle: "ECFMG",
        description: "Certification and pathway authority for international medical graduates in the United States.",
        website: "https://www.ecfmg.org",
        services: [
            "Certification pathways",
            "Eligibility guidance",
            "Credential verification",
            "US residency screening",
        ],
    },
];

function parseDbServices(value: string | null | undefined): string[] {
    if (!value) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed.map((item) => String(item).trim()).filter(Boolean);
    } catch {
        return [];
    }
}

function mapOfficialLinkToCard(link: OfficialGovernmentLink): MinistryCard {
    const rawDescription = (link.description || "").trim();
    const parsedServices = parseDbServices(rawDescription);
    const displayDescription =
        parsedServices.length > 0
            ? "Official government resource for student and institutional guidance."
            : rawDescription ||
            "Official government resource for student and institutional guidance.";

    return {
        id: link.id,
        name: normalizeCountryText(link.name),
        subtitle: normalizeCountryText(link.category || "Official Source"),
        description: normalizeCountryText(displayDescription),
        website: normalizeWebsite(link.url),
        services: (parsedServices.length > 0 ? parsedServices : DB_FALLBACK_SERVICES).map(normalizeCountryText),
    };
}

async function loadMinistryCards(): Promise<MinistryCard[]> {
    try {
        const links = await prisma.officialGovernmentLink.findMany({
            where: { status: true },
            orderBy: { position: "asc" },
        });

        if (links.length === 0) {
            return FALLBACK_MINISTRIES;
        }

        return links.map(mapOfficialLinkToCard);
    } catch {
        return FALLBACK_MINISTRIES;
    }
}

export default async function MinistryLinks() {
    const ministries = await loadMinistryCards();

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Official Government Links</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Direct access to official organizations that matter for MBBS admissions, compliance, and student support.
                    </p>
                </div>

                <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-3xl p-8 mb-8 text-white">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">{EMBASSY_INFO.name}</h3>
                            <p className="text-blue-100 mb-6">
                                Contact the embassy for official visa, documentation, and consular guidance before your travel.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <Building2 className="w-5 h-5 mt-1 flex-shrink-0" />
                                    <span className="text-blue-100">{EMBASSY_INFO.address}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-blue-100">{EMBASSY_INFO.phone}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-blue-100">{EMBASSY_INFO.email}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Globe className="w-5 h-5 flex-shrink-0" />
                                    <a
                                        href={EMBASSY_INFO.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-yellow-300 hover:text-yellow-200 transition-colors"
                                    >
                                        {EMBASSY_INFO.website}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                            <h4 className="text-xl font-semibold mb-4">Office Hours</h4>
                            <p className="text-blue-100 mb-4">{EMBASSY_INFO.hours}</p>
                            <h4 className="text-xl font-semibold mb-2">Consular Services</h4>
                            <p className="text-blue-100 mb-4">{EMBASSY_INFO.consular}</p>
                            <a
                                href={EMBASSY_INFO.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                            >
                                Contact Embassy
                            </a>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {ministries.map((ministry) => (
                        <div
                            key={ministry.id}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/80"
                        >
                            <div className="border-b bg-gradient-to-r from-gray-50 to-gray-100 p-6 transition-colors duration-300 group-hover:from-blue-50 group-hover:to-emerald-50">
                                <div className="flex items-start space-x-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="mb-1 text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-700">{ministry.name}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{ministry.subtitle}</p>
                                        <p className="text-gray-600">{ministry.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                            <a
                                                href={ministry.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
                                            >
                                                {ministry.website}
                                            </a>
                                            <ExternalLink className="w-3 h-3 text-gray-400" />
                                        </div>
                                        {ministry.phone ? (
                                            <div className="flex items-center space-x-3">
                                                <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                <span className="text-gray-600 text-sm">{ministry.phone}</span>
                                            </div>
                                        ) : null}
                                        {ministry.email ? (
                                            <div className="flex items-center space-x-3">
                                                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                <span className="text-gray-600 text-sm">{ministry.email}</span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="mb-6 flex-grow">
                                    <h4 className="font-semibold text-gray-800 mb-3">Key Services</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {ministry.services.map((service) => (
                                            <div key={service} className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                                                <span className="text-gray-600 text-sm">{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <a
                                        href={ministry.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-medium text-white transition-all duration-300 hover:from-blue-700 hover:to-blue-800"
                                    >
                                        <span>Visit Official Website</span>
                                        <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
                    <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-yellow-800" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-yellow-800 mb-3">Important Notice</h3>
                            <p className="text-yellow-700 mb-4">
                                Always verify requirements directly on official government portals before filing applications, visas, or equivalency documents.
                            </p>
                            <ul className="space-y-2 text-yellow-700">
                                {IMPORTANT_NOTES.map((item) => (
                                    <li key={item} className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
