export const metadata = {
  title: "समाज वैवाहिक मंच - सुयोग्य एवं शिक्षित स्वजातीय संबंध",
  description:
    "समाज के उच्च शिक्षित युवक-युवतियों एवं संभ्रांत परिवारों के लिए एक मर्यादित, विश्वसनीय और पारिवारिक वैवाहिक समन्वय पोर्टल।",
  alternates: {
    canonical: "/matrimonial",
  },
  openGraph: {
    title: "समाज वैवाहिक मंच | alokworld.in",
    description:
      "समाज के शिक्षित युवक-युवतियों एवं आदरणीय परिवारों के लिए एक गरिमामय वैवाहिक परिचय मंच।",
    url: "https://alokworld.in/matrimonial",
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
    { "@type": "ListItem", position: 2, name: "वैवाहिक मंच", item: "https://alokworld.in/matrimonial" },
  ],
};

export default function MatrimonialLayout({ children }) {
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
