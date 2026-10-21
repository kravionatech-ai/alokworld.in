export const metadata = {
  title: "Community Photo Gallery - National Conventions & Moments",
  description:
    "Glimpses of national Samaj conventions, youth felicitation ceremonies, heritage celebrations, and medical assistance camps.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Community Photo Gallery | alokworld.in",
    description:
      "Glimpses of community conventions, cultural celebrations, youth symposiums, and felicitation events.",
    url: "https://alokworld.in/gallery",
    siteName: "alokworld.in",
    locale: "en_IN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://alokworld.in" },
    { "@type": "ListItem", position: 2, name: "Photo Gallery", item: "https://alokworld.in/gallery" },
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
