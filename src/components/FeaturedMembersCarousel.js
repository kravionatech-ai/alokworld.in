"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, A11y } from "swiper/modules";
import MemberCard from "@/components/MemberCard";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function FeaturedMembersCarousel({
  members = [],
  title = "Featured Community Members",
  subtitle = "Honoring distinguished elders, doctors, engineers, advocates, and youth leaders.",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!members || members.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Featured Community Members Carousel"
      className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-6 shadow-xs"
    >
      {/* Header bar with title, description, and carousel controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0E5D5] mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block text-[10px] font-bold tracking-wider text-[#F26A21] uppercase bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5]">
              Spotlight
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#102F6B]">
              {title}
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link
            href="/directory"
            className="text-xs font-bold text-[#F26A21] hover:text-[#102F6B] underline transition-colors mr-2 hidden sm:inline-block"
          >
            All Members ({members.length}) →
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="featured-members-prev w-7 h-7 rounded-full bg-white border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-xs font-bold cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#F26A21]"
              aria-label="Previous member"
            >
              ←
            </button>
            <button
              type="button"
              className="featured-members-next w-7 h-7 rounded-full bg-white border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-xs font-bold cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#F26A21]"
              aria-label="Next member"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Swiper Slider with SSR Fallback */}
      <div className="relative w-full">
        {!mounted ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.slice(0, 3).map((member) => (
              <div key={member._id || member.id || member.slug} className="h-full min-h-[290px]">
                <MemberCard member={member} />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full">
            <Swiper
              modules={[Autoplay, Pagination, Navigation, A11y]}
              observer={true}
              observeParents={true}
              resizeObserver={true}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 18,
                },
              }}
              speed={600}
              loop={members.length > 3}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                bulletClass: "hero-bullet",
                bulletActiveClass: "hero-bullet-active",
                el: ".featured-members-pagination",
              }}
              navigation={{
                prevEl: ".featured-members-prev",
                nextEl: ".featured-members-next",
              }}
              a11y={{
                prevSlideMessage: "Previous member slide",
                nextSlideMessage: "Next member slide",
              }}
              className="w-full"
            >
              {members.map((member) => (
                <SwiperSlide key={member._id || member.id || member.slug} className="!h-auto pb-2">
                  <div className="h-full min-h-[290px]">
                    <MemberCard member={member} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Pagination Bullets */}
            <div className="featured-members-pagination flex items-center justify-center gap-1.5 mt-4" />
          </div>
        )}
      </div>
    </section>
  );
}
