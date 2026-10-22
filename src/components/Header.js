"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "मुख्य पृष्ठ", href: "/" },
  { label: "समाज इतिहास", href: "/history" },
  { label: "संगठन", href: "/organization" },
  { label: "महासभा", href: "/mahasabha" },
  { label: "वैवाहिक", href: "/matrimonial" },
  { label: "डायरेक्टरी", href: "/directory" },
  { label: "विभूतियां", href: "/personalities" },
  { label: "छायाचित्र दीर्घा", href: "/gallery" },
  { label: "परिचय", href: "/about" },
  { label: "संपर्क", href: "/contact" },
];

function NavLinksDesktop({ currentPath = "" }) {
  const isActive = (href) => {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  return (
    <div className="hidden md:flex items-center justify-center flex-wrap gap-x-0.5">
      {NAV_LINKS.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-2.5 lg:px-3 py-2.5 text-[11.5px] lg:text-xs font-semibold tracking-wide transition-colors duration-150 relative border-b-2 focus:outline-hidden focus:bg-[#0D2659] whitespace-nowrap ${
              active
                ? "text-white border-[#F26A21] bg-[#091D42]/70 font-bold"
                : "text-[#E2E8F0] border-transparent hover:text-white hover:bg-[#0D2659]"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

function NavLinksMobile({ currentPath = "", onSelect }) {
  const isActive = (href) => {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  return (
    <div className="space-y-0.5 py-1">
      {NAV_LINKS.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onSelect}
            className={`block px-3 py-2 text-xs font-medium rounded-xs transition-colors ${
              active
                ? "text-white bg-[#102F6B] border-l-4 border-[#F26A21] font-bold pl-2.5"
                : "text-[#CBD5E1] hover:text-white hover:bg-[#102F6B]/60"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

function ActiveNavContainer({ mobileMenuOpen, setMobileMenuOpen }) {
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  return (
    <>
      <NavLinksDesktop currentPath={pathname || ""} />
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden bg-[#091D42] border-t border-[#162744] px-3 pb-2 overflow-hidden"
          >
            <NavLinksMobile
              currentPath={pathname || ""}
              onSelect={() => setMobileMenuOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="w-full relative z-30">
      {/* ================================================================= */}
      {/* 1. TOP COMMUNITY BANNER: Authentic banner from topofwebsite      */}
      {/* ================================================================= */}
      <div className="w-full bg-[#091D42] border-b border-[#162744]">
        <div className="max-w-[1100px] mx-auto px-2 sm:px-4 pt-2 pb-1 text-center">
          <Link href="/" className="inline-block w-full focus:outline-hidden" title="Akhil Bhartiya Lodha, Lodhi, Lodh Mahasabha">
            <img
              src="/asset/topofwebsite/web_sit_front1.png"
              alt="Akhil Bhartiya Lodha, Lodhi, Lodh Mahasabha — alokworld.in"
              className="w-full max-h-[120px] sm:max-h-[150px] md:max-h-[180px] object-contain mx-auto"
            />
          </Link>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. BRAND TITLE STRIP: Compact Deep Navy (#091D42) with White Text */}
      {/* ================================================================= */}
      <div className="bg-[#091D42] border-b border-[#162744]">
        <div className="max-w-[1100px] mx-auto px-4 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-3">
            {/* Center Brand Title & Subtitle */}
            <div className="flex-1 text-center">
              <Link
                href="/"
                className="inline-block focus:outline-hidden focus:ring-1 focus:ring-[#F26A21] rounded-xs"
              >
                <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight leading-snug">
                  अखिल भारतीय लोधी, लोधा, लोध समाज महासभा
                </h1>
                <p className="text-[10.5px] sm:text-xs md:text-sm text-[#CBD5E1] font-medium mt-0.5 tracking-wide">
                  अखिल भारतीय समाज डायरेक्टरी — alokworld.in
                </p>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <div className="md:hidden shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="नेविगेशन मेनू खोलें / बंद करें"
                className="p-1.5 rounded-xs text-[#CBD5E1] hover:text-white hover:bg-[#102F6B] border border-[#162744] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#F26A21] cursor-pointer"
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. NAVIGATION BAR: Navy (#102F6B) with Subtle Orange Accent       */}
      {/* ================================================================= */}
      <nav
        aria-label="Main Navigation"
        className="bg-[#102F6B] border-b border-[#0C2454] shadow-xs"
      >
        <div className="max-w-[1100px] mx-auto px-2">
          <Suspense fallback={<NavLinksDesktop currentPath="" />}>
            <ActiveNavContainer
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
