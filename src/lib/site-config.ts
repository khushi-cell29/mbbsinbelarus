/**
 * Single source of truth for country / brand identity.
 * To clone this project for another country, edit this file (plus .env).
 */

const DEFAULT_SITE_URL = "https://www.mbbsinbelarus.com"; // TODO: confirm final domain

export const SITE_CONFIG = {
    // Brand
    name: process.env.NEXT_PUBLIC_SITE_NAME || "MBBS in Belarus",
    domain: "mbbsinbelarus.com",
    defaultUrl: DEFAULT_SITE_URL,

    // Country
    country: "Belarus",
    countryAdjective: "Belarusian",
    countryIso: "BY",
    capital: "Minsk",
    currencyCode: "BYN",
    timezoneLabel: "UTC+3 (Minsk Time)",
    // Path of the country-info page (also used for redirects/sitemap/SEO key)
    aboutCountryPath: "/about-belarus",
    aboutCountryKey: "about-belarus",

    // Map defaults (Leaflet, [lat, lng])
    mapCenter: [53.7098, 27.9534] as [number, number],
    mapZoom: 6,

    // Marketing office (company contact — shared across country sites)
    contact: {
        phoneDisplay: "+91 9667 667 331",
        phoneTel: "+919667667331",
        whatsapp: "https://wa.me/+919667667331",
        email: "info@mbbsinbelarus.com", // TODO: confirm mailbox exists
        address: "B-16 Ground Floor, Mayfield Garden, Sector 50, Gurugram, Haryana 122018",
        addressParts: {
            streetAddress: "B-16 Ground Floor, Mayfield Garden, Sector 50",
            addressLocality: "Gurugram",
            addressRegion: "Haryana",
            postalCode: "122018",
            addressCountry: "IN",
        },
    },

    // Social profiles — TODO: confirm handles once accounts are created
    social: {
        facebook: "https://facebook.com/mbbsinBelarus",
        twitter: "https://twitter.com/mbbsinBelarus",
        instagram: "https://instagram.com/mbbsinBelarus",
        youtube: "https://youtube.com/@mbbsinBelarus",
    },

    // Analytics — TODO: replace with the Belarus site's own GTM container
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",

    // Identifier the CRM uses to tell which partner site a lead came from
    crmSourceSite: "mbbsinbelarus.com", // TODO: register with CRM
} as const;
