export const metadata = {
  title: "Contact Central Secretariat - Helpdesk & Inquiries",
  description:
    "Contact the Akhil Bhartiya Samaj National Secretariat in New Delhi for member registration assistance, inquiries, and state affiliations.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact National Secretariat | alokworld.in",
    description:
      "Contact the Akhil Bhartiya Samaj National Secretariat for membership support, directory assistance, and inquiries.",
    url: "https://alokworld.in/contact",
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
        { "@type": "ListItem", position: 2, name: "Contact Secretariat", item: "https://alokworld.in/contact" },
      ],
    },
    {
      "@type": "ContactPage",
      "@id": "https://alokworld.in/contact#webpage",
      url: "https://alokworld.in/contact",
      name: "Contact National Secretariat - alokworld.in",
      description: "Official contact helpdesk for community directory registration and inquiries.",
      isPartOf: { "@id": "https://alokworld.in/#website" },
    },
  ],
};

export default function ContactLayout({ children }) {
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
