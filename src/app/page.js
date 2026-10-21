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
    { title: "Samaj History", desc: "Glorious heritage, freedom struggle & origin roots.", href: "/history", icon: "📜" },
    { title: "Personalities", desc: "Honoring brave historical icons & reformers.", href: "/personalities", icon: "🎖️" },
    { title: "Samaj Matrimonial", desc: "Dignified match-making for community families.", href: "/matrimonial", icon: "💍" },
    { title: "Organization", desc: "Core committees, youth wing & regional chapters.", href: "/organization", icon: "🏛️" },
    { title: "Photo Gallery", desc: "Moments from national conventions & youth meets.", href: "/gallery", icon: "📸" },
  ];

  const locations = [
    "Bhopal", "Jaipur", "Bengaluru", "Lucknow", "Indore", "Delhi NCR", "Mumbai", "Jabalpur"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#172B4D]">
      <Header siteName={settings?.siteName} />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* Portal Hero Banner */}
        <section className="bg-[#FFFDF6] rounded-lg p-5 sm:p-7 border border-[#F3D8B0] shadow-sm">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block text-[11px] font-bold tracking-wider text-[#C83B08] uppercase bg-[#FFE6C7] px-2.5 py-0.5 rounded border border-[#F3D8B0]">
                Official Community Portal
              </span>
              <span className="text-[#F3D8B0]">•</span>
              <span className="text-xs font-semibold text-[#082F75]">alokworld.in</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#082F75] tracking-tight leading-tight">
              अखिल भारतीय <span className="text-[#F4510B]">समाज डिरेक्टरी</span> एवं केंद्रीय पोर्टल
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
              A comprehensive digital network connecting community members, elders, doctors, engineers, advocates, merchants, and youth network across India.
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                href="/directory"
                className="px-4 py-2 bg-[#F4510B] hover:bg-[#C83B08] text-white text-xs font-bold rounded transition-colors shadow-sm"
              >
                Explore Member Directory →
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 bg-[#082F75] hover:bg-[#071D49] text-white text-xs font-bold rounded transition-colors"
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
              className="bg-[#FFFDF6] p-3 sm:p-4 rounded-lg border border-[#F3D8B0] shadow-xs hover:shadow-md hover:border-[#082F75] transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-xl mb-1.5 block">{p.icon}</span>
                <h3 className="text-xs font-bold text-[#082F75] group-hover:text-[#F4510B] transition-colors leading-snug">
                  {p.title}
                </h3>
                <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#F4510B] mt-2.5 block group-hover:translate-x-0.5 transition-transform">
                Open Section →
              </span>
            </Link>
          ))}
        </section>

        {/* 2-Column Responsive Layout: Directory Spotlight + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Central Directory Spotlight */}
          <div className="lg:col-span-8 order-2 lg:order-1 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3D8B0]">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#082F75] border-l-3 border-[#F4510B] pl-2">
                  सदस्य डायरेक्टरी खोज (Directory Spotlight)
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5 pl-2">
                  Quick search and explore verified community members.
                </p>
              </div>
              <Link
                href="/directory"
                className="text-xs font-bold text-[#F4510B] hover:text-[#C83B08] underline"
              >
                View Full Directory ({featuredMembers.length}+) →
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
              <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-12 text-center text-[#64748B] font-medium">
                Loading members from directory...
              </div>
            ) : (
              <MemberList members={featuredMembers} />
            )}

            <div className="text-center pt-3">
              <Link
                href="/directory"
                className="inline-block px-5 py-2.5 bg-[#082F75] hover:bg-[#F4510B] text-white text-xs font-bold rounded shadow-sm hover:shadow transition-all"
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
