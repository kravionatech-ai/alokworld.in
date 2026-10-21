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
    <aside className="space-y-3">
      {/* Navigation Links Section */}
      <div className="border border-[#F3D8B0] rounded-sm overflow-hidden shadow-xs">
        <div className="bg-[#082F75] text-white text-xs font-bold px-3 py-1.5 border-b-2 border-[#F4510B]">
          हमारे प्रेरणा श्रोत
        </div>
        <div className="bg-[#FFFDF6] p-0">
          {inspirationLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-1.5 text-xs text-[#082F75] font-semibold hover:bg-[#FFE6C7]/60 hover:text-[#F4510B] transition-colors ${
                i < inspirationLinks.length - 1 ? "border-b border-[#F3D8B0]/60" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Business Section */}
      <div className="border border-[#F3D8B0] rounded-sm overflow-hidden shadow-xs">
        <div className="bg-[#082F75] text-white text-xs font-bold px-3 py-1.5 border-b-2 border-[#F4510B]">
          बिज़नेस मैन
        </div>
        <div className="bg-[#FFFDF6] p-3">
          <div className="bg-[#071D49] text-white p-3 rounded text-center border border-[#F4510B]">
            <p className="font-bold text-sm text-[#FFE6C7]">उदय कंस्ट्रक्शन</p>
            <p className="text-[10px] mt-1 text-white/90">
              सभी प्रकार के निर्माण एवं ठेका कार्य
            </p>
          </div>
        </div>
      </div>

      {/* Our Stars Section */}
      <div className="border border-[#F3D8B0] rounded-sm overflow-hidden shadow-xs">
        <div className="bg-[#082F75] text-white text-xs font-bold px-3 py-1.5 border-b-2 border-[#F4510B]">
          Our Stars
        </div>
        <div className="bg-[#FFFDF6] p-3 text-center text-xs text-[#172B4D]">
          <div className="w-16 h-16 mx-auto bg-[#FFE6C7]/60 rounded-full flex items-center justify-center text-2xl mb-2 border border-[#F3D8B0]">
            ⭐
          </div>
          <p className="font-bold text-[#082F75]">समाज के प्रतिभावान छात्र-छात्राएं</p>
          <p className="text-[10px] text-[#64748B] mt-1">
            Class 12 Toppers, IAS / RAS / MBBS Selection
          </p>
        </div>
      </div>

      {/* Organization Posts */}
      <div className="border border-[#F3D8B0] rounded-sm overflow-hidden shadow-xs">
        <div className="bg-[#082F75] text-white text-xs font-bold px-3 py-1.5 border-b-2 border-[#F4510B]">
          समाज संगठन का पद
        </div>
        <div className="bg-[#FFFDF6] p-3 text-center text-xs">
          <p className="text-[#082F75] font-bold text-sm leading-relaxed">
            समाज के समस्त सम्माननीय पदाधिकारीगण
          </p>
          <p className="text-[10px] text-[#64748B] mt-2">
            आप समाज कि मेल आई डी पर आप का नाम, फोटो, पद, संगठन का नाम, मोबाइल नं. भेजे ताकि यहाँ इस जगह लगा सकें।
          </p>
        </div>
      </div>

      {/* Community Spotlight / Ad */}
      {adTitle && (
        <div className="border border-[#F3D8B0] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#082F75] text-white text-xs font-bold px-3 py-1.5 border-b-2 border-[#F4510B]">
            {adTitle}
          </div>
          <div className="bg-[#FFFDF6] p-3 text-center text-xs text-[#172B4D]">
            <p>{adBannerText}</p>
            {adLink && (
              <a
                href={adLink}
                className="inline-block mt-2 px-3 py-1 bg-[#F4510B] text-white rounded text-[10px] font-bold hover:bg-[#C83B08] transition-colors"
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
