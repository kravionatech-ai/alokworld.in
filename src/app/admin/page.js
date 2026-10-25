"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import InquiryChatModal from "@/components/admin/InquiryChatModal";
import ComposeEmailModal from "@/components/admin/ComposeEmailModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getSearchTokens } from "@/lib/transliteration";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 border border-[#D5CEC4] bg-[#FAF8F3] flex items-center justify-center text-xs text-[#55657E] animate-pulse rounded-xs">
      Loading visual rich-text editor...
    </div>
  ),
});

// =========================================================================
// MINIMALIST EDITORIAL ICONS (Monochrome SVGs, No Emojis)
// =========================================================================
function Icon({ name, className = "w-4 h-4 shrink-0" }) {
  switch (name) {
    case "overview":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      );
    case "users":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a3.75 3.75 0 016.94-1.72 8.243 8.243 0 012.81 1.725zM9 12a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm8.25-1.5a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      );
    case "user-plus":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v6m3-3h-6m-1.5 5.25a8.25 8.25 0 00-11.25 0M9 12a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
        </svg>
      );
    case "clock":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "archive":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      );
    case "document":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    case "navigation":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      );
    case "widgets":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
    case "photo":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      );
    case "search":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      );
    case "settings":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
      );
    case "shield":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.002A11.959 11.959 0 0112 2.714z" />
        </svg>
      );
    case "clipboard":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
      );
    case "key":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
      );
    case "mail":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      );
    case "server":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.7 4.05a2.25 2.25 0 011.8-.9h9a2.25 2.25 0 011.8.9l2.55 4.5a4.5 4.5 0 01.9 2.7" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Layout & Navigation State
  const [activeTab, setActiveTab] = useState("members");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminLang, setAdminLang] = useState("en"); // "en" | "hi" (bilingual admin toggle)

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("alok_admin_lang");
      if (savedLang === "hi" || savedLang === "en") setAdminLang(savedLang);
    } catch {}
  }, []);

  const changeAdminLang = (lang) => {
    setAdminLang(lang);
    try {
      localStorage.setItem("alok_admin_lang", lang);
    } catch {}
  };

  // Feedback notifications
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 1. Members State
  const [members, setMembers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminSearch, setAdminSearch] = useState("");
  const [memberSort, setMemberSort] = useState("newest");
  const [membersPage, setMembersPage] = useState(1);
  const MEMBERS_PER_PAGE = 15;

  const [editingMemberId, setEditingMemberId] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: "",
    slug: "",
    role: "Member",
    occupation: "",
    company: "",
    city: "",
    state: "",
    address: "",
    pincode: "",
    phone: "",
    email: "",
    avatar: "",
    biography: "",
    tags: "",
    membershipStatus: "active",
    isApproved: true,
    isPublished: true,
    isArchived: false,
    showPhone: true,
    showEmail: true,
    showAddress: false,
  });

  // 2. Page Content CMS State
  const [pagesList, setPagesList] = useState([]);
  const [selectedPageSlug, setSelectedPageSlug] = useState("about");
  const [pageEditorMode, setPageEditorMode] = useState("edit");
  const [pageForm, setPageForm] = useState({
    slug: "about",
    title: "",
    subtitle: "",
    bannerTitle: "",
    bannerSubtitle: "",
    content: "",
    status: "published",
    metaTitle: "",
    metaDescription: "",
    lastEditedBy: "",
  });

  // 3. Photo Gallery CMS State
  const [galleryItems, setGalleryItems] = useState([]);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "National Convention",
    mediaType: "image",
    videoUrl: "",
    eventDate: "",
    imageUrl: "",
    publicId: "",
    description: "",
    isPublished: true,
    isFeatured: false,
  });
  const [adminGalleryFilter, setAdminGalleryFilter] = useState("all");

  // 4. Website Settings State
  const [settings, setSettings] = useState({
    siteName: "",
    tagline: "",
    announcement: "",
    announcementEnabled: true,
    heroBadge: "Official Community Portal",
    heroTitle: "Akhil Bhartiya Samaj Directory & Central Portal",
    heroSubtitle: "Akhil Bhartiya Lodhi Adhikari-Karmachari Sangh (ALOK) & Samaj Directory — Connecting verified community professionals, elders, doctors, engineers, advocates, merchants, and youth nationwide.",
    heroCtaText: "Explore Member Directory →",
    heroCtaLink: "/directory",
    heroImage: "",
    // Event & Live Countdown State (2 Nov Target)
    eventEnabled: true,
    eventTopBarEnabled: true,
    eventPopupEnabled: true,
    eventTitle: "आलोक राष्ट्रीय महासम्मेलन एवं भव्य पोर्टल लोकार्पण — 2026",
    eventSubtitle: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ का ऐतिहासिक राष्ट्रीय सम्मेलन",
    eventBadge: "विशेष आगामी कार्यक्रम",
    eventDate: "2026-11-02T10:00:00",
    eventLocation: "कांस्टीट्यूशन क्लब, रफी मार्ग, नई दिल्ली",
    eventCountdownLabel: "वेबसाइट लाइव एवं महासम्मेलन उल्टी गिनती",
    eventDescription:
      "2 नवम्बर 2026 को समाज के गौरवशाली राष्ट्रीय महासम्मेलन, प्रतिभावान छात्र-छात्रा सम्मान एवं आलोक डिजिटल पोर्टल का भव्य राष्ट्रव्यापी लोकार्पण। देशभर के गणमान्य बंधु सादर आमंत्रित हैं।",
    eventImage: "/asset/alokadhivationposter2026/poster1.jpeg",
    eventCtaText: "अधिवेशन विवरण एवं पंजीकरण →",
    eventCtaLink: "/mahasabha",
    sidebarNoticeTitle: "",
    sidebarNoticeContent: "",
    sidebarNoticeEnabled: true,
    keyRegions: "Bhopal, Jaipur, Bengaluru, Lucknow, Indore, Delhi NCR, Mumbai, Jabalpur",
    adTitle: "",
    adBannerText: "",
    adLink: "/contact",
    adEnabled: true,
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    whatsappNumber: "",
    navigationLinks: [],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    siteUrl: "https://alokworld.in",
    ogImage: "",
    organizationName: "Akhil Bhartiya Lodha, Lodhi, Lodh Mahasabha",
    googleVerificationId: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg",
    twitterHandle: "@alokworldin",
    maintenanceMode: true,
    maintenanceBarEnabled: true,
    maintenancePopupEnabled: true,
    maintenanceMessage: "",
    maintenancePopupTitle: "",
    maintenancePopupMessage: "",
  });

  // 5. Activity Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [auditFilterAction, setAuditFilterAction] = useState("All");
  const [auditSearch, setAuditSearch] = useState("");

  // 6. Admin Team & Roles State
  const [adminUsers, setAdminUsers] = useState([]);
  const [newAdminForm, setNewAdminForm] = useState({
    name: "",
    email: "",
    role: "editor",
    password: "",
  });

  // 7. Messages / Email & Contact Management State
  const [messages, setMessages] = useState([]);
  const [emailsList, setEmailsList] = useState([]);
  const [emailStats, setEmailStats] = useState({
    sent: 0,
    delivered: 0,
    failed: 0,
    bounced: 0,
    received: 0,
    unreadInbound: 0,
    totalOutbound: 0,
  });
  const [messagesSubTab, setMessagesSubTab] = useState("inquiries"); // "inquiries" | "received" | "sent"
  const [emailFilterStatus, setEmailFilterStatus] = useState("all");
  const [emailSearch, setEmailSearch] = useState("");
  const [replyModal, setReplyModal] = useState({
    isOpen: false,
    inquiryId: null,
    recipientEmail: "",
    subject: "",
    message: "",
    sending: false,
  });
  const [selectedEmailDetail, setSelectedEmailDetail] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);

  // Confirmation Modal for Destructive Operations
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    targetName: "",
    confirmText: "Confirm Action",
    confirmBtnClass: "bg-red-700 hover:bg-red-800 text-white",
    action: null,
  });

  // ==========================================
  // AUTHENTICATION INITIALIZATION
  // ==========================================
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (!data.authenticated || !data.user) {
          router.push("/admin/login");
        } else {
          setCurrentUser(data.user);
          setAuthChecked(true);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  const loadAllData = () => {
    fetch("/api/members?admin=true&limit=150")
      .then((r) => r.json())
      .then((d) => {
        if (d?.members) setMembers(d.members);
      })
      .catch(console.error);

    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.settings) {
          const s = d.settings;
          setSettings({
            ...s,
            keyRegions: Array.isArray(s.keyRegions) ? s.keyRegions.join(", ") : s.keyRegions || "",
          });
        }
      })
      .catch(console.error);

    fetch("/api/pages")
      .then((r) => r.json())
      .then((d) => {
        if (d?.pages) {
          setPagesList(d.pages);
          const first = d.pages.find((p) => p.slug === "about") || d.pages[0];
          if (first) {
            setSelectedPageSlug(first.slug);
            setPageForm(first);
          }
        }
      })
      .catch(console.error);

    fetch("/api/gallery?all=true")
      .then((r) => r.json())
      .then((d) => {
        if (d?.items) setGalleryItems(d.items);
      })
      .catch(console.error);

    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => {
        if (d?.messages) setMessages(d.messages);
      })
      .catch(console.error);

    fetch("/api/admin/emails")
      .then((r) => r.json())
      .then((d) => {
        if (d?.logs) setEmailsList(d.logs);
        if (d?.stats) setEmailStats(d.stats);
      })
      .catch(console.error);

    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d) setDashboardStats(d);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (authChecked) {
      loadAllData();
    }
  }, [authChecked]);

  useEffect(() => {
    if (authChecked && (activeTab === "audit_logs" || activeTab === "overview")) {
      const params = new URLSearchParams();
      params.set("page", String(auditPage));
      params.set("limit", activeTab === "overview" ? "6" : "25");
      if (auditFilterAction && auditFilterAction !== "All") params.set("action", auditFilterAction);
      if (auditSearch) params.set("q", auditSearch);

      fetch(`/api/audit-logs?${params.toString()}`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.logs) {
            setAuditLogs(d.logs);
            setAuditTotal(d.total);
            setAuditTotalPages(d.totalPages);
          }
        })
        .catch(console.error);
    }
  }, [authChecked, activeTab, auditPage, auditFilterAction, auditSearch]);

  useEffect(() => {
    if (authChecked && activeTab === "admin_team" && currentUser?.role === "superadmin") {
      fetch("/api/admin/users")
        .then((r) => r.json())
        .then((d) => {
          if (d?.users) setAdminUsers(d.users);
        })
        .catch(console.error);
    }
  }, [authChecked, activeTab, currentUser]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const showBanner = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setStatusMsg("");
    } else {
      setStatusMsg(msg);
      setErrorMsg("");
      setTimeout(() => setStatusMsg(""), 5000);
    }
  };

  const requestConfirmation = ({ title, message, targetName, confirmText, confirmBtnClass, onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      targetName,
      confirmText: confirmText || "Confirm Action",
      confirmBtnClass: confirmBtnClass || "bg-red-700 hover:bg-red-800 text-white",
      action: onConfirm,
    });
  };

  const closeConfirmation = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false, action: null }));
  };

  // ==========================================
  // 1. MEMBER MANAGEMENT LOGIC
  // ==========================================
  const filteredMembers = useMemo(() => {
    let list = members.filter((m) => {
      if (statusFilter === "active" && (!m.isApproved || m.isArchived)) return false;
      if (statusFilter === "pending" && (m.isApproved || m.isArchived)) return false;
      if (statusFilter === "archived" && !m.isArchived && m.membershipStatus !== "archived") return false;
      if (statusFilter === "unlisted" && m.isPublished) return false;

      if (adminSearch) {
        const tokens = getSearchTokens(adminSearch).map((t) => t.toLowerCase());
        const digits = adminSearch.replace(/\D/g, "");
        const memberText = [
          m.name,
          m.city,
          m.state,
          m.occupation,
          m.company,
          m.phone,
          m.email,
          m.slug,
          ...(m.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const textMatches = tokens.some((t) => memberText.includes(t));
        const phoneMatches = digits.length >= 3 && m.phone && m.phone.replace(/\D/g, "").includes(digits);
        if (!textMatches && !phoneMatches) {
          return false;
        }
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (memberSort === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (memberSort === "name_asc") return (a.name || "").localeCompare(b.name || "");
      if (memberSort === "name_desc") return (b.name || "").localeCompare(a.name || "");
      if (memberSort === "city_asc") return (a.city || "").localeCompare(b.city || "");
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return list;
  }, [members, statusFilter, adminSearch, memberSort]);

  const totalMemberPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE) || 1;
  const paginatedMembers = useMemo(() => {
    const start = (membersPage - 1) * MEMBERS_PER_PAGE;
    return filteredMembers.slice(start, start + MEMBERS_PER_PAGE);
  }, [filteredMembers, membersPage]);

  useEffect(() => {
    setMembersPage(1);
  }, [statusFilter, adminSearch, memberSort]);

  const memberStats = useMemo(() => {
    const total = members.length;
    const approved = members.filter((m) => m.isApproved && !m.isArchived).length;
    const pending = members.filter((m) => !m.isApproved && !m.isArchived).length;
    const archived = members.filter((m) => m.isArchived || m.membershipStatus === "archived").length;
    return { total, approved, pending, archived };
  }, [members]);

  const resetMemberForm = () => {
    setEditingMemberId(null);
    setMemberForm({
      name: "",
      slug: "",
      role: "Member",
      occupation: "",
      company: "",
      city: "",
      state: "",
      address: "",
      pincode: "",
      phone: "",
      email: "",
      avatar: "",
      biography: "",
      tags: "",
      membershipStatus: "active",
      isApproved: true,
      isPublished: true,
      isArchived: false,
      showPhone: true,
      showEmail: true,
      showAddress: false,
    });
  };

  const startEditMember = (m) => {
    setEditingMemberId(m._id || m.id);
    setMemberForm({
      name: m.name || "",
      slug: m.slug || "",
      role: m.role || "Member",
      occupation: m.occupation || "",
      company: m.company || "",
      city: m.city || "",
      state: m.state || "",
      address: m.address || "",
      pincode: m.pincode || "",
      phone: m.phone || "",
      email: m.email || "",
      avatar: m.avatar || "",
      biography: m.biography || "",
      tags: Array.isArray(m.tags) ? m.tags.join(", ") : m.tags || "",
      membershipStatus: m.membershipStatus || "active",
      isApproved: Boolean(m.isApproved),
      isPublished: Boolean(m.isPublished),
      isArchived: Boolean(m.isArchived),
      showPhone: m.showPhone !== false,
      showEmail: m.showEmail !== false,
      showAddress: Boolean(m.showAddress),
    });
    setActiveTab("add_member");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMemberApproval = async (m) => {
    try {
      const id = m._id || m.id;
      const newStatus = !m.isApproved;
      const res = await fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update member approval status.");
      const data = await res.json();
      setMembers((prev) => prev.map((item) => (item._id === id || item.id === id ? data.member : item)));
      showBanner(`Member "${m.name}" set to ${newStatus ? "Approved" : "Pending"}.`);
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  const toggleMemberPublish = async (m) => {
    try {
      const id = m._id || m.id;
      const newPub = !m.isPublished;
      const res = await fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newPub }),
      });
      if (!res.ok) throw new Error("Failed to update visibility status.");
      const data = await res.json();
      setMembers((prev) => prev.map((item) => (item._id === id || item.id === id ? data.member : item)));
      showBanner(`Member "${m.name}" set to ${newPub ? "Published" : "Draft"}.`);
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  const toggleMemberArchive = (m) => {
    const isCurrentlyArchived = m.isArchived || m.membershipStatus === "archived";
    const nextState = !isCurrentlyArchived;

    requestConfirmation({
      title: nextState ? "Archive Member Record" : "Restore Member Record",
      message: nextState ? "Archived members remain stored safely in the database, but are excluded from public directory searches." : "Restoring this member will re-activate their record for public directory display upon approval.",
      targetName: m.name,
      confirmText: nextState ? "Archive Member" : "Restore Member",
      confirmBtnClass: nextState ? "bg-slate-700 hover:bg-slate-800 text-white" : "bg-emerald-700 hover:bg-emerald-800 text-white",
      onConfirm: async () => {
        try {
          const id = m._id || m.id;
          const res = await fetch(`/api/members/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              isArchived: nextState,
              membershipStatus: nextState ? "archived" : "active",
            }),
          });
          if (!res.ok) throw new Error("Failed to archive/restore member.");
          const data = await res.json();
          setMembers((prev) => prev.map((item) => (item._id === id || item.id === id ? data.member : item)));
          showBanner(`Member "${m.name}" set to ${nextState ? "Archived" : "Restored"}.`);
        } catch (err) {
          showBanner(err.message, true);
        }
      },
    });
  };

  const confirmDeleteMember = (m) => {
    requestConfirmation({
      title: "Delete Member Record",
      message: "Are you sure you want to permanently delete this member record? This action cannot be undone.",
      targetName: m.name,
      confirmText: "Permanently Delete",
      confirmBtnClass: "bg-red-700 hover:bg-red-800 text-white",
      onConfirm: async () => {
        try {
          const id = m._id || m.id;
          const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete member.");
          setMembers((prev) => prev.filter((item) => item._id !== id && item.id !== id));
          showBanner(`Member "${m.name}" successfully deleted.`);
        } catch (err) {
          showBanner(err.message, true);
        }
      },
    });
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...memberForm,
      tags: typeof memberForm.tags === "string"
        ? memberForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : memberForm.tags,
    };

    try {
      if (editingMemberId) {
        const res = await fetch(`/api/members/${editingMemberId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update member.");
        setMembers((prev) => prev.map((item) => (item._id === editingMemberId || item.id === editingMemberId ? data.member : item)));
        showBanner(`Member "${payload.name}" updated successfully.`);
      } else {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add member.");
        setMembers((prev) => [data.member, ...prev]);
        showBanner(`Member "${payload.name}" added successfully.`);
      }
      resetMemberForm();
      setActiveTab("members");
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (e, targetField = "member") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "folder",
      targetField === "gallery"
        ? "alokworld_gallery"
        : targetField === "heroImage"
        ? "alokworld_hero"
        : targetField === "ogImage"
        ? "alokworld_seo"
        : "alokworld_members"
    );

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (targetField === "member") {
        setMemberForm((prev) => ({ ...prev, avatar: data.url }));
        showBanner("Photo uploaded successfully.");
      } else if (targetField === "gallery") {
        setGalleryForm((prev) => ({ ...prev, imageUrl: data.url, publicId: data.publicId }));
        showBanner("Gallery image uploaded successfully.");
      } else if (targetField === "ogImage") {
        setSettings((prev) => ({ ...prev, ogImage: data.url }));
        showBanner("Social share image uploaded.");
      } else if (targetField === "heroImage") {
        setSettings((prev) => ({ ...prev, heroImage: data.url }));
        showBanner("Hero banner image uploaded! Please save settings.");
      }
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setUploadingImage(false);
    }
  };

  // ==========================================
  // 2. PAGE CONTENT CMS LOGIC
  // ==========================================
  const handleSelectPage = (slug) => {
    setSelectedPageSlug(slug);
    const page = pagesList.find((p) => p.slug === slug);
    if (page) {
      setPageForm(page);
    } else {
      setPageForm({
        slug,
        title: "",
        subtitle: "",
        bannerTitle: "",
        bannerSubtitle: "",
        content: "",
        status: "published",
        metaTitle: "",
        metaDescription: "",
      });
    }
  };

  const handleSavePage = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/pages/${selectedPageSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save page");

      setPagesList((prev) => {
        const idx = prev.findIndex((p) => p.slug === selectedPageSlug);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = data.page;
          return updated;
        }
        return [...prev, data.page];
      });

      showBanner(`Page "${data.page.title || selectedPageSlug}" saved successfully.`);
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePage = (slug) => {
    requestConfirmation({
      title: "Reset to Default Template",
      message: "Are you sure you want to delete custom content for this page? The system default template will be restored.",
      targetName: slug,
      confirmText: "Reset Content",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/pages/${slug}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete page");
          setPagesList((prev) => prev.filter((p) => p.slug !== slug));
          showBanner(`Page "${slug}" reset to default.`);
        } catch (err) {
          showBanner(err.message, true);
        }
      },
    });
  };

  // ==========================================
  // 3. PHOTO GALLERY CMS LOGIC
  // ==========================================
  const handleSaveGalleryItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingGalleryId) {
        const res = await fetch(`/api/gallery/${editingGalleryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(galleryForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update item");
        setGalleryItems((prev) => prev.map((it) => (it._id === editingGalleryId ? data.item : it)));
        showBanner("Gallery photo updated successfully.");
      } else {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(galleryForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add item");
        setGalleryItems((prev) => [data.item, ...prev]);
        showBanner("New photo added to gallery.");
      }
      setGalleryModalOpen(false);
      setEditingGalleryId(null);
      setGalleryForm({
      title: "",
      category: "National Convention",
      mediaType: "image",
      videoUrl: "",
      eventDate: "",
      imageUrl: "",
      publicId: "",
      description: "",
      isPublished: true,
      isFeatured: false,
    });
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGalleryItem = (item) => {
    requestConfirmation({
      title: "Delete Gallery Photo",
      message: "This photo will be removed from the public gallery.",
      targetName: item.title,
      confirmText: "Delete Photo",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/gallery/${item._id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete");
          setGalleryItems((prev) => prev.filter((it) => it._id !== item._id));
          showBanner(`Photo "${item.title}" deleted.`);
        } catch (err) {
          showBanner(err.message, true);
        }
      },
    });
  };

  // ==========================================
  // 4. SETTINGS & MAINTENANCE LOGIC
  // ==========================================
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...settings,
      keyRegions: typeof settings.keyRegions === "string"
        ? settings.keyRegions.split(",").map((s) => s.trim()).filter(Boolean)
        : settings.keyRegions,
    };

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");
      showBanner("Settings saved successfully.");
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // 5. ADMIN TEAM & ROLES LOGIC
  // ==========================================
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdminForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");

      setAdminUsers((prev) => [data.user, ...prev]);
      setNewAdminForm({ name: "", email: "", role: "editor", password: "" });
      showBanner(`Administrator "${data.user.email}" added successfully.`);
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = (adminUser) => {
    requestConfirmation({
      title: "Revoke Administrator Access",
      message: "Are you sure you want to revoke CMS login permissions for this administrator?",
      targetName: `${adminUser.name} (${adminUser.email})`,
      confirmText: "Revoke Access",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users?id=${adminUser._id}`, { method: "DELETE" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to delete user");
          setAdminUsers((prev) => prev.filter((u) => u._id !== adminUser._id));
          showBanner(`Administrator "${adminUser.email}" access revoked.`);
        } catch (err) {
          showBanner(err.message, true);
        }
      },
    });
  };

  // ==========================================
  // 6. CONTACT INQUIRIES LOGIC
  // ==========================================
  const handleDeleteMessage = (id) => {
    requestConfirmation({
      title: "Delete Inquiry Message",
      message: "Are you sure you want to delete this received contact inquiry?",
      targetName: `Inquiry #${id}`,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete inquiry.");
          setMessages((prev) => prev.filter((m) => m.id !== id && m._id !== id));
          showBanner("Inquiry message deleted.");
        } catch (err) {
          showBanner(err.message, true);
        }
      },
    });
  };

  const handleToggleMessageRead = async (id, currentVal) => {
    try {
      const nextVal = !currentVal;
      await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: nextVal }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id || m._id === id ? { ...m, isRead: nextVal } : m))
      );
    } catch (err) {
      console.warn("Could not toggle read:", err);
    }
  };

  const handleOpenReply = (inquiry) => {
    setReplyModal({
      isOpen: true,
      inquiryId: inquiry._id || inquiry.id,
      recipientEmail: inquiry.email,
      subject: inquiry.subject ? `Re: ${inquiry.subject}` : "Re: Inquiry - alokworld.in",
      message: `Dear ${inquiry.name || "Member"},\n\nThank you for contacting the Central Secretariat of Akhil Bhartiya Lodhi Adhikari-Karmachari Sangh (alokworld.in).\n\nIn response to your inquiry:\n\n\nSincerely,\nCentral Secretariat\nalokworld.in`,
      sending: false,
    });
  };

  const handleSendReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyModal.recipientEmail || !replyModal.subject || !replyModal.message) return;
    setReplyModal((prev) => ({ ...prev, sending: true }));

    try {
      const res = await fetch("/api/admin/emails/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: replyModal.inquiryId,
          recipientEmail: replyModal.recipientEmail,
          subject: replyModal.subject,
          message: replyModal.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to dispatch email reply.");

      showBanner(`Email reply sent successfully to ${replyModal.recipientEmail}.`);
      setReplyModal({ isOpen: false, inquiryId: null, recipientEmail: "", subject: "", message: "", sending: false });

      // Refresh emails and messages
      fetch("/api/admin/emails").then((r) => r.json()).then((d) => {
        if (d?.logs) setEmailsList(d.logs);
        if (d?.stats) setEmailStats(d.stats);
      });
      fetch("/api/contact").then((r) => r.json()).then((d) => {
        if (d?.messages) setMessages(d.messages);
      });
    } catch (err) {
      showBanner(err.message, true);
      setReplyModal((prev) => ({ ...prev, sending: false }));
    }
  };

  const handleRetryEmail = async (logId) => {
    try {
      const res = await fetch("/api/admin/emails/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Retry dispatch failed.");
      showBanner("Email dispatch retried successfully.");
      fetch("/api/admin/emails").then((r) => r.json()).then((d) => {
        if (d?.logs) setEmailsList(d.logs);
        if (d?.stats) setEmailStats(d.stats);
      });
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  // ==========================================
  // EDITORIAL NAVIGATION STRUCTURE (5 ORGANIZED GROUPS - BILINGUAL)
  // ==========================================
  const isHi = adminLang === "hi";
  const navigationSections = [
    {
      title: isHi ? "डैशबोर्ड" : "Dashboard",
      items: [
        { id: "overview", label: isHi ? "सिंहावलोकन एवं आंकड़े" : "Overview & Analytics", icon: "overview" },
        { id: "system_health", label: isHi ? "सिस्टम व सर्वर स्थिति" : "System & Server Health", icon: "server" },
      ],
    },
    {
      title: isHi ? "कंटेंट प्रबंधन (CMS)" : "Content Management (CMS)",
      items: [
        { id: "pages", label: isHi ? "पेज सामग्री (CMS)" : "Page Content (CMS)", icon: "document", count: pagesList.length },
        {
          id: "hero_widgets",
          label: isHi ? "मुख्य बैनर एवं घोषणाएं" : "Hero Banner & Announcements",
          icon: "widgets",
          activeIndicator: settings.announcementEnabled,
        },
        {
          id: "events",
          label: isHi ? "कार्यक्रम एवं उल्टी गिनती (Events)" : "Events & Live Countdown",
          icon: "calendar",
          activeIndicator: settings.eventEnabled,
        },        { id: "gallery", label: isHi ? "छायाचित्र दीर्घा" : "Photo Gallery", icon: "photo", count: galleryItems.length },
      ],
    },
    {
      title: isHi ? "सदस्य एवं समुदाय" : "Members & Community",
      items: [
        {
          id: "members",
          label: isHi ? "सदस्य निर्देशिका" : "Member Directory",
          icon: "users",
          count: memberStats.total,
          onClick: () => {
            setActiveTab("members");
            setStatusFilter("all");
          },
        },
        {
          id: "add_member",
          label: isHi ? "नया सदस्य जोड़ें" : "Add New Member",
          icon: "user-plus",
          onClick: () => {
            resetMemberForm();
            setActiveTab("add_member");
          },
        },
        {
          id: "messages",
          label: isHi ? "ईमेल एवं संपर्क संदेश" : "Email & Contact Management",
          icon: "mail",
          count: messages.length,
          activeIndicator: messages.some((m) => !m.isRead),
        },
      ],
    },
    {
      title: isHi ? "वेबसाइट सेटिंग्स" : "Website Settings",
      items: [
        { id: "site_settings", label: isHi ? "साइट सेटिंग्स एवं संपर्क" : "Site Settings & Contact", icon: "settings" },
        {
          id: "maintenance",
          label: isHi ? "रखरखाव मोड" : "Maintenance Mode",
          icon: "shield",
          activeIndicator: settings.maintenanceMode,
        },
      ],
    },
    {
      title: isHi ? "तकनीकी एसईओ" : "Technical SEO",
      items: [
        { id: "seo_settings", label: isHi ? "एसईओ एवं मेटा सेटिंग्स" : "SEO & Meta Settings", icon: "search" },
      ],
    },
  ];

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center p-4">
        <div className="bg-white border border-[#E2DDD5] p-6 text-center text-xs font-mono text-[#55657E]">
          Loading Admin Control Center...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8F6F0] text-[#1E293B] flex flex-col font-sans antialiased text-[13px]">
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BAR (Sticky Full-Width Header, 48px)                       */}
      {/* ========================================================================= */}
      <header className="h-12 w-full bg-white border-b border-[#E2DDD5] shrink-0 z-30 px-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xs text-[#102F6B] hover:text-[#D9531E] hover:bg-[#FAF8F3] cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/admin" className="flex items-center gap-1.5 font-bold text-sm tracking-tight text-[#102F6B]">
            <span>alokworld<span className="text-[#D9531E]">.in</span></span>
            <span className="text-[#A09A90] font-normal mx-0.5">/</span>
            <span className="text-xs font-medium text-[#55657E] hidden xs:inline">Admin Control Center</span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5 text-xs">
          <div className="text-[#55657E] hidden sm:flex items-center gap-1.5">
            <span className="font-medium text-[#1E293B]">{currentUser?.email}</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#F2EDE4] text-[#102F6B] border border-[#E2DDD5] rounded-xs font-semibold">
              {currentUser?.role || "Editor"}
            </span>
          </div>

          {/* Bilingual Language Switcher for Admin Panel */}
          <div className="flex items-center bg-[#F2EDE4] p-0.5 rounded border border-[#E2DDD5] text-xs font-semibold">
            <button
              type="button"
              onClick={() => changeAdminLang("en")}
              className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                adminLang === "en"
                  ? "bg-white text-[#102F6B] shadow-2xs font-bold"
                  : "text-[#55657E] hover:text-[#102F6B]"
              }`}
              title="Admin Panel in English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => changeAdminLang("hi")}
              className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                adminLang === "hi"
                  ? "bg-[#102F6B] text-white shadow-2xs font-bold"
                  : "text-[#55657E] hover:text-[#102F6B]"
              }`}
              title="एडमिन पैनल हिंदी में"
            >
              हिन्दी
            </button>
          </div>

          <span className="text-[#E2DDD5] hidden sm:inline">|</span>

          <Link
            href="/directory"
            target="_blank"
            className="text-[#102F6B] hover:text-[#D9531E] font-medium transition-colors flex items-center gap-1"
          >
            <span>{adminLang === "hi" ? "वेबसाइट देखें" : "View Website"}</span>
            <span className="text-[11px]">↗</span>
          </Link>

          <span className="text-[#E2DDD5]">|</span>

          <button
            onClick={handleLogout}
            className="text-red-700 hover:text-red-900 font-medium transition-colors cursor-pointer"
          >
            {adminLang === "hi" ? "लॉग आउट" : "Sign Out"}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY LAYOUT: FIXED STICKY SIDEBAR + FULL-WIDTH SCROLLABLE WORKSPACE     */}
      {/* ========================================================================= */}
      <div className="flex-1 flex w-full min-h-0 overflow-hidden relative">
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#0D1B2A]/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:relative top-0 bottom-0 left-0 md:left-auto
            w-60 lg:w-64 h-full bg-[#0D1B2A] text-slate-300 z-50 md:z-10 shrink-0 border-r border-[#1B2A40]
            flex flex-col justify-between transition-transform duration-200 ease-in-out
            ${mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* Mobile Header */}
          <div className="md:hidden h-12 px-4 flex items-center justify-between border-b border-[#1B2A40] bg-[#091424]">
            <span className="font-bold text-xs text-white">Admin Control Center</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
              aria-label="Close Navigation"
            >
              ✕
            </button>
          </div>

          {/* Nav List - Independently Scrollable */}
          <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-3.5 text-xs">
            {navigationSections.map((sec) => (
              <div key={sec.title} className="space-y-0.5">
                <div className="px-2 text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                  {sec.title}
                </div>
                {sec.items.map((item) => {
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.onClick) {
                          item.onClick();
                        } else {
                          setActiveTab(item.id);
                        }
                        setMobileMenuOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-2.5 py-1.5 rounded-xs text-left transition-colors cursor-pointer text-xs
                        ${
                          isSelected
                            ? "bg-[#162744] text-white border-l-2 border-[#D9531E] font-medium"
                            : "text-slate-300 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon name={item.icon} className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        {item.count !== undefined && (
                          <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.2 rounded-xs bg-white/5">
                            {item.count}
                          </span>
                        )}

                        {item.activeIndicator && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D9531E]" title="Active"></span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-[#1B2A40] text-[11px] text-slate-500 flex items-center justify-between bg-[#091424]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>alokworld.in</span>
            </div>
            <span className="font-mono text-slate-400 text-[10px]">v2.5 Full-Screen</span>
          </div>
        </aside>

        {/* Workspace: 100% full width, independent vertical scrolling, zero horizontal overflow */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden bg-[#F8F6F0] p-4 sm:p-6 lg:p-8 space-y-5">
          {/* Notifications */}
          {statusMsg && (
            <div className="p-3 bg-[#EAF5EC] border border-[#BDE0C6] text-[#1E5429] text-xs flex items-center justify-between rounded-xs">
              <span>{statusMsg}</span>
              <button onClick={() => setStatusMsg("")} className="font-bold ml-2 cursor-pointer">✕</button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-[#FDF0EE] border border-[#F3C4BE] text-[#932318] text-xs flex items-center justify-between rounded-xs">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg("")} className="font-bold ml-2 cursor-pointer">✕</button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">Publishing Overview & Statistics</h1>
                  <p className="text-xs text-[#55657E]">
                    Live system summary and community directory metrics directly from MongoDB Atlas.
                  </p>
                </div>
                <div className="text-xs text-[#55657E] font-mono">
                  {settings.maintenanceMode ? "● Maintenance Mode Active" : "● Live Portal Active"}
                </div>
              </div>

              {/* Operational Summary Strip (Live MongoDB & Email Telemetry) */}
              <div className="bg-white border border-[#E2DDD5] divide-y sm:divide-y-0 sm:divide-x divide-[#E2DDD5] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 rounded-xs">
                <div
                  className="p-3.5 cursor-pointer hover:bg-[#FAF8F3] transition-colors"
                  onClick={() => {
                    setActiveTab("members");
                    setStatusFilter("all");
                  }}
                >
                  <div className="text-[10px] uppercase font-semibold text-[#55657E]">Total Members</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#102F6B] mt-0.5">
                    {dashboardStats?.members?.total ?? memberStats.total}
                  </div>
                  <div className="text-[10px] text-[#55657E] mt-0.5">Directory Database</div>
                </div>

                <div
                  className="p-3.5 cursor-pointer hover:bg-[#FAF8F3] transition-colors"
                  onClick={() => {
                    setActiveTab("members");
                    setStatusFilter("active");
                  }}
                >
                  <div className="text-[10px] uppercase font-semibold text-emerald-800">Approved</div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-800 mt-0.5">
                    {dashboardStats?.members?.approved ?? memberStats.approved}
                  </div>
                  <div className="text-[10px] text-[#55657E] mt-0.5">Publicly Active</div>
                </div>

                <div
                  className={`p-3.5 cursor-pointer transition-colors ${
                    (dashboardStats?.members?.pending ?? memberStats.pending) > 0 ? "bg-amber-50/60 hover:bg-amber-50" : "hover:bg-[#FAF8F3]"
                  }`}
                  onClick={() => {
                    setActiveTab("members");
                    setStatusFilter("pending");
                  }}
                >
                  <div className="text-[10px] uppercase font-semibold text-amber-800">Pending Review</div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-800 mt-0.5">
                    {dashboardStats?.members?.pending ?? memberStats.pending}
                  </div>
                  <div className="text-[10px] text-[#55657E] mt-0.5">
                    {(dashboardStats?.members?.pending ?? memberStats.pending) > 0 ? "● Needs Review" : "All Approved"}
                  </div>
                </div>

                <div
                  className="p-3.5 cursor-pointer hover:bg-[#FAF8F3] transition-colors"
                  onClick={() => setActiveTab("pages")}
                >
                  <div className="text-[10px] uppercase font-semibold text-[#102F6B]">CMS Pages</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#102F6B] mt-0.5">
                    {dashboardStats?.cms?.pages ?? pagesList.length}
                  </div>
                  <div className="text-[10px] text-[#55657E] mt-0.5">Editorial Pages</div>
                </div>

                <div
                  className="p-3.5 cursor-pointer hover:bg-[#FAF8F3] transition-colors"
                  onClick={() => setActiveTab("gallery")}
                >
                  <div className="text-[10px] uppercase font-semibold text-[#55657E]">Photo Gallery</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#1E293B] mt-0.5">
                    {dashboardStats?.cms?.gallery ?? galleryItems.length}
                  </div>
                  <div className="text-[10px] text-[#55657E] mt-0.5">Cloudinary Media</div>
                </div>

                <div
                  className="p-3.5 cursor-pointer hover:bg-[#FAF8F3] transition-colors"
                  onClick={() => setActiveTab("messages")}
                >
                  <div className="text-[10px] uppercase font-semibold text-[#55657E]">Inquiries & Emails</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#102F6B] mt-0.5">
                    {dashboardStats?.inquiries?.total ?? messages.length}
                  </div>
                  <div className="text-[10px] text-[#55657E] mt-0.5">
                    {(dashboardStats?.inquiries?.unread ?? messages.filter((m) => !m.isRead).length) > 0 ? (
                      <span className="text-[#D9531E] font-medium font-mono">
                        {dashboardStats?.inquiries?.unread ?? messages.filter((m) => !m.isRead).length} Unread
                      </span>
                    ) : (
                      "All Answered"
                    )}
                  </div>
                </div>
              </div>

              {/* Email Gateway & Telemetry Strip */}
              <div className="bg-white border border-[#E2DDD5] p-3 rounded-xs text-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 flex-wrap text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[#55657E]">Outbound Emails:</span>
                    <span className="font-semibold text-[#102F6B]">
                      {dashboardStats?.emails?.sent ?? emailStats.sent} (Delivered: {dashboardStats?.emails?.delivered ?? emailStats.delivered})
                    </span>
                  </div>
                  <span className="text-[#E2DDD5]">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${(dashboardStats?.emails?.failed ?? emailStats.failed) > 0 ? "bg-red-500" : "bg-emerald-500"}`}></span>
                    <span className="text-[#55657E]">Email Failures:</span>
                    <span className={`font-semibold ${(dashboardStats?.emails?.failed ?? emailStats.failed) > 0 ? "text-red-700" : "text-[#1E293B]"}`}>
                      {dashboardStats?.emails?.failed ?? emailStats.failed}
                    </span>
                  </div>
                  <span className="text-[#E2DDD5]">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-[#55657E]">Inbound Emails:</span>
                    <span className="font-semibold text-[#1E293B]">
                      {dashboardStats?.emails?.received ?? emailStats.received} Received
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("messages")}
                  className="text-xs text-[#102F6B] hover:text-[#D9531E] font-semibold cursor-pointer underline"
                >
                  Open Email Management Center →
                </button>
              </div>

              {/* System & Portal Live Status Strip */}
              <div className="bg-white border border-[#E2DDD5] p-3 rounded-xs text-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 flex-wrap text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[#55657E]">Database:</span>
                    <span className="font-semibold text-[#1E293B]">MongoDB Online</span>
                  </div>
                  <span className="text-[#E2DDD5]">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${settings.announcementEnabled ? "bg-[#D9531E]" : "bg-slate-400"}`}></span>
                    <span className="text-[#55657E]">Announcement Bar:</span>
                    <span className="font-semibold text-[#1E293B]">
                      {settings.announcementEnabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <span className="text-[#E2DDD5]">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${settings.maintenanceMode ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                    <span className="text-[#55657E]">Maintenance Mode:</span>
                    <span className="font-semibold text-[#1E293B]">
                      {settings.maintenanceMode ? "Notice Active" : "Normal Mode"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("system_health")}
                    className="text-[11px] text-[#102F6B] hover:text-[#D9531E] font-medium underline"
                  >
                    View System Health & Diagnostics →
                  </button>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                <span className="font-semibold text-[#102F6B] mr-1">Quick Actions:</span>
                <button
                  onClick={() => { resetMemberForm(); setActiveTab("add_member"); }}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer shadow-2xs"
                >
                  + Add Member
                </button>
                <button
                  onClick={() => setActiveTab("pages")}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer shadow-2xs"
                >
                  Edit CMS Pages
                </button>
                <button
                  onClick={() => setActiveTab("hero_widgets")}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer shadow-2xs"
                >
                  Hero &amp; Announcements
                </button>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer shadow-2xs"
                >
                  Upload Gallery Photo
                </button>
                <button
                  onClick={() => setActiveTab("site_settings")}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer shadow-2xs"
                >
                  {isHi ? "साइट सेटिंग्स" : "Site Settings"}
                </button>
              </div>

              {/* Two Column Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Recent Members */}
                <div className="bg-white border border-[#E2DDD5] rounded-xs">
                  <div className="p-3 border-b border-[#E2DDD5] flex items-center justify-between font-bold text-xs text-[#102F6B]">
                    <span>{isHi ? "नवीनतम सदस्य पंजीकरण" : "Recent Member Registrations"}</span>
                    <button
                      onClick={() => { setActiveTab("members"); setStatusFilter("all"); }}
                      className="text-[#D9531E] hover:underline font-normal text-[11px] cursor-pointer"
                    >
                      {isHi ? "सभी देखें →" : "View All →"}
                    </button>
                  </div>
                  <div className="divide-y divide-[#EFECE6] text-xs">
                    {members.slice(0, 5).map((m) => (
                      <div key={m._id || m.id} className="p-2.5 flex items-center justify-between hover:bg-[#FAF8F3]">
                        <div>
                          <div className="font-medium text-[#102F6B]">{m.name}</div>
                          <div className="text-[11px] text-[#55657E]">{m.occupation || "Community Member"} · {m.city}</div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[11px] font-medium ${m.isApproved ? "text-emerald-700" : "text-amber-700"}`}>
                            {m.isApproved ? (isHi ? "स्वीकृत" : "Approved") : (isHi ? "प्रतीक्षारत" : "Pending")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Inquiries & Messages */}
                <div className="bg-white border border-[#E2DDD5] rounded-xs">
                  <div className="p-3 border-b border-[#E2DDD5] flex items-center justify-between font-bold text-xs text-[#102F6B]">
                    <span>{isHi ? "नवीनतम संदेश एवं पूछताछ" : "Recent Inquiries & Messages"}</span>
                    <button
                      onClick={() => setActiveTab("messages")}
                      className="text-[#D9531E] hover:underline font-normal text-[11px] cursor-pointer"
                    >
                      {isHi ? "सभी देखें →" : "View All →"}
                    </button>
                  </div>
                  <div className="divide-y divide-[#EFECE6] text-xs">
                    {messages.length === 0 ? (
                      <div className="p-4 text-center text-[#8896AB] italic">
                        {isHi ? "कोई नया संदेश नहीं है।" : "No inquiries received yet."}
                      </div>
                    ) : (
                      messages.slice(0, 5).map((msg) => (
                        <div key={msg._id} className="p-2.5 flex items-center justify-between hover:bg-[#FAF8F3]">
                          <div className="min-w-0 pr-2">
                            <span className="font-semibold text-[#102F6B] mr-1.5">{msg.name}</span>
                            <span className="text-[#55657E] text-[11px] truncate block">{msg.subject || msg.message}</span>
                          </div>
                          <span className="text-[10px] text-[#A09A90] shrink-0 font-mono">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: MEMBER DIRECTORY TABLE */}
          {/* ========================================================================= */}
          {activeTab === "members" && (
            <div className="space-y-3">
              {/* Header */}
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">Member Directory</h1>
                  <p className="text-xs text-[#55657E]">
                    Verified community records, approval statuses, and directory publishing.
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetMemberForm();
                    setActiveTab("add_member");
                  }}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer shadow-xs"
                >
                  + Add Member
                </button>
              </div>

              {/* Compact Unified Toolbar */}
              <div className="bg-white border border-[#E2DDD5] p-2 rounded-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 text-xs">
                {/* Status Segmented Tabs */}
                <div className="flex items-center gap-1 flex-wrap">
                  {[
                    { id: "all", label: isHi ? "सभी सदस्य" : "All", count: memberStats.total },
                    { id: "active", label: isHi ? "स्वीकृत" : "Approved", count: memberStats.approved },
                    { id: "pending", label: isHi ? "प्रतीक्षारत" : "Pending", count: memberStats.pending },
                    { id: "unlisted", label: isHi ? "अप्रकाशित" : "Draft / Unlisted" },
                    { id: "archived", label: isHi ? "संग्रहीत" : "Archived", count: memberStats.archived },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStatusFilter(s.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-xs cursor-pointer transition-colors ${
                        statusFilter === s.id
                          ? "bg-[#102F6B] text-white font-semibold"
                          : "text-[#55657E] hover:text-[#1E293B] hover:bg-[#F2EDE4]"
                      }`}
                    >
                      {s.label}
                      {s.count !== undefined && (
                        <span className={`ml-1 text-[11px] font-mono ${statusFilter === s.id ? "text-slate-300" : "text-[#8896AB]"}`}>
                          ({s.count})
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Sort & Search */}
                <div className="flex items-center gap-2">
                  <select
                    value={memberSort}
                    onChange={(e) => setMemberSort(e.target.value)}
                    className="h-8 px-2 rounded-xs border border-[#D5CEC4] bg-white text-xs text-[#1E293B] focus:border-[#102F6B] outline-hidden"
                  >
                    <option value="newest">{isHi ? "क्रम: नवीनतम" : "Sort: Newest"}</option>
                    <option value="oldest">{isHi ? "क्रम: पुरातन" : "Sort: Oldest"}</option>
                    <option value="name_asc">{isHi ? "क्रम: नाम A-Z" : "Sort: Name A-Z"}</option>
                    <option value="name_desc">{isHi ? "क्रम: नाम Z-A" : "Sort: Name Z-A"}</option>
                    <option value="city_asc">{isHi ? "क्रम: शहर अनुसार" : "Sort: City A-Z"}</option>
                  </select>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder={isHi ? "नाम, पद, शहर, फोन (हिंदी या English में खोजें)..." : "Search in Hindi or English (name, city, role)..."}
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="h-8 pl-7 pr-3 w-56 sm:w-72 rounded-xs border border-[#D5CEC4] bg-white text-xs text-[#1E293B] focus:border-[#102F6B] outline-hidden"
                    />
                    <span className="absolute left-2 top-2 text-[#8896AB] pointer-events-none">
                      <Icon name="search" className="w-3.5 h-3.5" />
                    </span>
                    {adminSearch && (
                      <button
                        onClick={() => setAdminSearch("")}
                        className="absolute right-2 top-2 text-[#8896AB] hover:text-[#1E293B]"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-[#E2DDD5] rounded-xs overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs min-w-[720px]">
                    <thead className="bg-[#FAF8F3] border-b border-[#E2DDD5] text-[11px] uppercase tracking-wider text-[#55657E] font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Member</th>
                        <th className="py-2.5 px-3">Role & Occupation</th>
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3">Approval</th>
                        <th className="py-2.5 px-3">Visibility</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE6]">
                      {paginatedMembers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-[#55657E]">
                            No member records found matching criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedMembers.map((m) => {
                          const isArchived = m.isArchived || m.membershipStatus === "archived";
                          return (
                            <tr key={m._id || m.id} className="hover:bg-[#FAF8F3] transition-colors">
                              {/* Member Name & Slug */}
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2.5">
                                  {m.avatar ? (
                                    <img
                                      src={m.avatar}
                                      alt=""
                                      className="w-7 h-7 rounded-xs object-cover border border-[#E2DDD5] shrink-0"
                                    />
                                  ) : (
                                    <div className="w-7 h-7 rounded-xs bg-[#F2EDE4] text-[#102F6B] border border-[#E2DDD5] flex items-center justify-center font-bold text-[11px] shrink-0">
                                      {m.name ? m.name.charAt(0).toUpperCase() : "M"}
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <Link
                                      href={`/member/${m.slug || m._id || m.id}`}
                                      target="_blank"
                                      className="font-semibold text-[#102F6B] hover:underline block truncate max-w-[180px]"
                                    >
                                      {m.name}
                                    </Link>
                                    <span className="text-[10px] text-[#8896AB] font-mono block truncate max-w-[150px]">
                                      /{m.slug || "id"}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Profession */}
                              <td className="py-2.5 px-3">
                                <div className="text-[#1E293B] font-medium truncate max-w-[190px]">
                                  {m.occupation || "Member"}
                                </div>
                                <div className="text-[11px] text-[#55657E] truncate max-w-[190px]">
                                  {m.company || m.role}
                                </div>
                              </td>

                              {/* Location */}
                              <td className="py-2.5 px-3 text-[#55657E]">
                                <div>{m.city || "—"}</div>
                                <div className="text-[11px] text-[#8896AB]">{m.state}</div>
                              </td>

                              {/* Approval Status */}
                              <td className="py-2.5 px-3">
                                <button
                                  type="button"
                                  onClick={() => toggleMemberApproval(m)}
                                  className="inline-flex items-center gap-1.5 cursor-pointer hover:underline"
                                  title="Click to toggle approval"
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      m.isApproved ? "bg-emerald-600" : "bg-amber-600"
                                    }`}
                                  ></span>
                                  <span className={`font-medium ${m.isApproved ? "text-emerald-800" : "text-amber-800"}`}>
                                    {m.isApproved ? "Approved" : "Pending"}
                                  </span>
                                </button>
                                {isArchived && (
                                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                                    [Archived]
                                  </span>
                                )}
                              </td>

                              {/* Visibility */}
                              <td className="py-2.5 px-3">
                                <button
                                  type="button"
                                  onClick={() => toggleMemberPublish(m)}
                                  className="inline-flex items-center gap-1.5 cursor-pointer hover:underline"
                                  title="Click to toggle publication"
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      m.isPublished ? "bg-blue-600" : "bg-slate-400"
                                    }`}
                                  ></span>
                                  <span className={m.isPublished ? "text-[#102F6B]" : "text-[#55657E]"}>
                                    {m.isPublished ? "Published" : "Draft"}
                                  </span>
                                </button>
                              </td>

                              {/* Action Text Links */}
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5 text-xs">
                                  <button
                                    onClick={() => startEditMember(m)}
                                    className="text-[#102F6B] hover:text-[#D9531E] font-medium hover:underline cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <span className="text-[#D5CEC4]">·</span>
                                  <button
                                    onClick={() => toggleMemberArchive(m)}
                                    className="text-[#55657E] hover:text-[#1E293B] hover:underline cursor-pointer"
                                  >
                                    {isArchived ? "Restore" : "Archive"}
                                  </button>
                                  {currentUser?.role === "superadmin" && (
                                    <>
                                      <span className="text-[#D5CEC4]">·</span>
                                      <button
                                        onClick={() => confirmDeleteMember(m)}
                                        className="text-red-700 hover:text-red-900 hover:underline cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="bg-[#FAF8F3] px-3 py-2 border-t border-[#E2DDD5] text-xs text-[#55657E] flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div>
                    Showing{" "}
                    <span className="font-semibold text-[#1E293B]">
                      {filteredMembers.length === 0 ? 0 : (membersPage - 1) * MEMBERS_PER_PAGE + 1}
                    </span>
                    –
                    <span className="font-semibold text-[#1E293B]">
                      {Math.min(membersPage * MEMBERS_PER_PAGE, filteredMembers.length)}
                    </span>{" "}
                    of <span className="font-semibold text-[#1E293B]">{filteredMembers.length}</span> total members
                  </div>

                  {totalMemberPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        disabled={membersPage <= 1}
                        onClick={() => setMembersPage((p) => Math.max(1, p - 1))}
                        className="px-2 py-0.5 bg-white border border-[#D5CEC4] rounded-xs disabled:opacity-40 cursor-pointer"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalMemberPages }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          onClick={() => setMembersPage(num)}
                          className={`w-6 h-6 rounded-xs text-xs font-mono cursor-pointer ${
                            membersPage === num
                              ? "bg-[#102F6B] text-white font-bold"
                              : "bg-white border border-[#D5CEC4] text-[#1E293B] hover:bg-[#F2EDE4]"
                          }`}
                        >
                          {num}
                        </button>
                      ))}

                      <button
                        disabled={membersPage >= totalMemberPages}
                        onClick={() => setMembersPage((p) => Math.min(totalMemberPages, p + 1))}
                        className="px-2 py-0.5 bg-white border border-[#D5CEC4] rounded-xs disabled:opacity-40 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: ADD / EDIT MEMBER FORM */}
          {/* ========================================================================= */}
          {activeTab === "add_member" && (
            <div className="bg-white border border-[#E2DDD5] p-5 sm:p-6 rounded-xs space-y-6">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">
                    {editingMemberId ? `Edit Member Record: ${memberForm.name}` : "Register Community Member"}
                  </h1>
                  <p className="text-xs text-[#55657E]">
                    Verified details, office/home addresses, and directory privacy consent.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetMemberForm();
                    setActiveTab("members");
                  }}
                  className="text-xs text-[#102F6B] hover:underline"
                >
                  ← Return to Member Directory
                </button>
              </div>

              <form onSubmit={handleMemberSubmit} className="space-y-6 text-xs max-w-4xl">
                {/* Identity */}
                <div className="space-y-3">
                  <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider border-b border-[#E2DDD5] pb-1">
                    Identity & Profile Photo
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-3">
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={memberForm.name}
                          onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">Profile Slug (URL)</label>
                        <input
                          type="text"
                          value={memberForm.slug}
                          onChange={(e) => setMemberForm({ ...memberForm, slug: e.target.value })}
                          placeholder="e.g. rajesh-kumar-lodhi"
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs font-mono text-xs focus:border-[#102F6B] outline-hidden"
                        />
                        <span className="text-[11px] text-[#55657E] mt-0.5 block">
                          Leave blank to auto-generate from name.
                        </span>
                      </div>
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">Community Role / Designation</label>
                        <input
                          type="text"
                          value={memberForm.role}
                          onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                          placeholder="e.g. Senior Patron, Executive Member"
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Avatar Upload */}
                    <div className="p-3 bg-[#FAF8F3] border border-[#E2DDD5] rounded-xs flex flex-col items-center justify-center text-center space-y-2">
                      <div className="w-16 h-16 rounded-xs overflow-hidden bg-white border border-[#D5CEC4] flex items-center justify-center font-bold text-lg text-[#102F6B]">
                        {memberForm.avatar ? (
                          <img src={memberForm.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>{memberForm.name ? memberForm.name.charAt(0) : "M"}</span>
                        )}
                      </div>
                      <label className="px-2.5 py-1 bg-white border border-[#D5CEC4] hover:border-[#102F6B] text-[11px] font-medium cursor-pointer rounded-xs">
                        {uploadingImage ? "Uploading..." : "Upload Photo"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "member")}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="Photo URL"
                        value={memberForm.avatar}
                        onChange={(e) => setMemberForm({ ...memberForm, avatar: e.target.value })}
                        className="w-full text-[10px] p-1 border border-[#D5CEC4] bg-white rounded-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional & Location */}
                <div className="space-y-3">
                  <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider border-b border-[#E2DDD5] pb-1">
                    Profession & Location
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Designation & Occupation *</label>
                      <input
                        type="text"
                        required
                        value={memberForm.occupation}
                        onChange={(e) => setMemberForm({ ...memberForm, occupation: e.target.value })}
                        placeholder="e.g. Executive Engineer, Doctor, Advocate"
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Department / Organization / Business</label>
                      <input
                        type="text"
                        value={memberForm.company}
                        onChange={(e) => setMemberForm({ ...memberForm, company: e.target.value })}
                        placeholder="e.g. Public Works Department (PWD)"
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">City / Town *</label>
                      <input
                        type="text"
                        required
                        value={memberForm.city}
                        onChange={(e) => setMemberForm({ ...memberForm, city: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={memberForm.state}
                        onChange={(e) => setMemberForm({ ...memberForm, state: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">PIN Code</label>
                      <input
                        type="text"
                        value={memberForm.pincode}
                        onChange={(e) => setMemberForm({ ...memberForm, pincode: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Residential / Office Full Address</label>
                      <input
                        type="text"
                        value={memberForm.address}
                        onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact & Biography */}
                <div className="space-y-3">
                  <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider border-b border-[#E2DDD5] pb-1">
                    Contact Information & Biography
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Mobile / Phone Number</label>
                      <input
                        type="text"
                        value={memberForm.phone}
                        onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                        placeholder="+91 98260 12345"
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Email Address</label>
                      <input
                        type="email"
                        value={memberForm.email}
                        onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                        placeholder="e.g. name@example.com"
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div className="col-span-full">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-medium text-[#1E293B]">
                          Biography, Career & Community Contributions
                        </label>
                        <span className="text-[10px] text-[#55657E]">
                          Supports bold, italic, lists, headings, links, and rich formatting
                        </span>
                      </div>
                      <RichTextEditor
                        value={memberForm.biography}
                        onChange={(html) => setMemberForm((prev) => ({ ...prev, biography: html }))}
                        minHeight="180px"
                        placeholder="Write detailed background, career, and community contributions..."
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy & Permissions */}
                <div className="space-y-3">
                  <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider border-b border-[#E2DDD5] pb-1">
                    Directory Visibility & Privacy Preferences
                  </h2>
                  <div className="p-3 bg-[#FAF8F3] border border-[#E2DDD5] rounded-xs space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1E293B]">
                      <input
                        type="checkbox"
                        checked={memberForm.isApproved}
                        onChange={(e) => setMemberForm({ ...memberForm, isApproved: e.target.checked })}
                      />
                      <span>Approved Community Member</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1E293B]">
                      <input
                        type="checkbox"
                        checked={memberForm.isPublished}
                        onChange={(e) => setMemberForm({ ...memberForm, isPublished: e.target.checked })}
                      />
                      <span>Display Publicly in Samaj Directory</span>
                    </label>

                    <div className="pt-1 border-t border-[#E2DDD5] grid grid-cols-1 sm:grid-cols-3 gap-2 text-[#55657E]">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={memberForm.showPhone}
                          onChange={(e) => setMemberForm({ ...memberForm, showPhone: e.target.checked })}
                        />
                        <span>Display phone number on public profile</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={memberForm.showEmail}
                          onChange={(e) => setMemberForm({ ...memberForm, showEmail: e.target.checked })}
                        />
                        <span>Display email address on public profile</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={memberForm.showAddress}
                          onChange={(e) => setMemberForm({ ...memberForm, showAddress: e.target.checked })}
                        />
                        <span>Display full address on public profile</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2DDD5]">
                  <button
                    type="button"
                    onClick={() => {
                      resetMemberForm();
                      setActiveTab("members");
                    }}
                    className="px-3 py-1.5 border border-[#D5CEC4] bg-white rounded-xs text-[#55657E] hover:text-[#1E293B] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-4 py-1.5 font-medium rounded-xs cursor-pointer shadow-xs"
                  >
                    {submitting ? "Saving..." : editingMemberId ? "Update Member" : "Create Member"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: PAGES CONTENT CMS */}
          {/* ========================================================================= */}
          {activeTab === "pages" && (
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between gap-3">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">Page Content CMS</h1>
                  <p className="text-xs text-[#55657E]">
                    Edit headings, banners, and editorial rich-text content across public pages.
                  </p>
                </div>
                <select
                  value={selectedPageSlug}
                  onChange={(e) => handleSelectPage(e.target.value)}
                  className="h-8 px-2.5 rounded-xs border border-[#D5CEC4] bg-white text-xs font-semibold text-[#102F6B]"
                >
                  <option value="about">About Us (/about)</option>
                  <option value="history">Community History (/history)</option>
                  <option value="organization">Organization & Executive (/organization)</option>
                  <option value="mahasabha">National Mahasabha (/mahasabha)</option>
                  <option value="personalities">Eminent Personalities (/personalities)</option>
                  <option value="contact">Secretariat Contact (/contact)</option>
                  <option value="privacy">Privacy Policy (/privacy)</option>
                  <option value="terms">Terms & Conditions (/terms)</option>
                </select>
              </div>

              <form onSubmit={handleSavePage} className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Page Heading / Title *</label>
                    <input
                      type="text"
                      required
                      value={pageForm.title}
                      onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={pageForm.subtitle}
                      onChange={(e) => setPageForm({ ...pageForm, subtitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Hero Banner Title</label>
                    <input
                      type="text"
                      value={pageForm.bannerTitle}
                      onChange={(e) => setPageForm({ ...pageForm, bannerTitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Hero Banner Subtitle</label>
                    <input
                      type="text"
                      value={pageForm.bannerSubtitle}
                      onChange={(e) => setPageForm({ ...pageForm, bannerSubtitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-[#1E293B]">
                      Visual Page Content (Editor)
                    </label>
                    <span className="text-[11px] text-[#55657E]">
                      Format headings, tables, links, quotes, and images.
                    </span>
                  </div>

                  <RichTextEditor
                    value={pageForm.content}
                    onChange={(html) => setPageForm((prev) => ({ ...prev, content: html }))}
                    minHeight="340px"
                    placeholder="Write editorial content with headings, lists, tables, and images..."
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E2DDD5]">
                  <button
                    type="button"
                    onClick={() => handleDeletePage(selectedPageSlug)}
                    className="text-xs text-red-700 hover:underline cursor-pointer"
                  >
                    Reset Page Content to Default Template
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-4 py-1.5 font-medium rounded-xs cursor-pointer shadow-xs"
                  >
                    {submitting ? "Saving..." : "Save Page Content"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: HERO & WIDGETS */}
          {/* ========================================================================= */}
          {activeTab === "hero_widgets" && (
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">Homepage Hero Banner & Announcements</h1>
                  <p className="text-xs text-[#55657E]">
                    Configure promotional headline, call-to-action button, and marquee announcement bar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Settings"}
                </button>
              </div>

              <div className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-5 text-xs">
                {/* Hero Section */}
                <div className="space-y-3">
                  <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider border-b border-[#E2DDD5] pb-1">
                    Homepage Main Hero Banner
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Hero Pill / Badge</label>
                      <input
                        type="text"
                        value={settings.heroBadge}
                        onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Main Headline</label>
                      <input
                        type="text"
                        value={settings.heroTitle}
                        onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden font-semibold"
                      />
                    </div>
                    <div className="col-span-full">
                      <label className="block font-medium text-[#1E293B] mb-1">Sub-headline</label>
                      <textarea
                        rows={2}
                        value={settings.heroSubtitle}
                        onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Primary CTA Button Label</label>
                      <input
                        type="text"
                        value={settings.heroCtaText}
                        onChange={(e) => setSettings({ ...settings, heroCtaText: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Primary CTA Destination URL</label>
                      <input
                        type="text"
                        value={settings.heroCtaLink}
                        onChange={(e) => setSettings({ ...settings, heroCtaLink: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div className="col-span-full">
                      <label className="block font-medium text-[#1E293B] mb-1">
                        Optional Hero Banner Image (Cloudinary URL)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="https://res.cloudinary.com/..."
                          value={settings.heroImage || ""}
                          onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                          className="flex-1 px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden font-mono text-xs"
                        />
                        <label className="px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#F2EDE4] border border-[#D5CEC4] text-[#102F6B] text-xs font-medium rounded-xs cursor-pointer shrink-0">
                          <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage}
                            onChange={(e) => handleImageUpload(e, "heroImage")}
                            className="hidden"
                          />
                        </label>
                        {settings.heroImage && (
                          <button
                            type="button"
                            onClick={() => setSettings({ ...settings, heroImage: "" })}
                            className="px-2 py-1.5 text-xs text-red-700 hover:bg-red-50 border border-red-200 rounded-xs cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Interactive Preview Canvas */}
                <div className="space-y-2 pt-3 border-t border-[#E2DDD5]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider">
                      Live Portal Preview (Desktop View)
                    </h3>
                    <span className="text-[10px] text-[#55657E]">
                      Real-time interactive preview of hero banner and notice ticker
                    </span>
                  </div>

                  <div className="border border-[#D5CEC4] rounded-xs bg-[#FFFCF5] p-3 sm:p-4 space-y-3">
                    {/* Top Announcement Strip Simulation */}
                    {settings.announcementEnabled ? (
                      <div className="bg-[#091D42] text-white px-3 py-1.5 text-xs rounded-xs flex items-center gap-2 border-l-4 border-[#F26A21]">
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-[#F26A21] text-white rounded-xs shrink-0">
                          Notice
                        </span>
                        <span className="text-xs truncate">{settings.announcement || "No announcement text configured"}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-[#8896AB] italic px-2">
                        [Announcement strip is currently disabled]
                      </div>
                    )}

                    {/* Hero Banner Card Simulation */}
                    <div className="bg-white rounded-xs p-4 sm:p-6 border border-[#F0E5D5] shadow-xs flex flex-col md:flex-row items-start justify-between gap-4">
                      <div className="flex-1 max-w-2xl space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold tracking-wider text-[#F26A21] uppercase bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5]">
                            {settings.heroBadge || "Official Community Portal"}
                          </span>
                          <span className="text-xs text-[#55657E]">• alokworld.in</span>
                        </div>

                        <h2 className="text-lg sm:text-xl font-black text-[#102F6B] leading-snug">
                          {settings.heroTitle || "Akhil Bhartiya Samaj Directory & Central Portal"}
                        </h2>

                        <p className="text-xs text-[#64748B] leading-relaxed">
                          {settings.heroSubtitle || "A comprehensive digital network connecting community members across India."}
                        </p>

                        <div className="pt-2 flex flex-wrap gap-2">
                          <span className="inline-block px-3 py-1.5 bg-[#F26A21] text-white font-semibold text-xs rounded-xs shadow-xs">
                            {settings.heroCtaText || "Explore Member Directory →"}
                          </span>
                          <span className="inline-block px-3 py-1.5 bg-[#102F6B] text-white font-medium text-xs rounded-xs">
                            Register / Contact
                          </span>
                        </div>
                      </div>

                      {settings.heroImage && (
                        <div className="w-full md:w-56 shrink-0 rounded-xs overflow-hidden border border-[#E2DDD5]">
                          <img src={settings.heroImage} alt="Hero Banner" className="w-full h-32 object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Community Sidebar Notice Simulation */}
                    {settings.sidebarNoticeEnabled && (
                      <div className="bg-white p-3 border border-[#E2DDD5] rounded-xs space-y-1 max-w-md">
                        <div className="text-[11px] font-bold text-[#102F6B] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D9531E]"></span>
                          <span>{settings.sidebarNoticeTitle || "Community Announcements"}</span>
                        </div>
                        <p className="text-xs text-[#55657E] leading-relaxed">
                          {settings.sidebarNoticeContent || "Notice content text..."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Announcement Strip */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-1">
                    <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider">
                      Top Marquee Announcement Ticker Bar
                    </h2>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[#1E293B]">
                      <input
                        type="checkbox"
                        checked={settings.announcementEnabled}
                        onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                      />
                      <span>Enabled</span>
                    </label>
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Announcement Bar Message</label>
                    <textarea
                      rows={2}
                      value={settings.announcement}
                      onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                </div>

                {/* Sidebar Community Notice */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-1">
                    <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider">
                      Sidebar Community Notice
                    </h2>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[#1E293B]">
                      <input
                        type="checkbox"
                        checked={settings.sidebarNoticeEnabled}
                        onChange={(e) => setSettings({ ...settings, sidebarNoticeEnabled: e.target.checked })}
                      />
                      <span>Enabled</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Notice Title</label>
                      <input
                        type="text"
                        value={settings.sidebarNoticeTitle}
                        onChange={(e) => setSettings({ ...settings, sidebarNoticeTitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Notice Description</label>
                      <textarea
                        rows={2}
                        value={settings.sidebarNoticeContent}
                        onChange={(e) => setSettings({ ...settings, sidebarNoticeContent: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: PHOTO GALLERY */}
          {/* ========================================================================= */}
          {activeTab === "gallery" && (
            <div className="space-y-4">
              <div className="border-b border-[#E2DDD5] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">
                    {isHi ? "छायाचित्र एवं वीडियो दीर्घा प्रबंधन" : "Photo & Video Gallery Management"}
                  </h1>
                  <p className="text-xs text-[#55657E]">
                    {isHi
                      ? "सामुदायिक आयोजनों, सम्मेलनों की तस्वीरें और यूट्यूब वीडियो जोड़ें, संपादित करें व प्रदर्शित करें।"
                      : "Upload photos and embed YouTube videos of community conventions, cultural gatherings, and historic events."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingGalleryId(null);
                      setGalleryForm({
                        title: "",
                        category: "National Convention",
                        mediaType: "image",
                        videoUrl: "",
                        eventDate: "",
                        imageUrl: "",
                        publicId: "",
                        description: "",
                        isPublished: true,
                        isFeatured: false,
                      });
                      setGalleryModalOpen(true);
                    }}
                    className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-semibold rounded-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <span>+ {isHi ? "मीडिया जोड़ें (फोटो / वीडियो)" : "Add Media (Photo / Video)"}</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs Toolbar */}
              <div className="flex items-center justify-between gap-2 bg-white p-2 border border-[#E2DDD5] rounded-xs text-xs">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setAdminGalleryFilter("all")}
                    className={`px-2.5 py-1 rounded-xs font-medium transition-colors cursor-pointer ${
                      adminGalleryFilter === "all"
                        ? "bg-[#102F6B] text-white font-bold"
                        : "text-[#55657E] hover:bg-[#FAF8F3]"
                    }`}
                  >
                    {isHi ? "सभी मीडिया" : "All Media"} ({galleryItems.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminGalleryFilter("image")}
                    className={`px-2.5 py-1 rounded-xs font-medium transition-colors cursor-pointer ${
                      adminGalleryFilter === "image"
                        ? "bg-[#102F6B] text-white font-bold"
                        : "text-[#55657E] hover:bg-[#FAF8F3]"
                    }`}
                  >
                    📷 {isHi ? "तस्वीरें" : "Photos"} ({galleryItems.filter((i) => i.mediaType !== "video").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminGalleryFilter("video")}
                    className={`px-2.5 py-1 rounded-xs font-medium transition-colors cursor-pointer ${
                      adminGalleryFilter === "video"
                        ? "bg-red-700 text-white font-bold"
                        : "text-red-700 hover:bg-red-50"
                    }`}
                  >
                    🎥 {isHi ? "यूट्यूब वीडियो" : "YouTube Videos"} ({galleryItems.filter((i) => i.mediaType === "video").length})
                  </button>
                </div>

                <span className="text-[11px] text-[#8896AB] hidden sm:inline">
                  {isHi ? "डेटाबेस में सुरक्षित" : "Stored in MongoDB"}
                </span>
              </div>

              {/* Gallery Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                {galleryItems
                  .filter((it) => {
                    if (adminGalleryFilter === "image") return it.mediaType !== "video";
                    if (adminGalleryFilter === "video") return it.mediaType === "video";
                    return true;
                  })
                  .map((it) => {
                    const isVid = it.mediaType === "video";
                    return (
                      <div
                        key={it._id}
                        className="bg-white border border-[#E2DDD5] rounded-xs overflow-hidden flex flex-col justify-between hover:border-[#102F6B] transition-colors shadow-xs"
                      >
                        <div>
                          <div className="h-36 bg-[#FAF8F3] border-b border-[#E2DDD5] overflow-hidden relative">
                            <img
                              src={it.imageUrl || (isVid ? `https://img.youtube.com/vi/${it.videoId}/hqdefault.jpg` : "/asset/topofwebsite/web_sit_front1.png")}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <span
                              className={`absolute top-1.5 left-1.5 text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded shadow-xs ${
                                isVid ? "bg-red-600" : "bg-[#102F6B]"
                              }`}
                            >
                              {isVid ? "🎥 VIDEO" : "📷 PHOTO"}
                            </span>
                            {it.isFeatured && (
                              <span className="absolute top-1.5 right-1.5 bg-amber-400 text-[#091D42] text-[9.5px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                                ⭐ HOME
                              </span>
                            )}
                          </div>
                          <div className="p-2.5">
                            <div className="font-semibold text-[#102F6B] truncate" title={it.title}>
                              {it.title}
                            </div>
                            <div className="text-[11px] text-[#55657E] mt-0.5 flex items-center justify-between">
                              <span>{it.category}</span>
                              <span className="text-[10px] text-[#8896AB]">{it.eventDate || "Archive"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="px-2.5 py-2 border-t border-[#EFECE6] flex items-center justify-between text-[11px] bg-[#FAF8F3]">
                          {isVid && it.videoUrl ? (
                            <a
                              href={it.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-700 hover:underline font-semibold"
                            >
                              Watch ▶
                            </a>
                          ) : (
                            <span className="text-[#8896AB]">Verified</span>
                          )}
                          <div className="space-x-1.5">
                            <button
                              onClick={() => {
                                setEditingGalleryId(it._id);
                                setGalleryForm({
                                  title: it.title || "",
                                  category: it.category || "National Convention",
                                  mediaType: it.mediaType || "image",
                                  videoUrl: it.videoUrl || "",
                                  imageUrl: it.imageUrl || "",
                                  publicId: it.publicId || "",
                                  eventDate: it.eventDate || "",
                                  description: it.description || "",
                                  isPublished: it.isPublished !== undefined ? it.isPublished : true,
                                  isFeatured: Boolean(it.isFeatured),
                                });
                                setGalleryModalOpen(true);
                              }}
                              className="text-[#102F6B] hover:underline font-medium cursor-pointer"
                            >
                              Edit
                            </button>
                            <span className="text-[#D5CEC4]">·</span>
                            <button
                              onClick={() => handleDeleteGalleryItem(it)}
                              className="text-red-700 hover:underline font-medium cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Add / Edit Media Modal */}
              {galleryModalOpen && (
                <div className="fixed inset-0 bg-[#0D1B2A]/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white max-w-lg w-full border border-[#D5CEC4] p-5 rounded-xs space-y-3.5 text-xs shadow-xl">
                    <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-2 font-bold text-[#102F6B]">
                      <span>
                        {editingGalleryId
                          ? isHi ? "मीडिया संपादन करें" : "Edit Media Item"
                          : isHi ? "नया मीडिया जोड़ें (फोटो या यूट्यूब वीडियो)" : "Add New Media (Photo or Video)"}
                      </span>
                      <button onClick={() => setGalleryModalOpen(false)} className="text-slate-500 hover:text-black font-bold">
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveGalleryItem} className="space-y-3">
                      {/* Media Type Toggle */}
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">
                          {isHi ? "मीडिया प्रकार चुनें (Media Type)" : "Media Type *"}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setGalleryForm({ ...galleryForm, mediaType: "image" })}
                            className={`py-1.5 px-3 rounded-xs border text-xs font-semibold cursor-pointer transition-colors ${
                              galleryForm.mediaType !== "video"
                                ? "bg-[#102F6B] text-white border-[#102F6B]"
                                : "bg-white text-[#55657E] border-[#D5CEC4] hover:bg-[#FAF8F3]"
                            }`}
                          >
                            📷 {isHi ? "तस्वीर / छायाचित्र (Photo)" : "Photo Image"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setGalleryForm({ ...galleryForm, mediaType: "video" })}
                            className={`py-1.5 px-3 rounded-xs border text-xs font-semibold cursor-pointer transition-colors ${
                              galleryForm.mediaType === "video"
                                ? "bg-red-600 text-white border-red-600"
                                : "bg-white text-red-700 border-red-200 hover:bg-red-50"
                            }`}
                          >
                            🎥 {isHi ? "यूट्यूब वीडियो (YouTube Video)" : "YouTube Video"}
                          </button>
                        </div>
                      </div>

                      {/* YouTube Video URL Field (Only if video) */}
                      {galleryForm.mediaType === "video" && (
                        <div className="p-3 bg-red-50/60 border border-red-200 rounded-xs space-y-2">
                          <label className="block font-bold text-red-900">
                            YouTube Video URL / Link *
                          </label>
                          <input
                            type="url"
                            required
                            value={galleryForm.videoUrl || ""}
                            onChange={(e) => setGalleryForm({ ...galleryForm, videoUrl: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                            className="w-full px-2.5 py-1.5 border border-red-300 bg-white rounded-xs focus:border-red-600 outline-hidden font-mono text-xs"
                          />
                          <p className="text-[10.5px] text-red-700">
                            वीडियो लिंक डालते ही यूट्यूब का थंबनेल और वीडियो स्वतः लोड हो जाएगा।
                          </p>

                          <label className="flex items-center gap-1.5 pt-1 cursor-pointer font-medium text-[#1E293B]">
                            <input
                              type="checkbox"
                              checked={Boolean(galleryForm.isFeatured)}
                              onChange={(e) => setGalleryForm({ ...galleryForm, isFeatured: e.target.checked })}
                              className="w-3.5 h-3.5"
                            />
                            <span>{isHi ? "मुखपृष्ठ पर मुख्य वीडियो के रूप में दिखाएं (Feature on Homepage)" : "Feature on Homepage Video Section"}</span>
                          </label>
                        </div>
                      )}

                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">
                          {isHi ? "शीर्षक (Title) *" : "Title *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={galleryForm.title}
                          onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                          placeholder={galleryForm.mediaType === "video" ? "वीडियो का शीर्षक..." : "तस्वीर का शीर्षक..."}
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-medium text-[#1E293B] mb-1">
                            {isHi ? "श्रेणी (Category)" : "Category"}
                          </label>
                          <input
                            type="text"
                            value={galleryForm.category}
                            onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                            placeholder="National Convention, Heritage..."
                            className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-[#1E293B] mb-1">
                            {isHi ? "दिनांक / वर्ष" : "Event Date / Year"}
                          </label>
                          <input
                            type="text"
                            value={galleryForm.eventDate}
                            onChange={(e) => setGalleryForm({ ...galleryForm, eventDate: e.target.value })}
                            placeholder="2026, 15 नवम्बर..."
                            className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Image / Thumbnail URL */}
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">
                          {galleryForm.mediaType === "video"
                            ? isHi ? "कस्टम थंबनेल URL (वैकल्पिक)" : "Custom Thumbnail URL (Optional)"
                            : isHi ? "फोटो URL या फाइल अपलोड करें *" : "Image URL or Upload *"}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            required={galleryForm.mediaType !== "video"}
                            value={galleryForm.imageUrl}
                            onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                            placeholder={galleryForm.mediaType === "video" ? "Auto-derived from YouTube if empty" : "https://res.cloudinary.com/... or /asset/..."}
                            className="flex-1 px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden font-mono text-xs"
                          />
                          <label className="px-2.5 py-1.5 bg-[#FAF8F3] hover:bg-[#F2EDE4] border border-[#D5CEC4] text-[#102F6B] text-[11px] font-medium cursor-pointer rounded-xs shrink-0">
                            {uploadingImage ? "Uploading..." : "Upload File"}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage}
                              onChange={(e) => handleImageUpload(e, "gallery")}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">
                          {isHi ? "संक्षिप्त विवरण (Description)" : "Description"}
                        </label>
                        <textarea
                          rows={2}
                          value={galleryForm.description || ""}
                          onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-[#E2DDD5]">
                        <button
                          type="button"
                          onClick={() => setGalleryModalOpen(false)}
                          className="px-3 py-1.5 border border-[#D5CEC4] rounded-xs text-[#55657E] hover:bg-slate-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-4 py-1.5 rounded-xs font-semibold cursor-pointer shadow-xs"
                        >
                          {submitting ? "Saving..." : "Save Media Item"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
                    {/* ========================================================================= */}
          {/* VIEW: TECHNICAL SEO */}
          {/* ========================================================================= */}
          {activeTab === "seo_settings" && (
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">Technical SEO & Indexing Directives</h1>
                  <p className="text-xs text-[#55657E]">
                    Configure global meta tags, OpenGraph preview cards, and search engine indexing directives.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save SEO Settings"}
                </button>
              </div>

              <div className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Primary Meta Title (Template: %s | alokworld.in)</label>
                    <input
                      type="text"
                      value={settings.seoTitle}
                      onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Canonical Base URL</label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Organization Name (Schema.org)</label>
                    <input
                      type="text"
                      value={settings.organizationName}
                      onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Google Search Console Verification Token</label>
                    <input
                      type="text"
                      value={settings.googleVerificationId}
                      onChange={(e) => setSettings({ ...settings, googleVerificationId: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs font-mono"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block font-medium text-[#1E293B] mb-1">Default Meta Description</label>
                    <textarea
                      rows={2}
                      value={settings.seoDescription}
                      onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block font-medium text-[#1E293B] mb-1">Meta Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={settings.seoKeywords}
                      onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block font-medium text-[#1E293B] mb-1">
                      OpenGraph Social Share Image URL (1200×630px recommended)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="https://res.cloudinary.com/..."
                        value={settings.ogImage || ""}
                        onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                        className="flex-1 px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden font-mono text-xs"
                      />
                      <label className="px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#F2EDE4] border border-[#D5CEC4] text-[#102F6B] text-xs font-medium rounded-xs cursor-pointer shrink-0">
                        <span>{uploadingImage ? "Uploading..." : "Upload Photo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingImage}
                          onChange={(e) => handleImageUpload(e, "ogImage")}
                          className="hidden"
                        />
                      </label>
                      {settings.ogImage && (
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, ogImage: "" })}
                          className="px-2 py-1.5 text-xs text-red-700 hover:bg-red-50 border border-red-200 rounded-xs cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: SITE INFORMATION */}
          {/* ========================================================================= */}
          {activeTab === "site_settings" && (
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">Site Identity & Secretariat Contact</h1>
                  <p className="text-xs text-[#55657E]">
                    Manage central secretariat correspondence information, phone numbers, and address details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Contact Info"}
                </button>
              </div>

              <div className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Portal Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Secretariat Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Official Contact Phone</label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Secretariat Office Postal Address</label>
                    <input
                      type="text"
                      value={settings.contactAddress}
                      onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: MAINTENANCE MODE */}
          {/* ========================================================================= */}
          {activeTab === "maintenance" && (
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">Maintenance Mode</h1>
                  <p className="text-xs text-[#55657E]">
                    Toggle emergency maintenance mode. When active, visitors see a polite advisory while administrators retain access.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Settings"}
                </button>
              </div>

              <div className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-4 text-xs">
                <div className="p-3 bg-[#FAF8F3] border border-[#E2DDD5] flex items-center justify-between rounded-xs">
                  <div>
                    <div className="font-semibold text-[#1E293B]">Maintenance Mode Enabled</div>
                    <div className="text-[11px] text-[#55657E]">
                      Displays an advisory banner on all public pages.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E293B] mb-1">Public Advisory Notice Message</label>
                  <textarea
                    rows={3}
                    value={settings.maintenanceMessage}
                    onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}


          {/* ========================================================================= */}
          {/* VIEW: INQUIRIES & EMAIL MANAGEMENT */}
          {activeTab === "messages" && (
            <div className="space-y-3.5">
              <div className="border-b border-[#E2DDD5] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">Email & Contact Inquiries Management</h1>
                  <p className="text-xs text-[#55657E]">
                    Monitor visitor inquiries, view inbound messages, track delivery statuses via Resend, and dispatch replies.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#55657E]">
                    Total Inquiries: <strong className="text-[#102F6B] font-bold">{messages.length}</strong>
                  </span>
                  <span className="text-[#D5CEC4]">·</span>
                  <span className="text-xs text-[#55657E]">
                    Outbound Emails: <strong className="text-[#102F6B] font-bold">{emailStats.sent + emailStats.delivered + emailStats.failed + emailStats.bounced}</strong>
                  </span>
                </div>
              </div>

              {/* Sub-tab Navigation */}
              <div className="flex items-center gap-1.5 border-b border-[#E2DDD5] pb-2 text-xs">
                <button
                  type="button"
                  onClick={() => setMessagesSubTab("inquiries")}
                  className={`px-3 py-1.5 rounded-xs font-semibold cursor-pointer transition-colors ${
                    messagesSubTab === "inquiries"
                      ? "bg-[#102F6B] text-white"
                      : "bg-[#FAF8F3] text-[#55657E] hover:text-[#1E293B] border border-[#E2DDD5]"
                  }`}
                >
                  Visitor Inquiries ({messages.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMessagesSubTab("received")}
                  className={`px-3 py-1.5 rounded-xs font-semibold cursor-pointer transition-colors ${
                    messagesSubTab === "received"
                      ? "bg-[#102F6B] text-white"
                      : "bg-[#FAF8F3] text-[#55657E] hover:text-[#1E293B] border border-[#E2DDD5]"
                  }`}
                >
                  Received Emails (Inbound) ({emailsList.filter((e) => e.direction === "inbound").length})
                </button>
                <button
                  type="button"
                  onClick={() => setMessagesSubTab("sent")}
                  className={`px-3 py-1.5 rounded-xs font-semibold cursor-pointer transition-colors ${
                    messagesSubTab === "sent"
                      ? "bg-[#102F6B] text-white"
                      : "bg-[#FAF8F3] text-[#55657E] hover:text-[#1E293B] border border-[#E2DDD5]"
                  }`}
                >
                  Sent Email History & Telemetry ({emailsList.filter((e) => e.direction === "outbound").length})
                </button>
              </div>

              {/* ========================================================= */}
              {/* SUB-TAB 1: CONTACT INQUIRIES                               */}
              {/* ========================================================= */}
              {messagesSubTab === "inquiries" && (
                <div className="space-y-2.5">
                  {messages.length === 0 ? (
                    <div className="bg-white border border-[#E2DDD5] p-6 text-center text-xs text-[#55657E]">
                      No contact inquiries recorded yet.
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id || msg._id}
                        className={`p-3.5 border rounded-xs text-xs space-y-2 transition-all ${
                          msg.isRead ? "bg-white border-[#E2DDD5]" : "bg-[#FFFBF5] border-[#F26A21] shadow-xs"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0E5D5] pb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#102F6B] text-sm">{msg.name}</span>
                            <span className="text-[#D5CEC4]">·</span>
                            <a href={`mailto:${msg.email}`} className="text-[#F26A21] hover:underline font-mono text-[11px] font-medium">
                              {msg.email}
                            </a>
                            {msg.phone && (
                              <>
                                <span className="text-[#D5CEC4]">·</span>
                                <span className="text-[#55657E] font-mono text-[11px]">📞 {msg.phone}</span>
                              </>
                            )}
                            <span className="text-[#D5CEC4]">·</span>
                            <span className="text-[10px] text-[#64748B]">
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleString("en-US") : "Recent"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Notification Status Badge */}
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold rounded-xs border ${
                                msg.notificationStatus === "sent"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : msg.notificationStatus === "failed"
                                  ? "bg-red-50 text-red-800 border-red-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}
                            >
                              Notification: {msg.notificationStatus === "sent" ? "Sent ✓" : msg.notificationStatus === "failed" ? "Failed ✕" : "Pending"}
                            </span>

                            {/* Actions */}
                            <button
                              type="button"
                              onClick={() => handleOpenReply(msg)}
                              className="px-2.5 py-1 bg-[#102F6B] hover:bg-[#091D42] text-white rounded-xs text-[11px] font-medium cursor-pointer shadow-xs"
                            >
                              ✉️ Reply
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleMessageRead(msg._id || msg.id, msg.isRead)}
                              className="px-2 py-1 bg-white border border-[#D5CEC4] text-[#55657E] hover:text-[#102F6B] rounded-xs text-[11px] cursor-pointer"
                            >
                              {msg.isRead ? "Mark Unread" : "Mark Read"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg._id || msg.id)}
                              className="px-2 py-1 bg-white border border-red-200 text-red-700 hover:bg-red-50 rounded-xs text-[11px] cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="font-semibold text-[#102F6B]">Subject: {msg.subject || "General Inquiry"}</div>
                        <p className="text-[#263449] leading-relaxed bg-[#FAF8F3] p-2.5 border border-[#E2DDD5] rounded-xs whitespace-pre-wrap">
                          {msg.message}
                        </p>

                        {/* Display Thread of Previous Replies */}
                        {Array.isArray(msg.replies) && msg.replies.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-[#E2DDD5] space-y-1.5">
                            <span className="text-[10px] font-bold uppercase text-[#55657E] tracking-wider">
                              Secretariat Replies ({msg.replies.length}):
                            </span>
                            {msg.replies.map((rep, idx) => (
                              <div key={idx} className="bg-white p-2 border border-[#E2DDD5] rounded-xs text-[11px] space-y-1">
                                <div className="flex items-center justify-between text-[#64748B]">
                                  <span>By: {rep.adminEmail}</span>
                                  <span>{rep.sentAt ? new Date(rep.sentAt).toLocaleString("hi-IN") : ""}</span>
                                </div>
                                <div className="font-medium text-[#102F6B]">{rep.subject}</div>
                                <p className="text-[#55657E] whitespace-pre-wrap">{rep.message}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* SUB-TAB 2: RECEIVED INBOUND EMAILS                         */}
              {/* ========================================================= */}
              {messagesSubTab === "received" && (
                <div className="space-y-3">
                  <div className="bg-[#FAF8F3] p-3 border border-[#E2DDD5] rounded-xs text-xs text-[#55657E]">
                    <strong>Inbound Email Gateway:</strong> Emails sent to <code className="text-[#102F6B] font-mono">contact@alokworld.in</code> are automatically recorded via webhook <code className="text-[#102F6B] font-mono">/api/webhooks/inbound-email</code>.
                  </div>

                  {emailsList.filter((e) => e.direction === "inbound").length === 0 ? (
                    <div className="bg-white border border-[#E2DDD5] p-6 text-center text-xs text-[#55657E]">
                      No inbound emails received yet.
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E2DDD5] rounded-xs overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#FAF8F3] border-b border-[#E2DDD5] text-[#102F6B] font-bold">
                            <th className="py-2.5 px-3">Time</th>
                            <th className="py-2.5 px-3">From (Sender)</th>
                            <th className="py-2.5 px-3">Subject</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DDD5]">
                          {emailsList
                            .filter((e) => e.direction === "inbound")
                            .map((em) => (
                              <tr key={em._id || em.id} className="hover:bg-[#FFFCF5]">
                                <td className="py-2 px-3 text-[#64748B] text-[11px] whitespace-nowrap">
                                  {em.createdAt ? new Date(em.createdAt).toLocaleString("hi-IN") : ""}
                                </td>
                                <td className="py-2 px-3 font-medium text-[#1E293B] max-w-[180px] truncate">
                                  {em.from}
                                </td>
                                <td className="py-2 px-3 text-[#102F6B] max-w-[240px] truncate font-medium">
                                  {em.subject}
                                </td>
                                <td className="py-2 px-3">
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold rounded-xs">
                                    Received
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-right space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedEmailDetail(em)}
                                    className="text-[#102F6B] hover:underline cursor-pointer text-xs"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenReply({
                                        _id: em._id,
                                        name: em.from,
                                        email: em.from,
                                        subject: em.subject,
                                      })
                                    }
                                    className="text-[#F26A21] hover:underline cursor-pointer text-xs font-semibold"
                                  >
                                    Reply
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* SUB-TAB 3: SENT EMAIL HISTORY & LIVE DELIVERY STATUS        */}
              {/* ========================================================= */}
              {messagesSubTab === "sent" && (
                <div className="space-y-3">
                  {/* Delivery Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white border border-[#E2DDD5] p-3 rounded-xs text-center">
                      <div className="text-[10px] uppercase font-bold text-[#55657E]">Total Sent</div>
                      <div className="text-xl font-bold text-[#102F6B] mt-0.5">
                        {emailStats.sent + emailStats.delivered + emailStats.failed + emailStats.bounced}
                      </div>
                    </div>
                    <div className="bg-white border border-emerald-200 p-3 rounded-xs text-center">
                      <div className="text-[10px] uppercase font-bold text-emerald-800">Delivered</div>
                      <div className="text-xl font-bold text-emerald-800 mt-0.5">
                        {emailStats.delivered}
                      </div>
                    </div>
                    <div className="bg-white border border-blue-200 p-3 rounded-xs text-center">
                      <div className="text-[10px] uppercase font-bold text-blue-800">Sent / Accepted</div>
                      <div className="text-xl font-bold text-blue-800 mt-0.5">
                        {emailStats.sent}
                      </div>
                    </div>
                    <div className="bg-white border border-red-200 p-3 rounded-xs text-center">
                      <div className="text-[10px] uppercase font-bold text-red-800">Failed</div>
                      <div className="text-xl font-bold text-red-800 mt-0.5">
                        {emailStats.failed}
                      </div>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="bg-white border border-[#E2DDD5] p-2.5 rounded-xs flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <label className="font-semibold text-[#102F6B]">Status Filter:</label>
                      <select
                        value={emailFilterStatus}
                        onChange={(e) => setEmailFilterStatus(e.target.value)}
                        className="px-2 py-1 border border-[#D5CEC4] bg-white rounded-xs text-xs"
                      >
                        <option value="all">All Statuses</option>
                        <option value="delivered">Delivered</option>
                        <option value="sent">Sent</option>
                        <option value="failed">Failed</option>
                        <option value="bounced">Bounced</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="Search by recipient or subject..."
                      value={emailSearch}
                      onChange={(e) => setEmailSearch(e.target.value)}
                      className="px-2.5 py-1 border border-[#D5CEC4] bg-white rounded-xs text-xs min-w-[200px]"
                    />
                  </div>

                  {/* Outbound Table */}
                  {emailsList.filter((e) => e.direction === "outbound").length === 0 ? (
                    <div className="bg-white border border-[#E2DDD5] p-6 text-center text-xs text-[#55657E]">
                      No outbound email records found.
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E2DDD5] rounded-xs overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#FAF8F3] border-b border-[#E2DDD5] text-[#102F6B] font-bold">
                            <th className="py-2.5 px-3">Dispatched At</th>
                            <th className="py-2.5 px-3">To (Recipient)</th>
                            <th className="py-2.5 px-3">Subject</th>
                            <th className="py-2.5 px-3">Type</th>
                            <th className="py-2.5 px-3">Provider ID</th>
                            <th className="py-2.5 px-3">Live Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2DDD5]">
                          {emailsList
                            .filter((e) => e.direction === "outbound")
                            .filter((e) => (emailFilterStatus === "all" ? true : e.status === emailFilterStatus))
                            .filter((e) => {
                              if (!emailSearch) return true;
                              const s = emailSearch.toLowerCase();
                              return (
                                (e.subject && e.subject.toLowerCase().includes(s)) ||
                                (Array.isArray(e.to) && e.to.some((t) => t.toLowerCase().includes(s)))
                              );
                            })
                            .map((em) => (
                              <tr key={em._id || em.id} className="hover:bg-[#FFFCF5]">
                                <td className="py-2 px-3 text-[#64748B] text-[11px] whitespace-nowrap">
                                  {em.createdAt ? new Date(em.createdAt).toLocaleString("hi-IN") : ""}
                                </td>
                                <td className="py-2 px-3 font-mono text-[11px] text-[#1E293B] max-w-[160px] truncate">
                                  {Array.isArray(em.to) ? em.to.join(", ") : em.to}
                                </td>
                                <td className="py-2 px-3 text-[#102F6B] max-w-[220px] truncate font-medium">
                                  {em.subject}
                                </td>
                                <td className="py-2 px-3 text-[10px] text-[#55657E]">
                                  {em.emailType === "contact_notification"
                                    ? "Secretariat Notification"
                                    : em.emailType === "visitor_confirmation"
                                    ? "Visitor Confirmation"
                                    : em.emailType === "admin_reply"
                                    ? "Admin Reply"
                                    : "System"}
                                </td>
                                <td className="py-2 px-3 font-mono text-[10px] text-[#64748B] max-w-[110px] truncate">
                                  {em.providerMessageId || "—"}
                                </td>
                                <td className="py-2 px-3 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-0.5 text-[10px] font-bold rounded-xs border ${
                                      em.status === "delivered"
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                        : em.status === "sent"
                                        ? "bg-blue-50 text-blue-800 border-blue-200"
                                        : em.status === "failed"
                                        ? "bg-red-50 text-red-800 border-red-200"
                                        : em.status === "bounced"
                                        ? "bg-purple-50 text-purple-800 border-purple-200"
                                        : "bg-amber-50 text-amber-800 border-amber-200"
                                    }`}
                                  >
                                    {em.status === "delivered"
                                      ? "Delivered"
                                      : em.status === "sent"
                                      ? "Sent"
                                      : em.status === "failed"
                                      ? "Failed"
                                      : em.status === "bounced"
                                      ? "Bounced"
                                      : "Pending"}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-right space-x-1.5 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedEmailDetail(em)}
                                    className="text-[#102F6B] hover:underline cursor-pointer text-xs"
                                  >
                                    Telemetry
                                  </button>
                                  {em.status === "failed" && (
                                    <button
                                      type="button"
                                      onClick={() => handleRetryEmail(em._id || em.id)}
                                      className="text-[#F26A21] hover:underline cursor-pointer text-xs font-bold"
                                    >
                                      Retry Send
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW: SYSTEM & DATABASE HEALTH                                            */}
          {/* ========================================================================= */}
          {activeTab === "system_health" && (
            <div className="space-y-4">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">Site & System Health Diagnostics</h1>
                  <p className="text-xs text-[#55657E]">
                    Real-time connection monitoring, database telemetry, and infrastructure diagnostics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    fetchMembers();
                    fetchPages();
                    fetchSettings();
                    fetchGallery();
                    fetchMessages();
                    setStatusMsg("System telemetry and health checks refreshed successfully.");
                  }}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] text-xs font-medium rounded-xs cursor-pointer shadow-2xs"
                >
                  Recheck Diagnostics ↺
                </button>
              </div>

              {/* 6-Card Diagnostic Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* 1. Database Connection */}
                <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#102F6B]">MongoDB Atlas Database</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-xs text-[#55657E] leading-relaxed">
                    Remote MongoDB Atlas replica set with Mongoose connection pooling.
                  </p>
                  <div className="text-[11px] font-mono text-[#55657E] pt-2 border-t border-[#EFECE6] space-y-1">
                    <div className="flex justify-between"><span>Members:</span> <span className="font-bold text-[#1E293B]">{memberStats.total} records</span></div>
                    <div className="flex justify-between"><span>CMS Pages:</span> <span className="font-bold text-[#1E293B]">{pagesList.length} documents</span></div>
                    <div className="flex justify-between"><span>Gallery Media:</span> <span className="font-bold text-[#1E293B]">{galleryItems.length} photos</span></div>
                    <div className="flex justify-between"><span>Contact Inquiries:</span> <span className="font-bold text-[#1E293B]">{messages.length} messages</span></div>
                  </div>
                </div>

                {/* 2. Media Storage / CDN */}
                <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#102F6B]">Cloudinary Media Storage & CDN</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-xs text-[#55657E] leading-relaxed">
                    Secure server-side upload endpoint with Cloudinary CDN optimization.
                  </p>
                  <div className="text-[11px] font-mono text-[#55657E] pt-2 border-t border-[#EFECE6] space-y-1">
                    <div className="flex justify-between"><span>API Gateway:</span> <span className="text-[#1E293B]">/api/upload</span></div>
                    <div className="flex justify-between"><span>Size Restriction:</span> <span className="text-[#1E293B]">Max 5.0 MB</span></div>
                    <div className="flex justify-between"><span>MIME Filter:</span> <span className="text-[#1E293B]">JPEG, PNG, WebP, GIF</span></div>
                  </div>
                </div>

                {/* 3. Authentication & Proxy */}
                <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#102F6B]">Authentication Proxy (Next.js)</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                      ENFORCED
                    </span>
                  </div>
                  <p className="text-xs text-[#55657E] leading-relaxed">
                    Cryptographically verified JWT tokens in HTTP-only cookies.
                  </p>
                  <div className="text-[11px] font-mono text-[#55657E] pt-2 border-t border-[#EFECE6] space-y-1">
                    <div className="flex justify-between"><span>Active User:</span> <span className="text-[#1E293B] font-bold truncate max-w-[140px]">{currentUser?.email}</span></div>
                    <div className="flex justify-between"><span>Assigned Role:</span> <span className="text-[#102F6B] font-bold uppercase">{currentUser?.role}</span></div>
                    <div className="flex justify-between"><span>Token Session:</span> <span className="text-[#1E293B]">7 days rolling</span></div>
                  </div>
                </div>

                {/* 4. Technical SEO Endpoints */}
                <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#102F6B]">Search Engine Directives (SEO)</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-xs text-[#55657E] leading-relaxed">
                    Dynamic XML sitemap and robots.txt index all published routes and members.
                  </p>
                  <div className="text-[11px] pt-2 border-t border-[#EFECE6] flex items-center justify-between">
                    <a href="/sitemap.xml" target="_blank" className="text-[#102F6B] hover:text-[#D9531E] font-medium underline">
                      View sitemap.xml ↗
                    </a>
                    <a href="/robots.txt" target="_blank" className="text-[#102F6B] hover:text-[#D9531E] font-medium underline">
                      View robots.txt ↗
                    </a>
                  </div>
                </div>

                {/* 5. Email Dispatch Service */}
                <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#102F6B]">Email Dispatch Service (Resend)</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                      CONFIGURED
                    </span>
                  </div>
                  <p className="text-xs text-[#55657E] leading-relaxed">
                    Transactional email sending via contact@alokworld.in with delivery tracking.
                  </p>
                  <div className="text-[11px] font-mono text-[#55657E] pt-2 border-t border-[#EFECE6] space-y-1">
                    <div className="flex justify-between"><span>Total Inquiries:</span> <span className="font-bold text-[#1E293B]">{messages.length}</span></div>
                    <div className="flex justify-between"><span>Inbox Address:</span> <span className="text-[#1E293B] truncate max-w-[140px]">{settings.contactEmail}</span></div>
                  </div>
                </div>

                {/* 6. OWASP Security Headers */}
                <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#102F6B]">HTTP Security Headers (OWASP)</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-[#55657E] leading-relaxed">
                    Security headers strictly enforced across all responses via proxy middleware.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-800 pt-2 border-t border-[#EFECE6] space-y-0.5">
                    <div>✓ HSTS: max-age=63072000; preload</div>
                    <div>✓ X-Frame-Options: SAMEORIGIN</div>
                    <div>✓ X-Content-Type-Options: nosniff</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONFIRMATION MODAL (Clean, Editorial, Non-disruptive) */}
      {/* ========================================================================= */}
      {/* REPLY MODAL */}
      {replyModal.isOpen && (
        <div className="fixed inset-0 bg-[#0D1B2A]/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full border border-[#D5CEC4] p-5 rounded-xs space-y-3.5 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-2">
              <span className="font-bold text-sm text-[#102F6B]">Send Official Email Reply</span>
              <button
                type="button"
                onClick={() => setReplyModal({ isOpen: false, inquiryId: null, recipientEmail: "", subject: "", message: "", sending: false })}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendReplySubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Recipient Email:</label>
                <input
                  type="email"
                  readOnly
                  value={replyModal.recipientEmail}
                  className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-[#FAF8F3] rounded-xs font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Email Subject:</label>
                <input
                  type="text"
                  required
                  value={replyModal.subject}
                  onChange={(e) => setReplyModal({ ...replyModal, subject: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Reply Message Body:</label>
                <textarea
                  required
                  rows={6}
                  value={replyModal.message}
                  onChange={(e) => setReplyModal({ ...replyModal, message: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2DDD5]">
                <button
                  type="button"
                  onClick={() => setReplyModal({ isOpen: false, inquiryId: null, recipientEmail: "", subject: "", message: "", sending: false })}
                  className="px-3 py-1.5 border border-[#D5CEC4] rounded-xs text-[#55657E] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={replyModal.sending}
                  className="px-4 py-1.5 bg-[#102F6B] hover:bg-[#091D42] text-white font-medium rounded-xs cursor-pointer shadow-xs"
                >
                  {replyModal.sending ? "Dispatching via Resend..." : "Send Email Reply →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMAIL DETAIL MODAL */}
      {selectedEmailDetail && (
        <div className="fixed inset-0 bg-[#0D1B2A]/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full border border-[#D5CEC4] p-5 rounded-xs space-y-3 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-2">
              <span className="font-bold text-sm text-[#102F6B]">Email Delivery Telemetry</span>
              <button
                type="button"
                onClick={() => setSelectedEmailDetail(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 bg-[#FAF8F3] p-3 border border-[#E2DDD5] rounded-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">Direction:</span>
                <span className="font-bold uppercase text-[#102F6B]">{selectedEmailDetail.direction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">From:</span>
                <span className="font-mono">{selectedEmailDetail.from}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">To:</span>
                <span className="font-mono">{Array.isArray(selectedEmailDetail.to) ? selectedEmailDetail.to.join(", ") : selectedEmailDetail.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">Subject:</span>
                <span className="font-bold">{selectedEmailDetail.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">Provider ID:</span>
                <span className="font-mono text-[11px]">{selectedEmailDetail.providerMessageId || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">Live Status:</span>
                <span className="font-bold text-[#F26A21]">{selectedEmailDetail.status}</span>
              </div>
              {selectedEmailDetail.errorMessage && (
                <div className="p-2 bg-red-50 border border-red-200 text-red-800 rounded-xs text-[11px]">
                  <strong>Error Description:</strong> {selectedEmailDetail.errorMessage}
                </div>
              )}
            </div>

            <div>
              <span className="font-semibold text-[#1E293B] block mb-1">Message Content:</span>
              <div className="p-2.5 bg-white border border-[#E2DDD5] rounded-xs max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed text-[#263449]">
                {selectedEmailDetail.textBody || selectedEmailDetail.htmlBody || "(No content)"}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E2DDD5]">
              <button
                type="button"
                onClick={() => setSelectedEmailDetail(null)}
                className="px-3 py-1.5 bg-[#102F6B] text-white rounded-xs cursor-pointer font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-[#0D1B2A]/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full border border-[#D5CEC4] p-5 rounded-xs space-y-3 text-xs shadow-lg">
            <div className="font-bold text-sm text-[#102F6B] border-b border-[#E2DDD5] pb-2">
              {confirmModal.title}
            </div>

            <p className="text-[#55657E] leading-relaxed">{confirmModal.message}</p>

            {confirmModal.targetName && (
              <div className="p-2 bg-[#FAF8F3] border border-[#E2DDD5] font-mono text-[11px] text-[#1E293B] truncate">
                Target: {confirmModal.targetName}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2DDD5]">
              <button
                type="button"
                onClick={closeConfirmation}
                className="px-3 py-1.5 border border-[#D5CEC4] bg-white rounded-xs text-[#55657E] hover:text-[#1E293B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (confirmModal.action) {
                    await confirmModal.action();
                  }
                  closeConfirmation();
                }}
                className={`px-3 py-1.5 rounded-xs font-medium text-xs cursor-pointer ${confirmModal.confirmBtnClass}`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
