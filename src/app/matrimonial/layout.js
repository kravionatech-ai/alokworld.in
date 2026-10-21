export const metadata = {
  title: "Samaj Matrimonial - Verified Family Matchmaking Portal",
  description:
    "A dignified, family-centered matrimonial matchmaking platform for educated community brides, grooms, and respected families.",
  alternates: {
    canonical: "/matrimonial",
  },
  openGraph: {
    title: "Samaj Matrimonial | alokworld.in",
    description:
      "A dignified, family-centered matrimonial matchmaking platform for educated community youth.",
    url: "https://alokworld.in/matrimonial",
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
    { "@type": "ListItem", position: 2, name: "Matrimonial Directory", item: "https://alokworld.in/matrimonial" },
  ],
};

export default function MatrimonialLayout({ children }) {
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
