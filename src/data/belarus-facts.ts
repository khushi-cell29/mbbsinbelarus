/**
 * Static data for Belarus Quick Facts page.
 * Kept in a separate module to keep the page component lean.
 */
import {
    Building,
    Users,
    Languages,
    DollarSign,
    MapPin,
    Clock,
    Flag,
    Mountain,
    Stethoscope,
    Plane,
    Globe,
    Sun,
    Calendar,
    TreePine,
    Heart,
    Car,
    Wifi,
    Award,
    Compass,
    Waves,
    Palmtree,
    SunMedium
} from "lucide-react";

export const essentialFacts = [
    { icon: Building, color: "blue", label: "Capital", value: "Minsk" },
    { icon: Users, color: "green", label: "Population", value: "About 9.1 million" },
    { icon: Languages, color: "purple", label: "Languages", value: "Belarusian, Russian" },
    { icon: DollarSign, color: "orange", label: "Currency", value: "Belarusian ruble (BYN)" },
    { icon: MapPin, color: "red", label: "Location", value: "Eastern Europe" },
    { icon: Clock, color: "teal", label: "Timezone", value: "UTC+3" },
    { icon: Flag, color: "yellow", label: "Independence", value: "July 3" },
    { icon: Mountain, color: "indigo", label: "Highest Point", value: "Dzyarzhynskaya Hill (345 m)" },
];

export const geographyPoints = [
    { icon: Globe, color: "text-blue-600", text: "Landlocked country in Eastern Europe" },
    { icon: Mountain, color: "text-green-600", text: "Broad plains, forests, and glacial lakes" },
    { icon: Palmtree, color: "text-purple-600", text: "A large network of protected wetlands and forests" },
    { icon: MapPin, color: "text-cyan-600", text: "Borders Poland, Lithuania, Latvia, Russia, and Ukraine" },
];

export const climateZones = [
    { icon: SunMedium, color: "text-orange-500", text: "Temperate continental climate" },
    { icon: Waves, color: "text-blue-500", text: "Cold winters and warm summers" },
    { icon: Calendar, color: "text-green-500", text: "Four distinct seasons" },
    { icon: Sun, color: "text-yellow-500", text: "Conditions vary across the year" },
];

export const attractions = [
    { icon: Building, color: "text-blue-200", name: "Mir Castle", desc: "UNESCO-listed historic castle complex" },
    { icon: Compass, color: "text-green-200", name: "Nesvizh Castle", desc: "Historic palace and UNESCO World Heritage site" },
    { icon: TreePine, color: "text-purple-200", name: "Belovezhskaya Pushcha", desc: "Ancient forest and UNESCO World Heritage site" },
    { icon: Building, color: "text-yellow-200", name: "Brest Fortress", desc: "Historic memorial complex in Brest" },
];

export const majorCities = [
    {
        name: "Minsk",
        gradient: "from-blue-600 to-purple-700",
        textMain: "text-blue-100",
        textSub: "text-blue-200",
        desc: "The capital and largest city, with major universities and cultural institutions.",
        pop: "About 2 million",
        highlight: "Political and Cultural Center",
    },
    {
        name: "Vitebsk",
        gradient: "from-green-600 to-emerald-700",
        textMain: "text-green-100",
        textSub: "text-green-200",
        desc: "A major regional city and home to a state medical university.",
        pop: "About 360,000",
        highlight: "Education and Culture",
    },
    {
        name: "Grodno",
        gradient: "from-orange-600 to-blue-700",
        textMain: "text-orange-100",
        textSub: "text-orange-200",
        desc: "A western Belarusian city with historic architecture and a medical university.",
        pop: "About 360,000",
        highlight: "Education and Heritage",
    },
];

export const defaultCuisines = [
    { id: 0, iconClass: "🥔", dishName: "Draniki", dishDescription: "Potato pancakes commonly served with sour cream", dishImage: null },
    { id: 1, iconClass: "🍲", dishName: "Machanka", dishDescription: "Traditional stew often served with thick pancakes", dishImage: null },
    { id: 2, iconClass: "🥣", dishName: "Cold beet soup", dishDescription: "A chilled beet soup commonly enjoyed in warmer months", dishImage: null },
    { id: 3, iconClass: "🥟", dishName: "Kalduny", dishDescription: "Filled dumplings with regional variations", dishImage: null },
];

export const transportOptions = [
    { icon: Plane, color: "text-blue-600", text: "Minsk National Airport (MSQ)" },
    { icon: Car, color: "text-orange-600", text: "Rail and road links connect major cities" },
    { icon: Globe, color: "text-purple-600", text: "Public transport serves urban and regional routes" },
    { icon: Wifi, color: "text-green-600", text: "Check current travel and transport guidance before arrival" },
];

export const visaFacts = [
    { icon: Award, color: "text-green-600", text: "Student Visa provided after university acceptance" },
    { icon: Calendar, color: "text-orange-600", text: "Straightforward application process for international students" },
    { icon: Plane, color: "text-blue-600", text: "Support provided for entry permits and residence registration" },
    { icon: Heart, color: "text-blue-600", text: "Student-friendly policies for international medical aspirants" },
];

export const mbbsHighlights = [
    { icon: Stethoscope, label: "International Recognition", desc: "Degrees recognized by GMC, NMC, and global medical bodies." },
    { icon: DollarSign, label: "Reasonable Fee Structure", desc: "High-quality medical education with manageable tuition fees." },
    { icon: Languages, label: "Medium of Instruction", desc: "MBBS programs are taught in English for global accessibility." },
];

export const economyStats = [
    { label: "Stability", value: "High Economic Freedom" },
    { label: "Main Industries", value: "Tourism, Finance, Textiles" },
    { label: "Health Hub", value: "Developing Regional Center" },
    { label: "Quality of Life", value: "High Safety Standards" },
];

export const quickFacts = [
    { icon: Calendar, label: "Independence Day", value: "July 3", color: "text-indigo-200" },
    { icon: Mountain, label: "Highest Point", value: "345 m", color: "text-blue-200" },
    { icon: Globe, label: "Region", value: "Eastern Europe", color: "text-green-200" },
    { icon: Award, label: "Education", value: "Growing Intl Interest", color: "text-yellow-200" },
];

export const healthcare = [
    {
        title: "Public Healthcare",
        desc: "Public healthcare services are provided through the national healthcare system.",
        color: "border-blue-200",
    },
    {
        title: "Private Healthcare",
        desc: "High-standard private clinics and specialized medical centers.",
        color: "border-green-200",
    },
    {
        title: "Medical Exposure",
        desc: "Clinical training arrangements depend on each university and its affiliated facilities.",
        color: "border-purple-200",
    },
];

export const mbbsWhyStats = [
    { val: "5-6 Years", label: "Course Duration" },
    { val: "NMC + WHO", label: "Recognition" },
    { val: "High", label: "Student Success" },
    { val: "English", label: "Language" },
];

export const studentLifeCards = [
    { icon: Heart, label: "Student Life", desc: "International students should review current local guidance and university support services." },
    { icon: Building, label: "Infrastructure", desc: "Modern university campuses with excellent student facilities." },
    { icon: Users, label: "Multicultural", desc: "Diverse student community from across the globe." },
];
