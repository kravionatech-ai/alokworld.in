export const metadata = {
  title: "समाज का गौरवशाली इतिहास - उत्पत्ति, स्वतंत्रता संग्राम एवं त्याग की अमर गाथा",
  description:
    "हमारे समाज के त्याग, स्वतंत्रता संग्राम में अग्रणी भूमिका, ऐतिहासिक उत्पत्ति और राष्ट्र निर्माण में अभूतपूर्व योगदान का प्रामाणिक इतिहास।",
  alternates: {
    canonical: "/history",
  },
  openGraph: {
    title: "समाज का गौरवशाली इतिहास | alokworld.in",
    description:
      "निस्वार्थ सेवा, अदम्य साहस, सांस्कृतिक विरासत एवं राष्ट्र निर्माण की ऐतिहासिक गाथा।",
    url: "https://alokworld.in/history",
    siteName: "alokworld.in",
    locale: "hi_IN",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "मुख्य पृष्ठ", item: "https://alokworld.in" },
    { "@type": "ListItem", position: 2, name: "समाज इतिहास", item: "https://alokworld.in/history" },
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
