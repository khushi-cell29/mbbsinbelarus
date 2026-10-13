/**
 * Seeds the four state medical universities of Belarus as DRAFT records.
 *
 * Only identity facts are filled in (name, city, founding year, public type,
 * approximate city-centre map coordinates). Fees, rankings, ratings, intake
 * dates, recognition flags (NMC/WHO/etc.) and photos are deliberately left
 * empty — enter verified values in Admin → Universities.
 *
 * Records are created with status=false (hidden from the public site). Set
 * SEED_UNIVERSITIES_LIVE=true to publish them immediately (e.g. on a staging DB).
 *
 * Run AFTER `npm run seed` (needs provinces, cities, institute types, levels).
 */
import { prisma } from "../src/lib/prisma";

const LIVE = (process.env.SEED_UNIVERSITIES_LIVE || "false").toLowerCase() === "true";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const universities = [
  {
    name: "Belarusian State Medical University",
    uniqueId: "BEL-BSMU-001",
    city: "Minsk",
    region: "Minsk",
    establishedYear: 1921,
    // City-centre coordinates (approximate) — refine with the exact campus location.
    latitude: 53.9006,
    longitude: 27.559,
  },
  {
    name: "Vitebsk State Medical University",
    uniqueId: "BEL-VSMU-002",
    city: "Vitebsk",
    region: "Vitebsk Region",
    establishedYear: 1934,
    latitude: 55.1848,
    longitude: 30.2016,
  },
  {
    name: "Grodno State Medical University",
    uniqueId: "BEL-GRSMU-003",
    city: "Grodno",
    region: "Grodno Region",
    establishedYear: 1958,
    latitude: 53.6693,
    longitude: 23.8131,
  },
  {
    name: "Gomel State Medical University",
    uniqueId: "BEL-GOMSMU-004",
    city: "Gomel",
    region: "Gomel Region",
    establishedYear: 1990,
    latitude: 52.4345,
    longitude: 30.9754,
  },
];

async function main() {
  console.log(`Seeding Belarus universities (${LIVE ? "LIVE" : "draft / hidden"})...`);

  const publicType = await prisma.instituteType.findFirst({ where: { name: "Public" } });
  const level = await prisma.level.findUnique({ where: { slug: "undergraduate" } });
  if (!publicType || !level) {
    throw new Error("Reference data missing. Run `npm run seed` first.");
  }

  for (const u of universities) {
    const province = await prisma.province.findFirst({ where: { name: u.region } });
    const city = province
      ? await prisma.city.findFirst({ where: { name: u.city, provinceId: province.id } })
      : null;
    const slug = slugify(u.name);

    const data = {
      name: u.name,
      uniqueId: u.uniqueId,
      slug,
      city: u.city,
      state: "Belarus",
      establishedYear: u.establishedYear,
      mediumOfInstruction: "English",
      courseDuration: "6 Years",
      latitude: u.latitude,
      longitude: u.longitude,
      instituteTypeId: publicType.id,
      provinceId: province?.id ?? null,
      cityId: city?.id ?? null,
      status: LIVE,
    };

    const university = await prisma.university.upsert({
      where: { slug },
      // Never overwrite admin-edited fields on re-run — only keep identity in sync.
      update: {
        name: data.name,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      create: data,
    });

    const existingProgram = await prisma.universityProgram.findFirst({
      where: { universityId: university.id, programSlug: "mbbs" },
    });
    if (!existingProgram) {
      await prisma.universityProgram.create({
        data: {
          universityId: university.id,
          programName: "MBBS (Doctor of Medicine - General Medicine)",
          programSlug: "mbbs",
          duration: "6 Years",
          levelId: level.id,
          mediumOfInstruction: "English",
          studyMode: "Full-time",
          isActive: true,
        },
      });
    }
    console.log(`  - ${u.name} (${u.city})`);
  }

  console.log("Done. Next: add fees, intakes, recognition, photos and brochures in Admin → Universities.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
