"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilterBar from "@/components/SearchFilterBar";
import MemberTable from "@/components/MemberTable";
import Sidebar from "@/components/Sidebar";
import { FadeIn } from "@/components/MotionWrappers";

export default function DirectoryPage() {
  const [members, setMembers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedProfession, setSelectedProfession] = useState("All");
  const [selectedOrganization, setSelectedOrganization] = useState("All");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    cities: ["लखनऊ", "भोपाल", "जयपुर", "नई दिल्ली", "ग्वालियर", "इंदौर", "हैदराबाद", "धौलपुर", "अलीगढ़", "आगरा"],
    states: ["उत्तर प्रदेश", "मध्य प्रदेश", "राजस्थान", "दिल्ली", "हरियाणा / पंजाब", "उत्तराखंड", "तेलंगाना", "अखिल भारतीय"],
    professions: [],
    organizations: [],
  });

  // Load site settings
  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      })
      .catch(console.error);
  }, []);

  // Fetch members with server-side filters, sorting, and pagination
  useEffect(() => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCity && selectedCity !== "All") params.set("city", selectedCity);
    if (selectedState && selectedState !== "All") params.set("state", selectedState);
    if (selectedProfession && selectedProfession !== "All") params.set("profession", selectedProfession);
    if (selectedOrganization && selectedOrganization !== "All") params.set("organization", selectedOrganization);
    if (selectedSort) params.set("sortBy", selectedSort);
    params.set("page", page.toString());
    params.set("limit", "12");

    fetch(`/api/members?${params.toString()}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load directory records");
        }
        return res.json();
      })
      .then((data) => {
        if (data?.members) {
          setMembers(data.members);
          setTotalResults(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
        if (data?.filterOptions) {
          setFilterOptions((prev) => ({
            cities: data.filterOptions.cities?.length ? data.filterOptions.cities : prev.cities,
            states: data.filterOptions.states?.length ? data.filterOptions.states : prev.states,
            professions: data.filterOptions.professions?.length ? data.filterOptions.professions : prev.professions,
            organizations: data.filterOptions.organizations?.length ? data.filterOptions.organizations : prev.organizations,
          }));
        }
      })
      .catch((err) => {
        console.error("Directory fetch error:", err);
        setError(err.message || "Failed to connect to the directory service.");
      })
      .finally(() => setLoading(false));
  }, [searchQuery, selectedCity, selectedState, selectedProfession, selectedOrganization, selectedSort, page]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCity("All");
    setSelectedState("All");
    setSelectedProfession("All");
    setSelectedOrganization("All");
    setSelectedSort("newest");
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        announcement={settings?.announcement}
      />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Page Banner */}
        <FadeIn direction="up" distance={14} duration={0.5}>
          <section className="bg-white rounded-lg p-5 sm:p-7 mb-5 border border-[#F0E5D5] shadow-xs">
            <div className="max-w-3xl">
              <span className="inline-block text-[11px] font-bold tracking-wider text-[#F26A21] uppercase bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5] mb-2">
                अखिल भारतीय समाज डायरेक्टरी
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] tracking-tight leading-tight">
                अखिल भारतीय समाज सदस्य डायरेक्टरी एवं पंजिका
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                देशभर के सभी सेवारत व सेवानिवृत्त अधिकारियों, कर्मचारियों, वरिष्ठजनों, चिकित्सकों, इंजीनियरों, अधिवक्ताओं एवं युवा प्रतिनिधियों की सत्यापित सूची।
              </p>
            </div>
          </section>
        </FadeIn>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 order-2 lg:order-1">
            {/* Filter Bar with city, state, profession, organization, sort, view toggle */}
            <FadeIn direction="up" distance={10} duration={0.4}>
              <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  setPage(1);
                }}
                selectedCity={selectedCity}
                onCityChange={(c) => {
                  setSelectedCity(c);
                  setPage(1);
                }}
                selectedState={selectedState}
                onStateChange={(s) => {
                  setSelectedState(s);
                  setPage(1);
                }}
                selectedProfession={selectedProfession}
                onProfessionChange={(p) => {
                  setSelectedProfession(p);
                  setPage(1);
                }}
                selectedOrganization={selectedOrganization}
                onOrganizationChange={(o) => {
                  setSelectedOrganization(o);
                  setPage(1);
                }}
                selectedSort={selectedSort}
                onSortChange={(s) => {
                  setSelectedSort(s);
                  setPage(1);
                }}
                cities={filterOptions.cities}
                states={filterOptions.states}
                professions={filterOptions.professions}
                organizations={filterOptions.organizations}
                totalResults={totalResults}
                onResetFilters={handleResetFilters}
              />
            </FadeIn>

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-5 text-xs flex items-center justify-between">
                <div>
                  <strong className="font-bold">डायरेक्टरी लोड करने में त्रुटि: </strong>
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => setPage(1)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 cursor-pointer"
                >
                  पुनः प्रयास करें ↺
                </button>
              </div>
            )}

            {/* Content Display: Loading / Traditional Table */}
            {loading ? (
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-16 text-center text-[#64748B] font-medium shadow-xs">
                <div className="w-8 h-8 border-3 border-[#102F6B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                सत्यापित समाज सदस्य रिकॉर्ड खोजे जा रहे हैं...
              </div>
            ) : (
              <MemberTable members={members} startIndex={(page - 1) * 12} />
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="btn-outline px-3.5 py-1.5 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  ← पिछला
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setPage(pageNum);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-7 h-7 rounded text-xs font-bold transition-colors cursor-pointer ${
                        page === pageNum
                          ? "bg-[#102F6B] text-white"
                          : "bg-white border border-[#F0E5D5] text-[#263449] hover:bg-[#FFF0E2]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page >= totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="btn-outline px-3.5 py-1.5 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  अगला →
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
              locations={filterOptions.cities.slice(0, 8)}
              selectedLocation={selectedCity}
              onSelectLocation={(loc) => {
                setSelectedCity(loc);
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
