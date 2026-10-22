"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryCarousel from "@/components/GalleryCarousel";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  SectionHeadingReveal,
  SubtleHoverCard,
} from "@/components/MotionWrappers";

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultGallery = [
    {
      _id: "g1",
      title: "अखिल भारतीय आलोक संघ राष्ट्रीय अधिवेशन 2026 पोस्टर",
      category: "National Convention",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster1.jpeg",
      description: "राष्ट्रीय अधिवेशन 2026 आधिकारिक पोस्टर — सामाजिक संगठन, शिक्षा एवं युवा सशक्तीकरण अभियान।",
    },
    {
      _id: "g2",
      title: "राष्ट्रीय अधिवेशन 2026 — सामाजिक एकता एवं अधिकार महासम्मेलन",
      category: "National Convention",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster2.jpeg",
      description: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ का भव्य राष्ट्रीय समागम।",
    },
    {
      _id: "g3",
      title: "आलोक राष्ट्रीय अधिवेशन 2026 — युवा मार्गदर्शन एवं शैक्षणिक उन्नति",
      category: "Education & Youth",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster3.jpeg",
      description: "प्रतियोगी परीक्षाओं की तैयारी, सिविल सर्विसेज मार्गदर्शन एवं छात्रवृत्ति कार्यक्रम।",
    },
    {
      _id: "g4",
      title: "आलोक राष्ट्रीय अधिवेशन 2026 — महिला सशक्तीकरण एवं सामाजिक उत्थान",
      category: "Social Welfare",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster4.jpeg",
      description: "समाज में बालिकाओं की उच्च शिक्षा एवं महिला नेतृत्व को बढ़ावा देने हेतु विशेष सत्र।",
    },
    {
      _id: "g5",
      title: "आलोक राष्ट्रीय अधिवेशन 2026 — संगठनात्मक शक्ति एवं भावी कार्ययोजना",
      category: "Organization",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster5.jpeg",
      description: "राष्ट्रीय कार्यकारिणी, राज्य इकाइयों एवं जिला इकाइयों की संयुक्त समीक्षा बैठक।",
    },
    {
      _id: "g6",
      title: "आलोक उत्तर प्रदेश प्रांतीय अधिवेशन एवं कार्यकारिणी बैठक",
      category: "State Convention",
      eventDate: "2025",
      imageUrl: "/asset/listofmemberswithdesignation/alok up.jpeg",
      description: "उत्तर प्रदेश राज्य इकाई का प्रांतीय सम्मेलन एवं संगठनात्मक विचार-विमर्श।",
    },
    {
      _id: "g7",
      title: "अखिल भारतीय समाज डायरेक्टरी मुख्य फ्रंट बैनर",
      category: "Heritage",
      eventDate: "2025",
      imageUrl: "/asset/topofwebsite/web_sit_front.png",
      description: "अखिल भारतीय लोधी, लोधा, लोध समाज डायरेक्टरी आधिकारिक कलात्मक बैनर।",
    },
    {
      _id: "g8",
      title: "अखिल भारतीय आलोक संघ राष्ट्रीय अधिवेशन स्मृति",
      category: "Event",
      eventDate: "2025",
      imageUrl: "/asset/1002458487.jpg",
      description: "अखिल भारतीय लोधी समाज प्रमुख प्रतिनिधियों की राष्ट्रीय संगोष्ठी।",
    },
    {
      _id: "g9",
      title: "आलोक धौलपुर राजस्थान प्रांतीय सम्मेलन",
      category: "State Convention",
      eventDate: "2025",
      imageUrl: "/asset/photo/photo/dholpur1.png",
      description: "धौलपुर राजस्थान में आयोजित समाज कल्याण एवं प्रतिभा सम्मान समारोह।",
    },
  ];

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data?.items && data.items.length > 0) {
          setItems(data.items);
        } else {
          setItems(defaultGallery);
        }
      })
      .catch(() => setItems(defaultGallery))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* Page Title & Intro */}
        <FadeIn direction="up" distance={14} duration={0.5}>
          <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
              Moments &amp; Memories
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
              Community Photo Gallery &amp; Event Carousel
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Glimpses of community conventions, cultural celebrations, youth symposiums, and felicitation events with interactive touch/swipe support.
            </p>
          </div>
        </FadeIn>

        {/* Swiper Interactive Gallery Carousel & Lightbox */}
        {loading ? (
          <div className="bg-white rounded-lg border border-[#F0E5D5] p-12 text-center text-[#64748B]">
            Loading community gallery...
          </div>
        ) : (
          <FadeIn direction="up" distance={16} duration={0.55}>
            <GalleryCarousel items={items} />
          </FadeIn>
        )}

        {/* Complete Photo Grid Overview with Staggered Entrance */}
        <section aria-label="All Gallery Photos" className="space-y-4">
          <SectionHeadingReveal className="flex items-center justify-between pb-2 border-b border-[#F0E5D5]">
            <h2 className="text-sm sm:text-base font-bold text-[#102F6B]">
              All Gallery Archives ({items.length} Photos)
            </h2>
            <span className="text-xs text-[#64748B]">
              Click any photo to open full-screen slider
            </span>
          </SectionHeadingReveal>

          <StaggerContainer
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            staggerDelay={0.06}
          >
            {items.map((img) => (
              <StaggerItem key={img._id} className="h-full">
                <SubtleHoverCard className="h-full">
                  <div className="bg-white rounded-lg border border-[#F0E5D5] overflow-hidden shadow-xs hover:shadow-md hover:border-[#102F6B] transition-all group flex flex-col h-full">
                    <div className="h-48 overflow-hidden bg-[#FFFCF5] relative">
                      <img
                        src={img.imageUrl}
                        alt={img.title ? `${img.title} - Samaj Community Photo Gallery` : "Samaj Community Event Photo"}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-[#102F6B]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {img.category || "Community"}
                      </span>
                      {img.eventDate && (
                        <span className="absolute top-2 right-2 bg-white/95 text-[#102F6B] text-[10px] font-bold px-2 py-0.5 rounded border border-[#F0E5D5]">
                          {img.eventDate}
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#102F6B] line-clamp-1 group-hover:text-[#F26A21] transition-colors">
                          {img.title}
                        </h3>
                        <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mt-1">
                          {img.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </SubtleHoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </main>

      <Footer />
    </div>
  );
}
