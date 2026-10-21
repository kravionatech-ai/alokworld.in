"use client";

import { useEffect, useState } from "react";

const defaultMaintenanceSettings = {
  maintenanceMode: true,
  maintenanceBarEnabled: true,
  maintenancePopupEnabled: true,
  maintenanceMessage:
    "Maintenance Notice: Our website is currently under development. We are improving your experience, and some features may not work as expected.",
  maintenancePopupTitle: "Website Under Active Development",
  maintenancePopupMessage:
    "Welcome to alokworld.in! We are actively updating features, verified directory records, and community services. Feel free to explore our portal.",
};

export default function MaintenanceNotice() {
  const [settings, setSettings] = useState(defaultMaintenanceSettings);
  const [barDismissed, setBarDismissed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isAdminPath = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
    const barDismissedInSession = sessionStorage.getItem("alokworld_maintenance_bar_dismissed") === "true";
    const popupSeenInSession = sessionStorage.getItem("alokworld_maintenance_popup_seen") === "true";

    if (barDismissedInSession) {
      setBarDismissed(true);
    }

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          const s = data.settings;
          setSettings(s);

          if (!s.maintenanceMode || !s.maintenanceBarEnabled) {
            setBarDismissed(true);
          } else if (!barDismissedInSession) {
            setBarDismissed(false);
          }

          if (s.maintenanceMode && s.maintenancePopupEnabled && !popupSeenInSession && !isAdminPath) {
            setShowPopup(true);
          }
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic maintenance settings:", err);
      });
  }, []);

  const dismissBar = () => {
    setBarDismissed(true);
    try {
      sessionStorage.setItem("alokworld_maintenance_bar_dismissed", "true");
    } catch (e) {
      // Ignore private browsing storage restrictions
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    try {
      sessionStorage.setItem("alokworld_maintenance_popup_seen", "true");
    } catch (e) {
      // Ignore private browsing storage restrictions
    }
  };

  if (!settings || !settings.maintenanceMode) {
    return null;
  }

  // Use the required English message by default or from settings
  const message =
    settings.maintenanceMessage && !/[\u0900-\u097F]/.test(settings.maintenanceMessage)
      ? settings.maintenanceMessage
      : defaultMaintenanceSettings.maintenanceMessage;
  const popupTitle = settings.maintenancePopupTitle || defaultMaintenanceSettings.maintenancePopupTitle;
  const popupMessage = settings.maintenancePopupMessage || defaultMaintenanceSettings.maintenancePopupMessage;

  return (
    <>
      {/* 1. Maintenance Announcement Bar: rendered in normal document flow above Header (never overlaps) */}
      {!barDismissed && settings.maintenanceBarEnabled && (
        <aside
          role="alert"
          aria-label="Maintenance Announcement"
          className="relative z-40 bg-[#091D42] text-white border-b-2 border-[#F26A21] px-3 py-2.5 text-xs transition-all duration-200"
        >
          <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#F26A21] text-white text-[11px] shrink-0 font-bold">
                🛠️
              </span>
              <p className="text-white text-[11px] sm:text-xs font-medium leading-tight">
                <strong className="text-[#FFF0E2] font-bold mr-1">Maintenance Notice:</strong>
                Our website is currently under development. We are improving your experience, and some features may not work as expected.
              </p>
            </div>

            <button
              onClick={dismissBar}
              aria-label="Dismiss maintenance announcement"
              className="shrink-0 text-white/90 hover:text-white hover:bg-white/10 rounded px-2 py-0.5 text-xs font-bold transition-colors cursor-pointer border border-white/20"
              title="Dismiss announcement"
            >
              ✕ Close
            </button>
          </div>
        </aside>
      )}

      {/* 2. Maintenance Popup Modal (controlled via settings) */}
      {mounted && showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={closePopup}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md bg-white border-2 border-[#E9D9C5] rounded-xl shadow-2xl p-6 text-center text-[#263449] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={closePopup}
              aria-label="Close maintenance notice"
              className="absolute right-3.5 top-3.5 text-[#64748B] hover:text-[#F26A21] text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#FFF0E2] transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Icon Header */}
            <div className="w-14 h-14 mx-auto rounded-full bg-[#102F6B] text-[#FFF0E2] border-2 border-[#F26A21] flex items-center justify-center text-2xl shadow-sm mb-3.5">
              🛠️
            </div>

            <div className="inline-block px-2.5 py-0.5 mb-2 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FFF0E2] text-[#F26A21] border border-[#E9D9C5]">
              Active Development
            </div>

            <h3 className="text-base sm:text-lg font-black text-[#102F6B] tracking-tight">
              {popupTitle}
            </h3>

            <p className="text-xs sm:text-sm text-[#64748B] mt-2.5 leading-relaxed">
              {popupMessage}
            </p>

            <div className="mt-5 pt-4 border-t border-[#E9D9C5] flex items-center justify-center gap-3">
              <button
                onClick={closePopup}
                className="btn-primary w-full py-2.5 px-4 text-xs sm:text-sm shadow-sm cursor-pointer"
              >
                Continue Browsing alokworld.in →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
