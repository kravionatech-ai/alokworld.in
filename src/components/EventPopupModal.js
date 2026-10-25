"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function EventPopupModal({ isOpen, onClose, eventSettings }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
    mounted: false,
  });

  const [dontShowAgain, setDontShowAgain] = useState(false);

  const eventDate = eventSettings?.eventDate || "2026-11-02T10:00:00";
  const eventTitle = eventSettings?.eventTitle || "आलोक राष्ट्रीय महासम्मेलन एवं भव्य पोर्टल लोकार्पण — 2026";
  const eventSubtitle = eventSettings?.eventSubtitle || "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ का ऐतिहासिक राष्ट्रीय सम्मेलन";
  const eventLocation = eventSettings?.eventLocation || "कांस्टीट्यूशन क्लब, रफी मार्ग, नई दिल्ली";
  const countdownLabel = eventSettings?.eventCountdownLabel || "वेबसाइट लाइव एवं महासम्मेलन उल्टी गिनती";
  const eventDescription =
    eventSettings?.eventDescription ||
    "2 नवम्बर 2026 को समाज के गौरवशाली राष्ट्रीय महासम्मेलन, प्रतिभावान छात्र-छात्रा सम्मान एवं आलोक डिजिटल पोर्टल का भव्य राष्ट्रव्यापी लोकार्पण। देशभर के गणमान्य बंधु सादर आमंत्रित हैं।";
  const eventImage =
    eventSettings?.eventImage ||
    "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924149/alokworld/posters/poster1.jpg";
  const ctaText = eventSettings?.eventCtaText || "अधिवेशन विवरण एवं पंजीकरण →";
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

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dontShowAgain]);

  const handleClose = () => {
    if (dontShowAgain && typeof window !== "undefined") {
      // Dismiss for 24 hours
      localStorage.setItem("alok_event_popup_dismissed_until", String(Date.now() + 24 * 60 * 60 * 1000));
    }
    onClose();
  };

  const padZero = (n) => String(n).padStart(2, "0");

  // Format date display (e.g. 2 नवम्बर 2026)
  let formattedDateDisplay = "2 नवम्बर 2026";
  try {
    const d = new Date(eventDate);
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const monthNamesHi = [
        "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
        "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"
      ];
      formattedDateDisplay = `${day} ${monthNamesHi[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch (e) {
    formattedDateDisplay = "2 नवम्बर 2026";
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-[#F26A21]/30 overflow-hidden z-10 my-auto text-[#1E293B]"
          >
            {/* Header Strip with saffron accent */}
            <div className="bg-gradient-to-r from-[#091D42] via-[#102F6B] to-[#091D42] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b-2 border-[#F26A21]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F26A21] animate-ping" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FEE8D6]">
                  {eventSettings?.eventBadge || "विशेष आगामी कार्यक्रम"}
                </span>
                <span className="text-white/40">|</span>
                <span className="text-[11px] sm:text-xs text-amber-300 font-semibold font-mono">
                  {formattedDateDisplay}
                </span>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-sm font-bold"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto">
              {/* Event Title & Subtitle */}
              <div className="text-center space-y-1">
                <h2 className="text-lg sm:text-xl font-black text-[#102F6B] leading-snug">
                  {eventTitle}
                </h2>
                {eventSubtitle && (
                  <p className="text-xs sm:text-sm text-[#55657E] font-medium max-w-lg mx-auto">
                    {eventSubtitle}
                  </p>
                )}
              </div>

              {/* Poster & Details Split Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#FAF8F3] p-3 sm:p-4 rounded-lg border border-[#EFECE6]">
                {/* Poster Thumbnail */}
                {eventImage && (
                  <div className="md:col-span-5 flex justify-center">
                    <div className="w-full max-w-[220px] rounded-md overflow-hidden shadow-md border-2 border-white group relative">
                      <img
                        src={eventImage}
                        alt={eventTitle}
                        className="w-full h-auto object-cover max-h-[260px]"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                        आधिकारिक आमंत्रण
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Highlights & Meta */}
                <div className={`${eventImage ? "md:col-span-7" : "md:col-span-12"} space-y-3`}>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-base text-[#F26A21]">📅</span>
                      <div>
                        <div className="font-bold text-[#102F6B]">कार्यक्रम दिनांक व समय:</div>
                        <div className="text-[#55657E]">
                          {formattedDateDisplay} (समय: प्रातः 10:00 बजे से सायं 4:00 बजे तक)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-base text-[#F26A21]">📍</span>
                      <div>
                        <div className="font-bold text-[#102F6B]">कार्यक्रम स्थल (Venue):</div>
                        <div className="text-[#55657E]">{eventLocation}</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed border-t border-[#E2DDD5] pt-2">
                    {eventDescription}
                  </p>
                </div>
              </div>

              {/* Big Live Countdown Timer Box */}
              <div className="bg-gradient-to-br from-[#091D42] to-[#163A70] rounded-lg p-3 sm:p-4 text-white text-center shadow-md">
                <div className="text-[11px] uppercase tracking-wider text-amber-300 font-bold mb-2 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>{countdownLabel}</span>
                </div>

                {timeLeft.mounted ? (
                  timeLeft.isLive ? (
                    <div className="py-2 text-base sm:text-lg font-bold text-emerald-300 animate-pulse">
                      🔴 कार्यक्रम का शुभारंभ हो चुका है / पोर्टल लाइव है!
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
                      <div className="bg-white/10 backdrop-blur-xs rounded p-2 border border-white/15">
                        <div className="text-xl sm:text-2xl font-black font-mono text-white">
                          {padZero(timeLeft.days)}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-[#CBD5E1] mt-0.5">
                          दिन
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-xs rounded p-2 border border-white/15">
                        <div className="text-xl sm:text-2xl font-black font-mono text-white">
                          {padZero(timeLeft.hours)}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-[#CBD5E1] mt-0.5">
                          घंटे
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-xs rounded p-2 border border-white/15">
                        <div className="text-xl sm:text-2xl font-black font-mono text-white">
                          {padZero(timeLeft.minutes)}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-[#CBD5E1] mt-0.5">
                          मिनट
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-[#F26A21] to-[#D9531E] rounded p-2 shadow-inner">
                        <div className="text-xl sm:text-2xl font-black font-mono text-white">
                          {padZero(timeLeft.seconds)}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-amber-100 mt-0.5">
                          सेकंड
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-xs text-slate-300 py-2">उल्टी गिनती की गणना की जा रही है...</div>
                )}
              </div>

              {/* Action Buttons & Footer Checkbox */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Link
                    href={ctaLink}
                    onClick={handleClose}
                    className="w-full sm:flex-1 py-2.5 px-4 bg-[#F26A21] hover:bg-[#D9531E] text-white font-bold text-center text-xs rounded transition-colors shadow-sm"
                  >
                    {ctaText}
                  </Link>

                  <Link
                    href="/directory"
                    onClick={handleClose}
                    className="w-full sm:w-auto py-2.5 px-4 bg-[#102F6B] hover:bg-[#091D42] text-white font-semibold text-center text-xs rounded transition-colors"
                  >
                    सदस्य डायरेक्टरी खोजें →
                  </Link>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#EFECE6]">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#1E293B]">
                    <input
                      type="checkbox"
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[#CBD5E1] cursor-pointer"
                    />
                    <span>आज दोबारा यह पॉपअप न दिखाएं</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="hover:underline text-[#102F6B] font-semibold cursor-pointer"
                  >
                    पृष्ठ पर आगे बढ़ें ✕
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
