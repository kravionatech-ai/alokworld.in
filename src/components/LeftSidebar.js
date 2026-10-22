"use client";

import Link from "next/link";

const navigationLinks = [
  { label: "मुख्य पृष्ठ (होम)", href: "/" },
  { label: "समाज डायरेक्टरी", href: "/directory" },
  { label: "राष्ट्रीय कार्यकारिणी एवं प्रकोष्ठ", href: "/organization" },
  { label: "महासभा संकल्प", href: "/mahasabha" },
  { label: "इतिहास एवं गौरवशाली विरासत", href: "/history" },
  { label: "ऐतिहासिक विभूतियां", href: "/personalities" },
  { label: "अधिवेशन छायाचित्र दीर्घा", href: "/gallery" },
  { label: "समाज वैवाहिक मंच", href: "/matrimonial" },
  { label: "केंद्रीय सचिवालय संपर्क", href: "/contact" },
  { label: "alokworld.in परिचय", href: "/about" },
];

const stateChapters = [
  { name: "उत्तर प्रदेश", code: "UP", members: "प्रांतीय इकाई" },
  { name: "मध्य प्रदेश", code: "MP", members: "प्रांतीय इकाई" },
  { name: "राजस्थान", code: "RJ", members: "प्रांतीय इकाई" },
  { name: "दिल्ली एनसीआर", code: "DL", members: "प्रांतीय इकाई" },
  { name: "तेलंगाना एवं दक्षिण", code: "TS", members: "प्रांतीय इकाई" },
  { name: "हरियाणा एवं पंजाब", code: "HR", members: "प्रांतीय इकाई" },
];

export default function LeftSidebar({ adTitle, adBannerText, adLink }) {
  return (
    <aside className="space-y-4">
      {/* 1. Quick Navigation Links */}
      <div className="border border-[#E9E2D8] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2.5 border-b-2 border-[#F26A21]">
          त्वरित डायरेक्टरी नेविगेशन
        </div>
        <div className="p-0">
          {navigationLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3.5 py-2 text-xs text-[#263449] font-medium hover:bg-[#FFF0E2] hover:text-[#F26A21] transition-colors ${
                i < navigationLinks.length - 1 ? "border-b border-[#E9E2D8]" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Key State Units & Chapters */}
      <div className="border border-[#E9E2D8] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2.5 border-b-2 border-[#F26A21] flex items-center justify-between">
          <span>प्रांतीय इकाइयां एवं प्रकोष्ठ</span>
          <span className="w-2 h-2 rounded-full bg-[#F26A21]"></span>
        </div>
        <div className="p-2 space-y-1">
          {stateChapters.map((sc) => (
            <Link
              key={sc.code}
              href={`/directory?state=${encodeURIComponent(sc.name)}`}
              className="flex items-center justify-between px-2.5 py-1.5 rounded text-xs hover:bg-[#FFF0E2] transition-colors"
            >
              <span className="font-semibold text-[#102F6B]">{sc.name}</span>
              <span className="text-[10px] text-[#64748B] bg-[#FFFCF5] px-1.5 py-0.5 rounded border border-[#E9E2D8]">
                {sc.members}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. National Convention 2026 Notice Box */}
      <div className="border border-[#E9E2D8] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#091D42] text-white text-xs font-bold px-3.5 py-2.5 border-b-2 border-[#F26A21]">
          राष्ट्रीय अधिवेशन 2026
        </div>
        <div className="p-3.5 text-center text-xs space-y-2">
          <p className="font-bold text-[#102F6B] text-xs leading-snug">
            अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक)
          </p>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            राष्ट्रीय महाधिवेशन 2026 में समाज के समस्त अधिकारी, कर्मचारी एवं प्रबुद्धजन सादर आमंत्रित हैं।
          </p>
          <Link
            href="/gallery"
            className="inline-block text-[11px] font-bold text-[#F26A21] hover:underline pt-1"
          >
            आधिकारिक पोस्टर देखें →
          </Link>
        </div>
      </div>
    </aside>
  );
}
