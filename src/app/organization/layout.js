export const metadata = {
  title: "Organizational Structure & Leadership - National Working Committees",
  description:
    "Meet the executive leadership, national advisory board, Youth Cell, Women Wing, and state chapters driving community development.",
  alternates: {
    canonical: "/organization",
  },
  openGraph: {
    title: "Samaj Organization & Leadership | alokworld.in",
    description:
      "An organized framework dedicated to community welfare, youth enablement, and nationwide harmony.",
    url: "https://alokworld.in/organization",
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
    { "@type": "ListItem", position: 2, name: "Organization", item: "https://alokworld.in/organization" },
  ],
};

export default function OrganizationLayout({ children }) {
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
