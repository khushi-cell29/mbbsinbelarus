import {
  ApplicationStatus,
  LeadStatus,
  NeetStatus,
  UserRole,
} from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import * as bcrypt from "bcryptjs";
import { SITE_CONFIG } from "../src/lib/site-config";

const SHOULD_SEED_SAMPLE_LEADS =
  (process.env.SEED_SAMPLE_LEADS || "false").toLowerCase() === "true";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function upsertByWhere(
  delegate: any,
  where: Record<string, unknown>,
  data: Record<string, unknown>,
) {
  const existing = await delegate.findFirst({ where });
  if (existing) {
    return delegate.update({ where: { id: existing.id }, data });
  }
  return delegate.create({ data });
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before seeding.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.upsert({
    where: { email },
    update: {
      name: "Super Admin",
      role: UserRole.admin,
      password: hashedPassword,
      designation: "Administrator",
      description: "Platform administrator for MBBS in Belarus.",
      status: true,
    },
    create: {
      name: "Super Admin",
      email,
      role: UserRole.admin,
      password: hashedPassword,
      designation: "Administrator",
      description: "Platform administrator for MBBS in Belarus.",
      status: true,
    },
  });
}

async function seedWebsiteSettings() {
  // Only identity settings are seeded. Marketing stats (stats_*) are intentionally NOT seeded:
  // the site hides any stat that has no value, so enter real numbers in the website settings
  // (keys stats_total_students, stats_experience_years, ...) once verified.
  const settings = [
    { key: "site_name", value: SITE_CONFIG.name, type: "text", group: "general" },
    { key: "support_email", value: SITE_CONFIG.contact.email, type: "text", group: "contact" },
    { key: "support_phone", value: SITE_CONFIG.contact.phoneDisplay, type: "text", group: "contact" },
  ];

  for (const item of settings) {
    await prisma.websiteSetting.upsert({
      where: { key: item.key },
      update: item,
      create: item,
    });
  }
}

// Regions ("oblasts") of Belarus and their main cities.
const BELARUS_REGIONS: { name: string; cities: string[] }[] = [
  { name: "Minsk", cities: ["Minsk"] },
  { name: "Brest Region", cities: ["Brest", "Baranavichy", "Pinsk"] },
  { name: "Gomel Region", cities: ["Gomel", "Mozyr", "Zhlobin"] },
  { name: "Grodno Region", cities: ["Grodno", "Lida", "Slonim"] },
  { name: "Minsk Region", cities: ["Borisov", "Soligorsk", "Molodechno"] },
  { name: "Mogilev Region", cities: ["Mogilev", "Bobruisk", "Orsha"] },
  { name: "Vitebsk Region", cities: ["Vitebsk", "Polotsk", "Novopolotsk"] },
];

async function seedReferenceData() {
  for (const name of ["Public", "Private"]) {
    await upsertByWhere(prisma.instituteType, { name }, { name, status: true });
  }

  for (const region of BELARUS_REGIONS) {
    const province = await upsertByWhere(prisma.province, { name: region.name }, { name: region.name, status: true });
    for (const cityName of region.cities) {
      await upsertByWhere(
        prisma.city,
        { name: cityName, provinceId: province.id },
        { name: cityName, provinceId: province.id, status: true },
      );
    }
  }

  const levels = [
    {
      name: "Undergraduate",
      slug: "undergraduate",
      description: "Bachelor-level programs including MBBS.",
      status: true,
    },
    {
      name: "Postgraduate",
      slug: "postgraduate",
      description: "Advanced clinical and research pathways.",
      status: true,
    },
  ];
  for (const item of levels) {
    await prisma.level.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  // Generic facility types (no claims about a specific university).
  for (const name of [
    "Indian Mess",
    "Multicultural Food Court",
    "24x7 Campus Security",
    "Simulation Labs",
    "On-campus Hostel",
  ]) {
    await upsertByWhere(prisma.facility, { name }, { name, status: true });
  }

  for (const studyMode of ["Full-time", "On-campus", "English Medium"]) {
    await upsertByWhere(prisma.studyMode, { studyMode }, { studyMode });
  }
}

async function seedCountryAndEducationPages() {
  // Draft content — review and edit in Admin → About Country / Education System.
  const aboutCountryData = {
    name: SITE_CONFIG.country,
    tagline: "A safe, affordable destination for medical studies in Eastern Europe",
    capital: SITE_CONFIG.capital,
    population: "About 9.1 million",
    languages: "Belarusian, Russian",
    currency: SITE_CONFIG.currencyCode,
    location: "Eastern Europe",
    timezone: SITE_CONFIG.timezoneLabel,
    highestPeak: "Dzyarzhynskaya Hill",
    highestPeakHeight: "345 m",
    whoRecognized: true,
    englishMedium: true,
    mbbsAffordableEducation:
      "State medical universities offer English-medium MBBS programs with competitive tuition for international students.",
    academicExcellence:
      "Medical education in Belarus combines a structured theoretical curriculum with early clinical training in teaching hospitals.",
    studentLife:
      "Cities such as Minsk, Vitebsk, Grodno and Gomel offer clean, orderly and student-friendly environments.",
    visaConnectivity:
      "Students typically enter on a study visa supported by an invitation from the university; confirm current rules with the Belarus embassy.",
  };
  const aboutCountry = await prisma.aboutCountryPage.upsert({
    where: { id: 1 },
    update: aboutCountryData,
    create: { id: 1, ...aboutCountryData },
  });

  const cityCards = [
    { cityName: "Minsk", description: "Capital and largest city, home to Belarusian State Medical University.", population: "About 2 million" },
    { cityName: "Vitebsk", description: "Historic city in the north-east and home to Vitebsk State Medical University.", population: "About 360,000" },
    { cityName: "Grodno", description: "Western city near the Polish border and home to Grodno State Medical University.", population: "About 360,000" },
    { cityName: "Gomel", description: "Southern regional centre and home to Gomel State Medical University.", population: "About 500,000" },
  ];
  for (const item of cityCards) {
    await upsertByWhere(
      prisma.countryMajorCity,
      { pageId: aboutCountry.id, cityName: item.cityName },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const cuisines = [
    { dishName: "Draniki", dishDescription: "Crispy potato pancakes, a national favourite." },
    { dishName: "Machanka", dishDescription: "Pork stew served with pancakes or bread." },
    { dishName: "Kolduny", dishDescription: "Stuffed potato dumplings baked or boiled." },
  ];
  for (const item of cuisines) {
    await upsertByWhere(
      prisma.countryCuisineLifestyle,
      { pageId: aboutCountry.id, dishName: item.dishName },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const lifestyles = [
    { title: "Safe and Orderly", description: "Belarus is generally regarded as a calm and orderly country for students." },
    { title: "Four Seasons", description: "A temperate continental climate with cold winters and warm summers." },
  ];
  for (const item of lifestyles) {
    await upsertByWhere(
      prisma.countryLifestyleCulture,
      { pageId: aboutCountry.id, title: item.title },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const attractions = [
    { attractionName: "Mir Castle Complex", description: "UNESCO World Heritage castle complex.", ordering: 1, isActive: true },
    { attractionName: "Nesvizh Castle", description: "Historic palace complex and UNESCO World Heritage site.", ordering: 2, isActive: true },
    { attractionName: "Belovezhskaya Pushcha", description: "Ancient forest and UNESCO World Heritage site.", ordering: 3, isActive: true },
    { attractionName: "Brest Fortress", description: "Memorial complex in Brest.", ordering: 4, isActive: true },
  ];
  for (const item of attractions) {
    await upsertByWhere(
      prisma.countryTouristAttraction,
      { pageId: aboutCountry.id, attractionName: item.attractionName },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const educationSystemData = {
    title: "Education System in Belarus",
    description:
      "Belarus has a state-run education system with a long tradition in medical training and structured, hospital-based learning.",
    introductionTitle: "Structured Academic Pathway",
    introductionDescription:
      "Medical education combines theory, laboratory work and clinical practice in university teaching hospitals.",
    literacyRate: 99.7,
    officialLanguage: "Belarusian and Russian",
    officialLanguageNote: "Local languages of instruction; international MBBS programs are taught in English",
    foreignLanguage: "English",
    foreignLanguageNote: "Used for international medical programs",
    higherEducationDescription: "State medical universities admit international students to English-medium programs.",
  };
  const educationSystem = await prisma.educationSystem.upsert({
    where: { id: 1 },
    update: educationSystemData,
    create: { id: 1, ...educationSystemData },
  });

  const schoolLevels = [
    { level: "Primary", ageRange: "6-10", isCompulsory: true, title: "Primary Education" },
    { level: "Secondary", ageRange: "10-17", isCompulsory: true, title: "General Secondary Education" },
    { level: "Higher Education", ageRange: "17+", isCompulsory: false, title: "University Level" },
  ];
  for (const item of schoolLevels) {
    await upsertByWhere(
      prisma.educationSchoolLevel,
      { pageId: educationSystem.id, level: item.level },
      { ...item, pageId: educationSystem.id },
    );
  }

  const degrees = [
    { degree: "MBBS / Doctor of Medicine (General Medicine)", duration: "6 Years", recognition: "Verify current NMC / WHO listing for each university" },
  ];
  for (const item of degrees) {
    await upsertByWhere(
      prisma.educationDegree,
      { pageId: educationSystem.id, degree: item.degree },
      { ...item, pageId: educationSystem.id },
    );
  }

  const aboutUsData = {
    heroTitle: `Your Trusted ${SITE_CONFIG.name} Advisory Team`,
    heroDescription: "We guide students from profile assessment to admission and pre-departure support.",
    mission: "Ethical and transparent MBBS counseling for students and parents.",
    vision: `To be the most trusted ${SITE_CONFIG.country} medical admission support platform.`,
    contact1: SITE_CONFIG.contact.phoneDisplay,
    email1: SITE_CONFIG.contact.email,
    address: SITE_CONFIG.contact.address,
  };
  await prisma.aboutUs.upsert({
    where: { id: 1 },
    update: aboutUsData,
    create: { id: 1, ...aboutUsData },
  });

  await upsertByWhere(
    prisma.educationSystemPage,
    { title: "MBBS Curriculum Overview" },
    {
      title: "MBBS Curriculum Overview",
      subtitle: "Pre-clinical to internship progression",
      description: "A structured progression from foundation sciences to clinical rotations.",
      highlights: ["Anatomy", "Physiology", "Pathology", "Clinical postings"],
      position: 1,
      status: true,
    },
  );
}

async function seedContentAndMisc() {
  const C = SITE_CONFIG.country;
  const staticSeoPages = [
    { page: "home", metaTitle: `Study MBBS in ${C} ${new Date().getFullYear()}`, metaDescription: "Admission guidance, fee insights, and university comparison." },
    { page: "about-us", metaTitle: `About ${SITE_CONFIG.name} Team`, metaDescription: "Meet the counselors and operations team supporting students." },
    { page: SITE_CONFIG.aboutCountryKey, metaTitle: `About ${C} for Students`, metaDescription: "Understand lifestyle, safety, and healthcare ecosystem." },
    { page: "education-system", metaTitle: `Education System in ${C}`, metaDescription: "Academic structure and MBBS training overview." },
    { page: "universities", metaTitle: `Medical Universities in ${C}`, metaDescription: "Compare colleges, tuition, and support facilities." },
    { page: "blog", metaTitle: `MBBS ${C} Blog`, metaDescription: "Guides for admission, visa, and student life." },
    { page: "news", metaTitle: `MBBS ${C} News`, metaDescription: "Education and policy updates for aspirants." },
    { page: "articles", metaTitle: `MBBS ${C} Articles`, metaDescription: "Long-form practical planning guides." },
    { page: "contact-us", metaTitle: `Contact ${SITE_CONFIG.name} Advisors`, metaDescription: "Book counseling with our admissions team." },
    { page: "scholarships", metaTitle: `MBBS Scholarships in ${C}`, metaDescription: "Merit and tuition support opportunities." },
  ];
  for (const item of staticSeoPages) {
    await prisma.staticPageSeo.upsert({
      where: { page: item.page },
      update: { ...item, status: true, ogImagePath: "/og-default.jpg" },
      create: { ...item, status: true, ogImagePath: "/og-default.jpg" },
    });
  }

  for (const item of [
    "universities/[slug]",
    "blog/[categorySlug]/[blogSlug]",
    "news/[categorySlug]/[slug]",
    "articles/[categorySlug]/[slug]",
    "scholarships/[slug]",
  ]) {
    const data = {
      page: item,
      metaTitle: SITE_CONFIG.name,
      metaDescription: `Dynamic page SEO baseline for ${C}-focused content.`,
      status: true,
    };
    await prisma.dynamicPageSeo.upsert({ where: { page: item }, update: data, create: data });
  }

  await upsertByWhere(prisma.defaultOgImage, { name: `${C} Default OG` }, {
    name: `${C} Default OG`,
    imageName: "og-default.jpg",
    imagePath: "/og-default.jpg",
    status: true,
  });

  const faqCategory = await prisma.faqCategory.upsert({
    where: { slug: "homepage" },
    update: { name: "Homepage", slug: "homepage", status: true },
    create: { name: "Homepage", slug: "homepage", status: true },
  });
  await upsertByWhere(prisma.faq, { question: `Is MBBS in ${C} taught in English?` }, {
    question: `Is MBBS in ${C} taught in English?`,
    answer: `Yes. State medical universities in ${C} run English-medium MBBS programs for international students.`,
    categoryId: faqCategory.id,
    position: 1,
    status: true,
  });

  // Company office (real contact — shared across country sites).
  await upsertByWhere(prisma.office, { name: "India Head Office" }, {
    name: "India Head Office",
    address: SITE_CONFIG.contact.addressParts.streetAddress,
    city: SITE_CONFIG.contact.addressParts.addressLocality,
    state: SITE_CONFIG.contact.addressParts.addressRegion,
    country: "India",
    phone: SITE_CONFIG.contact.phoneDisplay,
    email: SITE_CONFIG.contact.email,
    position: 1,
    status: true,
  });

  // Starter categories only — no sample posts, testimonials, experts or partner
  // inquiries (those would be fabricated content on a live site).
  await prisma.blogCategory.upsert({
    where: { slug: "admission-guides" },
    update: { name: "Admission Guides", slug: "admission-guides", status: true },
    create: { name: "Admission Guides", slug: "admission-guides", status: true },
  });
  await prisma.newsCategory.upsert({
    where: { slug: "policy-and-admissions" },
    update: { name: "Policy and Admissions", slug: "policy-and-admissions", status: true },
    create: { name: "Policy and Admissions", slug: "policy-and-admissions", status: true },
  });
  await prisma.articleCategory.upsert({
    where: { slug: "mbbs-planning" },
    update: { name: "MBBS Planning", slug: "mbbs-planning", status: true },
    create: { name: "MBBS Planning", slug: "mbbs-planning", status: true },
  });

  // NOTE: Government links are NOT seeded on purpose. The homepage shows a verified built-in list
  // (with phone/email) until you add rows in Admin -> Government Links, which then replace it.
}

async function seedUniversityDependentData() {
  // University-level reviews, testimonials, FAQs etc. must come from real data
  // (Admin → Universities). We only resolve a program id for the optional
  // sample lead below.
  const program = await prisma.universityProgram.findFirst({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });
  return { universityProgramId: program?.id ?? null };
}

async function seedOptionalLeadData(adminId: number, universityProgramId: number | null) {
  if (!SHOULD_SEED_SAMPLE_LEADS) {
    console.log("Skipping sample leads. Set SEED_SAMPLE_LEADS=true to include them.");
    return;
  }

  const lead = await prisma.lead.upsert({
    where: { email: "ravi.kumar@studentmail.com" },
    update: {
      name: "Ravi Kumar",
      phone: "9876501234",
      city: "Pune",
      state: "Maharashtra",
      source: "website",
      sourcePath: "/contact-us",
      status: LeadStatus.active,
      country: "India",
      interestedProgram: "MBBS",
      neetQualificationStatus: NeetStatus.qualified,
      neetScore: 545,
      assignedTo: adminId,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
    create: {
      name: "Ravi Kumar",
      email: "ravi.kumar@studentmail.com",
      phone: "9876501234",
      city: "Pune",
      state: "Maharashtra",
      source: "website",
      sourcePath: "/contact-us",
      status: LeadStatus.active,
      country: "India",
      interestedProgram: "MBBS",
      neetQualificationStatus: NeetStatus.qualified,
      neetScore: 545,
      assignedTo: adminId,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  await upsertByWhere(
    prisma.studentSchool,
    { leadId: lead.id, institutionName: "St. Xavier Higher Secondary School" },
    {
      leadId: lead.id,
      levelOfEducation: "Higher Secondary",
      countryOfEducation: "India",
      institutionName: "St. Xavier Higher Secondary School",
      gradeAverage: "82%",
    },
  );

  await upsertByWhere(
    prisma.studentDocument,
    { leadId: lead.id, documentType: "passport" },
    {
      leadId: lead.id,
      documentType: "passport",
      fileName: "ravi-passport.pdf",
      filePath: "/uploads/student-documents/ravi-passport.pdf",
      isVerified: true,
    },
  );

  await upsertByWhere(
    prisma.leadInquiry,
    { leadId: lead.id, source: "website", message: "Need counseling for September intake." },
    {
      leadId: lead.id,
      universityName: "Belarus MBBS options",
      message: "Need counseling for September intake.",
      source: "website",
      status: "pending",
      agentId: adminId,
    },
  );

  if (universityProgramId) {
    await upsertByWhere(
      prisma.studentApplication,
      { leadId: lead.id, universityProgramId },
      {
        leadId: lead.id,
        universityProgramId,
        status: ApplicationStatus.applied,
        notes: "Sample dashboard application record generated by seed.",
      },
    );
  } else {
    console.log("No university program found. Skipping sample StudentApplication seed.");
  }
}

async function main() {
  console.log("Starting Belarus baseline database seed...");
  console.log(
    "University bulk-upload tables are intentionally not seeded here (University, UniversityRanking, UniversityLink, UniversityIntake, UniversityProgram, UniversityDocument, UniversityPhoto, UniversityFmgeRate).",
  );

  const admin = await seedAdminUser();
  await seedWebsiteSettings();
  await seedReferenceData();
  await seedCountryAndEducationPages();
  await seedContentAndMisc();
  const { universityProgramId } = await seedUniversityDependentData();
  await seedOptionalLeadData(admin.id, universityProgramId);

  console.log("Belarus baseline seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed.", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
