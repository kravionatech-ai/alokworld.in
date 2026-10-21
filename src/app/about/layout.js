export const metadata = {
  title: "About alokworld.in - Community Mission & Principles",
  description:
    "Learn about the mission, values, digital network, and leadership behind the alokworld.in Samaj Community Directory portal.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | alokworld.in Samaj Directory",
    description:
      "Learn about the mission, vision, values, and digital objectives of the Samaj Directory portal.",
    url: "https://alokworld.in/about",
    siteName: "alokworld.in",
    locale: "en_IN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://alokworld.in" },
        { "@type": "ListItem", position: 2, name: "About Us", item: "https://alokworld.in/about" },
      ],
    },
    {
      "@type": "AboutPage",
      "@id": "https://alokworld.in/about#webpage",
      url: "https://alokworld.in/about",
      name: "About alokworld.in Samaj Community Directory",
      description: "Empowering the Samaj through digital connectivity, mutual support, and purposeful leadership.",
      isPartOf: { "@id": "https://alokworld.in/#website" },
    },
  ],
};

export default function AboutLayout({ children }) {
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
