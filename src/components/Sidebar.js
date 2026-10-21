"use client";

import Link from "next/link";

export default function Sidebar({
  noticeTitle,
  noticeContent,
  adTitle,
  adBannerText,
  adLink,
  locations = ["Bhopal", "Jaipur", "Bengaluru", "Lucknow", "Indore", "Delhi NCR", "Mumbai", "Jabalpur"],
  selectedLocation = "All",
  onSelectLocation,
}) {
  return (
    <aside className="space-y-4">
      {/* Box 1: Samaj Notice & Message */}
      <div className="bg-white rounded-lg border border-[#F0E5D5] p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2.5 pb-2.5 border-b border-[#F0E5D5] text-[#102F6B] font-bold text-sm">
          <span className="text-[#F26A21]">📢</span>
          <h3 className="border-l-3 border-[#F26A21] pl-2">
            {noticeTitle && !/[\u0900-\u097F]/.test(noticeTitle)
              ? noticeTitle
              : "Community Announcements & Notices"}
          </h3>
        </div>
        <div className="p-3 bg-[#FFFCF5] rounded border border-[#F0E5D5] text-xs text-[#263449] leading-relaxed">
          {noticeContent && !/[\u0900-\u097F]/.test(noticeContent)
            ? noticeContent
            : "All community members are requested to keep their family and professional information up to date in the directory."}
        </div>
      </div>

      {/* Box 2: Quick Filter By Region / State */}
      <div className="bg-white rounded-lg border border-[#F0E5D5] p-4 sm:p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#102F6B] mb-3 pb-2 border-b border-[#F0E5D5] flex items-center justify-between">
          <span>Key Regions</span>
          <span className="w-2 h-2 rounded-full bg-[#F26A21]"></span>
        </h3>
        <div className="flex flex-col gap-1 text-xs">
          {onSelectLocation ? (
            <>
              <button
                onClick={() => onSelectLocation("All")}
                className={`text-left px-3 py-2 rounded font-medium transition-colors cursor-pointer ${
                  selectedLocation === "All"
                    ? "bg-[#102F6B] text-white font-bold border-l-4 border-[#F26A21]"
                    : "text-[#263449] hover:bg-[#FFF0E2]"
                }`}
              >
                All Regions
              </button>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => onSelectLocation(loc)}
                  className={`text-left px-3 py-2 rounded font-medium transition-colors cursor-pointer ${
                    selectedLocation === loc
                      ? "bg-[#102F6B] text-white font-bold border-l-4 border-[#F26A21]"
                      : "text-[#263449] hover:bg-[#FFF0E2]"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </>
          ) : (
            <>
              <Link
                href="/directory"
                className="text-left px-3 py-2 rounded font-medium text-[#263449] hover:bg-[#FFF0E2]"
              >
                All Regions
              </Link>
              {locations.map((loc) => (
                <Link
                  key={loc}
                  href={`/directory?city=${encodeURIComponent(loc)}`}
                  className="text-left px-3 py-2 rounded font-medium text-[#263449] hover:bg-[#FFF0E2]"
                >
                  {loc}
                </Link>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Box 3: Community Business Spotlight / Advertisement */}
      <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 shadow-xs text-center space-y-3">
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
          COMMUNITY SPOTLIGHT
        </span>
        <h4 className="font-bold text-sm text-[#102F6B]">
          {adTitle && !/[\u0900-\u097F]/.test(adTitle) ? adTitle : "Community Business Directory"}
        </h4>
        <p className="text-xs text-[#64748B] leading-relaxed">
          {adBannerText || "Promote your enterprise across our national community network."}
        </p>
        <Link
          href={adLink || "/contact"}
          className="btn-primary w-full py-2 text-xs shadow-xs"
        >
          Connect &amp; Promote →
        </Link>
      </div>
    </aside>
  );
}
