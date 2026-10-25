"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, A11y } from "swiper/modules";
import { FadeIn, InteractiveTap } from "@/components/MotionWrappers";

import "swiper/css";
import "swiper/css/navigation";

export default function Sidebar({
  noticeTitle,
  noticeContent,
  adTitle,
  adBannerText,
  adLink,
  locations = ["Bhopal", "Jaipur", "Bengaluru", "Lucknow", "Indore", "Delhi NCR", "Mumbai", "Jabalpur"],
  selectedLocation = "All",
  onSelectLocation,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const notices = [
    {
      id: "n1",
      badge: "डायरेक्टरी",
      text:
        noticeContent ||
        "सभी समाज बंधुओं से अनुरोध है कि वे अपने परिवार व कार्यक्षेत्र की जानकारी डायरेक्टरी में अद्यतन रखें।",
      actionText: "रिकॉर्ड जांचें →",
      actionLink: "/directory",
    },
    {
      id: "n2",
      badge: "अधिवेशन 2026",
      text: "आगामी 2 नवंबर 2026 राष्ट्रीय महासम्मेलन एवं प्रतिभा सम्मान समारोह में सादर आमंत्रित हैं।",
      actionText: "महासभा विवरण →",
      actionLink: "/mahasabha",
    },
    {
      id: "n3",
      badge: "महासभा",
      text: "प्रांतीय कमेटियों एवं युवा प्रकोष्ठ सम्मेलनों के संबंध में जिला प्रभारियों से संपर्क करें।",
      actionText: "संगठन प्रकोष्ठ →",
      actionLink: "/organization",
    },
    {
      id: "n4",
      badge: "सचिवालय",
      text: "डायरेक्टरी संशोधन, प्रविष्टि सहायता अथवा जानकारी हेतु केंद्रीय हेल्पलाइन से संपर्क करें।",
      actionText: "संपर्क करें →",
      actionLink: "/contact",
    },
  ];

  return (
    <aside className="space-y-4">
      {/* Box 1: Samaj Notice & Message with Swiper Slider */}
      <FadeIn direction="up" distance={12} duration={0.45}>
        <div className="bg-white rounded-lg border border-[#F0E5D5] p-4 sm:p-5 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2.5 border-b border-[#F0E5D5]">
            <div className="flex items-center gap-1.5 text-[#102F6B] font-bold text-sm">
              <span className="text-[#F26A21]">📢</span>
              <h3 className="border-l-3 border-[#F26A21] pl-2">
                {noticeTitle || "समाज संदेश एवं सूचनाएं"}
              </h3>
            </div>

            {/* Micro Navigation Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="sidebar-notice-prev w-5 h-5 rounded bg-[#FFFCF5] border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-[10px] font-bold cursor-pointer"
                aria-label="पिछली सूचना"
              >
                ‹
              </button>
              <button
                type="button"
                className="sidebar-notice-next w-5 h-5 rounded bg-[#FFFCF5] border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-[10px] font-bold cursor-pointer"
                aria-label="अगली सूचना"
              >
                ›
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#FFFCF5] rounded border border-[#F0E5D5]">
            {!mounted ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5]">
                    {notices[0].badge}
                  </span>
                  <Link
                    href={notices[0].actionLink}
                    className="text-[10px] font-bold text-[#102F6B] hover:text-[#F26A21] underline transition-colors"
                  >
                    {notices[0].actionText}
                  </Link>
                </div>
                <p className="text-xs text-[#263449] leading-relaxed">
                  {notices[0].text}
                </p>
              </div>
            ) : (
              <Swiper
                modules={[Autoplay, Navigation, A11y]}
                speed={500}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                navigation={{
                  prevEl: ".sidebar-notice-prev",
                  nextEl: ".sidebar-notice-next",
                }}
                a11y={{
                  prevSlideMessage: "पिछली सूचना",
                  nextSlideMessage: "अगली सूचना",
                }}
                className="w-full"
              >
                {notices.map((n) => (
                  <SwiperSlide key={n.id}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5]">
                          {n.badge}
                        </span>
                        <Link
                          href={n.actionLink}
                          className="text-[10px] font-bold text-[#102F6B] hover:text-[#F26A21] underline transition-colors"
                        >
                          {n.actionText}
                        </Link>
                      </div>
                      <p className="text-xs text-[#263449] leading-relaxed">
                        {n.text}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Box 2: Quick Filter By Region / State */}
      <FadeIn direction="up" distance={12} duration={0.45} delay={0.06}>
        <div className="bg-white rounded-lg border border-[#F0E5D5] p-4 sm:p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#102F6B] mb-3 pb-2 border-b border-[#F0E5D5] flex items-center justify-between">
            <span>प्रमुख क्षेत्र व शहर</span>
            <span className="w-2 h-2 rounded-full bg-[#F26A21]"></span>
          </h3>
          <div className="flex flex-col gap-1 text-xs">
            {onSelectLocation ? (
              <>
                <button
                  onClick={() => onSelectLocation("All")}
                  className={`text-left px-3 py-2 rounded font-medium transition-colors cursor-pointer ${
                    selectedLocation === "All"
                      ? "bg-[#102F6B] text-white font-bold border-l-4 border-[#F26A21]"
                      : "text-[#263449] hover:bg-[#FFF0E2]"
                  }`}
                >
                  सभी क्षेत्र
                </button>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => onSelectLocation(loc)}
                    className={`text-left px-3 py-2 rounded font-medium transition-colors cursor-pointer ${
                      selectedLocation === loc
                        ? "bg-[#102F6B] text-white font-bold border-l-4 border-[#F26A21]"
                        : "text-[#263449] hover:bg-[#FFF0E2]"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </>
            ) : (
              <>
                <Link
                  href="/directory"
                  className="text-left px-3 py-2 rounded font-medium text-[#263449] hover:bg-[#FFF0E2]"
                >
                  सभी क्षेत्र
                </Link>
                {locations.map((loc) => (
                  <Link
                    key={loc}
                    href={`/directory?city=${encodeURIComponent(loc)}`}
                    className="text-left px-3 py-2 rounded font-medium text-[#263449] hover:bg-[#FFF0E2]"
                  >
                    {loc}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Box 3: Community Business Spotlight / Advertisement */}
      <FadeIn direction="up" distance={12} duration={0.45} delay={0.12}>
        <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 shadow-xs text-center space-y-3">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
            सामुदायिक व्यवसाय मंच
          </span>
          <h4 className="font-bold text-sm text-[#102F6B]">
            {adTitle || "व्यावसायिक डायरेक्टरी एवं प्रतिष्ठान"}
          </h4>
          <p className="text-xs text-[#64748B] leading-relaxed">
            {adBannerText || "अपने व्यावसायिक प्रतिष्ठान को देशभर के समाज नेटवर्क पर प्रचारित करें।"}
          </p>
          <InteractiveTap>
            <Link
              href={adLink || "/contact"}
              className="inline-block w-full py-2 bg-[#102F6B] text-white text-xs font-bold rounded hover:bg-[#F26A21] transition-colors"
            >
              प्रतिष्ठान सूचीबद्ध करें / संपर्क करें →
            </Link>
          </InteractiveTap>
        </div>
      </FadeIn>
    </aside>
  );
}
