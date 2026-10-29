export const metadata = {
  title: "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) - राष्ट्रीय संकल्प, मिशन एवं विधान",
  description:
    "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक संघ) के आधिकारिक अभिलेख, राष्ट्रीय संकल्प, कार्यकारी मार्गदर्शन एवं वार्षिक राष्ट्रीय अधिवेशन विवरण।",
  alternates: {
    canonical: "/aloksangh",
  },
  openGraph: {
    title: "आलोक संघ - अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ | alokworld.in",
    description:
      "देशभर के समस्त अधिकारी-कर्मचारी बंधुओं, प्रांतीय इकाइयों और सामाजिक प्रबुद्धजनों को संगठित करने वाला शीर्ष संगठन।",
    url: "https://alokworld.in/aloksangh",
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
    { "@type": "ListItem", position: 2, name: "आलोक संघ", item: "https://alokworld.in/aloksangh" },
  ],
};

export default function AlokSanghLayout({ children }) {
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
