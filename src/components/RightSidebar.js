"use client";

import Link from "next/link";

const verifiedOfficeBearers = [
  {
    name: "सर्वश्री अतिवल सिंह",
    role: "राष्ट्रीय अध्यक्ष",
    location: "उत्तर प्रदेश",
    phone: "+91 99999 00079",
    avatar: "",
  },
  {
    name: "सर्वश्री वीरवल सिंह",
    role: "अध्यक्ष परामर्शदात्री समिति",
    location: "उत्तर प्रदेश",
    phone: "+91 94544 12070",
    avatar: "",
  },
  {
    name: "सर्वश्री डा० ओमकार सिंह नरवरिया",
    role: "राष्ट्रीय कोषाध्यक्ष",
    location: "नई दिल्ली",
    phone: "+91 98734 83657",
    avatar: "/asset/photo/photo/Dr Omkar_Singh.jpg",
  },
  {
    name: "डॉ. बद्री विशाल सिंह",
    role: "राष्ट्रीय संरक्षक (से०नि० महानिदेशक)",
    location: "लखनऊ, उत्तर प्रदेश",
    phone: "",
    avatar: "/asset/photo/photo/Dr Badri Vishal R Singh.jpg",
  },
  {
    name: "इंजीनियर हर्ष राजपूत",
    role: "राष्ट्रीय प्रवक्ता",
    location: "भोपाल, मध्य प्रदेश",
    phone: "",
    avatar: "/asset/photo/photo/Er. Harsh Rajput.jpg",
  },
];

export default function RightSidebar({ settings }) {
  return (
    <aside className="space-y-4">
      {/* 1. Verified National Office Bearers Spotlight */}
      <div className="border border-[#E9E2D8] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2.5 border-b-2 border-[#F26A21] flex items-center justify-between">
          <span>राष्ट्रीय पदाधिकारी</span>
          <span className="text-[10px] bg-[#FFF0E2] text-[#F26A21] px-1.5 py-0.5 rounded font-mono">आलोक</span>
        </div>
        <div className="divide-y divide-[#E9E2D8]">
          {verifiedOfficeBearers.map((ob, idx) => (
            <div key={idx} className="p-3 flex items-start gap-3 hover:bg-[#FFFCF5] transition-colors">
              {ob.avatar ? (
                <img
                  src={ob.avatar}
                  alt={ob.name}
                  width={42}
                  height={42}
                  className="w-10 h-10 rounded-full object-cover border border-[#E9E2D8] shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#102F6B] text-white flex items-center justify-center font-bold text-xs shrink-0 border border-[#F26A21]">
                  {ob.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#102F6B] truncate">{ob.name}</p>
                <p className="text-[11px] font-semibold text-[#F26A21] leading-tight">{ob.role}</p>
                <p className="text-[10px] text-[#64748B] mt-0.5">{ob.location}</p>
                {ob.phone && (
                  <a
                    href={`tel:${ob.phone.replace(/[^\d+]/g, "")}`}
                    className="text-[11px] font-mono font-medium text-[#102F6B] hover:text-[#F26A21] hover:underline block mt-0.5"
                  >
                    {ob.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-2.5 bg-[#FFFCF5] text-center border-t border-[#E9E2D8]">
          <Link
            href="/organization"
            className="text-[11px] font-bold text-[#F26A21] hover:underline"
          >
            संपूर्ण कार्यकारिणी विवरण देखें →
          </Link>
        </div>
      </div>

      {/* 2. Official Secretariat Contact Notice / Sidebar Community Notice */}
      {settings?.sidebarNoticeEnabled !== false && (
        <div className="border border-[#E9E2D8] rounded-lg overflow-hidden shadow-xs bg-white">
          <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2.5 border-b-2 border-[#F26A21]">
            {settings?.sidebarNoticeTitle || "केंद्रीय सचिवालय सहायता केंद्र"}
          </div>
          <div className="p-4 text-xs text-[#263449] space-y-2">
            <p className="leading-relaxed">
              {settings?.sidebarNoticeContent || "समस्त समाज बंधुओं एवं पदाधिकारियों से अनुरोध है कि वे अपने परिवार व कार्यक्षेत्र की जानकारी अद्यतन करें।"}
            </p>
            <div className="pt-2 border-t border-[#E9E2D8] text-[11px] text-[#64748B] space-y-1">
              <p>ईमेल: <a href={`mailto:${settings?.contactEmail || "admin@alokworld.in"}`} className="text-[#F26A21] font-medium">{settings?.contactEmail || "admin@alokworld.in"}</a></p>
              <p>दूरभाष: <a href={`tel:${(settings?.contactPhone || "+91 96085 53167").replace(/[^\d+]/g, "")}`} className="text-[#F26A21] font-medium">{settings?.contactPhone || "+91 96085 53167"}</a></p>
            </div>
            <Link
              href="/contact"
              className="block text-center w-full py-2 bg-[#102F6B] text-white text-xs font-bold rounded hover:bg-[#F26A21] transition-colors mt-2"
            >
              विवरण संशोधन / संपर्क करें →
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
