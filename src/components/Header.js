"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "मुख्य पृष्ठ", href: "/" },
  { label: "इतिहास", href: "/history" },
  { label: "संगठन", href: "/organization" },
  { label: "महासभा", href: "/mahasabha" },
  { label: "वैवाहिक परिचय", href: "/matrimonial" },
  { label: "सदस्य निर्देशिका", href: "/directory" },
  { label: "महान विभूतियाँ", href: "/personalities" },
  { label: "चित्र दीर्घा", href: "/gallery" },
  { label: "हमारे बारे में", href: "/about" },
  { label: "संपर्क करें", href: "/contact" },
];

function NavLinksDesktop({ currentPath = "" }) {
  const isActive = (href) => {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  return (
    <div className="hidden md:flex items-center justify-center h-10 gap-x-0.5 lg:gap-x-1 flex-nowrap">
      {NAV_LINKS.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`h-10 flex items-center px-2 lg:px-2.5 text-[11.5px] lg:text-xs font-semibold tracking-wide transition-colors duration-150 relative border-b-2 whitespace-nowrap focus:outline-hidden focus:bg-[#0D2659] ${
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
    <div className="space-y-0.5 py-2 border-t border-[#091D42]">
      {NAV_LINKS.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onSelect}
            className={`block px-3 py-2 text-xs font-medium rounded-xs transition-colors ${
              active
                ? "text-white bg-[#091D42] border-l-4 border-[#F26A21] font-bold pl-2.5"
                : "text-[#CBD5E1] hover:text-white hover:bg-[#091D42]/60"
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
      {/* Mobile Toggle Row (40px high) */}
      <div
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="flex md:hidden items-center justify-between h-10 px-2 cursor-pointer select-none"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <span className="text-[#F26A21]">☰</span>
          <span>नेविगेशन मेनू</span>
        </span>
        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="p-1 rounded text-[#CBD5E1] hover:text-white hover:bg-[#091D42] transition-colors focus:outline-hidden"
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

      {/* Desktop Links (40px high) */}
      <NavLinksDesktop currentPath={pathname || ""} />

      {/* Mobile Animated Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden bg-[#102F6B] pb-2 overflow-hidden"
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
      {/* 1. TOP COMMUNITY BANNER: Authentic banner resized & centered     */}
      {/* ================================================================= */}
      <div
        className="site-banner-container bg-[#091D42]"
        style={{ width: "100%", padding: "6px 12px" }}
      >
        <div className="max-w-[850px] w-full mx-auto">
          <Link
            href="/"
            className="block w-full focus:outline-hidden"
            title="अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ"
          >
            <img
              src="/asset/topofwebsite/web_sit_front1.png"
              alt="अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ — alokworld.in"
              width={1337}
              height={483}
              priority="true"
              className="site-banner-image"
              style={{
                display: "block",
                width: "100%",
                maxWidth: "850px",
                height: "auto",
                marginInline: "auto",
                objectFit: "contain",
              }}
            />
          </Link>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. BRAND TITLE STRIP: Compact Deep Navy (#091D42, 68–75px high)    */}
      {/* ================================================================= */}
      <div className="w-full bg-[#091D42] border-t border-[#162744] border-b border-[#162744]">
        <div className="max-w-[850px] mx-auto px-3 sm:px-4 py-2.5 sm:py-3 text-center flex flex-col items-center justify-center min-h-[68px] sm:min-h-[72px]">
          <Link
            href="/"
            className="inline-block focus:outline-hidden focus:ring-1 focus:ring-[#F26A21] rounded-xs"
          >
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight leading-snug">
              अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ
            </h1>
            <p className="text-[11px] sm:text-xs md:text-sm text-[#CBD5E1] font-semibold mt-0.5 tracking-wide">
              अखिल भारतीय लोधी समाज निर्देशिका — alokworld.in
            </p>
          </Link>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. NAVIGATION BAR: Navy (#102F6B, ~40px high)                     */}
      {/* ================================================================= */}
      <nav
        aria-label="Main Navigation"
        className="w-full bg-[#102F6B] border-b border-[#0C2454] shadow-xs"
      >
        <div className="max-w-[1000px] mx-auto px-2 sm:px-4">
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
