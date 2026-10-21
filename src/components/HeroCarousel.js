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

  // Dynamic slides combining site settings and core community pillars
  const slides = [
    {
      id: "hero-main",
      badge: settings?.heroBadge || "Official Community Portal",
      title: settings?.heroTitle || "Akhil Bhartiya Samaj Directory & Central Portal",
      subtitle:
        settings?.heroSubtitle ||
        "A comprehensive digital network connecting community members, elders, doctors, engineers, advocates, merchants, and youth network across India.",
      ctaText: settings?.heroCtaText || "Explore Member Directory →",
      ctaLink: settings?.heroCtaLink || "/directory",
      secondaryCtaText: "Register / Contact Secretariat",
      secondaryCtaLink: "/contact",
      image:
        settings?.heroImage ||
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
      imageAlt: "Samaj Community Convention & Directory Network",
    },
    {
      id: "hero-matrimonial",
      badge: "Samaj Matrimonial",
      title: "Trusted Community Matrimonial & Family Network",
      subtitle:
        "Connecting verified community families across India with trust, cultural alignment, and dignified match-making services.",
      ctaText: "Explore Matrimonial Profiles →",
      ctaLink: "/matrimonial",
      secondaryCtaText: "Submit Matrimonial Inquiry",
      secondaryCtaLink: "/contact",
      image:
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
      imageAlt: "Samaj Matrimonial & Family Celebrations",
    },
    {
      id: "hero-heritage",
      badge: "Glorious Heritage",
      title: "Preserving Samaj History & Freedom Fighter Legacy",
      subtitle:
        "Honoring immortal legends like Veerangana Rani Avanti Bai and Shaheed Gulab Singh who made the supreme sacrifice for our nation.",
      ctaText: "Read Community History →",
      ctaLink: "/history",
      secondaryCtaText: "View Historical Personalities",
      secondaryCtaLink: "/personalities",
      image:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
      imageAlt: "Veerangana Rani Avanti Bai & Historical Heritage",
    },
    {
      id: "hero-mahasabha",
      badge: "National Mahasabha",
      title: "Akhil Bhartiya Mahasabha & Youth Empowerment",
      subtitle:
        "Organizing regional state conventions, youth mentorship programs, civil services guidance, and community welfare initiatives.",
      ctaText: "Explore Organization Wings →",
      ctaLink: "/organization",
      secondaryCtaText: "View Convention Photo Gallery",
      secondaryCtaLink: "/gallery",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
      imageAlt: "National Mahasabha Convention & Youth Welfare",
    },
  ];

  // Static SSR preview to prevent hydration mismatch and enable SEO indexing before Swiper mounts
  if (!mounted) {
    const slide = slides[0];
    return (
      <section
        aria-label="Community Highlights & Announcements Carousel"
        className="relative bg-white rounded-lg border border-[#F0E5D5] shadow-xs overflow-hidden"
      >
        <div className="p-5 sm:p-7 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl flex-1 text-left">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="inline-block text-[11px] font-bold tracking-wider text-[#F26A21] uppercase bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                  {slide.badge}
                </span>
                <span className="text-[#F0E5D5]">•</span>
                <span className="text-xs font-semibold text-[#102F6B]">
                  alokworld.in
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] tracking-tight leading-tight">
                {slide.title}
              </h1>

              <p className="mt-2.5 text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                {slide.subtitle}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <Link
                  href={slide.ctaLink}
                  className="btn-primary px-4 py-2 text-xs shadow-xs"
                >
                  {slide.ctaText}
                </Link>
                {slide.secondaryCtaText && slide.secondaryCtaLink && (
                  <Link
                    href={slide.secondaryCtaLink}
                    className="btn-navy px-4 py-2 text-xs shadow-xs"
                  >
                    {slide.secondaryCtaText}
                  </Link>
                )}
              </div>
            </div>

            {slide.image && (
              <div className="w-full md:w-80 shrink-0 rounded-md overflow-hidden border border-[#F0E5D5] shadow-xs relative aspect-16/10 md:aspect-4/3 bg-[#FFFCF5]">
                <img
                  src={slide.image}
                  alt={slide.imageAlt || slide.title}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
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
      className="relative bg-white rounded-lg border border-[#F0E5D5] shadow-xs overflow-hidden"
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={700}
        loop={slides.length > 1}
        autoplay={{
          delay: 5500,
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
            <div className="p-5 sm:p-7 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Text Content */}
                <div className="max-w-2xl flex-1 text-left">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-block text-[11px] font-bold tracking-wider text-[#F26A21] uppercase bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                      {slide.badge}
                    </span>
                    <span className="text-[#F0E5D5]">•</span>
                    <span className="text-xs font-semibold text-[#102F6B]">
                      alokworld.in
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] tracking-tight leading-tight">
                    {slide.title}
                  </h1>

                  <p className="mt-2.5 text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                    {slide.subtitle}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <InteractiveTap>
                      <Link
                        href={slide.ctaLink}
                        className="btn-primary px-4 py-2 text-xs shadow-xs focus:ring-2 focus:ring-[#F26A21] focus:outline-hidden"
                      >
                        {slide.ctaText}
                      </Link>
                    </InteractiveTap>
                    {slide.secondaryCtaText && slide.secondaryCtaLink && (
                      <InteractiveTap>
                        <Link
                          href={slide.secondaryCtaLink}
                          className="btn-navy px-4 py-2 text-xs shadow-xs focus:ring-2 focus:ring-[#102F6B] focus:outline-hidden"
                        >
                          {slide.secondaryCtaText}
                        </Link>
                      </InteractiveTap>
                    )}
                  </div>
                </div>

                {/* Banner Image Preview */}
                {slide.image && (
                  <div className="w-full md:w-80 shrink-0 rounded-md overflow-hidden border border-[#F0E5D5] shadow-xs relative aspect-16/10 md:aspect-4/3 bg-[#FFFCF5]">
                    <img
                      src={slide.image}
                      alt={slide.imageAlt || slide.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Controls Bar: pagination + arrows */}
      <div className="bg-[#FAF7F0] border-t border-[#F0E5D5] px-4 py-2.5 flex items-center justify-between">
        {/* Pagination Dots */}
        <div className="hero-custom-pagination flex items-center gap-1.5" />

        {/* Previous / Next Arrows */}
        <div className="flex items-center gap-1.5">
          <InteractiveTap>
            <button
              type="button"
              className="hero-btn-prev w-7 h-7 rounded-full bg-white border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-xs font-bold cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#F26A21]"
              aria-label="Previous slide"
            >
              ←
            </button>
          </InteractiveTap>
          <InteractiveTap>
            <button
              type="button"
              className="hero-btn-next w-7 h-7 rounded-full bg-white border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-xs font-bold cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#F26A21]"
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
