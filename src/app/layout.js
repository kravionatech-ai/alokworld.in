import "./globals.css";
import Script from "next/script";
import MaintenanceNotice from "@/components/MaintenanceNotice";

export const metadata = {
  title: {
    default: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय पोर्टल | alokworld.in",
    template: "%s | alokworld.in",
  },
  description:
    "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक) एवं समाज डायरेक्टरी — देशभर के सभी सत्यापित सदस्यों, वरिष्ठजनों, चिकित्सकों, इंजीनियरों, अधिवक्ताओं एवं युवाओं को जोड़ने वाला आधिकारिक मंच।",
  keywords: [
    "समाज डायरेक्टरी",
    "अखिल भारतीय लोधी महासंघ",
    "आलोक संघ",
    "लोधी समाज",
    "लोधा महासभा",
    "alokworld",
    "samaj directory",
    "वैवाहिक डायरेक्टरी",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://alokworld.in"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg",
  },
  openGraph: {
    title: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय पोर्टल | alokworld.in",
    description:
      "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक) एवं समाज डायरेक्टरी — देशभर के सभी सत्यापित सदस्यों, वरिष्ठजनों एवं प्रबुद्धजनों का आधिकारिक मंच।",
    url: "https://alokworld.in",
    siteName: "alokworld.in",
    locale: "hi_IN",
    type: "website",
    images: [
      {
        url: "/asset/topofwebsite/web_sit_front.png",
        width: 1200,
        height: 630,
        alt: "alokworld.in अखिल भारतीय समाज डायरेक्टरी पोर्टल",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "अखिल भारतीय समाज डायरेक्टरी | alokworld.in",
    description:
      "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक) एवं समाज डायरेक्टरी।",
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
      name: "अखिल भारतीय लोधी, लोधा, लोध महासभा",
      url: "https://alokworld.in",
      logo: {
        "@type": "ImageObject",
        url: "https://alokworld.in/logo.png",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91 98734 83657",
        contactType: "केंद्रीय सचिवालय",
        areaServed: "IN",
        availableLanguage: ["Hindi", "English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://alokworld.in/#website",
      url: "https://alokworld.in",
      name: "अखिल भारतीय समाज डायरेक्टरी - alokworld.in",
      description:
        "अखिल भारतीय समाज डायरेक्टरी — देशभर के सेवारत व सेवानिवृत्त अधिकारियों, कर्मचारियों, प्रबुद्धजनों एवं युवाओं का सशक्त व पारदर्शी डिजिटल मंच।",
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
      inLanguage: "hi",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi" className="antialiased">
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
