"use client";

import Link from "next/link";

const inspirationLinks = [
  { label: "Home", href: "/" },
  { label: "History", href: "/history" },
  { label: "Historical Personalities", href: "/personalities" },
  { label: "Samaj Directory", href: "/directory" },
  { label: "Samaj Organization", href: "/organization" },
  { label: "Mahasabha", href: "/mahasabha" },
  { label: "Samaj Matrimonial", href: "/matrimonial" },
  { label: "Photo Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function LeftSidebar({ adTitle, adBannerText, adLink }) {
  return (
    <aside className="space-y-4">
      {/* Navigation Links Section */}
      <div className="border border-[#E9D9C5] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2 border-b-2 border-[#F26A21]">
          Quick Navigation
        </div>
        <div className="p-0">
          {inspirationLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3.5 py-2 text-xs text-[#263449] font-semibold hover:bg-[#FFF0E2] hover:text-[#F26A21] transition-colors ${
                i < inspirationLinks.length - 1 ? "border-b border-[#E9D9C5]" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Business Section */}
      <div className="border border-[#E9D9C5] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2 border-b-2 border-[#F26A21]">
          Featured Business
        </div>
        <div className="p-3.5">
          <div className="bg-[#091D42] text-white p-3.5 rounded-lg text-center border border-[#F26A21]">
            <p className="font-bold text-sm text-[#FFF0E2]">Uday Construction</p>
            <p className="text-[11px] mt-1 text-white/90">
              All types of civil construction and contracting services
            </p>
          </div>
        </div>
      </div>

      {/* Community Stars Section */}
      <div className="border border-[#E9D9C5] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2 border-b-2 border-[#F26A21]">
          Community Achievers
        </div>
        <div className="p-3.5 text-center text-xs text-[#263449]">
          <div className="w-14 h-14 mx-auto bg-[#FFF0E2] rounded-full flex items-center justify-center text-2xl mb-2 border border-[#E9D9C5]">
            ⭐
          </div>
          <p className="font-bold text-[#102F6B]">Meritorious Students &amp; Achievers</p>
          <p className="text-[11px] text-[#64748B] mt-1">
            Class 12 Toppers, IAS / State Civil Services / Medical Selections
          </p>
        </div>
      </div>

      {/* Organization Posts */}
      <div className="border border-[#E9D9C5] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2 border-b-2 border-[#F26A21]">
          Executive Leadership Registry
        </div>
        <div className="p-3.5 text-center text-xs">
          <p className="text-[#102F6B] font-bold text-sm leading-relaxed">
            Honorable Community Office Bearers
          </p>
          <p className="text-[11px] text-[#64748B] mt-2 leading-relaxed">
            Please submit your name, photograph, designation, organization name, and contact details to the secretariat email to be featured here.
          </p>
        </div>
      </div>

      {/* Community Spotlight / Ad */}
      {adTitle && (
        <div className="border border-[#E9D9C5] rounded-lg overflow-hidden shadow-xs bg-white">
          <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2 border-b-2 border-[#F26A21]">
            {adTitle}
          </div>
          <div className="p-3.5 text-center text-xs text-[#263449]">
            <p>{adBannerText}</p>
            {adLink && (
              <a
                href={adLink}
                className="btn-primary mt-2.5 px-3 py-1 text-[11px]"
              >
                View Details →
              </a>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
