import "./globals.css";
import MaintenanceNotice from "@/components/MaintenanceNotice";

export const metadata = {
  title: "अखिल भारतीय लोधा, लोधी, लोध महासभा - Samaj Directory | alokworld.in",
  description: "Official Samaj Community Directory - search and connect with community members, elders, doctors, engineers, and professionals across India.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://alokworld.in"),
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
      <body className="min-h-screen bg-[#FFF9E8] text-[#172B4D]">
        <MaintenanceNotice />
        {children}
      </body>
    </html>
  );
}
