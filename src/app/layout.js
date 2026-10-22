import "./globals.css";
import Script from "next/script";
import MaintenanceNotice from "@/components/MaintenanceNotice";

export const metadata = {
  title: {
    default: "Akhil Bhartiya Samaj Directory & Central Portal | alokworld.in",
    template: "%s | alokworld.in",
  },
  description:
    "Official Samaj Community Directory - search and connect with verified community members, elders, doctors, engineers, and professionals across India.",
  keywords: [
    "samaj directory",
    "community directory",
    "alokworld",
    "samaj portal",
    "verified members",
    "lodhi samaj",
    "lodha mahasabha",
    "matrimonial directory",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://alokworld.in"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg",
  },
  openGraph: {
    title: "Akhil Bhartiya Samaj Directory & Central Portal | alokworld.in",
    description:
      "Official Samaj Community Directory - Search and connect with verified community members, elders, and professionals across India.",
    url: "https://alokworld.in",
    siteName: "alokworld.in",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/asset/topofwebsite/web_sit_front.png",
        width: 1200,
        height: 630,
        alt: "alokworld.in Samaj Community Directory Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akhil Bhartiya Samaj Directory | alokworld.in",
    description:
      "Official Samaj Community Directory - Search and connect with verified community members across India.",
    images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://alokworld.in/#organization",
      name: "Akhil Bhartiya Samaj Mahasabha",
      url: "https://alokworld.in",
      logo: {
        "@type": "ImageObject",
        url: "https://alokworld.in/logo.png",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91 96085 53167",
        contactType: "National Secretariat",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://alokworld.in/#website",
      url: "https://alokworld.in",
      name: "alokworld.in Samaj Community Directory",
      description:
        "Official Samaj Community Directory - search and connect with verified community members, elders, doctors, engineers, and professionals.",
      publisher: {
        "@id": "https://alokworld.in/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://alokworld.in/directory?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-IN",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <meta name="google-site-verification" content="vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="min-h-screen bg-[#FFFCF5] text-[#263449]">
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7LLNEM51KC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-7LLNEM51KC');
          `}
        </Script>

        <MaintenanceNotice />
        {children}
      </body>
    </html>
  );
}
