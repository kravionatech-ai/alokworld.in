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
      <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2.5 pb-2.5 border-b border-[#F3D8B0] text-[#082F75] font-bold text-sm">
          <span className="text-[#F4510B]">📢</span>
          <h3 className="border-l-2 border-[#F4510B] pl-2">{noticeTitle || "समाज संदेश एवं सूचनाएं"}</h3>
        </div>
        <div className="p-3 bg-[#FFE6C7]/30 rounded border border-[#F3D8B0] text-xs text-[#172B4D] leading-relaxed">
          {noticeContent ||
            "सभी समाज बंधुओं से अनुरोध है कि वे अपने परिवार व कार्यक्षेत्र की जानकारी अद्यतन करें।"}
        </div>
      </div>

      {/* Box 2: Quick Filter By Region / State */}
      <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-4 sm:p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#082F75] mb-3 pb-2 border-b border-[#F3D8B0] flex items-center justify-between">
          <span>प्रमुख क्षेत्र / Key Regions</span>
          <span className="w-2 h-2 rounded-full bg-[#F4510B]"></span>
        </h3>
        <div className="flex flex-col gap-1 text-xs">
          {onSelectLocation ? (
            <>
              <button
                onClick={() => onSelectLocation("All")}
                className={`text-left px-3 py-2 rounded font-medium transition-colors cursor-pointer ${
                  selectedLocation === "All"
                    ? "bg-[#082F75] text-white font-bold border-l-3 border-[#F4510B]"
                    : "text-[#172B4D] hover:bg-[#FFE6C7]/60"
                }`}
              >
                All Regions (सभी क्षेत्र)
              </button>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => onSelectLocation(loc)}
                  className={`text-left px-3 py-2 rounded font-medium transition-colors cursor-pointer ${
                    selectedLocation === loc
                      ? "bg-[#082F75] text-white font-bold border-l-3 border-[#F4510B]"
                      : "text-[#172B4D] hover:bg-[#FFE6C7]/60"
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
                className="text-left px-3 py-2 rounded font-medium text-[#172B4D] hover:bg-[#FFE6C7]/60"
              >
                All Regions (सभी क्षेत्र)
              </Link>
              {locations.map((loc) => (
                <Link
                  key={loc}
                  href={`/directory?city=${encodeURIComponent(loc)}`}
                  className="text-left px-3 py-2 rounded font-medium text-[#172B4D] hover:bg-[#FFE6C7]/60"
                >
                  {loc}
                </Link>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Box 3: Community Business Spotlight / Advertisement */}
      <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-5 shadow-sm text-center space-y-3">
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#C83B08] bg-[#FFE6C7] px-2 py-0.5 rounded border border-[#F3D8B0]">
          COMMUNITY SPOTLIGHT
        </span>
        <h4 className="font-bold text-sm text-[#082F75]">
          {adTitle || "Community Business Directory"}
        </h4>
        <p className="text-xs text-[#64748B] leading-relaxed">
          {adBannerText || "Promote your business across community network."}
        </p>
        <Link
          href={adLink || "/contact"}
          className="inline-block w-full py-2 bg-[#F4510B] hover:bg-[#C83B08] text-white font-bold text-xs rounded transition-colors shadow-sm"
        >
          Connect &amp; Promote →
        </Link>
      </div>
    </aside>
  );
}
