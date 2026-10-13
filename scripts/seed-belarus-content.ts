/**
 * Seeds starter CONTENT for the Belarus site: blog posts, articles, news-style
 * student advisories, scholarship information, education-system data and
 * extra About-Belarus data.
 *
 * Editorial rules used for everything below:
 *  - Evergreen, explanatory content only. No invented events, dates, prices,
 *    seat counts, rankings, ratings or statistics.
 *  - Anything that changes (fees, intakes, exam formats, visa rules, scholarship
 *    terms) is described as "verify with the official source".
 *  - "News" items are student advisories, not claims about specific events.
 *    Replace/extend with real dated news from Admin → News.
 *
 * Idempotent: posts, scholarships and FAQs are only created when missing
 * (matched by slug / question), so re-running never overwrites admin edits.
 * Reference/country rows are upserted by name.
 *
 * Run AFTER `npm run seed`:  npm run seed:belarus:content
 */
import { prisma } from "../src/lib/prisma";

const C = "Belarus";

type Section = { title: string; slug: string; html: string };
type Faq = { q: string; a: string };

function readingTime(html: string): number {
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

async function getAdminId(): Promise<number> {
  const admin = await prisma.user.findFirst({ where: { role: "admin" }, orderBy: { id: "asc" } });
  if (!admin) throw new Error("No admin user found. Run `npm run seed` first.");
  return admin.id;
}

async function category(model: "blogCategory" | "newsCategory" | "articleCategory", name: string, slug: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delegate = (prisma as any)[model];
  return delegate.upsert({
    where: { slug },
    update: { name, slug, status: true },
    create: { name, slug, status: true },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG
// ─────────────────────────────────────────────────────────────────────────────
const blogs: {
  category: string;
  title: string;
  slug: string;
  shortnote: string;
  intro: string;
  sections: Section[];
  faqs: Faq[];
  metaDescription: string;
  keywords: string;
  home?: boolean;
  trending?: boolean;
}[] = [
  {
    category: "admission-guides",
    title: "MBBS in Belarus: A Step-by-Step Admission Roadmap",
    slug: "mbbs-in-belarus-admission-roadmap",
    shortnote: "A practical sequence from eligibility check to arrival, so you know what to do and in what order.",
    intro:
      "<p>Applying for MBBS abroad is easier when you treat it as a sequence of small steps. This roadmap covers the typical path for an Indian student applying to a state medical university in Belarus. Exact documents, dates and fees differ by university and year, so always confirm the details with the university or our counsellors before you pay anything.</p>",
    sections: [
      {
        title: "Step 1: Check your eligibility",
        slug: "check-eligibility",
        html: "<p>Start with the basics: you will generally need Physics, Chemistry and Biology in your 10+2, and qualifying marks in each. Indian students who plan to practise in India must also meet the National Medical Commission (NMC) eligibility conditions for foreign medical graduates, which include NEET qualification. Read the latest NMC notices before you commit.</p>",
      },
      {
        title: "Step 2: Shortlist universities",
        slug: "shortlist-universities",
        html: "<p>Belarus has four state medical universities: Belarusian State Medical University (Minsk), Vitebsk State Medical University, Grodno State Medical University and Gomel State Medical University. Compare them on city, fees, hostel availability, English-medium support, clinical training and recognition status. Use the <a href=\"/universities\">universities page</a> and the <a href=\"/compare\">comparison tool</a>.</p>",
      },
      {
        title: "Step 3: Verify recognition",
        slug: "verify-recognition",
        html: "<p>Before applying, check that the university is listed in the World Directory of Medical Schools and review NMC guidance. Do this yourself on the official websites instead of relying only on a consultant's claim.</p>",
      },
      {
        title: "Step 4: Prepare documents and apply",
        slug: "prepare-and-apply",
        html: "<p>Typical documents include your passport, 10th and 12th marksheets, NEET scorecard, photographs and a medical fitness certificate. Some documents may need attestation or apostille. Submit the application through the university or an authorised partner, and keep copies of everything.</p>",
      },
      {
        title: "Step 5: Offer, invitation and visa",
        slug: "offer-invitation-visa",
        html: "<p>After admission, the university arranges the invitation needed for a study visa. Visa rules are set by the Belarus Ministry of Foreign Affairs, so read its official visa pages and the website of the Embassy of Belarus in New Delhi for current requirements.</p>",
      },
      {
        title: "Step 6: Travel and enrolment",
        slug: "travel-and-enrolment",
        html: "<p>Plan flights only after your visa is confirmed, and check current routes because options can change. On arrival you will complete enrolment, registration and medical checks, and move into the hostel or private housing.</p>",
      },
    ],
    faqs: [
      { q: "When should I start applying?", a: "Start planning several months before the intake you want. Document attestation and the visa can take time, so early preparation avoids last-minute stress." },
      { q: "Is NEET required for MBBS in Belarus?", a: "Universities set their own entry rules, but Indian students who want to practise in India after MBBS abroad generally need to meet NMC conditions, which include NEET qualification. Check current NMC guidance." },
      { q: "Can I apply directly to the university?", a: "Yes, you can apply through official channels. Many students use a counselling partner for guidance with documents and the visa. Always confirm what fees are being charged and to whom." },
    ],
    metaDescription: "A step-by-step admission roadmap for MBBS in Belarus: eligibility, shortlisting universities, verifying recognition, documents, visa and arrival.",
    keywords: "MBBS in Belarus admission process, Belarus medical university admission, how to apply MBBS Belarus",
    home: true,
    trending: true,
  },
  {
    category: "admission-guides",
    title: "Documents Checklist for MBBS Admission Abroad",
    slug: "documents-checklist-mbbs-abroad",
    shortnote: "The documents most universities and embassies ask for, and how to avoid common delays.",
    intro:
      "<p>Missing or incorrectly attested documents are one of the most common causes of delay. Use this checklist as a starting point, then confirm the exact list with your university and the embassy.</p>",
    sections: [
      {
        title: "Core academic and identity documents",
        slug: "core-documents",
        html: "<ul><li>Valid passport (check the expiry date well in advance)</li><li>10th and 12th marksheets and certificates</li><li>NEET scorecard (for Indian students)</li><li>Birth certificate</li><li>Passport-size photographs as specified by the university</li></ul>",
      },
      {
        title: "Medical and supporting documents",
        slug: "medical-supporting",
        html: "<p>Universities and embassies commonly ask for a medical fitness certificate and may ask for specific health tests. Requirements differ, so ask for the current list instead of assuming.</p>",
      },
      {
        title: "Attestation and translation",
        slug: "attestation-translation",
        html: "<p>Some documents may need notarisation, apostille or an official translation. Start this early and keep both originals and scanned copies. Ask the university which documents must be translated and into which language.</p>",
      },
      {
        title: "Tips to avoid delays",
        slug: "avoid-delays",
        html: "<ul><li>Check that names and dates match across all documents</li><li>Scan documents clearly in the requested file format</li><li>Keep digital and paper copies</li><li>Do not pay fees to anyone without a written receipt</li></ul>",
      },
    ],
    faqs: [
      { q: "Do all documents need apostille?", a: "Not always. It depends on the university and the embassy. Ask for the current requirements for your specific case before starting attestation." },
      { q: "What if my name differs between documents?", a: "Fix this before applying. Differences can cause visa and registration problems, so get a correction or an affidavit as advised by the authorities." },
    ],
    metaDescription: "A practical documents checklist for MBBS admission abroad, including academic, identity, medical, attestation and translation tips.",
    keywords: "documents required MBBS abroad, MBBS Belarus documents, apostille MBBS",
  },
  {
    category: "student-life",
    title: "Student City Guide: Minsk, Vitebsk, Grodno and Gomel",
    slug: "student-city-guide-belarus",
    shortnote: "A quick, honest look at the four university cities and what daily life can look like for international students.",
    intro:
      "<p>Each of Belarus's four state medical universities is in a different city. The cities share a calm, orderly feel, but they differ in size, pace and surroundings. This guide gives a general picture; visit the universities' own pages for specifics.</p>",
    sections: [
      {
        title: "Minsk",
        slug: "minsk",
        html: "<p>Minsk is the capital and largest city, home to Belarusian State Medical University. It has the widest range of shops, cafes, public transport (including a metro) and cultural venues, and is generally the easiest city for newcomers to settle in.</p>",
      },
      {
        title: "Vitebsk",
        slug: "vitebsk",
        html: "<p>Vitebsk, in the north-east, is a mid-sized city known for its arts and culture and home to Vitebsk State Medical University. It has a more relaxed pace than the capital.</p>",
      },
      {
        title: "Grodno",
        slug: "grodno",
        html: "<p>Grodno is in the west near the Polish border and hosts Grodno State Medical University. It is known for its historic centre and green spaces.</p>",
      },
      {
        title: "Gomel",
        slug: "gomel",
        html: "<p>Gomel, in the south-east, is a large regional centre and home to Gomel State Medical University, with parks and a river-side setting.</p>",
      },
      {
        title: "Climate, language and daily life",
        slug: "climate-language-daily-life",
        html: "<p>Belarus has four distinct seasons with cold winters, so warm clothing is essential. Belarusian and Russian are the local languages; English-medium students are generally advised to learn basic Russian, which helps in hospitals, shops and daily life. Universities typically offer hostel accommodation, but confirm availability and conditions before you arrive.</p>",
      },
    ],
    faqs: [
      { q: "Which city is best for international students?", a: "It depends on your priorities. Minsk offers the most amenities, while smaller cities can be quieter and more affordable. Compare universities on the universities page." },
      { q: "Do I need to speak Russian?", a: "Your lectures are in English, but basic Russian is very helpful for daily life and patient interaction during clinical training." },
    ],
    metaDescription: "A student city guide to Minsk, Vitebsk, Grodno and Gomel, the four cities with state medical universities in Belarus.",
    keywords: "student life Belarus, Minsk student guide, Vitebsk Grodno Gomel students",
    home: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLES
// ─────────────────────────────────────────────────────────────────────────────
const articles: typeof blogs = [
  {
    category: "mbbs-planning",
    title: "Understanding the 6-Year MBBS (General Medicine) Programme in Belarus",
    slug: "mbbs-six-year-programme-belarus",
    shortnote: "How a six-year medical degree in Belarus is typically structured, from foundation sciences to clinical training.",
    intro:
      "<p>Medical universities in Belarus teach General Medicine as a six-year programme. The detailed curriculum differs by university, but the overall journey follows a familiar pattern. Always request the current curriculum from your chosen university.</p>",
    sections: [
      {
        title: "Early years: foundation sciences",
        slug: "foundation-sciences",
        html: "<p>The first years focus on basic medical sciences such as anatomy, physiology, biochemistry and histology, usually with laboratory work and dissection or simulation sessions.</p>",
      },
      {
        title: "Middle years: pre-clinical to clinical bridge",
        slug: "pre-clinical-bridge",
        html: "<p>Students move toward pathology, pharmacology, microbiology and introductory clinical subjects, often beginning supervised patient contact in teaching hospitals.</p>",
      },
      {
        title: "Final years: clinical rotations",
        slug: "clinical-rotations",
        html: "<p>The later years concentrate on clinical departments such as internal medicine, surgery, paediatrics and obstetrics-gynaecology, with hospital-based learning and examinations.</p>",
      },
      {
        title: "Language and patient communication",
        slug: "language-patient-communication",
        html: "<p>Teaching for international students is in English, but patients are usually Russian or Belarusian speakers. Learning medical Russian during the programme is a practical advantage.</p>",
      },
    ],
    faqs: [
      { q: "Is the course really six years?", a: "General Medicine is generally offered as a six-year programme. Confirm the exact structure and any internship requirements with your university and with NMC rules if you plan to practise in India." },
      { q: "Is the programme in English?", a: "Universities run English-medium groups for international students. Confirm this for your chosen intake." },
    ],
    metaDescription: "How the six-year MBBS / General Medicine programme in Belarus is typically structured, from foundation sciences to clinical rotations.",
    keywords: "MBBS Belarus six years, General Medicine Belarus curriculum, medical course structure Belarus",
    home: true,
    trending: true,
  },
  {
    category: "mbbs-planning",
    title: "Planning Your MBBS Budget: Cost Categories to Consider",
    slug: "mbbs-budget-cost-categories",
    shortnote: "A framework for estimating the real cost of studying medicine abroad, without relying on a single headline number.",
    intro:
      "<p>The tuition fee is only one part of what MBBS abroad costs. Fees vary by university and year, so this article lists the categories to budget for instead of quoting numbers. Ask each university for its current written fee structure.</p>",
    sections: [
      {
        title: "Tuition and university charges",
        slug: "tuition-university-charges",
        html: "<p>Ask whether the quoted fee is per year or for the whole course, and whether it includes registration, insurance, exams or study materials.</p>",
      },
      {
        title: "Accommodation and food",
        slug: "accommodation-food",
        html: "<p>Hostel fees are usually separate from tuition. Compare hostel options with private rental, and consider food and utilities.</p>",
      },
      {
        title: "Visa, travel and insurance",
        slug: "visa-travel-insurance",
        html: "<p>Include visa fees, flights (and at least one return trip per year), travel insurance and mandatory health insurance where required.</p>",
      },
      {
        title: "Hidden and recurring costs",
        slug: "hidden-recurring-costs",
        html: "<ul><li>Document attestation and translation</li><li>Residence registration and renewals</li><li>Warm clothing for winter</li><li>Currency exchange and bank charges</li><li>Exam preparation for NMC screening later</li></ul>",
      },
    ],
    faqs: [
      { q: "How do I compare fees fairly?", a: "Ask each university for a full written breakdown for the whole six years, then compare total cost including hostel, insurance and travel." },
      { q: "Are fees fixed for the entire course?", a: "This varies. Ask the university in writing whether fees can change during the programme." },
    ],
    metaDescription: "A practical framework for planning your MBBS budget abroad: tuition, accommodation, visa, travel, insurance and hidden costs.",
    keywords: "MBBS abroad cost, MBBS budget planning, Belarus MBBS fees",
  },
  {
    category: "mbbs-planning",
    title: "NMC Screening and Licensing: A Planning Guide for Indian Students",
    slug: "nmc-screening-planning-guide",
    shortnote: "What Indian students should know about NMC rules and the screening test for foreign medical graduates.",
    intro:
      "<p>Indian citizens who complete a medical degree abroad usually need to qualify a screening test conducted under the National Medical Commission before they can register to practise in India. Rules and exam formats are updated from time to time, so treat this as a planning guide and verify everything on the official NMC website.</p>",
    sections: [
      {
        title: "Eligibility before you travel",
        slug: "eligibility-before-travel",
        html: "<p>NMC sets eligibility conditions for foreign medical graduates, including NEET qualification and conditions about the course and training abroad. Read the current regulations before choosing a university.</p>",
      },
      {
        title: "The screening examination",
        slug: "screening-examination",
        html: "<p>Graduates take the NMC screening test, historically known as FMGE, and follow any successor exam format announced by NMC. Check the NMC notices for the current name, pattern and schedule.</p>",
      },
      {
        title: "Internship and registration",
        slug: "internship-registration",
        html: "<p>After qualifying, graduates complete any required internship in India and then apply for registration. Ask the university about the internship rules that apply to your batch.</p>",
      },
      {
        title: "Start preparing early",
        slug: "start-preparing-early",
        html: "<p>Many students begin screening-test preparation during the final years of the degree. Choose a university with strong clinical teaching, and keep records of your training.</p>",
      },
    ],
    faqs: [
      { q: "Do I have to take a test to practise in India?", a: "Indian citizens with a foreign medical degree generally have to qualify a screening test conducted under NMC rules. Confirm the latest rules on the NMC website." },
      { q: "Where do I find official updates?", a: "Use the NMC website (nmc.org.in) and official notices instead of social media or forwarded messages." },
    ],
    metaDescription: "A planning guide to NMC rules and the foreign medical graduate screening test for Indian students studying MBBS abroad.",
    keywords: "NMC screening foreign medical graduates, FMGE guide, NExT MBBS abroad, licensing India",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEWS-STYLE STUDENT ADVISORIES (evergreen; no claims about specific events)
// ─────────────────────────────────────────────────────────────────────────────
const news: typeof blogs = [
  {
    category: "policy-and-admissions",
    title: "Student Advisory: Verify a University's Recognition Before You Apply",
    slug: "advisory-verify-university-recognition",
    shortnote: "A reminder to confirm a medical school's listing and NMC position from official sources.",
    intro:
      "<p>Before paying any fee, confirm the university's status using official sources. Use the World Directory of Medical Schools, the university's own website and the NMC website.</p>",
    sections: [
      {
        title: "What to check",
        slug: "what-to-check",
        html: "<ul><li>Is the university listed in the World Directory of Medical Schools?</li><li>Does the programme meet the course and training conditions in NMC regulations?</li><li>Is the medium of instruction for your batch confirmed in writing?</li></ul>",
      },
      {
        title: "Keep written confirmation",
        slug: "written-confirmation",
        html: "<p>Keep emails and receipts for everything you are promised about fees, hostel and teaching language.</p>",
      },
    ],
    faqs: [{ q: "Who can confirm recognition?", a: "Official sources can: the university, the relevant ministries and regulators, and listings such as the World Directory of Medical Schools. Do not rely on a single verbal claim." }],
    metaDescription: "Advisory for students: how to verify a medical university's recognition and NMC position before applying.",
    keywords: "verify medical university recognition, WDOMS, NMC guidelines",
    home: true,
  },
  {
    category: "policy-and-admissions",
    title: "Student Advisory: Where to Find Official Belarus Visa Information",
    slug: "advisory-official-belarus-visa-information",
    shortnote: "Visa rules change. Here is where to read the official requirements.",
    intro:
      "<p>Visa and entry rules for Belarus are set by the Belarus Ministry of Foreign Affairs. For current requirements, use its official visa pages and the website of the Embassy of Belarus in New Delhi.</p>",
    sections: [
      {
        title: "Official sources",
        slug: "official-sources",
        html: "<ul><li>Ministry of Foreign Affairs of Belarus: <a href=\"https://mfa.gov.by/en/visa/general/\" target=\"_blank\" rel=\"noopener noreferrer\">visa information</a></li><li>Embassy of Belarus in India: <a href=\"https://india.mfa.gov.by/en/\" target=\"_blank\" rel=\"noopener noreferrer\">india.mfa.gov.by</a></li></ul>",
      },
      {
        title: "Plan ahead",
        slug: "plan-ahead",
        html: "<p>Study visas depend on an invitation arranged through the university. Do not book flights until your visa is confirmed.</p>",
      },
    ],
    faqs: [{ q: "Who arranges the invitation?", a: "The university normally arranges the invitation needed for a study visa after admission. Confirm the process with your university." }],
    metaDescription: "Where to find official Belarus visa information for international students, including the Ministry of Foreign Affairs and the Embassy in India.",
    keywords: "Belarus student visa, Belarus embassy India visa, study visa Belarus",
  },
  {
    category: "policy-and-admissions",
    title: "Student Advisory: Plan Early for Intake and Document Attestation",
    slug: "advisory-plan-early-intake-attestation",
    shortnote: "Intake dates differ by university, so start document preparation well ahead.",
    intro:
      "<p>Intake windows and deadlines differ between universities and can change, so check each university's current dates. Documents that need attestation or translation are the most common cause of delay.</p>",
    sections: [
      {
        title: "Practical steps",
        slug: "practical-steps",
        html: "<ul><li>Ask each university for its current intake and deadline in writing</li><li>Begin attestation and translation early</li><li>Keep digital and paper copies of everything</li></ul>",
      },
    ],
    faqs: [{ q: "Do all universities have the same intake?", a: "No. Intake windows vary by university and may change, so confirm the dates for the year you want." }],
    metaDescription: "Plan early for intake and document attestation when applying to medical universities in Belarus.",
    keywords: "MBBS intake Belarus, document attestation, admission deadlines",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SCHOLARSHIPS (informational; no invented amounts / seats / deadlines)
// ─────────────────────────────────────────────────────────────────────────────
const scholarships = [
  {
    title: "Belarus Government Scholarship (Intergovernmental Quota)",
    slug: "belarus-government-scholarship-foreign-students",
    scholarshipType: "Government",
    program: "MBBS / General Medicine",
    applicationMode: "Through official channels",
    shortnote:
      "Belarus may offer state-funded study places to foreign citizens under intergovernmental agreements. Availability, eligibility and the application route depend on the applicant's country and change over time, so confirm the current position with the Embassy of Belarus and the Ministry of Education.",
    faqs: [
      { q: "Is this scholarship available to Indian students?", a: "Availability depends on agreements between Belarus and each country and can change. Check the Embassy of Belarus in India and the Ministry of Education of Belarus for the current position." },
      { q: "How do I apply?", a: "State-funded places are usually applied for through official government channels rather than directly to a consultant. Always confirm the route in writing from an official source." },
      { q: "Does it cover everything?", a: "Coverage differs by programme and year. Ask for the written terms before you rely on any scholarship." },
    ],
  },
  {
    title: "Merit-Based Tuition Discounts (University-Specific)",
    slug: "merit-based-tuition-discounts-belarus",
    scholarshipType: "Merit-based (varies)",
    program: "MBBS / General Medicine",
    applicationMode: "Ask the university or our counsellors",
    shortnote:
      "Some universities may offer discounts or concessions for strong academic performance, early applications or similar criteria. Terms differ by university and year and are not guaranteed. Ask our counsellors for the current offers and get any promised discount in writing.",
    faqs: [
      { q: "Is a discount guaranteed?", a: "No. Any discount depends on the university's current policy and your application. Treat it as available only when confirmed in writing." },
      { q: "How can I find out what is available?", a: "Contact our counsellors or the university directly and ask for the written fee structure including any applicable concessions." },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WRITERS
// ─────────────────────────────────────────────────────────────────────────────
async function seedPosts(
  kind: "blog" | "news" | "article",
  items: typeof blogs,
  adminId: number,
) {
  for (const item of items) {
    const catModel = kind === "blog" ? "blogCategory" : kind === "news" ? "newsCategory" : "articleCategory";
    const catName =
      item.category === "student-life" ? "Student Life"
      : item.category === "admission-guides" ? "Admission Guides"
      : item.category === "policy-and-admissions" ? "Policy and Admissions"
      : "MBBS Planning";
    const cat = await category(catModel, catName, item.category);

    const description = item.intro;
    const base = {
      categoryId: cat.id,
      authorId: adminId,
      title: item.title,
      slug: item.slug,
      shortnote: `<p>${item.shortnote}</p>`,
      description,
      status: true,
      homeView: !!item.home,
      trending: !!item.trending,
      metaTitle: item.title,
      metaDescription: item.metaDescription,
      metaKeyword: item.keywords,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = prisma as any;
    const existing = await p[kind].findFirst({ where: { slug: item.slug } });
    if (existing) {
      console.log(`  = ${kind}: ${item.slug} (exists, skipped)`);
      continue;
    }

    const created =
      kind === "blog"
        ? await p.blog.create({ data: { ...base, readingTime: readingTime(description + item.sections.map((s) => s.html).join("")) } })
        : await p[kind].create({ data: base });

    const fk = kind === "blog" ? "blogId" : kind === "news" ? "newsId" : "articleId";
    const contentModel = kind === "blog" ? "blogContent" : kind === "news" ? "newsContent" : "articleContent";
    const faqModel = kind === "blog" ? "blogFaq" : kind === "news" ? "newsFaq" : "articleFaq";

    for (const [i, s] of item.sections.entries()) {
      await p[contentModel].create({
        data: { [fk]: created.id, title: s.title, slug: s.slug, description: s.html, position: i + 1 },
      });
    }
    for (const [i, f] of item.faqs.entries()) {
      await p[faqModel].create({
        data: { [fk]: created.id, question: f.q, answer: f.a, position: i + 1, status: true },
      });
    }
    console.log(`  + ${kind}: ${item.slug}`);
  }
}

async function seedScholarships() {
  for (const s of scholarships) {
    const existing = await prisma.scholarship.findUnique({ where: { slug: s.slug } });
    if (existing) {
      console.log(`  = scholarship: ${s.slug} (exists, skipped)`);
      continue;
    }
    const created = await prisma.scholarship.create({
      data: {
        title: s.title,
        slug: s.slug,
        scholarshipType: s.scholarshipType,
        program: s.program,
        applicationMode: s.applicationMode,
        shortnote: s.shortnote,
        isActive: true,
        metaTitle: s.title,
        metaDescription: s.shortnote.slice(0, 155),
      },
    });
    for (const [i, f] of s.faqs.entries()) {
      await prisma.scholarshipFaq.create({
        data: { scholarshipId: created.id, question: f.q, answer: f.a, position: i + 1, status: true },
      });
    }
    console.log(`  + scholarship: ${s.slug}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATION SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
async function upsertBy<T>(find: () => Promise<T | null>, update: (x: T) => Promise<unknown>, create: () => Promise<unknown>) {
  const existing = await find();
  if (existing) await update(existing);
  else await create();
}

async function seedEducationSystem() {
  const data = {
    title: "Education System in Belarus",
    description:
      "Belarus has a state-run education system with a long tradition in medical training. General secondary education leads to higher education at universities, including four state medical universities that admit international students.",
    introductionTitle: "A Structured, State-Regulated System",
    introductionDescription:
      "Education in Belarus is organised and regulated by the state. Medical education is delivered by state medical universities under the oversight of the Ministry of Health and the Ministry of Education, combining theoretical study, laboratory work and hospital-based clinical training.",
    governmentRegulation:
      "The Ministry of Education regulates education policy and university licensing, while the Ministry of Health oversees medical training and healthcare. International applicants should rely on these ministries and the universities for current rules.",
    culturalImportance:
      "Education has a long tradition in Belarus and universities are central to the country's academic and scientific life.",
    continuousDevelopment:
      "Curricula, teaching methods and admission rules are updated over time. Always confirm the current programme details with your chosen university.",
    schoolEducationStructureDescription:
      "General secondary education runs for eleven years: primary (4 years), basic secondary (5 years) and upper secondary (2 years).",
    examinationSystemDescription:
      "Belarusian school leavers use centralized testing for university admission. International applicants generally follow the university's own admission process, which may include document review and an interview.",
    languagesInstructionDescription:
      "Belarusian and Russian are the local languages of instruction. State medical universities run English-medium programmes for international students; learning basic Russian is recommended for daily life and clinical communication.",
    bolognProcessAlignment:
      "Belarus joined the Bologna Process in 2015 and has been aligning parts of its degree structure with European higher-education standards.",
    higherEducationDescription:
      "State medical universities in Minsk, Vitebsk, Grodno and Gomel admit international students to English-medium General Medicine programmes.",
    literacyRate: 99.7,
    officialStateLanguage: "Belarusian",
    officialStateLanguageNote: "State language",
    officialLanguage: "Russian",
    officialLanguageNote: "Also an official language, widely used in daily life and hospitals",
    foreignLanguage: "English",
    foreignLanguageNote: "Medium of instruction for international MBBS programmes",
  };
  const system = await prisma.educationSystem.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });

  // School levels: replace the generic seed rows with the accurate 4 + 5 + 2 structure.
  await prisma.educationSchoolLevel.deleteMany({ where: { pageId: system.id, level: { in: ["Secondary"] } } });
  const levels = [
    { level: "Primary", title: "Primary Education", ageRange: "6-10", durationYears: 4, isCompulsory: true, description: "Foundational literacy, numeracy and general knowledge." },
    { level: "Basic Secondary", title: "Basic Secondary Education", ageRange: "10-15", durationYears: 5, isCompulsory: true, description: "Core subjects across sciences, languages and humanities." },
    { level: "Upper Secondary", title: "Upper Secondary Education", ageRange: "15-17", durationYears: 2, isCompulsory: false, description: "Completes general secondary education and prepares students for university entry." },
    { level: "Higher Education", title: "University Level", ageRange: "17+", durationYears: 4, isCompulsory: false, description: "Bachelor-level and specialist degrees. Medicine is a longer programme (six years)." },
  ];
  for (const l of levels) {
    await upsertBy(
      () => prisma.educationSchoolLevel.findFirst({ where: { pageId: system.id, level: l.level } }),
      (x) => prisma.educationSchoolLevel.update({ where: { id: (x as { id: number }).id }, data: l }),
      () => prisma.educationSchoolLevel.create({ data: { ...l, pageId: system.id } }),
    );
  }

  const exams = [
    {
      examName: "Centralized Testing (CT)",
      gradeLevel: "Grade 11",
      type: "National",
      subjects: "Subjects depend on the chosen university programme, often including Biology and Chemistry for medicine",
    },
    {
      examName: "University Admission Process for International Applicants",
      gradeLevel: "After 10+2 / equivalent",
      type: "University-specific",
      subjects: "Document review and, where required, an interview or entrance assessment set by the university",
    },
  ];
  for (const e of exams) {
    await upsertBy(
      () => prisma.educationExamination.findFirst({ where: { pageId: system.id, examName: e.examName } }),
      (x) => prisma.educationExamination.update({ where: { id: (x as { id: number }).id }, data: e }),
      () => prisma.educationExamination.create({ data: { ...e, pageId: system.id } }),
    );
  }

  const degrees = [
    { degree: "MBBS / Doctor of Medicine (General Medicine)", duration: "6 Years", recognition: "Verify current NMC / WHO listing for each university" },
    { degree: "Clinical Residency (postgraduate specialisation)", duration: "Varies by specialty", recognition: "Confirm eligibility and recognition with the university" },
  ];
  for (const d of degrees) {
    await upsertBy(
      () => prisma.educationDegree.findFirst({ where: { pageId: system.id, degree: d.degree } }),
      (x) => prisma.educationDegree.update({ where: { id: (x as { id: number }).id }, data: d }),
      () => prisma.educationDegree.create({ data: { ...d, pageId: system.id } }),
    );
  }

  const fields = [
    { field: "General Medicine", description: "The main programme for MBBS aspirants, combining foundation sciences with clinical rotations.", durationYears: "6" },
    { field: "Dentistry and Pharmacy", description: "Related health-science programmes offered at medical universities. Check each university for availability to international students.", durationYears: "Varies" },
    { field: "Paediatrics and Specialties", description: "Specialised clinical tracks and postgraduate options. Availability varies by university.", durationYears: "Varies" },
  ];
  for (const f of fields) {
    await upsertBy(
      () => prisma.educationPopularField.findFirst({ where: { pageId: system.id, field: f.field } }),
      (x) => prisma.educationPopularField.update({ where: { id: (x as { id: number }).id }, data: f }),
      () => prisma.educationPopularField.create({ data: { ...f, pageId: system.id } }),
    );
  }

  const pages = [
    { title: "MBBS Curriculum Overview", subtitle: "Pre-clinical to clinical progression", description: "A structured progression from foundation sciences to clinical rotations in university teaching hospitals.", highlights: ["Anatomy", "Physiology", "Pathology", "Clinical postings"], position: 1 },
    { title: "Clinical Training", subtitle: "Learning in teaching hospitals", description: "Students gradually move from observation to supervised patient contact in affiliated hospitals. Clinical communication is mostly in Russian or Belarusian.", highlights: ["Supervised patient contact", "Hospital rotations", "Practical skills"], position: 2 },
    { title: "Language of Instruction", subtitle: "English-medium, with local language support", description: "International MBBS programmes are taught in English. Basic Russian is recommended for daily life and clinical settings.", highlights: ["English-medium lectures", "Russian for daily life", "Language support"], position: 3 },
    { title: "Assessment and Examinations", subtitle: "How progress is evaluated", description: "Progress is assessed through coursework, practical sessions and examinations. Ask your university for the current assessment scheme.", highlights: ["Coursework", "Practical assessments", "Semester examinations"], position: 4 },
    { title: "After the Degree", subtitle: "Licensing and next steps", description: "Indian graduates need to meet NMC rules, including the screening test, to practise in India. Graduates can also explore pathways in other countries, subject to local regulations.", highlights: ["NMC screening", "Internship rules", "Other country pathways"], position: 5 },
  ];
  for (const p of pages) {
    await upsertBy(
      () => prisma.educationSystemPage.findFirst({ where: { title: p.title } }),
      (x) => prisma.educationSystemPage.update({ where: { id: (x as { id: number }).id }, data: { ...p, status: true } }),
      () => prisma.educationSystemPage.create({ data: { ...p, status: true } }),
    );
  }
  console.log("  + education system");
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT BELARUS
// ─────────────────────────────────────────────────────────────────────────────
async function seedAboutCountry() {
  const data = {
    name: C,
    tagline: "A safe, affordable destination for medical studies in Eastern Europe",
    capital: "Minsk",
    population: "About 9.1 million",
    languages: "Belarusian, Russian",
    currency: "BYN",
    location: "Eastern Europe",
    timezone: "UTC+3 (Minsk Time)",
    highestPeak: "Dzyarzhynskaya Hill",
    highestPeakHeight: "345 m",
    whoRecognized: true,
    englishMedium: true,
    mbbsAffordableEducation:
      "State medical universities offer English-medium MBBS programmes. Fees vary by university, so compare the current written fee structures.",
    academicExcellence:
      "Medical education combines a structured theoretical curriculum with early clinical training in teaching hospitals.",
    studentLife:
      "Cities such as Minsk, Vitebsk, Grodno and Gomel are generally regarded as clean, orderly and student-friendly.",
    religionDiversity:
      "Most people in Belarus are Eastern Orthodox Christians, with a Roman Catholic minority and smaller communities of other faiths.",
    culturalHighlights:
      "Belarusian culture is known for its folk crafts, woven ornaments, castles and a strong tradition of festivals and folk music.",
    keySectors: "Manufacturing, agriculture, chemicals and information technology",
    mainIndustries: "Machinery, agriculture, potash and IT",
    unescoSites:
      "Mir Castle Complex; Architectural, Residential and Cultural Complex of the Radziwill Family at Nesvizh; Belovezhskaya Pushcha / Białowieża Forest; Struve Geodetic Arc",
    visaConnectivity:
      "Students typically enter on a study visa supported by an invitation arranged through the university. Check the Ministry of Foreign Affairs of Belarus and the Embassy of Belarus in India for current rules, and check current flight routes before booking.",
    publicHealthcare:
      "A state-funded healthcare system with a network of hospitals and polyclinics, including the teaching hospitals used for clinical training.",
    privateHealthcare:
      "Private clinics and medical centres complement public care in the larger cities.",
    studentHealthcare:
      "International students generally need valid health insurance, and universities can guide you on clinics and medical services.",
  };
  const page = await prisma.aboutCountryPage.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });

  const cities = [
    { cityName: "Minsk", description: "Capital and largest city, home to Belarusian State Medical University, with a metro and the widest range of amenities.", population: "About 2 million" },
    { cityName: "Vitebsk", description: "A historic city in the north-east known for arts and culture, home to Vitebsk State Medical University.", population: "About 360,000" },
    { cityName: "Grodno", description: "A western city near the Polish border with a historic centre, home to Grodno State Medical University.", population: "About 360,000" },
    { cityName: "Gomel", description: "A large regional centre in the south-east, home to Gomel State Medical University.", population: "About 500,000" },
    { cityName: "Brest", description: "A western city on the Polish border, known for the Brest Fortress memorial complex.", population: "About 340,000" },
  ];
  for (const c of cities) {
    await upsertBy(
      () => prisma.countryMajorCity.findFirst({ where: { pageId: page.id, cityName: c.cityName } }),
      (x) => prisma.countryMajorCity.update({ where: { id: (x as { id: number }).id }, data: c }),
      () => prisma.countryMajorCity.create({ data: { ...c, pageId: page.id } }),
    );
  }

  const cuisines = [
    { dishName: "Draniki", dishDescription: "Crispy potato pancakes, often served with sour cream. A national favourite." },
    { dishName: "Machanka", dishDescription: "A hearty pork stew served with pancakes or bread." },
    { dishName: "Kolduny", dishDescription: "Stuffed potato dumplings, baked or boiled." },
    { dishName: "Kholodnik", dishDescription: "A cold beetroot soup, popular in summer." },
    { dishName: "Syrniki", dishDescription: "Soft, lightly fried cottage-cheese pancakes served for breakfast or dessert." },
  ];
  for (const c of cuisines) {
    await upsertBy(
      () => prisma.countryCuisineLifestyle.findFirst({ where: { pageId: page.id, dishName: c.dishName } }),
      (x) => prisma.countryCuisineLifestyle.update({ where: { id: (x as { id: number }).id }, data: c }),
      () => prisma.countryCuisineLifestyle.create({ data: { ...c, pageId: page.id } }),
    );
  }

  const lifestyles = [
    { title: "Safe and Orderly", description: "Belarus is generally regarded as a calm and orderly country for students." },
    { title: "Four Seasons", description: "A temperate continental climate with cold winters and warm summers. Pack warm clothing." },
    { title: "Green and Spacious", description: "Cities have many parks, and forests and lakes are easy to reach." },
    { title: "Folk Traditions", description: "Handicrafts, woven ornaments and folk festivals remain an important part of local culture." },
  ];
  for (const l of lifestyles) {
    await upsertBy(
      () => prisma.countryLifestyleCulture.findFirst({ where: { pageId: page.id, title: l.title } }),
      (x) => prisma.countryLifestyleCulture.update({ where: { id: (x as { id: number }).id }, data: l }),
      () => prisma.countryLifestyleCulture.create({ data: { ...l, pageId: page.id } }),
    );
  }

  const attractions = [
    { attractionName: "Mir Castle Complex", description: "UNESCO World Heritage castle complex.", ordering: 1 },
    { attractionName: "Nesvizh Castle", description: "Historic palace complex and UNESCO World Heritage site.", ordering: 2 },
    { attractionName: "Belovezhskaya Pushcha", description: "One of Europe's oldest forests and a UNESCO World Heritage site.", ordering: 3 },
    { attractionName: "Brest Fortress", description: "Memorial complex in Brest.", ordering: 4 },
    { attractionName: "Minsk Old Town (Trinity Suburb)", description: "A restored historic quarter with cafes and views over the Svislach River.", ordering: 5 },
  ];
  for (const a of attractions) {
    await upsertBy(
      () => prisma.countryTouristAttraction.findFirst({ where: { pageId: page.id, attractionName: a.attractionName } }),
      (x) => prisma.countryTouristAttraction.update({ where: { id: (x as { id: number }).id }, data: { ...a, isActive: true } }),
      () => prisma.countryTouristAttraction.create({ data: { ...a, isActive: true, pageId: page.id } }),
    );
  }
  console.log("  + about Belarus");
}

async function main() {
  console.log("Seeding Belarus content...");
  const adminId = await getAdminId();

  console.log("Blogs");
  await seedPosts("blog", blogs, adminId);
  console.log("Articles");
  await seedPosts("article", articles, adminId);
  console.log("News (student advisories)");
  await seedPosts("news", news, adminId);
  console.log("Scholarships");
  await seedScholarships();
  console.log("Education system");
  await seedEducationSystem();
  console.log("About Belarus");
  await seedAboutCountry();

  console.log(
    "Done. Review everything in Admin and replace the evergreen advisories with real dated news as it happens.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
