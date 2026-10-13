import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { APP_YEAR, ADMISSION_YEAR } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.defaultUrl;
const SITE_NAME = SITE_CONFIG.name;

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Study MBBS in ${SITE_CONFIG.country} ${APP_YEAR}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    `Study MBBS in ${SITE_CONFIG.country} at top NMC-recognized medical universities. Low tuition fees, English-medium programs, high FMGE pass rates. Apply for ${ADMISSION_YEAR} admissions.`,
  keywords: `MBBS in ${SITE_CONFIG.country}, study MBBS ${SITE_CONFIG.country}, medical university ${SITE_CONFIG.country}, NMC recognized ${SITE_CONFIG.country}`,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Study MBBS in ${SITE_CONFIG.country} ${APP_YEAR}`,
    description: `Study MBBS in ${SITE_CONFIG.country} at top NMC-recognized medical universities.`,
    images: [
      {
        url: `${SITE_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Study MBBS in ${SITE_CONFIG.country} ${APP_YEAR}`,
    description: `Study MBBS in ${SITE_CONFIG.country} at top NMC-recognized medical universities.`,
    images: [`${SITE_URL}/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

import { auth } from "@/lib/auth";
import Script from "next/script";
import CookieConsent from "@/components/common/CookieConsent";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        {Boolean(SITE_CONFIG.gtmId) && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${SITE_CONFIG.gtmId}');`,
          }}
        />
        )}
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased font-sans overflow-x-hidden">
        {/* Google Tag Manager (noscript) */}
        {Boolean(SITE_CONFIG.gtmId) && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${SITE_CONFIG.gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        )}
        <Providers session={session}>
          {children}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
