"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TopEventCountdownBar({ eventSettings, onOpenModal }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
    mounted: false,
  });

  const eventDate = eventSettings?.eventDate || "2026-11-02T10:00:00";
  const eventTitle = eventSettings?.eventTitle || "आलोक राष्ट्रीय महासम्मेलन एवं भव्य पोर्टल लोकार्पण — 2026";
  const countdownLabel = eventSettings?.eventCountdownLabel || "वेबसाइट लाइव एवं महासम्मेलन उल्टी गिनती";
  const ctaText = eventSettings?.eventCtaText || "विवरण एवं पंजीकरण →";
  const ctaLink = eventSettings?.eventCtaLink || "/mahasabha";

  useEffect(() => {
    function calculateTime() {
      const targetTime = new Date(eventDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isLive: true,
          mounted: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isLive: false,
        mounted: true,
      });
    }

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  if (!eventSettings || eventSettings.eventEnabled === false || eventSettings.eventTopBarEnabled === false) {
    return null;
  }

  const padZero = (n) => String(n).padStart(2, "0");

  return (
    <aside
      aria-label="Upcoming Event and Live Countdown"
      className="w-full bg-gradient-to-r from-[#0B1E40] via-[#102F6B] to-[#0B1E40] text-white border-b border-[#F26A21]/40 text-xs py-1.5 px-3 sm:px-4 relative z-40 shadow-xs"
    >
      <div className="max-w-[1150px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Badge + Event Title + Click to open popup */}
        <div className="flex items-center gap-2 text-center md:text-left flex-wrap justify-center md:justify-start">
          <span className="inline-flex items-center gap-1.5 bg-[#F26A21] text-white px-2 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide uppercase shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {eventSettings?.eventBadge || "लाइव उल्टी गिनती"}
          </span>

          <button
            type="button"
            onClick={onOpenModal}
            className="text-[11.5px] sm:text-xs font-semibold text-[#FEE8D6] hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1 group"
            title="इवेंट पोस्टर एवं विस्तृत विवरण देखने के लिए क्लिक करें"
          >
            <span className="line-clamp-1">{eventTitle}</span>
            <span className="text-[#F26A21] text-xs group-hover:translate-x-0.5 transition-transform">
              (पॉपअप खोलें ↗)
            </span>
          </button>
        </div>

        {/* Right: Countdown Digits + CTA Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {timeLeft.mounted ? (
            timeLeft.isLive ? (
              <span className="px-2.5 py-0.5 bg-emerald-600/90 text-white font-bold rounded-xs text-[11px] animate-pulse">
                🔴 कार्यक्रम लाइव / संपन्न
              </span>
            ) : (
              <div
                onClick={onOpenModal}
                className="flex items-center gap-1 sm:gap-1.5 font-mono cursor-pointer bg-black/25 px-2 py-0.5 rounded border border-white/10 hover:border-[#F26A21]/50 transition-colors"
                title={`${countdownLabel} — क्लिक करके विवरण देखें`}
              >
                <div className="flex flex-col items-center">
                  <span className="bg-[#1C3D7A] text-white font-bold px-1.5 py-0.2 rounded text-[11px]">
                    {padZero(timeLeft.days)}
                  </span>
                  <span className="text-[8.5px] text-[#CBD5E1] uppercase tracking-tighter">दिन</span>
                </div>
                <span className="text-[#F26A21] font-bold pb-2">:</span>

                <div className="flex flex-col items-center">
                  <span className="bg-[#1C3D7A] text-white font-bold px-1.5 py-0.2 rounded text-[11px]">
                    {padZero(timeLeft.hours)}
                  </span>
                  <span className="text-[8.5px] text-[#CBD5E1] uppercase tracking-tighter">घंटे</span>
                </div>
                <span className="text-[#F26A21] font-bold pb-2">:</span>

                <div className="flex flex-col items-center">
                  <span className="bg-[#1C3D7A] text-white font-bold px-1.5 py-0.2 rounded text-[11px]">
                    {padZero(timeLeft.minutes)}
                  </span>
                  <span className="text-[8.5px] text-[#CBD5E1] uppercase tracking-tighter">मिनट</span>
                </div>
                <span className="text-[#F26A21] font-bold pb-2">:</span>

                <div className="flex flex-col items-center">
                  <span className="bg-[#F26A21] text-white font-bold px-1.5 py-0.2 rounded text-[11px]">
                    {padZero(timeLeft.seconds)}
                  </span>
                  <span className="text-[8.5px] text-[#CBD5E1] uppercase tracking-tighter">सेकंड</span>
                </div>
              </div>
            )
          ) : (
            <div className="text-[11px] text-slate-300">उल्टी गिनती लोड हो रही है...</div>
          )}

          {/* Action Button: Opens Details or links to CTA */}
          <button
            type="button"
            onClick={onOpenModal}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-[#F26A21] hover:bg-[#D9531E] text-white font-bold rounded-xs transition-colors text-[11px] cursor-pointer shadow-xs"
          >
            <span>इवेंट पोस्टर</span>
            <span>↗</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
