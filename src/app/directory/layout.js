export const metadata = {
  title: "Community Member Directory - Verified Professionals & Elders",
  description:
    "Search and discover verified Samaj community members, doctors, engineers, advocates, civil servants, entrepreneurs, and elders across India.",
  alternates: {
    canonical: "/directory",
  },
  openGraph: {
    title: "Community Member Directory | alokworld.in",
    description:
      "Search and connect with verified Samaj community members, doctors, engineers, advocates, and elders across India.",
    url: "https://alokworld.in/directory",
    siteName: "alokworld.in",
    locale: "en_IN",
    type: "website",
  },
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://alokworld.in",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Community Directory",
      item: "https://alokworld.in/directory",
    },
  ],
};

export default function DirectoryLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {children}
    </>
  );
}
