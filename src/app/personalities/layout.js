export const metadata = {
  title: "Eminent Personalities - Historical Icons, Pioneers & Achievers",
  description:
    "Honoring celebrated freedom fighters, martyrs, reformers, civil servants, and social visionaries of the Samaj community.",
  alternates: {
    canonical: "/personalities",
  },
  openGraph: {
    title: "Eminent Personalities | alokworld.in",
    description:
      "Honoring celebrated freedom fighters, martyrs, reformers, civil servants, and social visionaries of the Samaj community.",
    url: "https://alokworld.in/personalities",
    siteName: "alokworld.in",
    locale: "en_IN",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://alokworld.in" },
    { "@type": "ListItem", position: 2, name: "Eminent Personalities", item: "https://alokworld.in/personalities" },
  ],
};

export default function PersonalitiesLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
