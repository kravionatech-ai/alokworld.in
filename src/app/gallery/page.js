"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryCarousel from "@/components/GalleryCarousel";
import VideoModal from "@/components/VideoModal";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  SectionHeadingReveal,
  SubtleHoverCard,
} from "@/components/MotionWrappers";

function GalleryContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "all";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState(initialType); // "all" | "image" | "video"
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("type")) {
      setTypeFilter(searchParams.get("type"));
    }
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/gallery", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.items && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Compute available distinct categories
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Media Type Filter
      if (typeFilter === "image") {
        if (item.mediaType === "video") return false;
      } else if (typeFilter === "video") {
        if (item.mediaType !== "video") return false;
      }

      // 2. Category Filter
      if (categoryFilter !== "all" && item.category !== categoryFilter) {
        return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = [item.title, item.description, item.category].filter(Boolean).join(" ").toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [items, typeFilter, categoryFilter, searchQuery]);

  const videoCount = items.filter((i) => i.mediaType === "video").length;
  const imageCount = items.filter((i) => i.mediaType !== "video").length;

  const handleOpenVideo = (item) => {
    setActiveVideo(item);
    setIsVideoModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* Page Title & Intro */}
        <FadeIn direction="up" distance={14} duration={0.5}>
          <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
              छायाचित्र एवं वीडियो दीर्घा
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
              राष्ट्रीय महाधिवेशन, समाज गतिविधियां एवं वीडियो दीर्घा
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              अखिल भारतीय आलोक संघ राष्ट्रीय अधिवेशन, प्रतिभा सम्मान समारोह, आधिकारिक आमंत्रण पत्र, ऐतिहासिक वृत्तचित्र एवं प्रेरक वीडियो संग्रह।
            </p>
          </div>
        </FadeIn>

        {/* Top Swiper Carousel of Featured Items */}
        {loading ? (
          <div className="bg-white rounded-lg border border-[#F0E5D5] p-12 text-center text-[#64748B]">
            छायाचित्र एवं वीडियो दीर्घा लोड की जा रही है...
          </div>
        ) : (
          <FadeIn direction="up" distance={16} duration={0.55}>
            <GalleryCarousel items={items} onVideoClick={handleOpenVideo} />
          </FadeIn>
        )}

        {/* Media Type & Category Filter Toolbar */}
        <section aria-label="Media Filters" className="bg-white rounded-lg border border-[#F0E5D5] p-3 sm:p-4 shadow-xs space-y-3">
          {/* Row 1: Primary Media Type Tabs (All | Photos | Videos) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F3] rounded border border-[#E9E2D8] w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setTypeFilter("all")}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === "all"
                    ? "bg-[#102F6B] text-white shadow-xs"
                    : "text-[#55657E] hover:text-[#102F6B]"
                }`}
              >
                🌟 सभी मीडिया ({items.length})
              </button>

              <button
                type="button"
                onClick={() => setTypeFilter("image")}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === "image"
                    ? "bg-[#102F6B] text-white shadow-xs"
                    : "text-[#55657E] hover:text-[#102F6B]"
                }`}
              >
                📷 छायाचित्र ({imageCount})
              </button>

              <button
                type="button"
                onClick={() => setTypeFilter("video")}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  typeFilter === "video"
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-red-700 hover:bg-red-50"
                }`}
              >
                <span>🎥 वीडियो</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 rounded-full font-mono">
                  {videoCount}
                </span>
              </button>
            </div>

            {/* Search Input within Gallery */}
            <div className="w-full sm:w-64 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="शीर्षक या विवरण द्वारा खोजें..."
                className="w-full pl-3 pr-8 py-1.5 text-xs bg-[#FAF8F3] border border-[#D5CEC4] rounded focus:border-[#102F6B] outline-hidden text-[#1E293B]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8896AB] hover:text-[#1E293B]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-[#F0E5D5] text-xs">
              <span className="text-[11px] font-semibold text-[#8896AB] shrink-0">श्रेणी:</span>
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold shrink-0 transition-colors cursor-pointer ${
                  categoryFilter === "all"
                    ? "bg-[#F26A21] text-white"
                    : "bg-[#FAF8F3] text-[#55657E] hover:bg-[#F2EDE4]"
                }`}
              >
                सभी श्रेणियां
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold shrink-0 transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? "bg-[#F26A21] text-white"
                      : "bg-[#FAF8F3] text-[#55657E] hover:bg-[#F2EDE4]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Media Grid Overview */}
        <section aria-label="समस्त छायाचित्र एवं वीडियो" className="space-y-4">
          <SectionHeadingReveal className="flex items-center justify-between pb-2 border-b border-[#F0E5D5]">
            <h2 className="text-sm sm:text-base font-bold text-[#102F6B]">
              {typeFilter === "video" ? "🎥 वीडियो संग्रह" : typeFilter === "image" ? "📷 छायाचित्र संग्रह" : "समस्त छायाचित्र एवं वीडियो"}{" "}
              ({filteredItems.length} उपलब्ध)
            </h2>
            <span className="text-xs text-[#64748B]">
              विस्तृत देखने / प्ले करने हेतु किसी भी कार्ड पर क्लिक करें
            </span>
          </SectionHeadingReveal>

          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-lg border border-[#F0E5D5] p-12 text-center text-[#64748B] space-y-2">
              <div className="text-2xl">🔍</div>
              <div className="font-semibold text-[#102F6B]">कोई मीडिया रिकॉर्ड नहीं मिला</div>
              <p className="text-xs">कृपया अन्य फ़िल्टर या खोज शब्द का प्रयास करें।</p>
              <button
                type="button"
                onClick={() => {
                  setTypeFilter("all");
                  setCategoryFilter("all");
                  setSearchQuery("");
                }}
                className="mt-2 px-3 py-1 bg-[#102F6B] text-white text-xs font-semibold rounded cursor-pointer"
              >
                सभी फ़िल्टर रीसेट करें
              </button>
            </div>
          ) : (
            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
              staggerDelay={0.05}
            >
              {filteredItems.map((item) => {
                const isVideo = item.mediaType === "video";
                return (
                  <StaggerItem key={item._id} className="h-full">
                    <SubtleHoverCard className="h-full">
                      <div
                        onClick={() => {
                          if (isVideo) handleOpenVideo(item);
                        }}
                        className={`bg-white rounded-lg border border-[#F0E5D5] overflow-hidden shadow-xs hover:shadow-md hover:border-[#102F6B] transition-all group flex flex-col h-full ${
                          isVideo ? "cursor-pointer" : ""
                        }`}
                      >
                        {/* Media Thumbnail Container */}
                        <div className="h-60 sm:h-64 overflow-hidden bg-[#FFFCF5] relative p-1.5 flex items-center justify-center border-b border-[#F0E5D5]">
                          <img
                            src={item.imageUrl || (isVideo ? `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` : "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924154/alokworld/banners/web_sit_front1.png")}
                            alt={item.title || "Samaj Media Gallery"}
                            loading="lazy"
                            decoding="async"
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs rounded"
                          />

                          {/* Media Type Badge */}
                          <span
                            className={`absolute top-2.5 left-2.5 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 ${
                              isVideo ? "bg-red-600" : "bg-[#102F6B]/90"
                            }`}
                          >
                            <span>{isVideo ? "🎥 वीडियो" : "📷 फोटो"}</span>
                          </span>

                          {/* Category Badge */}
                          {item.category && (
                            <span className="absolute top-2.5 right-2.5 bg-white/95 text-[#102F6B] text-[10px] font-bold px-2 py-0.5 rounded border border-[#F0E5D5] shadow-xs">
                              {item.category}
                            </span>
                          )}

                          {/* Video Play Button Overlay */}
                          {isVideo && (
                            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <span className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl shadow-xl group-hover:scale-115 transition-transform">
                                ▶
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Caption Area */}
                        <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-[#8896AB] mb-1">
                              <span>{item.eventDate || "समुदाय संग्रह"}</span>
                              {isVideo && (
                                <span className="text-red-600 font-bold flex items-center gap-1">
                                  <span>YouTube</span>
                                  <span>↗</span>
                                </span>
                              )}
                            </div>

                            <h3 className="text-sm font-bold text-[#102F6B] line-clamp-2 group-hover:text-[#F26A21] transition-colors leading-snug">
                              {item.title}
                            </h3>

                            {item.description && (
                              <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {isVideo && (
                            <div className="pt-2 border-t border-[#F0E5D5] flex items-center justify-between">
                              <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                                <span>प्ले करें (Watch Video)</span>
                                <span>▶</span>
                              </span>
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
        </section>
      </main>

      {/* Video Modal Player */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        video={activeVideo}
      />

      <Footer />
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">दीर्घा लोड हो रही है...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
