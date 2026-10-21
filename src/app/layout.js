import "./globals.css";
import Script from "next/script";
import MaintenanceNotice from "@/components/MaintenanceNotice";

export const metadata = {
  title: "अखिल भारतीय लोधा, लोधी, लोध महासभा - Samaj Directory | alokworld.in",
  description: "Official Samaj Community Directory - search and connect with community members, elders, doctors, engineers, and professionals across India.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://alokworld.in"),
  verification: {
    google: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg",
  },
  openGraph: {
    title: "अखिल भारतीय समाज डिरेक्टरी | alokworld.in",
    description: "Official Samaj Community Directory - Search and connect with community members, elders, and professionals.",
    url: "https://alokworld.in",
    siteName: "alokworld.in",
    locale: "hi_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi" className="antialiased">
      <head>
        <meta name="google-site-verification" content="vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg" />
      </head>
      <body className="min-h-screen bg-[#FFF9E8] text-[#172B4D]">
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
