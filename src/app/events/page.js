"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { FadeIn, StaggerContainer, StaggerItem, SubtleHoverCard } from "@/components/MotionWrappers";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("upcoming"); // 'upcoming', 'past', 'all'
  const [loading, setLoading] = useState(true);
  const [nowTime, setNowTime] = useState(0);

  useEffect(() => {
    setNowTime(Date.now());
    fetch("/api/events", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.events) {
          setEvents(data.events);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Helper to determine if an event is past
  const isPastEvent = (evt) => {
    if (!evt.date || !nowTime) return false;
    try {
      const d = new Date(evt.date).getTime();
      return !isNaN(d) && d < nowTime;
    } catch {
      return false;
    }
  };

  const filteredEvents = events.filter((e) => {
    // Only display active events on public frontend
    if (e.isActive === false) return false;
    const past = isPastEvent(e);
    if (filter === "upcoming") return !past;
    if (filter === "past") return past;
    return true;
  });

  const featuredEvent = events.find((e) => e.isFeatured && e.isActive !== false) || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            {/* Page Header */}
            <FadeIn direction="up" distance={14} duration={0.5}>
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                    अखिल भारतीय आयोजन
                  </span>
                  <span className="text-xs text-[#64748B]">
                    {events.filter((e) => e.isActive !== false).length} सक्रिय कार्यक्रम
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                  समाज कार्यक्रम, महासम्मेलन एवं बैठकें
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                  अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) एवं प्रांतीय इकाइयों द्वारा आयोजित राष्ट्रीय सम्मेलनों, प्रतिभा सम्मान व बैठकों का प्रामाणिक विवरण।
                </p>
              </div>
            </FadeIn>

            {/* Featured Highlight Banner (if any) */}
            {featuredEvent && (
              <FadeIn direction="up" distance={12} duration={0.45}>
                <div className="bg-gradient-to-r from-[#0D2552] via-[#102F6B] to-[#1C3D7A] rounded-lg p-5 sm:p-6 text-white shadow-md border-2 border-[#F26A21]/60 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/15 pb-2.5">
                    <span className="bg-[#F26A21] text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      🌟 मुख्य / लाइव कार्यक्रम
                    </span>
                    <span className="text-xs font-mono text-amber-200">
                      {featuredEvent.date
                        ? new Date(featuredEvent.date).toLocaleDateString("hi-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "शीघ्र घोषित"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {featuredEvent.image && (
                      <div className="w-full sm:w-40 sm:h-48 shrink-0 rounded-md overflow-hidden bg-black/30 border border-white/20">
                        <img
                          src={featuredEvent.image}
                          alt={featuredEvent.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <span className="inline-block bg-white/10 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                        {featuredEvent.badge || "राष्ट्रीय महाधिवेशन"}
                      </span>
                      <h2 className="text-base sm:text-lg md:text-xl font-black text-white leading-snug">
                        {featuredEvent.title}
                      </h2>
                      {featuredEvent.subtitle && (
                        <p className="text-xs text-slate-200 font-medium">
                          {featuredEvent.subtitle}
                        </p>
                      )}
                      {featuredEvent.location && (
                        <div className="text-xs text-amber-300 flex items-center justify-center sm:justify-start gap-1">
                          <span>📍</span>
                          <span>{featuredEvent.location}</span>
                        </div>
                      )}
                      {featuredEvent.description && (
                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                          {featuredEvent.description}
                        </p>
                      )}
                      {featuredEvent.ctaText && featuredEvent.ctaLink && (
                        <div className="pt-2">
                          <Link
                            href={featuredEvent.ctaLink}
                            className="inline-block bg-[#F26A21] hover:bg-[#d85813] text-white text-xs font-bold px-4 py-2 rounded-xs transition-colors shadow-xs"
                          >
                            {featuredEvent.ctaText}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center justify-between border-b border-[#E9E2D8] pb-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFilter("upcoming")}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    filter === "upcoming"
                      ? "bg-[#102F6B] text-white shadow-xs"
                      : "bg-white text-[#64748B] hover:bg-[#FFF0E2] hover:text-[#102F6B] border border-[#E9E2D8]"
                  }`}
                >
                  📅 आगामी कार्यक्रम ({events.filter((e) => e.isActive !== false && !isPastEvent(e)).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("past")}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    filter === "past"
                      ? "bg-[#102F6B] text-white shadow-xs"
                      : "bg-white text-[#64748B] hover:bg-[#FFF0E2] hover:text-[#102F6B] border border-[#E9E2D8]"
                  }`}
                >
                  🏛️ पूर्व कार्यक्रम ({events.filter((e) => e.isActive !== false && isPastEvent(e)).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    filter === "all"
                      ? "bg-[#102F6B] text-white shadow-xs"
                      : "bg-white text-[#64748B] hover:bg-[#FFF0E2] hover:text-[#102F6B] border border-[#E9E2D8]"
                  }`}
                >
                  सभी ({events.filter((e) => e.isActive !== false).length})
                </button>
              </div>
            </div>

            {/* Events List */}
            {loading ? (
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-12 text-center text-[#64748B]">
                <div className="w-8 h-8 border-3 border-[#102F6B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-medium">कार्यक्रम लोड हो रहे हैं...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-10 text-center space-y-2">
                <span className="text-3xl block">⏳</span>
                <h3 className="text-sm font-bold text-[#102F6B]">
                  {filter === "upcoming"
                    ? "वर्तमान में कोई आगामी कार्यक्रम निर्धारित नहीं है"
                    : filter === "past"
                    ? "कोई पूर्व कार्यक्रम रिकॉर्ड में नहीं है"
                    : "कोई कार्यक्रम उपलब्ध नहीं है"}
                </h3>
                <p className="text-xs text-[#64748B] max-w-md mx-auto">
                  आगामी आयोजनों एवं सम्मेलनों की तिथियां केंद्रीय राष्ट्रीय सचिवालय द्वारा शीघ्र ही घोषित की जाएंगी।
                </p>
                <div className="pt-2">
                  <Link
                    href="/directory"
                    className="inline-block px-4 py-2 bg-[#102F6B] text-white text-xs font-bold rounded-xs hover:bg-[#0D1B2A] transition-colors"
                  >
                    समाज डायरेक्टरी देखें →
                  </Link>
                </div>
              </div>
            ) : (
              <StaggerContainer className="space-y-4" staggerDelay={0.06}>
                {filteredEvents.map((evt) => {
                  const past = isPastEvent(evt);
                  let formattedDate = evt.date;
                  try {
                    const d = new Date(evt.date);
                    if (!isNaN(d.getTime())) {
                      formattedDate = d.toLocaleString("hi-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    }
                  } catch {}

                  return (
                    <StaggerItem key={evt.id}>
                      <SubtleHoverCard>
                        <div className="bg-white rounded-lg border border-[#F0E5D5] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-start">
                          {evt.image ? (
                            <div className="w-full sm:w-36 sm:h-36 shrink-0 rounded-md overflow-hidden bg-slate-100 border border-[#E9E2D8]">
                              <img
                                src={evt.image}
                                alt={evt.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-full sm:w-28 sm:h-28 shrink-0 rounded-md bg-[#FFF0E2] border border-[#F0E5D5] flex flex-col items-center justify-center text-[#F26A21]">
                              <span className="text-2xl">📅</span>
                              <span className="text-[10px] font-bold uppercase mt-1">कार्यक्रम</span>
                            </div>
                          )}

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {evt.badge && (
                                <span className="text-[10px] font-bold uppercase bg-[#FFF0E2] text-[#F26A21] px-2 py-0.5 rounded border border-[#F0E5D5]">
                                  {evt.badge}
                                </span>
                              )}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  past
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {past ? "सम्पन्न (Past)" : "आगामी (Upcoming)"}
                              </span>
                              {evt.isFeatured && (
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                  ⭐ मुख्य कार्यक्रम
                                </span>
                              )}
                            </div>

                            <h2 className="text-sm sm:text-base font-bold text-[#102F6B]">
                              {evt.title}
                            </h2>

                            {evt.subtitle && (
                              <p className="text-xs text-[#55657E] font-medium">
                                {evt.subtitle}
                              </p>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#64748B] pt-1">
                              {formattedDate && (
                                <div className="flex items-center gap-1.5">
                                  <span>📅</span>
                                  <span>{formattedDate}</span>
                                </div>
                              )}
                              {evt.location && (
                                <div className="flex items-center gap-1.5">
                                  <span>📍</span>
                                  <span>{evt.location}</span>
                                </div>
                              )}
                            </div>

                            {evt.description && (
                              <p className="text-xs text-[#263449] leading-relaxed pt-1">
                                {evt.description}
                              </p>
                            )}

                            {evt.ctaText && evt.ctaLink && (
                              <div className="pt-2">
                                <Link
                                  href={evt.ctaLink}
                                  className="inline-block text-xs font-bold text-[#F26A21] hover:text-[#102F6B] hover:underline"
                                >
                                  {evt.ctaText} →
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </SubtleHoverCard>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            )}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
