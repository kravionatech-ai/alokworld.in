export const metadata = {
  title: "ऐतिहासिक विभूतियां एवं प्रेरक व्यक्तित्व - अमर बलिदानी, समाज सुधारक एवं पथप्रदर्शक",
  description:
    "समाज के अमर स्वतंत्रता सेनानियों, वीरांगनाओं, समाज सुधारकों, प्रशासनिक अधिकारियों एवं प्रेरक मार्गदर्शकों का पावन स्मरण।",
  alternates: {
    canonical: "/personalities",
  },
  openGraph: {
    title: "ऐतिहासिक विभूतियां एवं प्रेरक व्यक्तित्व | alokworld.in",
    description:
      "समाज के अमर स्वतंत्रता सेनानियों, वीरांगनाओं, समाज सुधारकों और प्रबुद्ध विभूतियों का प्रेरक जीवन दर्शन।",
    url: "https://alokworld.in/personalities",
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
    { "@type": "ListItem", position: 2, name: "विभूतियां", item: "https://alokworld.in/personalities" },
  ],
};

export default function PersonalitiesLayout({ children }) {
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
