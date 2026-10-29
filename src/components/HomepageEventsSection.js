"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FadeIn, SubtleHoverCard } from "@/components/MotionWrappers";

export default function HomepageEventsSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (data?.events) {
          // Filter only active events
          const activeOnes = data.events.filter((e) => e.isActive !== false);
          setEvents(activeOnes);
        }
      })
      .catch(() => {});
  }, []);

  if (!events || events.length === 0) {
    return null;
  }

  // Display top 2 active events (or 1 featured)
  const displayEvents = events.slice(0, 2);

  return (
    <FadeIn direction="up" distance={12} duration={0.45}>
      <section
        aria-label="समाज कार्यक्रम एवं सम्मेलन"
        className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0E5D5] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block text-[10px] font-bold tracking-wider text-[#F26A21] uppercase bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5]">
                आगामी आयोजन
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#102F6B]">
                समाज कार्यक्रम एवं महासम्मेलन
              </h2>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ के आधिकारिक राष्ट्रीय सम्मेलनों एवं बैठकों की जानकारी।
            </p>
          </div>

          <Link
            href="/events"
            className="text-xs font-bold text-[#F26A21] hover:text-[#102F6B] underline transition-colors self-start sm:self-auto"
          >
            सभी कार्यक्रम देखें ({events.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayEvents.map((evt) => {
            let formattedDate = evt.date;
            try {
              const d = new Date(evt.date);
              if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleDateString("hi-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
              }
            } catch {}

            return (
              <SubtleHoverCard key={evt.id} className="h-full">
                <div className="h-full bg-[#FAF8F5] rounded-md border border-[#F0E5D5] p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3">
                    {evt.image ? (
                      <div className="w-16 h-20 shrink-0 rounded overflow-hidden bg-slate-200 border border-[#E9E2D8]">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-16 shrink-0 rounded bg-[#FFF0E2] border border-[#F0E5D5] flex items-center justify-center text-[#F26A21] text-xl">
                        📅
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {evt.badge && (
                          <span className="text-[10px] font-bold uppercase bg-[#102F6B] text-white px-1.5 py-0.2 rounded">
                            {evt.badge}
                          </span>
                        )}
                        {evt.isFeatured && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                            ⭐ मुख्य
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#102F6B] line-clamp-2 leading-snug">
                        {evt.title}
                      </h3>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
                        {formattedDate && <span>📅 {formattedDate}</span>}
                        {evt.location && <span>📍 {evt.location}</span>}
                      </div>
                    </div>
                  </div>

                  {evt.description && (
                    <p className="text-[11.5px] text-[#55657E] line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  )}

                  <div className="pt-1 flex items-center justify-between border-t border-[#F0E5D5]">
                    <Link
                      href="/events"
                      className="text-xs font-bold text-[#F26A21] hover:underline"
                    >
                      {evt.ctaText || "विवरण देखें"} →
                    </Link>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                      सक्रिय कार्यक्रम
                    </span>
                  </div>
                </div>
              </SubtleHoverCard>
            );
          })}
        </div>
      </section>
    </FadeIn>
  );
}
