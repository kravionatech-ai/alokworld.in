"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Keyboard, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function GalleryCarousel({ items = [], onVideoClick }) {
  const [mounted, setMounted] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 1. Featured Top Carousel Showcase */}
      <div className="bg-white rounded-lg border border-[#F0E5D5] p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0E5D5] mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block text-[10px] font-bold tracking-wider text-[#F26A21] uppercase bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5]">
              प्रमुख छायाचित्र
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#102F6B]">
              अधिवेशन एवं कार्यक्रम छायाचित्र दीर्घा
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="gallery-prev-btn w-7 h-7 rounded-full bg-white border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-xs font-bold cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#F26A21]"
              aria-label="पिछला छायाचित्र"
            >
              ←
            </button>
            <button
              type="button"
              className="gallery-next-btn w-7 h-7 rounded-full bg-white border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-xs font-bold cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#F26A21]"
              aria-label="अगला छायाचित्र"
            >
              →
            </button>
          </div>
        </div>

        {/* Swiper Carousel or SSR Fallback */}
        <div className="relative">
          {!mounted ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.slice(0, 3).map((img, idx) => (
                <div
                  key={img._id || idx}
                  className="bg-[#FFFCF5] rounded-lg border border-[#F0E5D5] overflow-hidden shadow-xs"
                >
                  <div className="h-60 sm:h-72 overflow-hidden relative bg-[#FFFCF5] p-2 flex items-center justify-center border-b border-[#F0E5D5]">
                    <img
                      src={img.imageUrl}
                      alt={img.title || "समाज कार्यक्रम छायाचित्र"}
                      className="max-w-full max-h-full object-contain drop-shadow-xs"
                    />
                  </div>
                  <div className="p-3.5">
                    <h3 className="text-xs sm:text-sm font-bold text-[#102F6B] line-clamp-1">
                      {img.title}
                    </h3>
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
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                }}
                speed={600}
                loop={items.length > 3}
                autoplay={{
                  delay: 4500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                pagination={{
                  clickable: true,
                  bulletClass: "hero-bullet",
                  bulletActiveClass: "hero-bullet-active",
                  el: ".gallery-pagination",
                }}
                navigation={{
                  prevEl: ".gallery-prev-btn",
                  nextEl: ".gallery-next-btn",
                }}
                a11y={{
                  prevSlideMessage: "पिछला छायाचित्र",
                  nextSlideMessage: "अगला छायाचित्र",
                }}
                className="w-full pb-2"
              >
                {items.map((img, idx) => (
                  <SwiperSlide key={img._id || idx} className="h-auto">
                    <div
                      onClick={() => {
                        if (img.mediaType === "video" && onVideoClick) {
                          onVideoClick(img);
                        } else {
                          setLightboxIndex(idx);
                        }
                      }}
                      className="bg-[#FFFCF5] rounded-lg border border-[#F0E5D5] overflow-hidden shadow-xs hover:shadow-md hover:border-[#102F6B] transition-all cursor-pointer group flex flex-col h-full"
                    >
                      <div className="h-60 sm:h-72 overflow-hidden relative bg-[#FFFCF5] p-2 flex items-center justify-center border-b border-[#F0E5D5]">
                        <img
                          src={img.imageUrl || (img.mediaType === "video" ? `https://img.youtube.com/vi/${img.videoId}/hqdefault.jpg` : "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924154/alokworld/banners/web_sit_front1.png")}
                          alt={img.title || "समाज कार्यक्रम छायाचित्र"}
                          loading="lazy"
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                        />
                        <div className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ${
                          img.mediaType === "video" ? "bg-red-600" : "bg-[#102F6B]/90"
                        }`}>
                          {img.mediaType === "video" ? "🎥 वीडियो" : img.category || "समाज"}
                        </div>
                        {img.eventDate && (
                          <div className="absolute top-2 right-2 bg-white/90 text-[#102F6B] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs border border-[#F0E5D5]">
                            {img.eventDate}
                          </div>
                        )}
                        {img.mediaType === "video" && (
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                            <span className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
                              ▶
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-[#102F6B] group-hover:text-[#F26A21] transition-colors line-clamp-1">
                            {img.title}
                          </h3>
                          <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                            {img.description}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-[#F26A21] mt-2 block group-hover:translate-x-0.5 transition-transform">
                          {img.mediaType === "video" ? "वीडियो चलाएं ▶" : "विस्तृत देखें 🔍"}
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="gallery-pagination flex items-center justify-center gap-1.5 mt-4" />
            </>
          )}
        </div>
      </div>

      {/* 2. Lightbox Modal using Swiper */}
      {lightboxIndex !== null && mounted && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="छायाचित्र लाइटबॉक्स कैरोसेल"
          className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center p-3 sm:p-6 backdrop-blur-xs"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Modal Header */}
          <div
            className="w-full max-w-4xl flex items-center justify-between text-white pb-3 px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs sm:text-sm font-bold text-[#FFF0E2]">
              छायाचित्र {lightboxIndex + 1} / {items.length}
            </div>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="text-white hover:text-[#F26A21] bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors text-base font-bold cursor-pointer"
              aria-label="बंद करें"
            >
              ✕
            </button>
          </div>

          {/* Lightbox Swiper Container */}
          <div
            className="w-full max-w-4xl bg-[#091D42] rounded-lg overflow-hidden border border-[#F0E5D5]/30 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Swiper
              modules={[Navigation, Keyboard, A11y]}
              initialSlide={lightboxIndex}
              keyboard={{ enabled: true }}
              navigation={{
                prevEl: ".lightbox-prev",
                nextEl: ".lightbox-next",
              }}
              onSlideChange={(swiper) => setLightboxIndex(swiper.activeIndex)}
              className="w-full"
            >
              {items.map((img, idx) => (
                <SwiperSlide key={img._id || idx}>
                  <div className="flex flex-col items-center">
                    <div className="w-full max-h-[65vh] flex items-center justify-center bg-black/50 p-2 sm:p-4">
                      <img
                        src={img.imageUrl}
                        alt={img.title || "समाज कार्यक्रम छायाचित्र"}
                        className="max-h-[60vh] max-w-full object-contain rounded"
                      />
                    </div>
                    <div className="w-full p-4 bg-[#091D42] border-t border-white/10 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2]/10 px-2 py-0.5 rounded border border-[#F26A21]/30">
                          {img.category || "समाज आयोजन"}
                        </span>
                        {img.eventDate && (
                          <span className="text-xs text-[#CBD5E1]">
                            • {img.eventDate}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {img.title}
                      </h3>
                      {img.description && (
                        <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">
                          {img.description}
                        </p>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Lightbox Navigation Buttons */}
            <button
              type="button"
              className="lightbox-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-[#F26A21] transition-colors flex items-center justify-center text-sm font-bold cursor-pointer"
              aria-label="पिछला छायाचित्र"
            >
              ‹
            </button>
            <button
              type="button"
              className="lightbox-next absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-[#F26A21] transition-colors flex items-center justify-center text-sm font-bold cursor-pointer"
              aria-label="अगला छायाचित्र"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
