import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const visibility = await prisma.websiteSetting.findUnique({
        where: { key: "scholarship_visibility" }
    });
    const showScholarship = visibility?.value !== "false"; // Default to true

    return (
        <>
            {/* Belarus flag strip (red / green) */}
            <div className="flex w-full h-2" aria-hidden="true">
                <div
                    className="w-8 shrink-0 bg-white"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M4 0L8 4L4 8L0 4Z' fill='%23CE1720'/%3E%3Cpath d='M4 2.5L5.5 4L4 5.5L2.5 4Z' fill='white'/%3E%3C/svg%3E\")",
                        backgroundSize: "8px 8px",
                    }}
                />
                <div className="flex-[2] bg-blue-600" />
                <div className="flex-1 bg-green-600" />
            </div>
            <Header showScholarship={showScholarship} />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
