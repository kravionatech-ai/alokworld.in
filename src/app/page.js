"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilterBar from "@/components/SearchFilterBar";
import MemberTable from "@/components/MemberTable";
import Sidebar from "@/components/Sidebar";
import HeroCarousel from "@/components/HeroCarousel";
import AnnouncementSlider from "@/components/AnnouncementSlider";
import FeaturedMembersCarousel from "@/components/FeaturedMembersCarousel";
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

  const quickPillars = [
    { title: "Samaj Directory", desc: "Verified member profiles, elders, doctors & engineers.", href: "/directory", icon: "👥" },
    { title: "Samaj History", desc: "Glorious heritage, freedom struggle & historical roots.", href: "/history", icon: "📜" },
    { title: "Personalities", desc: "Honoring brave historical icons, patriots & reformers.", href: "/personalities", icon: "🎖️" },
    { title: "Samaj Matrimonial", desc: "Dignified match-making for community families.", href: "/matrimonial", icon: "💍" },
    { title: "Organization", desc: "Core committees, youth wing & regional chapters.", href: "/organization", icon: "🏛️" },
    { title: "Photo Gallery", desc: "Moments from national conventions & youth meets.", href: "/gallery", icon: "📸" },
  ];

  const locations = [
    "Bhopal", "Jaipur", "Bengaluru", "Lucknow", "Indore", "Delhi NCR", "Mumbai", "Jabalpur"
  ];

  // Dynamic announcement list for AnnouncementSlider
  const announcementsList = settings?.announcement
    ? [
        {
          id: "ann-settings",
          tag: "Notice",
          text: settings.announcement,
          link: "/directory",
          linkText: "Explore Directory →",
        },
        {
          id: "ann-matrimonial",
          tag: "Matrimonial",
          text: "Verified matrimonial applications open for community brides and grooms across India.",
          link: "/matrimonial",
          linkText: "View Profiles →",
        },
        {
          id: "ann-history",
          tag: "Heritage",
          text: "Honor the valor of Veerangana Rani Avanti Bai and Shaheed Gulab Singh in our heritage portal.",
          link: "/history",
          linkText: "Read History →",
        },
      ]
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header siteName={settings?.siteName} />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* Compact Community Announcements Slider */}
        <FadeIn direction="up" distance={10} duration={0.4}>
          <AnnouncementSlider
            announcements={announcementsList}
            title={settings?.announcementBadge || "Samaj Notice"}
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
                    Open Section →
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
            title="Distinguished Community Members Spotlight"
            subtitle="Swipe through verified community elders, doctors, engineers, and professionals."
          />
        )}

        {/* 2-Column Responsive Layout: Directory Spotlight + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Central Directory Spotlight */}
          <div className="lg:col-span-8 order-2 lg:order-1 space-y-4">
            <SectionHeadingReveal className="flex items-center justify-between pb-2 border-b border-[#F0E5D5]">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
                  Community Member Directory Spotlight
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5 pl-2">
                  Quick search and explore verified community members across India.
                </p>
              </div>
              <InteractiveTap>
                <Link
                  href="/directory"
                  className="text-xs font-bold text-[#F26A21] hover:text-[#091D42] underline"
                >
                  Full Directory →
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
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-12 text-center text-[#64748B] font-medium">
                Loading members from directory...
              </div>
            ) : (
              <MemberTable members={featuredMembers.slice(0, 6)} startIndex={0} />
            )}

            <div className="text-center pt-3">
              <InteractiveTap>
                <Link
                  href="/directory"
                  className="btn-navy px-5 py-2.5 text-xs shadow-sm inline-block"
                >
                  Browse All Directory Members &amp; Pagination →
                </Link>
              </InteractiveTap>
            </div>
          </div>

          {/* Right Sidebar */}
          <FadeIn
            as="div"
            direction="up"
            distance={14}
            duration={0.5}
            delay={0.1}
            className="lg:col-span-4 order-1 lg:order-2"
          >
            <Sidebar
              noticeTitle={settings?.sidebarNoticeTitle}
              noticeContent={settings?.sidebarNoticeContent}
              adTitle={settings?.adTitle}
              adBannerText={settings?.adBannerText}
              adLink={settings?.adLink}
              locations={locations}
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
            />
          </FadeIn>
        </div>
      </main>

      <Footer
        contactEmail={settings?.contactEmail}
        contactPhone={settings?.contactPhone}
      />
    </div>
  );
}
