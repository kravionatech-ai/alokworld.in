export const metadata = {
  title: "समाज सदस्य डायरेक्टरी - सत्यापित प्रबुद्धजन एवं वरिष्ठ मार्गदर्शक",
  description:
    "अखिल भारतीय समाज के सत्यापित सदस्यों, चिकित्सकों, अभियंताओं, अधिवक्ताओं, प्रशासनिक अधिकारियों, व्यवसायियों एवं वरिष्ठ बंधुओं की खोज करें।",
  alternates: {
    canonical: "/directory",
  },
  openGraph: {
    title: "समाज सदस्य डायरेक्टरी | alokworld.in",
    description:
      "देश भर के सत्यापित समाज बंधुओं, अधिकारियों, व्यवसायियों एवं मार्गदर्शकों से जुड़ें।",
    url: "https://alokworld.in/directory",
    siteName: "alokworld.in",
    locale: "hi_IN",
    type: "website",
  },
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "मुख्य पृष्ठ",
      item: "https://alokworld.in",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "समाज डायरेक्टरी",
      item: "https://alokworld.in/directory",
    },
  ],
};

export default function DirectoryLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {children}
    </>
  );
}
