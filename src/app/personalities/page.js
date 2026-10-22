"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import PersonalitiesCarousel from "@/components/PersonalitiesCarousel";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  SectionHeadingReveal,
  SubtleHoverCard,
} from "@/components/MotionWrappers";

export default function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default historical icons verified against project archives
  const defaultList = [
    {
      _id: "p1",
      name: "Veerangana Rani Avanti Bai Lodhi",
      title: "Immortal Heroine of the 1857 War of Independence",
      era: "1831 - 1858",
      photo: "/asset/topofwebsite/web_sit_front.png",
      summary: "Queen of Ramgarh who led troops with extraordinary courage against British colonial forces during the First War of Indian Independence of 1857, making the supreme sacrifice for the motherland.",
    },
    {
      _id: "p2",
      name: "Shaheed Gulab Singh Lodhi",
      title: "Immortal Freedom Fighter & Flag Bearer",
      era: "1903 - 1935",
      photo: "",
      summary: "Valiant young revolutionary who fearlessly hoisted the Indian tricolor in defiance of British bullets at Aminabad Park, Lucknow, sacrificing his life for national independence.",
    },
    {
      _id: "p3",
      name: "Swami Brahmanand Ji",
      title: "Education Pioneer, Social Reformer & Parliamentarian",
      era: "1894 - 1984",
      photo: "",
      summary: "Visionary saint and Member of Parliament who spearheaded an educational revolution across Bundelkhand, establishing dozens of schools, gurukuls, and colleges to empower underprivileged communities.",
    },
    {
      _id: "p4",
      name: "Raja Hridayshah Lodhi",
      title: "Legendary Leader of the 1842 Bundela Rebellion",
      era: "1806 - 1852",
      photo: "",
      summary: "Brave ruler of Hirapur who organized and led the historic armed uprising against exploitative British agrarian and taxation policies in 1842.",
    }
  ];

  useEffect(() => {
    fetch("/api/personalities")
      .then((res) => res.json())
      .then((data) => {
        if (data?.personalities && data.personalities.length > 0) {
          setPersonalities(data.personalities);
        } else {
          setPersonalities(defaultList);
        }
      })
      .catch(() => setPersonalities(defaultList))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            <FadeIn direction="up" distance={14} duration={0.5}>
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                  Icons &amp; Legends
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                  Glorious Historical Figures &amp; Community Icons
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  Honoring the brave freedom fighters, reformers, philosophers, and nation builders from our community heritage.
                </p>
              </div>
            </FadeIn>

            {/* Featured Swiper Carousel */}
            {personalities.length > 0 && (
              <FadeIn direction="up" distance={16} duration={0.55}>
                <PersonalitiesCarousel personalities={personalities} />
              </FadeIn>
            )}

            {/* Complete Grid with Staggered Entrance */}
            <div className="space-y-3">
              <SectionHeadingReveal>
                <h2 className="text-sm font-bold text-[#102F6B] pb-1 border-b border-[#F0E5D5]">
                  All Historical Personalities ({personalities.length})
                </h2>
              </SectionHeadingReveal>

              <StaggerContainer
                className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                staggerDelay={0.07}
              >
                {personalities.map((item) => (
                  <StaggerItem key={item._id} className="h-full">
                    <SubtleHoverCard className="h-full">
                      <div className="bg-white rounded-lg border border-[#F0E5D5] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#102F6B] transition-all flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-13 h-13 rounded-lg bg-[#102F6B] text-white flex items-center justify-center font-bold text-lg shrink-0 border border-[#F26A21]">
                              {item.name ? item.name.charAt(0) : "P"}
                            </div>
                            <div>
                              <h3 className="text-sm sm:text-base font-bold text-[#102F6B] leading-tight">
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

                          <p className="text-xs text-[#64748B] leading-relaxed pt-2.5 border-t border-[#F0E5D5]">
                            {item.summary}
                          </p>
                        </div>
                      </div>
                    </SubtleHoverCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>

          <FadeIn
            as="div"
            direction="up"
            distance={14}
            duration={0.5}
            delay={0.1}
            className="lg:col-span-4"
          >
            <Sidebar />
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
}
