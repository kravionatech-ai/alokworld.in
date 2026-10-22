export const metadata = {
  title: "संगठनात्मक ढांचा एवं नेतृत्व - राष्ट्रीय कार्यसमिति एवं प्रांतीय शाखाएं",
  description:
    "समाज के उत्थान एवं संवर्धन हेतु समर्पित राष्ट्रीय कार्यकारिणी, युवा प्रकोष्ठ, महिला विंग और राज्य शाखाओं के सम्मानित पदाधिकारियों का परिचय।",
  alternates: {
    canonical: "/organization",
  },
  openGraph: {
    title: "संगठनात्मक ढांचा एवं नेतृत्व | alokworld.in",
    description:
      "समाज कल्याण, युवा सशक्तिकरण और राष्ट्रव्यापी सामाजिक समरसता को समर्पित संगठनात्मक संरचना।",
    url: "https://alokworld.in/organization",
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
    { "@type": "ListItem", position: 2, name: "संगठन संरचना", item: "https://alokworld.in/organization" },
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
