"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { FadeIn, StaggerContainer, StaggerItem, SubtleHoverCard, InteractiveTap } from "@/components/MotionWrappers";

export default function MatrimonialPage() {
  const [profiles, setProfiles] = useState([]);
  const [genderFilter, setGenderFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matrimonial")
      .then((res) => res.json())
      .then((data) => {
        if (data?.profiles && Array.isArray(data.profiles)) {
          setProfiles(data.profiles);
        } else {
          setProfiles([]);
        }
      })
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = profiles.filter((p) => {
    if (genderFilter !== "All" && p.gender !== genderFilter) return false;
    if (cityFilter !== "All" && p.city !== cityFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            {/* Page Header */}
            <FadeIn direction="up" distance={14} duration={0.5}>
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                  Dignified Matchmaking
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                  Samaj Matrimonial &amp; Family Network
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                  Connecting verified community families across India with trust, tradition, and dignified matrimonial matches.
                </p>

                {/* Filter Controls */}
                <div className="mt-4 pt-4 border-t border-[#F0E5D5] flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#102F6B] mr-2">Looking for:</span>
                  {[
                    { key: "All", label: "All Profiles" },
                    { key: "Female", label: "Brides (Kanya)" },
                    { key: "Male", label: "Grooms (Var)" },
                  ].map((g) => (
                    <button
                      key={g.key}
                      onClick={() => setGenderFilter(g.key)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer border ${
                        genderFilter === g.key
                          ? "bg-[#102F6B] text-white border-[#102F6B]"
                          : "bg-white text-[#263449] border-[#F0E5D5] hover:bg-[#FFF0E2]"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Profiles Grid with Staggered Entrance */}
            <div className="space-y-3.5">
              {filtered.length === 0 ? (
                <div className="bg-white rounded-lg border border-[#F0E5D5] p-10 text-center shadow-xs text-xs text-[#64748B]">
                  No matrimonial profiles found in this category.
                </div>
              ) : (
                <StaggerContainer className="space-y-3.5" staggerDelay={0.06}>
                  {filtered.map((p) => (
                    <StaggerItem key={p._id}>
                      <SubtleHoverCard>
                        <div className="bg-white rounded-lg border border-[#F0E5D5] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#102F6B] transition-all">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F0E5D5]">
                            <div>
                              <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-[#102F6B]">{p.fullName}</h2>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFF0E2] text-[#F26A21] border border-[#F0E5D5]">
                                  {p.gender === "Male" ? "Groom" : "Bride"}
                                </span>
                              </div>
                              <p className="text-xs text-[#64748B] mt-0.5">
                                {p.dob} • Height: {p.height} • Gotra: {p.gotra}
                              </p>
                            </div>

                            <InteractiveTap>
                              <a
                                href="/contact"
                                className="btn-primary px-3.5 py-1.5 text-xs shadow-xs inline-block"
                              >
                                Express Interest →
                              </a>
                            </InteractiveTap>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs text-[#263449]">
                            <div>
                              <span className="text-[#64748B] block text-[11px]">Education:</span>
                              <strong className="text-[#102F6B]">{p.education}</strong>
                            </div>
                            <div>
                              <span className="text-[#64748B] block text-[11px]">Occupation &amp; Annual Income:</span>
                              <strong className="text-[#102F6B]">{p.occupation} {p.annualIncome && `(${p.annualIncome})`}</strong>
                            </div>
                            <div>
                              <span className="text-[#64748B] block text-[11px]">Current Location:</span>
                              <span className="font-medium">{p.city}, {p.state}</span>
                            </div>
                            <div>
                              <span className="text-[#64748B] block text-[11px]">Family Background:</span>
                              <span className="font-medium">{p.fatherName} • {p.familyCity}</span>
                            </div>
                          </div>
                        </div>
                      </SubtleHoverCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </div>

          <FadeIn as="div" direction="up" distance={14} duration={0.5} delay={0.1} className="lg:col-span-4">
            <Sidebar />
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
}
