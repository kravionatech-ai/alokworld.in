export const metadata = {
  title: "छायाचित्र दीर्घा - राष्ट्रीय अधिवेशन, सांस्कृतिक उत्सव एवं ऐतिहासिक क्षण",
  description:
    "अखिल भारतीय समाज के राष्ट्रीय अधिवेशनों, युवा प्रतिभा सम्मान समारोहों, ऐतिहासिक आयोजनों और समाज सेवा अभियानों के पावन छायाचित्र।",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "छायाचित्र दीर्घा | alokworld.in",
    description:
      "राष्ट्रीय अधिवेशनों, सांस्कृतिक समारोहों और सम्मान कार्यक्रमों के अनुपम क्षण।",
    url: "https://alokworld.in/gallery",
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
    { "@type": "ListItem", position: 2, name: "छायाचित्र दीर्घा", item: "https://alokworld.in/gallery" },
  ],
};

export default function GalleryLayout({ children }) {
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
