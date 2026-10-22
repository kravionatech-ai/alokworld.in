"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade, A11y } from "swiper/modules";
import { FadeIn, InteractiveTap } from "@/components/MotionWrappers";

// Swiper base and module styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroCarousel({ settings }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1-to-1 exact matching of slide content to real project posters and banners
  const slides = [
    {
      id: "hero-main",
      badge: settings?.heroBadge || "Official Community Portal",
      title: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक)",
      subtitle:
        settings?.heroSubtitle ||
        "अखिल भारतीय समाज डायरेक्टरी — देशभर के सेवारत व सेवानिवृत्त अधिकारियों, कर्मचारियों, प्रबुद्धजनों एवं युवाओं का सशक्त व पारदर्शी डिजिटल मंच।",
      ctaText: settings?.heroCtaText || "Explore Member Directory →",
      ctaLink: settings?.heroCtaLink || "/directory",
      secondaryCtaText: "Executive Structure",
      secondaryCtaLink: "/organization",
      image: "/asset/topofwebsite/web_sit_front1.png",
      imageAlt: "अखिल भारतीय लोधी अधिकारी कर्मचारी संघ — स्वामी ब्रह्मानंद जी महाराज, आलोक प्रतीक एवं वीरांगना रानी अवंती बाई लोधी",
      objectFit: "contain",
    },
    {
      id: "hero-adhiveshan-2026",
      badge: "National Convention 2026",
      title: "आलोक राष्ट्रीय प्रतिभा सम्मान समारोह-2026",
      subtitle:
        "15 नवम्बर 2026 (रविवार), समय: प्रातः 10:00 से सायं 4:00 बजे | स्थान: कांस्टीट्यूशन क्लब, रफी मार्ग, नई दिल्ली। समाज के समग्र विकास, शिक्षा एवं संगठनात्मक सशक्तीकरण हेतु चारों राष्ट्रीय पुरस्कारों के आवेदन आमंत्रित।",
      ctaText: "View Convention Details →",
      ctaLink: "/mahasabha",
      secondaryCtaText: "Official Convention Posters",
      secondaryCtaLink: "/gallery",
      image: "/asset/alokadhivationposter2026/poster1.jpeg",
      imageAlt: "आलोक राष्ट्रीय प्रतिभा सम्मान समारोह 2026 — कांस्टीट्यूशन क्लब नई दिल्ली मुख्य आमंत्रण पोस्टर",
      objectFit: "contain",
    },
    {
      id: "hero-education-merit",
      badge: "Education & Youth Merit",
      title: "स्वामी ब्रह्मानंद सम्मान पुरस्कार — प्रतिभावान छात्र-छात्रा सम्मान",
      subtitle:
        "आईआईटी (IIT), एमबीबीएस (MBBS), आईआईएम (IIM), आईआईएफटी (IIFT) एवं संघ लोक सेवा आयोग (UPSC) सहित उच्च संस्थानों में चयनित समाज के होनहार विद्यार्थियों का राष्ट्रीय स्तर पर सम्मान।",
      ctaText: "Explore Youth Initiatives →",
      ctaLink: "/organization",
      secondaryCtaText: "Submit Student Query",
      secondaryCtaLink: "/contact",
      image: "/asset/alokadhivationposter2026/poster4.jpeg",
      imageAlt: "स्वामी ब्रह्मानंद पुरस्कार — आईआईटी, एमबीबीएस, आईआईएम, आईआईएफटी प्रतिभावान छात्र-छात्रा सम्मान पोस्टर",
      objectFit: "contain",
    },
    {
      id: "hero-public-service",
      badge: "Public Service & Heritage",
      title: "अमर शहीद महारानी अवंतीबाई लोधी पुरस्कार — अधिकारी-कर्मचारी सेवा",
      subtitle:
        "केंद्रीय व राज्य सरकार के उपक्रमों, अर्ध-सरकारी संस्थानों एवं लोक सेवाओं में नव-नियुक्त तथा निष्ठापूर्वक सेवानिवृत्त समाज के सम्मानित अधिकारियों एवं कर्मचारियों का राष्ट्रीय अभिनंदन।",
      ctaText: "Read Heritage & Valor →",
      ctaLink: "/history",
      secondaryCtaText: "View Personalities",
      secondaryCtaLink: "/personalities",
      image: "/asset/alokadhivationposter2026/poster3.jpeg",
      imageAlt: "अमर शहीद महारानी अवंतीबाई लोधी पुरस्कार — सरकारी व अर्ध-सरकारी अधिकारी/कर्मचारी सदस्य सम्मान पोस्टर",
      objectFit: "contain",
    },
    {
      id: "hero-organization-expand",
      badge: "Organization & Membership",
      title: "राजा हिरदे शाह सम्मान — संगठन सशक्तीकरण एवं सदस्यता अभियान",
      subtitle:
        "आलोक संघ को राज्यों और जिलों में सशक्त बनाने, सदस्यता का व्यापक विस्तार करने और समाज को एकजुट करने वाले समर्पित प्रतिनिधियों एवं कर्मठ कार्यकर्ताओं का विशेष सम्मान।",
      ctaText: "Join Samaj Network →",
      ctaLink: "/contact",
      secondaryCtaText: "View Directory",
      secondaryCtaLink: "/directory",
      image: "/asset/alokadhivationposter2026/poster5.jpeg",
      imageAlt: "राजा हिरदे शाह पुरस्कार — आलोक संगठन सशक्तीकरण एवं सदस्यता सम्मान पोस्टर",
      objectFit: "contain",
    },
    {
      id: "hero-ratna-award",
      badge: "Exemplary Social Service",
      title: "आलोक रत्न पुरस्कार — समग्र समाज विकास एवं जनकल्याण",
      subtitle:
        "शैक्षणिक, आर्थिक, सामाजिक-सांस्कृतिक, राजनैतिक व रोज़गार के क्षेत्र में समाज के समग्र उत्थान और आलोक अभियान को आगे बढ़ाने में उल्लेखनीय योगदान देने वाले समाजसेवियों का सर्वोच्च सम्मान।",
      ctaText: "View Photo Gallery →",
      ctaLink: "/gallery",
      secondaryCtaText: "Mahasabha Resolutions",
      secondaryCtaLink: "/mahasabha",
      image: "/asset/alokadhivationposter2026/poster2.jpeg",
      imageAlt: "आलोक रत्न पुरस्कार — समाज सेवा एवं समग्र विकास विशिष्ट सम्मान पोस्टर",
      objectFit: "contain",
    },
  ];

  // Static SSR preview to prevent hydration mismatch and enable SEO indexing before Swiper mounts
  if (!mounted) {
    const slide = slides[0];
    return (
      <section
        aria-label="Community Highlights & Announcements Carousel"
        className="relative bg-white rounded-lg border border-[#E9E2D8] shadow-xs overflow-hidden"
      >
        <div className="p-4 sm:p-6 md:p-7">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            {/* Left Column: Heading, description, buttons (58-60% width on desktop) */}
            <div className="w-full lg:w-[58%] xl:w-[60%] flex flex-col justify-center text-left">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="inline-block text-[11px] font-bold tracking-wider text-[#F26A21] uppercase bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#E9E2D8]">
                  {slide.badge}
                </span>
                <span className="text-[#E9E2D8]">•</span>
                <span className="text-xs font-semibold text-[#102F6B]">
                  alokworld.in
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] tracking-tight leading-snug">
                {slide.title}
              </h1>

              <p className="mt-2.5 text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                {slide.subtitle}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <Link
                  href={slide.ctaLink}
                  className="btn-primary px-4 py-2.5 text-xs font-bold shadow-xs"
                >
                  {slide.ctaText}
                </Link>
                {slide.secondaryCtaText && slide.secondaryCtaLink && (
                  <Link
                    href={slide.secondaryCtaLink}
                    className="btn-navy px-4 py-2.5 text-xs font-bold shadow-xs"
                  >
                    {slide.secondaryCtaText}
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: Substantially larger image (40-42% width on desktop) */}
            {slide.image && (
              <div className="w-full lg:w-[42%] xl:w-[40%] shrink-0">
                <div className="w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[440px] rounded-lg border border-[#E9E2D8] shadow-sm bg-[#FFFCF5] p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.imageAlt || slide.title}
                    loading="eager"
                    className="max-w-full max-h-full object-contain rounded drop-shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <FadeIn
      as="section"
      direction="up"
      distance={16}
      duration={0.55}
      aria-label="Community Highlights & Announcements Carousel"
      className="relative bg-white rounded-lg border border-[#E9E2D8] shadow-xs overflow-hidden"
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={700}
        loop={slides.length > 1}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: "hero-bullet",
          bulletActiveClass: "hero-bullet-active",
          el: ".hero-custom-pagination",
        }}
        navigation={{
          prevEl: ".hero-btn-prev",
          nextEl: ".hero-btn-next",
        }}
        a11y={{
          prevSlideMessage: "Previous community slide",
          nextSlideMessage: "Next community slide",
          firstSlideMessage: "This is the first slide",
          lastSlideMessage: "This is the last slide",
        }}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="p-4 sm:p-6 md:p-7">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
                {/* Left Column: Heading, description, and relevant CTAs (58-60% width) */}
                <div className="w-full lg:w-[58%] xl:w-[60%] flex flex-col justify-center text-left">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-block text-[11px] font-bold tracking-wider text-[#F26A21] uppercase bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#E9E2D8]">
                      {slide.badge}
                    </span>
                    <span className="text-[#E9E2D8]">•</span>
                    <span className="text-xs font-semibold text-[#102F6B]">
                      alokworld.in
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] tracking-tight leading-snug">
                    {slide.title}
                  </h1>

                  <p className="mt-2.5 text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                    {slide.subtitle}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <InteractiveTap>
                      <Link
                        href={slide.ctaLink}
                        className="btn-primary px-4 py-2.5 text-xs font-bold shadow-xs focus:ring-2 focus:ring-[#F26A21] focus:outline-hidden"
                      >
                        {slide.ctaText}
                      </Link>
                    </InteractiveTap>
                    {slide.secondaryCtaText && slide.secondaryCtaLink && (
                      <InteractiveTap>
                        <Link
                          href={slide.secondaryCtaLink}
                          className="btn-navy px-4 py-2.5 text-xs font-bold shadow-xs focus:ring-2 focus:ring-[#102F6B] focus:outline-hidden"
                        >
                          {slide.secondaryCtaText}
                        </Link>
                      </InteractiveTap>
                    )}
                  </div>
                </div>

                {/* Right Column: Substantially larger, balanced image (40-42% width) with object-contain */}
                {slide.image && (
                  <div className="w-full lg:w-[42%] xl:w-[40%] shrink-0">
                    <div className="w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[440px] rounded-lg border border-[#E9E2D8] shadow-sm bg-[#FFFCF5] p-2 sm:p-2.5 flex items-center justify-center overflow-hidden">
                      <img
                        src={slide.image}
                        alt={slide.imageAlt || slide.title}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain rounded drop-shadow-sm transition-transform duration-500 hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Controls Bar: pagination + arrows */}
      <div className="bg-[#FAF7F0] border-t border-[#E9E2D8] px-4 py-2.5 flex items-center justify-between">
        {/* Pagination Dots */}
        <div className="hero-custom-pagination flex items-center gap-1.5" />

        {/* Previous / Next Arrows */}
        <div className="flex items-center gap-1.5">
          <InteractiveTap>
            <button
              type="button"
              className="hero-btn-prev w-7 h-7 rounded-full bg-white border border-[#E9E2D8] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-xs font-bold cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#F26A21]"
              aria-label="Previous slide"
            >
              ←
            </button>
          </InteractiveTap>
          <InteractiveTap>
            <button
              type="button"
              className="hero-btn-next w-7 h-7 rounded-full bg-white border border-[#E9E2D8] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-xs font-bold cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#F26A21]"
              aria-label="Next slide"
            >
              →
            </button>
          </InteractiveTap>
        </div>
      </div>
    </FadeIn>
  );
}
