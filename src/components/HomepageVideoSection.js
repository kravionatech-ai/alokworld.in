"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FadeIn, SectionHeadingReveal } from "@/components/MotionWrappers";
import VideoModal from "@/components/VideoModal";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

export default function HomepageVideoSection({ initialVideos = [] }) {
  const [videos, setVideos] = useState(initialVideos);
  const [activeVideo, setActiveVideo] = useState(null);
  const [modalVideo, setModalVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialVideos.length > 0) {
      setVideos(initialVideos);
      setActiveVideo(initialVideos[0]);
    } else {
      fetch("/api/gallery?type=video")
        .then((r) => r.json())
        .then((d) => {
          if (d?.items && d.items.length > 0) {
            setVideos(d.items);
            setActiveVideo(d.items[0]);
          }
        })
        .catch(console.error);
    }
  }, [initialVideos]);

  if (!videos || videos.length === 0) {
    return null;
  }

  const currentVideo = activeVideo || videos[0];

  const handleOpenModal = (vid) => {
    setModalVideo(vid);
    setIsModalOpen(true);
  };

  return (
    <section aria-label="Community Videos and Live Broadcasts" className="space-y-4">
      <SectionHeadingReveal className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-[#F0E5D5]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded border border-red-200">
              वीडियो एवं प्रसारण
            </span>
          </div>
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#102F6B] mt-1">
            सामुदायिक वीडियो, अधिवेशन उद्बोधन एवं वृत्तचित्र
          </h2>
        </div>
        <Link
          href="/gallery?type=video"
          className="text-xs font-bold text-[#F26A21] hover:text-[#091D42] underline flex items-center gap-1 shrink-0"
        >
          <span>सभी वीडियो देखें ({videos.length})</span>
          <span>→</span>
        </Link>
      </SectionHeadingReveal>

      {/* Main Video Section: Split Player + Playlist */}
      <FadeIn direction="up" distance={12} duration={0.45}>
        <div className="bg-white rounded-lg border border-[#F0E5D5] shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Active Video Player Column (8 cols on lg) */}
          <div className="lg:col-span-8 bg-[#091D42] text-white flex flex-col justify-between">
            <div className="relative w-full pb-[56.25%] bg-black">
              {currentVideo?.videoId ? (
                <iframe
                  src={getYouTubeEmbedUrl(currentVideo.videoId, { autoplay: false })}
                  title={currentVideo.title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div
                  onClick={() => handleOpenModal(currentVideo)}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                >
                  <img
                    src={currentVideo?.imageUrl || "/asset/alokadhivationposter2026/poster1.jpeg"}
                    alt={currentVideo?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform">
                      ▶
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Video Caption & Controls */}
            <div className="p-4 sm:p-5 space-y-2 border-t border-white/10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F26A21] text-white">
                  {currentVideo?.category || "वीडियो"}
                </span>
                {currentVideo?.eventDate && (
                  <span className="text-xs text-[#CBD5E1] font-mono">
                    {currentVideo.eventDate}
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                {currentVideo?.title}
              </h3>

              {currentVideo?.description && (
                <p className="text-xs text-[#CBD5E1] line-clamp-2 leading-relaxed">
                  {currentVideo.description}
                </p>
              )}
            </div>
          </div>

          {/* Playlist / Side Thumbnails Column (4 cols on lg) */}
          <div className="lg:col-span-4 bg-[#FAF8F3] border-t lg:border-t-0 lg:border-l border-[#F0E5D5] flex flex-col justify-between">
            <div className="p-3 bg-[#FAF8F3] border-b border-[#E2DDD5] text-xs font-bold text-[#102F6B] flex items-center justify-between">
              <span>अन्य वीडियो सूची ({videos.length})</span>
              <span className="text-[10px] text-[#F26A21] font-semibold">यूट्यूब संग्रह</span>
            </div>

            <div className="divide-y divide-[#EFECE6] max-h-[380px] overflow-y-auto">
              {videos.map((vid, idx) => {
                const isSelected = currentVideo?._id === vid._id;
                return (
                  <div
                    key={vid._id || idx}
                    onClick={() => setActiveVideo(vid)}
                    className={`p-3 flex items-start gap-2.5 transition-colors cursor-pointer group ${
                      isSelected
                        ? "bg-[#FFF0E2] border-l-3 border-[#F26A21]"
                        : "hover:bg-white border-l-3 border-transparent"
                    }`}
                  >
                    <div className="relative w-20 h-14 shrink-0 rounded overflow-hidden bg-black/80">
                      <img
                        src={vid.imageUrl || "https://img.youtube.com/vi/" + vid.videoId + "/hqdefault.jpg"}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <span className="w-5 h-5 rounded-full bg-red-600/90 text-white flex items-center justify-center text-[9px] shadow-sm">
                          ▶
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold line-clamp-2 leading-tight ${
                          isSelected ? "text-[#102F6B] font-bold" : "text-[#263449] group-hover:text-[#F26A21]"
                        }`}
                      >
                        {vid.title}
                      </p>
                      <span className="text-[10px] text-[#64748B] block mt-1">
                        {vid.category || "वीडियो"} {vid.eventDate ? `• ${vid.eventDate}` : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-2.5 bg-white border-t border-[#E2DDD5] text-center">
              <Link
                href="/gallery?type=video"
                className="text-xs font-bold text-[#F26A21] hover:underline"
              >
                दीर्घा में सभी वीडियो खोलें →
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Video Lightbox Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        video={modalVideo}
      />
    </section>
  );
}
