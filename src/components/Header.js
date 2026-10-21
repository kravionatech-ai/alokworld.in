"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "History", href: "/history" },
  { label: "Organization", href: "/organization" },
  { label: "Mahasabha", href: "/mahasabha" },
  { label: "Matrimonial", href: "/matrimonial" },
  { label: "Directory", href: "/directory" },
  { label: "Personalities", href: "/personalities" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header({ siteName }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative">
      {/* Top Banner - Deep Navy background #091D42 */}
      <div className="bg-[#091D42] border-b border-[#102F6B]">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="flex items-center justify-between sm:justify-center py-3.5 gap-4">
            {/* Left Crest */}
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF9ED] text-[#102F6B] font-black text-lg sm:text-xl border-2 border-[#F26A21] shrink-0 shadow-sm">
              🏛️
            </div>

            {/* Central Org Title */}
            <div className="text-center flex-1 sm:flex-initial">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-wide">
                Akhil Bhartiya Lodha, Lodhi, Lodh Mahasabha
              </h1>
              <p className="text-xs sm:text-sm text-[#FFF0E2] font-semibold mt-0.5">
                {siteName && !/[\u0900-\u097F]/.test(siteName)
                  ? siteName
                  : "National Samaj Community Directory & Leadership Secretariat"}
              </p>
              <p className="text-[11px] text-white/80 mt-0.5 hidden xs:block">
                alokworld.in — Official Community Portal
              </p>
            </div>

            {/* Right Emblem on desktop */}
            <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-full bg-[#FFF9ED] text-[#102F6B] font-black text-xl border-2 border-[#F26A21] shrink-0 shadow-sm">
              ⭐
            </div>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden btn-primary px-3 py-1.5 text-xs text-white"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? "✕ Close" : "☰ Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navy Navigation Bar #102F6B with Accent Orange #F26A21 accent */}
      <nav className="bg-[#102F6B] border-b-2 border-[#F26A21] shadow-sm">
        <div className="max-w-[1100px] mx-auto px-2">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-center flex-wrap gap-0">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2.5 text-xs font-bold text-white hover:bg-[#F26A21] hover:text-white transition-colors whitespace-nowrap border-r border-[#091D42]/60 last:border-r-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="px-3 py-2.5 text-xs font-bold text-[#FFF0E2] hover:bg-[#F26A21] hover:text-white transition-colors whitespace-nowrap ml-1 bg-[#091D42]/60 rounded-xs"
            >
              Admin Portal
            </Link>
          </div>

          {/* Mobile Tablet Header info strip */}
          <div className="md:hidden flex items-center justify-between py-2 text-white">
            <span className="text-xs font-semibold text-[#FFF0E2]">Navigation</span>
            <span className="text-[11px] text-white/70">alokworld.in</span>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-[#091D42] border-t border-[#102F6B] pb-3 px-3 space-y-1 animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold text-white hover:bg-[#F26A21] rounded border-b border-[#102F6B]/60 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-xs font-bold text-[#F26A21] hover:bg-[#F26A21] hover:text-white rounded bg-[#102F6B]/50"
            >
              Admin Portal →
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
