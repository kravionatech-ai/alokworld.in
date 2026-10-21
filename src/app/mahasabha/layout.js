export const metadata = {
  title: "Akhil Bhartiya Mahasabha - Apex Assembly & Resolutions",
  description:
    "Official records, national resolutions, executive guidance, and annual conventions of the Akhil Bhartiya Samaj Mahasabha.",
  alternates: {
    canonical: "/mahasabha",
  },
  openGraph: {
    title: "Akhil Bhartiya Mahasabha | alokworld.in",
    description:
      "The apex representative organization uniting all regional chapters, trusts, and community councils across India.",
    url: "https://alokworld.in/mahasabha",
    siteName: "alokworld.in",
    locale: "en_IN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://alokworld.in" },
    { "@type": "ListItem", position: 2, name: "Mahasabha", item: "https://alokworld.in/mahasabha" },
  ],
};

export default function MahasabhaLayout({ children }) {
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
