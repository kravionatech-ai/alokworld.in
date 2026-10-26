"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchFilterBar from "@/components/SearchFilterBar";
import MemberTable from "@/components/MemberTable";
import Sidebar from "@/components/Sidebar";
import HeroCarousel from "@/components/HeroCarousel";
import AnnouncementSlider from "@/components/AnnouncementSlider";
import FeaturedMembersCarousel from "@/components/FeaturedMembersCarousel";
import HomepageVideoSection from "@/components/HomepageVideoSection";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  SectionHeadingReveal,
  SubtleHoverCard,
  InteractiveTap,
} from "@/components/MotionWrappers";

export default function HomePage() {
  const [featuredMembers, setFeaturedMembers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedLocation && selectedLocation !== "All") params.set("city", selectedLocation);
    params.set("limit", "12"); // Spotlight preview on home

    fetch(`/api/members?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.members) {
          setFeaturedMembers(data.members);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchQuery, selectedLocation]);

  const defaultQuickPillars = [
    { title: "समाज डायरेक्टरी", desc: "सत्यापित सदस्य विवरण, वरिष्ठजन, डॉक्टर, इंजीनियर व अधिवक्ता।", href: "/directory", icon: "👥" },
    { title: "समाज इतिहास", desc: "गौरवशाली विरासत, स्वतंत्रता संग्राम व ऐतिहासिक जड़ें।", href: "/history", icon: "📜" },
    { title: "विभूतियां", desc: "वीर स्वतंत्रता सेनानी, समाज सुधारक एवं महापुरुष।", href: "/personalities", icon: "🎖️" },
    { title: "महासभा संकल्प", desc: "आलोक राष्ट्रीय महाधिवेशन एवं समाज विकास के प्रस्ताव।", href: "/mahasabha", icon: "⚖️" },
    { title: "संगठन एवं इकाइयां", desc: "राष्ट्रीय कार्यकारिणी, युवा प्रकोष्ठ व प्रांतीय शाखाएं।", href: "/organization", icon: "🏛️" },
    { title: "छायाचित्र दीर्घा", desc: "राष्ट्रीय अधिवेशन व प्रतिभा सम्मान समारोह के क्षण।", href: "/gallery", icon: "📸" },
  ];

  const quickPillars = Array.isArray(settings?.quickPillars) && settings.quickPillars.length > 0
    ? settings.quickPillars.filter((p) => p.enabled !== false)
    : defaultQuickPillars;

  const locations = [
    "भोपाल", "जयपुर", "बेंगलुरु", "लखनऊ", "इंदौर", "दिल्ली एनसीआर", "मुंबई", "जबलपुर", "ग्वालियर", "धौलपुर"
  ];

  // Dynamic announcement list for AnnouncementSlider
  const announcementsList = Array.isArray(settings?.announcementsList) && settings.announcementsList.length > 0
    ? settings.announcementsList.filter((a) => a.enabled !== false)
    : settings?.announcement
    ? [
        {
          id: "ann-settings",
          tag: "सूचना",
          text: settings.announcement,
          link: "/directory",
          linkText: "डायरेक्टरी देखें →",
        },
        {
          id: "ann-convention",
          tag: "अधिवेशन 2026",
          text: "आगामी 2 नवंबर 2026 राष्ट्रीय महासम्मेलन एवं प्रतिभा सम्मान समारोह में सादर आमंत्रित हैं।",
          link: "/mahasabha",
          linkText: "अधिवेशन विवरण →",
        },
        {
          id: "ann-history",
          tag: "विरासत",
          text: "वीरांगना रानी अवंतीबाई एवं अमर शहीद गुलाब सिंह के शौर्य और बलिदान को सादर नमन।",
          link: "/history",
          linkText: "इतिहास पढ़ें →",
        },
      ]
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header siteName={settings?.siteName} settings={settings} />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* Compact Community Announcements Slider */}
        <FadeIn direction="up" distance={10} duration={0.4}>
          <AnnouncementSlider
            announcements={announcementsList}
            title={settings?.announcementBadge || "समाज संदेश"}
          />
        </FadeIn>

        {/* Portal Hero Banner with Swiper Carousel */}
        <HeroCarousel settings={settings} />

        {/* Quick Portal Pillars Grid with Staggered Entrance */}
        <StaggerContainer
          as="section"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3"
          staggerDelay={0.06}
          initialDelay={0.1}
        >
          {quickPillars.map((p, idx) => (
            <StaggerItem key={idx} className="h-full">
              <SubtleHoverCard className="h-full">
                <Link
                  href={p.href}
                  className="bg-white p-3 sm:p-4 rounded-lg border border-[#F0E5D5] shadow-xs hover:shadow-md hover:border-[#102F6B] transition-all flex flex-col justify-between group h-full"
                >
                  <div>
                    <span className="text-xl mb-1.5 block">{p.icon}</span>
                    <h3 className="text-xs font-bold text-[#102F6B] group-hover:text-[#F26A21] transition-colors leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#F26A21] mt-2.5 block group-hover:translate-x-0.5 transition-transform">
                    अनुभाग देखें →
                  </span>
                </Link>
              </SubtleHoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Featured Community Members Carousel (Multi-card Swiper) */}
        {featuredMembers && featuredMembers.length > 0 && (
          <FeaturedMembersCarousel
            members={featuredMembers}
            title="विशिष्ट समाज बंधु एवं पदाधिकारी"
            subtitle="समाज के वरिष्ठजनों, चिकित्सकों, इंजीनियरों, अधिवक्ताओं एवं प्रबुद्धजनों का संक्षिप्त विवरण।"
          />
        )}

        {/* Community Videos & Live Broadcast Section */}
        <HomepageVideoSection />

        {/* Traditional 3-Column Samaj Directory Layout: Left Sidebar + Central Table + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Navigation & State Units */}
          <div className="hidden lg:block lg:col-span-3 order-1 space-y-4">
            <FadeIn direction="up" distance={12} duration={0.45}>
              <LeftSidebar
                adTitle={settings?.adTitle}
                adBannerText={settings?.adBannerText}
                adLink={settings?.adLink}
                settings={settings}
              />
            </FadeIn>
          </div>

          {/* Center Column: Central Directory Spotlight Table */}
          <div className="col-span-1 lg:col-span-6 order-2 space-y-4">
            <SectionHeadingReveal className="flex items-center justify-between pb-2 border-b border-[#E9E2D8]">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
                  सामुदायिक सदस्य डायरेक्टरी
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5 pl-2">
                  सत्यापित प्रकाशित समाज सदस्य सूची ({featuredMembers.length} सक्रिय)।
                </p>
              </div>
              <InteractiveTap>
                <Link
                  href="/directory"
                  className="text-xs font-bold text-[#F26A21] hover:text-[#091D42] underline"
                >
                  संपूर्ण डायरेक्टरी देखें →
                </Link>
              </InteractiveTap>
            </SectionHeadingReveal>

            <FadeIn direction="up" distance={10} duration={0.4}>
              <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                locations={locations}
                totalResults={featuredMembers.length}
              />
            </FadeIn>

            {loading ? (
              <div className="bg-white rounded-lg border border-[#E9E2D8] p-12 text-center text-[#64748B] font-medium shadow-xs">
                <div className="w-8 h-8 border-3 border-[#102F6B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                सत्यापित समाज सदस्य रिकॉर्ड लोड हो रहे हैं...
              </div>
            ) : (
              <MemberTable members={featuredMembers.slice(0, 8)} startIndex={0} />
            )}

            <div className="text-center pt-3">
              <InteractiveTap>
                <Link
                  href="/directory"
                  className="btn-navy px-5 py-2.5 text-xs shadow-sm inline-block"
                >
                  सभी सत्यापित डायरेक्टरी रिकॉर्ड देखें →
                </Link>
              </InteractiveTap>
            </div>
          </div>

          {/* Right Column: Verified National Leadership Spotlight */}
          <div className="col-span-1 lg:col-span-3 order-3 space-y-4">
            <FadeIn direction="up" distance={12} duration={0.45} delay={0.08}>
              <RightSidebar settings={settings} />
            </FadeIn>
          </div>
        </div>
      </main>

      <Footer
        contactEmail={settings?.contactEmail}
        contactPhone={settings?.contactPhone}
      />
    </div>
  );
}
