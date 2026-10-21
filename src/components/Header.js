"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "History", href: "/history" },
  { label: "Samaj Suggestion", href: "/organization" },
  { label: "Mahasabha", href: "/mahasabha" },
  { label: "Samaj Matrimonial", href: "/matrimonial" },
  { label: "Samaj Directory", href: "/directory" },
  { label: "Personalities", href: "/personalities" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header({ siteName }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      {/* Top Banner - Dark Navy background with white Hindi branding */}
      <div className="bg-[#071D49] border-b border-[#082F75]">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center justify-center py-3 px-4 gap-4">
            {/* Left emblem */}
            <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full bg-[#FFF9E8] text-[#082F75] font-black text-2xl border-2 border-[#F4510B] shrink-0 shadow-sm">
              ॐ
            </div>

            {/* Central org title */}
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-wide">
                अखिल भारतीय लोधा, लोधी, लोध महासभा
              </h1>
              <p className="text-xs sm:text-sm text-[#FFE6C7] font-semibold mt-0.5">
                {siteName || "(अखिल भारतीय लोधी महासभा) — लोधी चैरीटेबल ट्रस्ट"}
              </p>
              <p className="text-[10px] text-white/80 mt-0.5">
                alokworld.in — Official Community Directory Portal
              </p>
            </div>

            {/* Right emblem */}
            <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full bg-[#FFF9E8] text-[#082F75] font-black text-2xl border-2 border-[#F4510B] shrink-0 shadow-sm">
              स्
            </div>
          </div>
        </div>
      </div>

      {/* Navy Blue Navigation Bar with subtle orange hover & active states */}
      <nav className="bg-[#082F75] border-b-2 border-[#F4510B] shadow-sm">
        <div className="max-w-[1100px] mx-auto px-2">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-center flex-wrap gap-0">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-xs font-bold text-white hover:bg-[#F4510B] hover:text-white transition-colors whitespace-nowrap border-r border-[#071D49]/60 last:border-r-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="px-3 py-2 text-xs font-bold text-[#FFE6C7] hover:bg-[#F4510B] hover:text-white transition-colors whitespace-nowrap"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center justify-between py-2">
            <span className="text-xs font-bold text-white">☰ Menu</span>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-sm px-3 py-1 bg-[#F4510B] hover:bg-[#C83B08] rounded transition-colors"
            >
              {menuOpen ? "Close ✕" : "Open ▾"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-[#071D49] border-t border-[#082F75] pb-2 px-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold text-white hover:bg-[#F4510B] border-b border-[#082F75]/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-xs font-bold text-[#FFE6C7] hover:bg-[#F4510B] hover:text-white"
            >
              Admin Panel
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
