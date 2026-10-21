export const metadata = {
  title: "Samaj History & Glorious Heritage - Origins, Freedom Struggle & Legacy",
  description:
    "A comprehensive chronicle of the sacrifices, freedom struggle leadership, historical origins, and patriotic legacy of our Samaj.",
  alternates: {
    canonical: "/history",
  },
  openGraph: {
    title: "Samaj History & Heritage | alokworld.in",
    description:
      "A chronicle of selfless service, courage, cultural legacy, and nation-building.",
    url: "https://alokworld.in/history",
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
    { "@type": "ListItem", position: 2, name: "Samaj History", item: "https://alokworld.in/history" },
  ],
};

export default function HistoryLayout({ children }) {
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
