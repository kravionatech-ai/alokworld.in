"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function AnnouncementSlider({
  announcements = [],
  title = "समाज संदेश एवं सूचनाएं",
  className = "",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultItems = [
    {
      id: "a1",
      tag: "डायरेक्टरी",
      text: "सभी समाज बंधुओं से अनुरोध है कि वे डायरेक्टरी में अपने परिवार एवं कार्यक्षेत्र की जानकारी अद्यतन रखें।",
      link: "/directory",
      linkText: "विवरण अद्यतन करें →",
    },
    {
      id: "a2",
      tag: "वैवाहिक",
      text: "वर्ष 2026 हेतु नवीन सत्यापित वैवाहिक प्रविष्टियां सम्मिलित की गई हैं। योग्य रिश्ते हेतु प्रोफाइल देखें।",
      link: "/matrimonial",
      linkText: "प्रोफाइल देखें →",
    },
    {
      id: "a3",
      tag: "अधिवेशन",
      text: "आलोक राष्ट्रीय प्रतिभा सम्मान समारोह 2026 (कांस्टीट्यूशन क्लब नई दिल्ली) की घोषणा। आवेदन आमंत्रित।",
      link: "/mahasabha",
      linkText: "अधिवेशन विवरण →",
    },
    {
      id: "a4",
      tag: "सहायता",
      text: "डायरेक्टरी प्रविष्टि अथवा प्रांतीय इकाइयों से संपर्क हेतु केंद्रीय सचिवालय हेल्पलाइन पर संपर्क करें।",
      link: "/contact",
      linkText: "संपर्क करें →",
    },
  ];

  const items = announcements && announcements.length > 0 ? announcements : defaultItems;

  return (
    <div
      aria-label="समाज संदेश एवं महत्वपूर्ण सूचनाएं"
      className={`bg-white rounded-lg border border-[#F0E5D5] shadow-xs overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#FAF7F0] border-b border-[#F0E5D5]">
        <div className="flex items-center gap-2">
          <span className="text-[#F26A21] text-xs font-bold animate-pulse">📢</span>
          <span className="text-xs font-bold text-[#102F6B] tracking-wide uppercase">
            {title}
          </span>
        </div>

        {/* Navigation micro-arrows */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="announcement-prev-btn w-5 h-5 rounded bg-white border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-[10px] font-bold cursor-pointer"
            aria-label="पिछली सूचना"
          >
            ‹
          </button>
          <button
            type="button"
            className="announcement-next-btn w-5 h-5 rounded bg-white border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-[10px] font-bold cursor-pointer"
            aria-label="अगली सूचना"
          >
            ›
          </button>
        </div>
      </div>

      <div className="p-3">
        {!mounted ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#263449]">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              {items[0]?.tag && (
                <span className="inline-block shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5]">
                  {items[0].tag}
                </span>
              )}
              <p className="leading-snug text-[#263449] font-medium line-clamp-2">
                {items[0]?.text}
              </p>
            </div>
            {items[0]?.link && (
              <Link
                href={items[0].link}
                className="shrink-0 text-[11px] font-bold text-[#F26A21] hover:text-[#102F6B] underline transition-colors whitespace-nowrap self-end sm:self-auto"
              >
                {items[0].linkText || "विवरण देखें →"}
              </Link>
            )}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation, A11y]}
            direction="horizontal"
            speed={500}
            loop={items.length > 1}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: ".announcement-prev-btn",
              nextEl: ".announcement-next-btn",
            }}
            a11y={{
              prevSlideMessage: "पिछली सूचना",
              nextSlideMessage: "अगली सूचना",
            }}
            className="w-full"
          >
            {items.map((item) => (
              <SwiperSlide key={item.id || item._id || item.text}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#263449]">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {item.tag && (
                      <span className="inline-block shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5]">
                        {item.tag}
                      </span>
                    )}
                    <p className="leading-snug text-[#263449] font-medium line-clamp-2">
                      {item.text}
                    </p>
                  </div>
                  {item.link && (
                    <Link
                      href={item.link}
                      className="shrink-0 text-[11px] font-bold text-[#F26A21] hover:text-[#102F6B] underline transition-colors whitespace-nowrap self-end sm:self-auto"
                    >
                      {item.linkText || "विवरण देखें →"}
                    </Link>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}
