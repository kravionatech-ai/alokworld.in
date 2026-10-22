export const metadata = {
  title: "alokworld.in परिचय - समाज संकल्प एवं उद्देश्य",
  description:
    "alokworld.in समाज डायरेक्टरी पोर्टल के मिशन, मानवीय मूल्यों, डिजिटल नेटवर्क और नेतृत्व के बारे में जानें।",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "परिचय | alokworld.in समाज डायरेक्टरी",
    description:
      "alokworld.in समाज डायरेक्टरी पोर्टल के मिशन, संकल्पना एवं डिजिटल उद्देश्यों के बारे में जानें।",
    url: "https://alokworld.in/about",
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
        { "@type": "ListItem", position: 2, name: "परिचय", item: "https://alokworld.in/about" },
      ],
    },
    {
      "@type": "AboutPage",
      "@id": "https://alokworld.in/about#webpage",
      url: "https://alokworld.in/about",
      name: "alokworld.in अखिल भारतीय समाज डायरेक्टरी परिचय",
      description: "डिजिटल संपर्क, परस्पर सहयोग एवं समर्पित नेतृत्व के माध्यम से समाज सशक्तिकरण।",
      inLanguage: "hi",
      isPartOf: { "@id": "https://alokworld.in/#website" },
    },
  ],
};

export default function AboutLayout({ children }) {
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
