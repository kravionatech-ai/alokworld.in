export const metadata = {
  title: "केंद्रीय सचिवालय संपर्क - सहायता एवं सामान्य पूछताछ",
  description:
    "अखिल भारतीय समाज राष्ट्रीय सचिवालय, नई दिल्ली से सदस्य पंजीकरण सहायता, पूछताछ एवं राज्य शाखा समन्वय हेतु संपर्क करें।",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "केंद्रीय सचिवालय संपर्क | alokworld.in",
    description:
      "सदस्यता सहायता, डायरेक्टरी सहयोग और सामाजिक पूछताछ हेतु अखिल भारतीय समाज राष्ट्रीय सचिवालय से संपर्क करें।",
    url: "https://alokworld.in/contact",
    siteName: "alokworld.in",
    locale: "hi_IN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "मुख्य पृष्ठ", item: "https://alokworld.in" },
        { "@type": "ListItem", position: 2, name: "संपर्क", item: "https://alokworld.in/contact" },
      ],
    },
    {
      "@type": "ContactPage",
      "@id": "https://alokworld.in/contact#webpage",
      url: "https://alokworld.in/contact",
      name: "केंद्रीय सचिवालय संपर्क - alokworld.in",
      description: "समुदाय डायरेक्टरी पंजीकरण एवं सहायता हेतु आधिकारिक संपर्क हेल्पडेस्क।",
      inLanguage: "hi",
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
