"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function PersonalitiesCarousel({ personalities = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!personalities || personalities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-[#F0E5D5] p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0E5D5] mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-block text-[10px] font-bold tracking-wider text-[#F26A21] uppercase bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5]">
            Featured Icons
          </span>
          <h2 className="text-sm sm:text-base font-bold text-[#102F6B]">
            Historical Icons Spotlight
          </h2>
        </div>

        {/* Micro Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="pers-prev-btn w-6 h-6 rounded-full bg-white border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-xs font-bold cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#F26A21]"
            aria-label="Previous personality"
          >
            ←
          </button>
          <button
            type="button"
            className="pers-next-btn w-6 h-6 rounded-full bg-white border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-xs font-bold cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#F26A21]"
            aria-label="Next personality"
          >
            →
          </button>
        </div>
      </div>

      <div className="relative">
        {!mounted ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {personalities.slice(0, 2).map((item) => (
              <div
                key={item._id || item.name}
                className="bg-[#FFFCF5] rounded-lg border border-[#F0E5D5] p-4"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-12 h-12 rounded-lg bg-[#102F6B] text-white flex items-center justify-center font-bold text-base shrink-0 border border-[#F26A21]">
                    {item.name ? item.name.charAt(0) : "P"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#102F6B] leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-[#F26A21] block mt-0.5">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <Swiper
              modules={[Autoplay, Pagination, Navigation, A11y]}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
              }}
              speed={600}
              loop={personalities.length > 2}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                bulletClass: "hero-bullet",
                bulletActiveClass: "hero-bullet-active",
                el: ".pers-pagination",
              }}
              navigation={{
                prevEl: ".pers-prev-btn",
                nextEl: ".pers-next-btn",
              }}
              a11y={{
                prevSlideMessage: "Previous personality",
                nextSlideMessage: "Next personality",
              }}
              className="w-full pb-2"
            >
              {personalities.map((item) => (
                <SwiperSlide key={item._id || item.name} className="h-auto">
                  <div className="bg-[#FFFCF5] rounded-lg border border-[#F0E5D5] p-4 flex flex-col justify-between h-full hover:border-[#F26A21] transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-12 h-12 rounded-lg bg-[#102F6B] text-white flex items-center justify-center font-bold text-base shrink-0 border border-[#F26A21]">
                          {item.name ? item.name.charAt(0) : "P"}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#102F6B] leading-tight">
                            {item.name}
                          </h3>
                          <span className="text-[11px] font-semibold text-[#F26A21] block mt-0.5">
                            {item.title}
                          </span>
                          {item.era && (
                            <span className="text-[10px] text-[#64748B] block font-mono">
                              {item.era}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed pt-2 border-t border-[#F0E5D5] line-clamp-3">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="pers-pagination flex items-center justify-center gap-1.5 mt-3" />
          </>
        )}
      </div>
    </div>
  );
}
