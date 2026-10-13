import { cache } from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import { homepageFaqs } from "./homepage-faqs";

// ─────────────────────────────────────────────────────────
// TYPES & INTERFACES
// ─────────────────────────────────────────────────────────

/**
 * Fetches dynamic FAQs for the homepage from the 'faq' table.
 * Filters by 'homepage' category if available, otherwise returns all active FAQs.
 * Fallbacks to the static 'homepage-faqs.ts' data if the DB provides no records.
 */
export async function getHomepageFaqs() {
    try {
        const faqs = await prisma.faq.findMany({
            where: {
                status: true,
                category: {
                    slug: "homepage"
                }
            },
            orderBy: {
                position: "asc"
            },
            select: {
                question: true,
                answer: true,
            }
        });

        if (faqs.length > 0) {
            return faqs;
        }
    } catch (error) {
        console.error("Error fetching dynamic homepage FAQs:", error);
    }
    
    // Final fallback to static data
    return homepageFaqs;
}

export interface HomePageStats {
    universities: string;
    students: string;
    scholarships: string;
    annualAid: string;
    admissionSupport: string;
    meritAwards: string;
    verifiedPrograms: string;
    experienceYears: string;
    visaSuccess: string;
}

/**
 * Fetches dynamic statistics for the homepage, combining DB counts
 * with optional setting-based overrides.
 */
export async function getHomepageStats(): Promise<HomePageStats> {
    try {
        const [uniCount, scholarshipCount] = await Promise.all([
            prisma.university.count({ where: { status: true } }),
            prisma.scholarship.count({ where: { isActive: true } }),
        ]);

        // Key-value settings to allow manual overrides for marketing numbers
        const settings = await prisma.websiteSetting.findMany({
            where: {
                key: {
                    in: [
                        "stats_total_students",
                        "stats_total_universities",
                        "stats_total_scholarships",
                        "stats_annual_aid",
                        "stats_admission_support",
                        "stats_merit_label",
                        "stats_verified_label",
                        "stats_experience_years",
                        "stats_visa_success",
                    ],
                },
            },
        });

        const getVal = (key: string, fallback: string) =>
            settings.find((s) => s.key === key)?.value ?? fallback;

        // Dynamic calculation for annual aid when setting is missing
        const calcAnnualAid = async () => {
            const scholarships = await prisma.scholarship.findMany({
                where: { isActive: true },
                select: { amountMin: true, amountMax: true, availableSeats: true }
            }).catch(() => []);
            
            const total = scholarships.reduce((sum, s) => {
                const amount = s.amountMax ? Number(s.amountMax) : (s.amountMin ? Number(s.amountMin) : 0);
                const seats = s.availableSeats || 1;
                return sum + (amount * seats);
            }, 0);

            if (total >= 1000000) return `$${(total / 1000000).toFixed(1)}M+`;
            if (total > 0) return `$${(total / 1000).toFixed(0)}k+`;
            return ""; // no verified amounts -> hide the tile
        };

        const annualAidFallback = await calcAnnualAid();

        // Empty string = "no verified figure" and the UI hides that tile.
        // Marketing numbers (students, experience, success rates...) are only shown when an
        // admin enters them in website settings (stats_*); we never invent defaults.
        return {
            universities: uniCount > 0 ? `${uniCount}` : getVal("stats_total_universities", ""),
            scholarships: getVal("stats_total_scholarships", scholarshipCount > 0 ? `${scholarshipCount}` : ""),
            students: getVal("stats_total_students", ""),
            annualAid: getVal("stats_annual_aid", annualAidFallback),
            admissionSupport: getVal("stats_admission_support", ""),
            meritAwards: getVal("stats_merit_label", ""),
            verifiedPrograms: getVal("stats_verified_label", ""),
            experienceYears: getVal("stats_experience_years", ""),
            visaSuccess: getVal("stats_visa_success", ""),
        };
    } catch (error) {
        console.error("Error fetching homepage stats:", error);
        return {
            universities: "",
            scholarships: "",
            students: "",
            annualAid: "",
            admissionSupport: "",
            meritAwards: "",
            verifiedPrograms: "",
            experienceYears: "",
            visaSuccess: "",
        };
    }
}


type Theme = "red" | "blue" | "green" | "amber" | "purple";

type ValueCard = {
    label: string;
    value: string;
    detail?: string;
};

type FeatureCard = {
    title: string;
    description: string;
    theme: Theme;
};

type ImageCard = {
    title: string;
    description: string;
    image?: string;
    meta?: string;
    points?: string[];
    theme: Theme;
};

type UniversityCityCard = {
    city: string;
    description: string;
    universityCount: number;
    universityNames: string[];
    avgTuition?: string;
};

type EducationTimelineCard = {
    label: string;
    title: string;
    description: string;
    points: string[];
    duration?: string;
    meta?: string;
    theme: Theme;
};

type EducationExamCard = {
    title: string;
    description: string;
    gradeLevel?: string;
    type?: string;
    subjects: string[];
};

export type AboutCountryContent = {
    countryName: string;
    heroTitle: string;
    heroDescription: string;
    bannerImage?: string;
    summaryStats: ValueCard[];
    highlights: FeatureCard[];
    overviewCards: FeatureCard[];
    supportPoints: string[];
    cities: ImageCard[];
    universityCities: UniversityCityCard[];
    attractions: ImageCard[];
    cuisines: ImageCard[];
    location: string;
    timezone: string;
    independenceDay: string;
    highestPeak: string;
    highestPeakHeight: string;
};

export type EducationSystemContent = {
    title: string;
    description: string;
    introductionTitle: string;
    introductionDescription: string;
    supportingNarrative: string[];
    summaryStats: ValueCard[];
    focusAreas: FeatureCard[];
    timeline: EducationTimelineCard[];
    degreeCards: FeatureCard[];
    languageCards: ValueCard[];
    institutionCards: ValueCard[];
    examinations: EducationExamCard[];
};

const themes: Theme[] = ["red", "blue", "green", "amber", "purple"];

function pickTheme(index: number): Theme {
    return themes[index % themes.length];
}

function splitContent(value?: string | null): string[] {
    if (!value) return [];

    return value
        .split(/\r?\n|[;,]/)
        .map((item) => item.replace(/^[\s\-\u2022]+/, "").trim())
        .filter(Boolean);
}

function compact<T>(items: Array<T | null | undefined | false | "" | 0>): T[] {
    return items.filter(Boolean) as T[];
}

function formatPercent(value?: number | null) {
    if (value === null || value === undefined) return undefined;
    return `${Number(value)}%`;
}

function withDefaultDescription(value: string | null | undefined, fallback: string) {
    return value?.trim() || fallback;
}

export const getAboutCountryContent = cache(async (): Promise<AboutCountryContent> => {
    const page = await prisma.aboutCountryPage
        .findFirst({
            include: {
                cuisines: { orderBy: { id: "asc" } },
                lifestyles: { orderBy: { id: "asc" } },
                majorCities: { orderBy: { id: "asc" } },
                touristAttractions: {
                    where: { isActive: true },
                    orderBy: [{ ordering: "asc" }, { id: "asc" }],
                },
            },
        })
        .catch((error: Error) => {
            console.error("Failed to fetch about country content, using fallback content.", error);
            return null;
        });

    const countryName = page?.name || SITE_CONFIG.country;
    const heroTitle = page?.tagline || `Life and study in ${countryName}`;
    const heroDescription =
        page?.studentLife ||
        page?.mbbsAffordableEducation ||
        page?.academicExcellence ||
        page?.nomadicHeritage ||
        `Explore why ${countryName} continues to attract international medical students looking for affordable, structured, and globally aligned education.`;

    const summaryStats = compact<ValueCard>([
        { label: "Capital", value: page?.capital || SITE_CONFIG.capital },
        { label: "Population", value: page?.population || "About 9.1 million" },
        { label: "Languages", value: page?.languages || "Belarusian, Russian" },
        { label: "Currency", value: page?.currency || SITE_CONFIG.currencyCode },
    ]);

    const highlights =
        page?.lifestyles.length
            ? page.lifestyles.slice(0, 6).map((item: any, index: number) => ({
                  title: item.title,
                  description: withDefaultDescription(item.description, `Learn more about ${item.title.toLowerCase()} in ${countryName}.`),
                  theme: pickTheme(index),
              }))
            : [
                  {
                      title: "Student-friendly lifestyle",
                      description: `${countryName} offers a balanced mix of affordability, city access, and practical support for international students.`,
                      theme: "red" as const,
                  },
                  {
                      title: "Strong academic environment",
                      description: "Medical universities combine classroom learning with clinical exposure and international student services.",
                      theme: "blue" as const,
                  },
                  {
                      title: "Affordable day-to-day living",
                      description: "Accommodation, local transport, and food are generally manageable compared with many study-abroad destinations.",
                      theme: "green" as const,
                  },
              ];

    const overviewCards = compact<FeatureCard>([
        page?.mbbsAffordableEducation && {
            title: "Affordable MBBS pathway",
            description: page.mbbsAffordableEducation,
            theme: "red",
        },
        page?.academicExcellence && {
            title: "Academic standards",
            description: page.academicExcellence,
            theme: "blue",
        },
        page?.studentLife && {
            title: "Student life",
            description: page.studentLife,
            theme: "amber",
        },
        page?.visaConnectivity && {
            title: "Travel and connectivity",
            description: page.visaConnectivity,
            theme: "green",
        },
        page?.publicHealthcare && {
            title: "Healthcare access",
            description: page.publicHealthcare,
            theme: "purple",
        },
        page?.tourismGrowth && {
            title: "Growing destination",
            description: page.tourismGrowth,
            theme: "blue",
        },
    ]);

    const supportPoints = compact<string>([
        page?.studentHealthcare || undefined,
        page?.privateHealthcare || undefined,
        page?.religionDiversity || undefined,
        page?.ancientSilkRoad || undefined,
        page?.culturalHighlights || undefined,
    ]).slice(0, 5);

    const cities =
        page?.majorCities.length
            ? page.majorCities.map((city: any, index: number) => ({
                  title: city.cityName,
                  description: withDefaultDescription(city.description, `${city.cityName} is one of the important hubs for international students.`),
                  image: city.cityImage ? cdn(city.cityImage) : undefined,
                  meta: city.population || undefined,
                  points: splitContent(city.highlights).slice(0, 4),
                  theme: pickTheme(index),
              }))
            : [];

    const universityCities = await prisma.university
        .findMany({
            where: { status: true },
            select: {
                name: true,
                city: true,
                state: true,
                tuitionFee: true,
                shortnote: true,
                isFeatured: true,
                cityRelation: { select: { name: true } },
            },
            orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
        })
        .then((universities: any[]) => {
            const buckets = new Map<
                string,
                {
                    city: string;
                    universityCount: number;
                    universityNames: string[];
                    notes: string[];
                    tuitions: string[];
                }
            >();

            universities.forEach((uni) => {
                const cityName = uni.city?.trim() || uni.cityRelation?.name?.trim() || uni.state?.trim();
                if (!cityName) return;

                const key = cityName.toLowerCase();
                if (!buckets.has(key)) {
                    buckets.set(key, {
                        city: cityName,
                        universityCount: 0,
                        universityNames: [],
                        notes: [],
                        tuitions: [],
                    });
                }

                const bucket = buckets.get(key)!;
                bucket.universityCount += 1;
                bucket.universityNames.push(uni.name);
                if (uni.shortnote?.trim()) bucket.notes.push(uni.shortnote.trim());
                if (uni.tuitionFee?.trim()) bucket.tuitions.push(uni.tuitionFee.trim());
            });

            const fromDb = Array.from(buckets.values())
                .sort((a, b) => b.universityCount - a.universityCount || a.city.localeCompare(b.city))
                .slice(0, 3)
                .map((bucket) => ({
                    city: bucket.city,
                    description: withDefaultDescription(
                        bucket.notes[0],
                        `${bucket.city} offers access to medical universities, practical training, and student housing options.`,
                    ),
                    universityCount: bucket.universityCount,
                    universityNames: bucket.universityNames.slice(0, 3),
                    avgTuition: bucket.tuitions[0] || undefined,
                }));

            const fallback: UniversityCityCard[] = [
                {
                    city: SITE_CONFIG.capital,
                    description: "Capital city with major hospitals, universities, and student facilities.",
                    universityCount: 1,
                    universityNames: ["Leading MBBS institutions"],
                    avgTuition: undefined,
                },
                {
                    city: "Curepipe",
                    description: "Central academic hub with a peaceful and student-friendly environment.",
                    universityCount: 1,
                    universityNames: ["Established medical campuses"],
                    avgTuition: "$3,500-8,000",
                },
                {
                    city: "Quatre Bornes",
                    description: "Urban center with strong educational access, housing, and connectivity.",
                    universityCount: 1,
                    universityNames: ["Accessible university options"],
                    avgTuition: "$3,500-8,000",
                },
            ];

            if (fromDb.length >= 3) {
                return fromDb;
            }

            const used = new Set(fromDb.map((item) => item.city.toLowerCase()));
            const filled = fallback.filter((item) => !used.has(item.city.toLowerCase()));
            return [...fromDb, ...filled].slice(0, 3);
        })
        .catch((error: Error) => {
            console.error("Failed to fetch university city details, using fallback city cards.", error);
            return [
                {
                    city: SITE_CONFIG.capital,
                    description: "Capital city with major hospitals, universities, and student facilities.",
                    universityCount: 1,
                    universityNames: ["Leading MBBS institutions"],
                    avgTuition: "$3,500-8,000",
                },
                {
                    city: "Curepipe",
                    description: "Central academic hub with a peaceful and student-friendly environment.",
                    universityCount: 1,
                    universityNames: ["Established medical campuses"],
                    avgTuition: "$3,500-8,000",
                },
                {
                    city: "Quatre Bornes",
                    description: "Urban center with strong educational access, housing, and connectivity.",
                    universityCount: 1,
                    universityNames: ["Accessible university options"],
                    avgTuition: "$3,500-8,000",
                },
            ] satisfies UniversityCityCard[];
        });

    const attractions =
        page?.touristAttractions.length
            ? page.touristAttractions.map((spot: any, index: number) => ({
                  title: spot.attractionName,
                  description: withDefaultDescription(spot.description, `${spot.attractionName} is one of the standout attractions in ${countryName}.`),
                  image: spot.image ? cdn(spot.image) : undefined,
                  theme: pickTheme(index),
              }))
            : [];

    const cuisines =
        page?.cuisines.length
            ? page.cuisines.map((item: any, index: number) => ({
                  title: item.dishName || `Cuisine ${index + 1}`,
                  description: withDefaultDescription(item.dishDescription, "Part of the local food culture students commonly explore."),
                  image: item.dishImage ? cdn(item.dishImage) : undefined,
                  theme: pickTheme(index),
              }))
            : [];

    const location = page?.location || "Eastern Europe";
    const timezone = page?.timezone || SITE_CONFIG.timezoneLabel;
    const independenceDay = page?.independenceDay ? new Date(page.independenceDay).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) : "3 July";
    const highestPeak = page?.highestPeak || "Dzyarzhynskaya Hill";
    const highestPeakHeight = page?.highestPeakHeight || "345 m";

    return {
        countryName,
        heroTitle,
        heroDescription,
        bannerImage: page?.bannerImage ? cdn(page.bannerImage) : undefined,
        summaryStats,
        highlights,
        overviewCards:
            overviewCards.length > 0
                ? overviewCards
                : [
                      {
                          title: "Practical living costs",
                          description: `Students typically choose ${countryName} for its balance of tuition value and manageable monthly expenses.`,
                          theme: "red",
                      },
                      {
                          title: "Supportive student communities",
                          description: "International student groups, hostels, and onboarding support help new arrivals settle in quickly.",
                          theme: "blue",
                      },
                      {
                          title: "Strong lifestyle fit",
                          description: "City infrastructure, public transport, and campus access make the transition smoother for first-time international students.",
                          theme: "green",
                      },
                  ],
        supportPoints:
            supportPoints.length > 0
                ? supportPoints
                : [
                      `${countryName} continues to attract students looking for structured medical education and better cost predictability.`,
                      "International students typically receive onboarding support around housing, travel, and essential local setup.",
                      "Major cities offer access to hospitals, public services, and day-to-day amenities near university clusters.",
                  ],
        cities,
        universityCities,
        attractions,
        cuisines,
        location,
        timezone,
        independenceDay,
        highestPeak,
        highestPeakHeight,
    };
});

export const getEducationSystemContent = cache(async (): Promise<EducationSystemContent> => {
    const system = await prisma.educationSystem
        .findFirst({
            include: {
                degrees: { orderBy: { id: "asc" } },
                examinations: { orderBy: { id: "asc" } },
                popularFields: { orderBy: { id: "asc" } },
                schoolLevels: { orderBy: { id: "asc" } },
            },
        })
        .catch((error: Error) => {
            console.error("Failed to fetch education system content, using fallback content.", error);
            return null;
        });

    const title = system?.title || `Education System in ${SITE_CONFIG.country}`;
    const description =
        system?.description ||
        "Understand the academic structure, teaching approach, and progression pathways that shape medical education in Belarus.";

    const primaryDegree = system?.degrees[0];
    const summaryStats = [
        {
            label: "Medical Degree",
            value: "6 Years",
            detail: "MBBS / Doctor of Medicine (General Medicine) at state medical universities",
        },
        {
            label: "Language of Instruction",
            value: "English",
            detail: "International MBBS programs are taught in English; Russian is used in clinics",
        },
        {
            label: "General Secondary Education",
            value: "11 Years",
            detail: "Primary, basic and upper secondary stages",
        },
        {
            label: "State Medical Universities",
            value: "4",
            detail: "Minsk, Vitebsk, Grodno and Gomel",
        },
    ];

    const supportingNarrative = compact<string>([
        system?.governmentRegulation || undefined,
        system?.culturalImportance || undefined,
        system?.continuousDevelopment || undefined,
        system?.higherEducationDescription || undefined,
        system?.bolognProcessAlignment || undefined,
    ]);

    const finalNarrative = supportingNarrative.length > 0 
        ? supportingNarrative.slice(0, 5)
        : [
            "A state-run education system with a long tradition in medical training.",
            "Medical programs combine theory, laboratory work and hospital-based clinical practice.",
            "International MBBS programs are taught in English at state medical universities.",
            "Universities are regulated by the Ministry of Health and the Ministry of Education.",
            "Always confirm each university's current NMC and WHO listing before applying.",
        ];

    const focusAreas =
        system?.popularFields.length
            ? system.popularFields.map((field: any, index: number) => ({
                  title: field.field,
                  description:
                      field.description ||
                      compact([
                          field.numberOfInstitutions ? `${field.numberOfInstitutions} institutions` : undefined,
                          field.durationYears ? `${field.durationYears} duration` : undefined,
                      ]).join(" | ") ||
                      `Explore how ${field.field.toLowerCase()} fits into the education landscape.`,
                  theme: pickTheme(index),
              }))
            : [
                  {
                      title: "Structured medical curriculum",
                      description: "A clear progression from foundation sciences to clinical rotations in university teaching hospitals.",
                      theme: "red" as const,
                  },
                  {
                      title: "NMC & WHO Recognition",
                      description: "Medical programs are designed to meet the requirements of international medical councils including NMC.",
                      theme: "blue" as const,
                  },
                  {
                      title: "Clinical Exposure",
                      description: "Strong emphasis on hands-on hospital training in affiliated public and private hospitals.",
                      theme: "green" as const,
                  },
              ];

    const timeline =
        system?.schoolLevels.length
            ? system.schoolLevels.map((level: any, index: number) => {
                  const points = splitContent(level.description).slice(0, 5);
                  const meta = compact([
                      level.ageRange ? `Age ${level.ageRange}` : undefined,
                      level.numberOfSchools || undefined,
                  ]).join(" | ");

                  return {
                      label: level.level,
                      title: level.title || level.level,
                      description:
                          withDefaultDescription(
                              level.description,
                              `${level.level} builds the next stage of academic preparation within the national education system.`,
                          ),
                      points: points.length ? points : compact([level.ageRange, level.numberOfSchools]),
                      duration: level.durationYears ? `${level.durationYears} years` : undefined,
                      meta: meta || (level.isCompulsory ? "Compulsory stage" : undefined),
                      theme: pickTheme(index),
                  };
              })
            : [
                  {
                    label: "Primary",
                    title: "Primary Education",
                    description: "Foundational education focusing on core literacy and numeracy.",
                    points: ["Compulsory stage", "State schools"],
                    duration: "4 years",
                    theme: "red" as const,
                  },
                  {
                    label: "Secondary",
                    title: "Basic and Upper Secondary Education",
                    description: "General secondary education leading to the certificate required for university entry.",
                    points: ["Basic stage", "Upper secondary stage", "Centralized testing for admission"],
                    duration: "7 years",
                    theme: "blue" as const,
                  },
                  {
                    label: "Tertiary",
                    title: "University and Professional Training",
                    description: "Higher education offering degrees in Medicine and other fields.",
                    points: ["Universities", "Medical Universities", "Postgraduate residency"],
                    duration: "4 to 6 years",
                    theme: "green" as const,
                  },
              ];

    const degreeCards =
        system?.degrees.length
            ? system.degrees.map((degree: any, index: number) => ({
                  title: degree.degree,
                  description:
                      compact([
                          degree.duration ? `Duration: ${degree.duration}` : undefined,
                          degree.ectsCredits ? `ECTS: ${degree.ectsCredits}` : undefined,
                          degree.recognition || undefined,
                      ]).join(" | ") || "Recognized higher education pathway.",
                  theme: pickTheme(index),
              }))
            : [
                  {
                      title: "MBBS (Doctor of Medicine - General Medicine)",
                      description: "Six-year medical degree combining pre-clinical, clinical and practical training. Confirm current NMC / WHO recognition for each university.",
                      theme: "green" as const,
                  },
              ];

    const languageCards = compact<ValueCard>([
        system?.officialStateLanguage && {
            label: system.officialStateLanguage,
            value: formatPercent(system.officialStateLanguagePercentage ? Number(system.officialStateLanguagePercentage) : undefined) || "Widely used",
            detail: system.officialStateLanguageNote || "State language",
        },
        system?.officialLanguage && {
            label: system.officialLanguage,
            value: formatPercent(system.officialLanguagePercentage ? Number(system.officialLanguagePercentage) : undefined) || "Widely used",
            detail: system.officialLanguageNote || "Official language",
        },
        system?.foreignLanguage && {
            label: system.foreignLanguage,
            value: formatPercent(system.foreignLanguagePercentage ? Number(system.foreignLanguagePercentage) : undefined) || "International support",
            detail: system.foreignLanguageNote || "Foreign language support",
        },
    ]);

    const institutionCards = [
        {
            label: "State Medical Universities",
            value: "4",
            detail: "Belarusian State, Vitebsk State, Grodno State and Gomel State Medical Universities",
        },
        {
            label: "Medical Degree",
            value: "6 Years",
            detail: "MBBS / Doctor of Medicine (General Medicine)",
        },
        {
            label: "Language",
            value: "English",
            detail: "Medium of instruction for international MBBS students",
        },
    ];

    const examinations =
        system?.examinations.length
            ? system.examinations.map((exam: any) => ({
                  title: exam.examName,
                  description:
                      exam.subjects ||
                      exam.type ||
                      exam.gradeLevel ||
                      `Learn how ${exam.examName.toLowerCase()} fits into the education pathway.`,
                  gradeLevel: exam.gradeLevel || undefined,
                  type: exam.type || undefined,
                  subjects: splitContent(exam.subjects),
              }))
            : [
                  {
                      title: "Centralized Testing (CT)",
                      description: "National entrance testing used for admission to Belarusian universities. International applicants follow the university's own admission process.",
                      subjects: ["Biology", "Chemistry"],
                  },
              ];

    return {
        title,
        description,
        introductionTitle: system?.introductionTitle || `Academic Framework in ${SITE_CONFIG.country}`,
        introductionDescription:
            system?.introductionDescription ||
            `${SITE_CONFIG.country}'s state education system has a long tradition in medical training, combining theoretical study with hospital-based clinical practice.`,
        supportingNarrative: finalNarrative,
        summaryStats,
        focusAreas,
        timeline,
        degreeCards,
        languageCards:
            languageCards.length > 0
                ? languageCards
                : [
                      {
                          label: "Belarusian / Russian / English",
                          value: "Multilingual",
                          detail: "Belarusian and Russian are the state languages; international MBBS programs are taught in English.",
                      },
                  ],
        institutionCards:
            institutionCards.length > 0
                ? institutionCards
                : [
                      {
                          label: "Academic Network",
                          value: "State Regulated",
                          detail: "State medical universities operate under the Ministry of Health and the Ministry of Education.",
                      },
                  ],
        examinations,
    };
});
