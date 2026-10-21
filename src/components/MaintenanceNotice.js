"use client";

import { useEffect, useState } from "react";

const defaultMaintenanceSettings = {
  maintenanceMode: true,
  maintenanceBarEnabled: true,
  maintenancePopupEnabled: true,
  maintenanceMessage:
    "Website Under Maintenance — We are improving your experience. Some features may not work as expected.",
  maintenancePopupTitle: "Website Under Active Development",
  maintenancePopupMessage:
    "Welcome to alokworld.in! We are actively updating features, verified directory records, and community services. Feel free to explore.",
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

  const message = settings.maintenanceMessage || defaultMaintenanceSettings.maintenanceMessage;
  const popupTitle = settings.maintenancePopupTitle || defaultMaintenanceSettings.maintenancePopupTitle;
  const popupMessage = settings.maintenancePopupMessage || defaultMaintenanceSettings.maintenancePopupMessage;

  return (
    <>
      {/* 1. Maintenance Announcement Bar */}
      {!barDismissed && settings.maintenanceBarEnabled && (
        <div
          role="alert"
          className="relative z-50 bg-[#071D49] text-white border-b-2 border-[#F4510B] px-3 py-2 text-xs transition-all duration-200"
        >
          <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#F4510B] text-white text-[11px] shrink-0 font-bold">
                🛠️
              </span>
              <span className="font-bold text-[#FFE6C7] shrink-0 hidden sm:inline">
                [Maintenance Notice]:
              </span>
              <p className="truncate sm:whitespace-normal text-white/95 text-[11px] sm:text-xs">
                {message}
              </p>
            </div>

            <button
              onClick={dismissBar}
              aria-label="Dismiss maintenance announcement"
              className="shrink-0 text-white/80 hover:text-[#F4510B] hover:bg-white/10 rounded px-1.5 py-0.5 text-xs font-bold transition-colors cursor-pointer"
              title="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. Optional Maintenance Popup Modal */}
      {mounted && showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={closePopup}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md bg-[#FFFDF6] border-2 border-[#F3D8B0] rounded-xl shadow-2xl p-6 text-center text-[#172B4D] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={closePopup}
              aria-label="Close maintenance notice"
              className="absolute right-3.5 top-3.5 text-[#64748B] hover:text-[#F4510B] text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#FFE6C7]/50 transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Icon Header */}
            <div className="w-14 h-14 mx-auto rounded-full bg-[#082F75] text-[#FFE6C7] border-2 border-[#F4510B] flex items-center justify-center text-2xl shadow-sm mb-3.5">
              🛠️
            </div>

            <div className="inline-block px-2.5 py-0.5 mb-2 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FFE6C7] text-[#C83B08] border border-[#F3D8B0]">
              Development In Progress
            </div>

            <h3 className="text-base sm:text-lg font-black text-[#082F75] tracking-tight">
              {popupTitle}
            </h3>

            <p className="text-xs sm:text-sm text-[#64748B] mt-2.5 leading-relaxed">
              {popupMessage}
            </p>

            <div className="mt-5 pt-4 border-t border-[#F3D8B0]/60 flex items-center justify-center gap-3">
              <button
                onClick={closePopup}
                className="w-full py-2.5 px-4 bg-[#F4510B] hover:bg-[#C83B08] text-white text-xs sm:text-sm font-bold rounded transition-colors shadow-sm cursor-pointer"
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
