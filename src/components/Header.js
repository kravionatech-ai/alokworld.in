"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopEventCountdownBar from "@/components/TopEventCountdownBar";
import EventPopupModal from "@/components/EventPopupModal";

const NAV_LINKS = [
  { label: "मुख्य पृष्ठ", href: "/" },
  { label: "इतिहास", href: "/history" },
  { label: "संगठन", href: "/organization" },
  { label: "आलोक संघ", href: "/aloksangh" },
  { label: "कार्यक्रम", href: "/events" },
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
    <div className="hidden md:flex items-center justify-center h-[42px] gap-x-0.5 lg:gap-x-1 flex-nowrap">
      {NAV_LINKS.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`h-[42px] flex items-center px-2 lg:px-2.5 text-[11.5px] lg:text-xs font-semibold tracking-wide transition-colors duration-150 relative border-b-[3px] whitespace-nowrap focus:outline-hidden focus:bg-[#112F5C] ${
              active
                ? "text-white border-[#F26A21] bg-[#0F2952] font-bold"
                : "text-[#E2E8F0] border-transparent hover:text-white hover:bg-[#1C4685]"
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
    <div className="space-y-0.5 py-2 border-t border-[#112F5C] bg-[#163A70]">
      {NAV_LINKS.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onSelect}
            className={`block px-3.5 py-2.5 text-xs font-medium rounded-xs transition-colors ${
              active
                ? "text-white bg-[#0F2952] border-l-4 border-[#F26A21] font-bold pl-3"
                : "text-[#E2E8F0] hover:text-white hover:bg-[#1C4685]"
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
        className="flex md:hidden items-center justify-between h-10 px-3 cursor-pointer select-none"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <span className="text-[#F26A21] text-sm">☰</span>
          <span>नेविगेशन मेनू</span>
        </span>
        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="p-1.5 rounded text-[#E2E8F0] hover:text-white hover:bg-[#1C4685] transition-colors focus:outline-hidden"
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

      {/* Desktop Links (42px high) */}
      <NavLinksDesktop currentPath={pathname || ""} />

      {/* Mobile Animated Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden bg-[#163A70] pb-2 overflow-hidden shadow-lg border-b border-[#0C2454]"
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

export default function Header({ siteName, settings: propSettings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(propSettings || null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  useEffect(() => {
    if (propSettings) {
      setSettings(propSettings);
    } else {
      fetch("/api/settings")
        .then((r) => r.json())
        .then((d) => {
          if (d?.settings) setSettings(d.settings);
        })
        .catch(console.error);
    }
  }, [propSettings]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-open Event Popup Modal once per session/day if enabled
  useEffect(() => {
    if (settings && settings.eventEnabled !== false && settings.eventPopupEnabled !== false) {
      try {
        const dismissedUntil = localStorage.getItem("alok_event_popup_dismissed_until");
        if (!dismissedUntil || Date.now() > Number(dismissedUntil)) {
          const timer = setTimeout(() => {
            setIsEventModalOpen(true);
          }, 1000);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        // Ignore localStorage error if cookies disabled
      }
    }
  }, [settings]);

  return (
    <>
      {/* ================================================================= */}
      {/* 0. TOP EVENT COUNTDOWN TICKER STRIP                               */}
      {/* ================================================================= */}
      <TopEventCountdownBar
        eventSettings={settings}
        onOpenModal={() => setIsEventModalOpen(true)}
      />

      {/* ================================================================= */}
      {/* 1. TOP HEADER (BANNER + TITLE): Deep Navy (#091D42)               */}
      {/*    Scrolls naturally with page                                    */}
      {/* ================================================================= */}
      <header className="w-full bg-[#091D42]">
        {/* Section A — Original Organization Banner (Compact Heritage Strip) */}
        <div className="w-full pt-2 sm:pt-2.5 pb-1 px-3 sm:px-4">
          <div className="max-w-[700px] w-full mx-auto">
            <Link
              href="/"
              className="block w-full focus:outline-hidden"
              title={settings?.headerTitle || "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ"}
            >
              <img
                src={settings?.headerBannerImage || "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924152/alokworld/banners/heritage_banner_strip.jpg"}
                alt="अखिल भारतीय समाज महापुरुष एवं राष्ट्रीय प्रतीक — लोधेश्वर भगवान, वीरांगना अवंतीबाई, स्वामी ब्रह्मानंद, स्वामी केशवानंद, राजा हिरदेशाह एवं शहीद गुलाब सिंह"
                width={1080}
                height={162}
                priority="true"
                className="site-banner-image"
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: "700px",
                  height: "auto",
                  marginInline: "auto",
                  objectFit: "contain",
                }}
              />
            </Link>
          </div>
        </div>

        {/* Section B — Organization Identity */}
        <div className="w-full pt-1 pb-2.5 sm:pb-3 px-3 sm:px-4 text-center">
          <div className="max-w-[850px] mx-auto flex flex-col items-center justify-center">
            <Link
              href="/"
              className="inline-block focus:outline-hidden focus:ring-1 focus:ring-[#F26A21] rounded-xs"
            >
              <h1 className="text-base sm:text-lg md:text-xl lg:text-[22px] font-bold text-white tracking-wide leading-tight">
                {settings?.headerTitle || "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ"}
              </h1>
              <p className="text-[11px] sm:text-xs md:text-sm text-[#CBD5E1] font-medium tracking-wide mt-0.5 sm:mt-1">
                {settings?.headerSubtitle || "अखिल भारतीय लोधी समाज निर्देशिका — alokworld.in"}
              </p>
            </Link>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* 2. SECTION C: STICKY NAVIGATION BAR (Stays sticky at top: 0)     */}
      {/*    Navy Blue (#163A70) with Orange (#F26A21) active highlight    */}
      {/* ================================================================= */}
      <nav
        aria-label="Main Navigation"
        className="sticky top-0 z-[1000] w-full bg-[#163A70] border-b border-[#0C2454] shadow-md"
      >
        <div className="max-w-[1020px] mx-auto px-2 sm:px-4">
          <Suspense fallback={<NavLinksDesktop currentPath="" />}>
            <ActiveNavContainer
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          </Suspense>
        </div>
      </nav>

      {/* ================================================================= */}
      {/* 3. EVENT POPUP MODAL DIALOG                                       */}
      {/* ================================================================= */}
      <EventPopupModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        eventSettings={settings}
      />
    </>
  );
}
