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
      title: "आलोक राष्ट्रीय प्रतिभा सम्मान समारोह-2026 आमंत्रण पत्र",
      category: "National Convention",
      eventDate: "15 नवम्बर 2026",
      imageUrl: "/asset/alokadhivationposter2026/poster1.jpeg",
      description: "कांस्टीट्यूशन क्लब, रफी मार्ग नई दिल्ली में आयोजित होने वाले पंचम राष्ट्रीय अधिवेशन एवं प्रतिभा सम्मान समारोह का आधिकारिक आमंत्रण एवं चारों राष्ट्रीय पुरस्कारों का विवरण।",
    },
    {
      _id: "g2",
      title: "आलोक रत्न पुरस्कार — विशिष्ट समाज सेवा सम्मान",
      category: "National Awards",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster2.jpeg",
      description: "वर्ष 2023-2024 एवं 2024-2025 हेतु समाज के समग्र विकास (शैक्षिक, आर्थिक, सामाजिक-सांस्कृतिक, राजनैतिक व रोज़गार) में उत्कृष्ट योगदान देने वाले वरिष्ठ समाजसेवियों हेतु सम्मान पोस्टर।",
    },
    {
      _id: "g3",
      title: "अमर शहीद महारानी अवंतीबाई लोधी पुरस्कार — अधिकारी-कर्मचारी सेवा",
      category: "Public Service",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster3.jpeg",
      description: "सरकारी व अर्ध-सरकारी सेवाओं में 30 जून 2024 से 31 अक्टूबर 2026 की अवधि में नव-नियुक्त तथा निष्ठापूर्वक सेवानिवृत्त अधिकारी-कर्मचारी सदस्यों हेतु आधिकारिक सम्मान पोस्टर।",
    },
    {
      _id: "g4",
      title: "स्वामी ब्रह्मानंद सम्मान पुरस्कार — प्रतिभावान छात्र-छात्रा सम्मान",
      category: "Education & Merit",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster4.jpeg",
      description: "आईआईटी (IIT), एमबीबीएस (MBBS), आईआईएम (IIM), आईआईएफटी (IIFT) में नव-प्रवेशित एवं उत्कृष्ट समाज के छात्र-छात्राओं हेतु राष्ट्रीय सम्मान पोस्टर।",
    },
    {
      _id: "g5",
      title: "राजा हिरदे शाह पुरस्कार — संगठन सशक्तीकरण एवं सदस्यता अभियान",
      category: "Organization",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster5.jpeg",
      description: "अपने-अपने राज्यों में आलोक संगठन को मजबूत करने तथा सर्वाधिक सदस्यता बढ़ाने में अग्रणी योगदान देने वाले कर्मठ सदस्यों व पदाधिकारियों का सम्मान पोस्टर।",
    },
    {
      _id: "g6",
      title: "आलोक उत्तर प्रदेश प्रांतीय कार्यकारिणी आधिकारिक दायित्व सूची",
      category: "State Chapter",
      eventDate: "2025-2026",
      imageUrl: "/asset/listofmemberswithdesignation/alok up.jpeg",
      description: "उत्तर प्रदेश राज्य इकाई के प्रांतीय अध्यक्ष सर्वश्री यशपाल सिंह राजपूत (लखनऊ) सहित सभी 25 वरिष्ठ पदाधिकारियों की आधिकारिक संपर्क एवं दायित्व तालिका।",
    },
    {
      _id: "g7",
      title: "अखिल भारतीय समाज डायरेक्टरी शीर्ष कलात्मक बैनर",
      category: "Heritage",
      eventDate: "Portal Art",
      imageUrl: "/asset/topofwebsite/web_sit_front1.png",
      description: "स्वामी ब्रह्मानंद जी महाराज, केंद्रीय आलोक प्रतीक एवं वीरांगना रानी अवंती बाई लोधी का आधिकारिक शीर्ष बैनर।",
    },
    {
      _id: "g8",
      title: "अखिल भारतीय समाज महापुरुष एवं राष्ट्रीय प्रतीक फलक",
      category: "Heritage Icons",
      eventDate: "Heritage",
      imageUrl: "/asset/1002458487.jpg",
      description: "लोधेश्वर भगवान, वीरांगना रानी अवंतीबाई, स्वामी ब्रह्मानंद, केंद्रीय आलोक चक्र, स्वामी केशवानंद, राजा हिरदेशाह एवं अमर शहीद गुलाब सिंह के पावन स्मृति पदक।",
    },
    {
      _id: "g9",
      title: "आलोक धौलपुर राजस्थान प्रांतीय सम्मेलन",
      category: "State Chapter",
      eventDate: "2025",
      imageUrl: "/asset/photo/photo/dholpur1.png",
      description: "धौलपुर राजस्थान में आयोजित समाज कल्याण एवं प्रतिभा सम्मान समारोह आधिकारिक बैनर।",
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
                    <div className="h-64 sm:h-72 overflow-hidden bg-[#FFFCF5] relative p-2 flex items-center justify-center border-b border-[#F0E5D5]">
                      <img
                        src={img.imageUrl}
                        alt={img.title ? `${img.title} - Samaj Community Photo Gallery` : "Samaj Community Event Photo"}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs rounded"
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
