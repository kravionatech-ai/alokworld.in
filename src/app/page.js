"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilterBar from "@/components/SearchFilterBar";
import MemberList from "@/components/MemberList";
import Sidebar from "@/components/Sidebar";

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
    params.set("limit", "6"); // Spotlight preview on home

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

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header siteName={settings?.siteName} />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* Portal Hero Banner */}
        <section className="bg-white rounded-lg p-5 sm:p-7 border border-[#F0E5D5] shadow-xs">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block text-[11px] font-bold tracking-wider text-[#F26A21] uppercase bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                {settings?.heroBadge || "Official Community Portal"}
              </span>
              <span className="text-[#F0E5D5]">•</span>
              <span className="text-xs font-semibold text-[#102F6B]">alokworld.in</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] tracking-tight leading-tight">
              {settings?.heroTitle ? (
                settings.heroTitle
              ) : (
                <>
                  Akhil Bhartiya <span className="text-[#F26A21]">Samaj Directory</span> &amp; Central Portal
                </>
              )}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
              {settings?.heroSubtitle ||
                "A comprehensive digital network connecting community members, elders, doctors, engineers, advocates, merchants, and youth network across India."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                href={settings?.heroCtaLink || "/directory"}
                className="btn-primary px-4 py-2 text-xs shadow-sm"
              >
                {settings?.heroCtaText || "Explore Member Directory →"}
              </Link>
              <Link
                href="/contact"
                className="btn-navy px-4 py-2 text-xs shadow-sm"
              >
                Register / Contact Secretariat
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Portal Pillars Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {quickPillars.map((p, idx) => (
            <Link
              key={idx}
              href={p.href}
              className="bg-white p-3 sm:p-4 rounded-lg border border-[#F0E5D5] shadow-xs hover:shadow-md hover:border-[#102F6B] transition-all flex flex-col justify-between group"
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
          ))}
        </section>

        {/* 2-Column Responsive Layout: Directory Spotlight + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Central Directory Spotlight */}
          <div className="lg:col-span-8 order-2 lg:order-1 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0E5D5]">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
                  Community Member Directory Spotlight
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5 pl-2">
                  Quick search and explore verified community members across India.
                </p>
              </div>
              <Link
                href="/directory"
                className="text-xs font-bold text-[#F26A21] hover:text-[#091D42] underline"
              >
                Full Directory →
              </Link>
            </div>

            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              locations={locations}
              totalResults={featuredMembers.length}
            />

            {loading ? (
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-12 text-center text-[#64748B] font-medium">
                Loading members from directory...
              </div>
            ) : (
              <MemberList members={featuredMembers} />
            )}

            <div className="text-center pt-3">
              <Link
                href="/directory"
                className="btn-navy px-5 py-2.5 text-xs shadow-sm"
              >
                Browse All Directory Members &amp; Pagination →
              </Link>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 order-1 lg:order-2">
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
