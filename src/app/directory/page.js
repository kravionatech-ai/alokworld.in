"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilterBar from "@/components/SearchFilterBar";
import MemberList from "@/components/MemberList";
import Sidebar from "@/components/Sidebar";

export default function DirectoryPage() {
  const [members, setMembers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
    params.set("page", page.toString());
    params.set("limit", "12");

    fetch(`/api/members?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.members) {
          setMembers(data.members);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchQuery, selectedLocation, page]);

  const locations = [
    "Bhopal", "Jaipur", "Bengaluru", "Lucknow", "Indore", "Delhi NCR", "Mumbai", "Jabalpur"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#172B4D]">
      <Header
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        announcement={settings?.announcement}
      />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Page Banner */}
        <section className="bg-[#FFFDF6] rounded-lg p-5 sm:p-7 mb-5 border border-[#F3D8B0] shadow-sm">
          <div className="max-w-3xl">
            <span className="inline-block text-[11px] font-bold tracking-wider text-[#C83B08] uppercase bg-[#FFE6C7] px-2 py-0.5 rounded border border-[#F3D8B0] mb-2">
              अखिल भारतीय समाज डिरेक्टरी
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#082F75] tracking-tight">
              समाज डायरेक्टरी एवं सदस्यता संपर्क सूची (Member Directory)
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
              Search and connect with registered community elders, doctors, engineers, advocates, merchants, and youth network across India.
            </p>
          </div>
        </section>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 order-2 lg:order-1">
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                setPage(1);
              }}
              selectedLocation={selectedLocation}
              onLocationChange={(loc) => {
                setSelectedLocation(loc);
                setPage(1);
              }}
              locations={locations}
              totalResults={members.length}
            />

            {loading ? (
              <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-12 text-center text-[#64748B] font-medium">
                Loading members from directory...
              </div>
            ) : (
              <MemberList members={members} />
            )}

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3.5 py-1.5 rounded border border-[#F3D8B0] bg-white hover:bg-[#FFE6C7]/50 text-[#082F75] text-xs font-semibold disabled:opacity-40 transition-colors shadow-xs"
                >
                  ← Previous
                </button>
                <span className="text-xs font-semibold px-3 text-[#082F75]">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3.5 py-1.5 rounded border border-[#F3D8B0] bg-white hover:bg-[#FFE6C7]/50 text-[#082F75] text-xs font-semibold disabled:opacity-40 transition-colors shadow-xs"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 order-1 lg:order-2">
            <Sidebar
              noticeTitle={settings?.sidebarNoticeTitle}
              noticeContent={settings?.sidebarNoticeContent}
              adTitle={settings?.adTitle}
              adBannerText={settings?.adBannerText}
              adLink={settings?.adLink}
              locations={locations}
              selectedLocation={selectedLocation}
              onSelectLocation={(loc) => {
                setSelectedLocation(loc);
                setPage(1);
              }}
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
