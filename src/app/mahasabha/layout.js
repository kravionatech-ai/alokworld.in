export const metadata = {
  title: "अखिल भारतीय महासभा - शीर्ष सामाजिक संगठन, अधिवेशन एवं राष्ट्रीय संकल्प",
  description:
    "अखिल भारतीय समाज महासभा के आधिकारिक अभिलेख, राष्ट्रीय संकल्प, कार्यकारी मार्गदर्शन एवं वार्षिक राष्ट्रीय अधिवेशन विवरण।",
  alternates: {
    canonical: "/mahasabha",
  },
  openGraph: {
    title: "अखिल भारतीय महासभा | alokworld.in",
    description:
      "देश भर की समस्त क्षेत्रीय इकाइयों, ट्रस्टों और सामाजिक परिषदों को एक सूत्र में पिरोने वाला शीर्ष संगठन।",
    url: "https://alokworld.in/mahasabha",
    siteName: "alokworld.in",
    locale: "hi_IN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "मुख्य पृष्ठ", item: "https://alokworld.in" },
    { "@type": "ListItem", position: 2, name: "महासभा", item: "https://alokworld.in/mahasabha" },
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
