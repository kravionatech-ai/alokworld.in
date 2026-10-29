export const metadata = {
  title: "समाज कार्यक्रम एवं सम्मेलन | alokworld.in",
  description:
    "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) के आगामी महाधिवेशन, प्रतिभा सम्मान समारोह, सामाजिक सम्मेलन एवं बैठकों का संपूर्ण विवरण।",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "समाज कार्यक्रम एवं सम्मेलन | alokworld.in",
    description:
      "अखिल भारतीय समाज के आधिकारिक कार्यक्रमों, महासम्मेलनों एवं बैठकों की तिथियां, पोस्टर एवं विवरण।",
    url: "https://alokworld.in/events",
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
    { "@type": "ListItem", position: 2, name: "कार्यक्रम", item: "https://alokworld.in/events" },
  ],
};

export default function EventsLayout({ children }) {
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
