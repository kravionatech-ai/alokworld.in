"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

export default function VideoModal({ isOpen, onClose, video }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!video) return null;

  const embedUrl = video.videoId ? getYouTubeEmbedUrl(video.videoId, { autoplay: true }) : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-[#091D42] text-white rounded-lg shadow-2xl overflow-hidden border border-[#F26A21]/40 z-10 my-auto"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#0F2952] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {video.category || "यूट्यूब वीडियो"}
                </span>
                {video.eventDate && (
                  <span className="text-xs text-[#CBD5E1]">| {video.eventDate}</span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-sm font-bold"
                aria-label="Close video"
              >
                ✕
              </button>
            </div>

            {/* Video Player 16:9 Aspect Ratio */}
            <div className="relative w-full pb-[56.25%] bg-black">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={video.title || "Community Video"}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                  वीडियो लोड करने में असमर्थ। कृपया मान्य यूट्यूब लिंक जांचें।
                </div>
              )}
            </div>

            {/* Video Metadata / Caption */}
            <div className="p-4 sm:p-5 space-y-2 bg-[#091D42]">
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  {video.description}
                </p>
              )}
              {video.videoUrl && (
                <div className="pt-2 flex items-center justify-between text-[11px] text-[#94A3B8] border-t border-white/10">
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F26A21] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>यूट्यूब पर देखें (Open on YouTube)</span>
                    <span>↗</span>
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="hover:text-white underline cursor-pointer"
                  >
                    बंद करें ✕
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
