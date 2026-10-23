"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 border border-[#D5CEC4] bg-[#FAF8F3] flex items-center justify-center text-xs text-[#55657E] animate-pulse rounded-xs">
      विजुअल रिच-टेक्स्ट संपादक लोड हो रहा है...
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
    isअनुमोदित: true,
    isप्रकाशित: true,
    isArchived: false,
    showPhone: true,
    showEmail: true,
    showAddress: false,
  });

  // 2. पृष्ठ सामग्री प्रबंधन (CMS) State
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
    eventDate: "",
    imageUrl: "",
    publicId: "",
    description: "",
    isPublished: true,
  });

  // 4. Website Settings State
  const [settings, setSettings] = useState({
    siteName: "",
    tagline: "",
    announcement: "",
    announcementEnabled: true,
    heroBadge: "आधिकारिक समाज पोर्टल",
    heroTitle: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय पोर्टल",
    heroSubtitle: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक) एवं समाज डायरेक्टरी — देशभर के सभी सत्यापित सदस्यों, वरिष्ठजनों, चिकित्सकों, इंजीनियरों, अधिवक्ताओं एवं युवाओं को जोड़ने वाला आधिकारिक मंच।",
    heroCtaText: "सदस्य डायरेक्टरी देखें →",
    heroCtaLink: "/directory",
    heroImage: "",
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

  // 6. Admin Team & भूमिकाs State
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
    confirmText: "पुष्टि करें",
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
      confirmText: confirmText || "पुष्टि करें",
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
        const q = adminSearch.toLowerCase().trim();
        const matchesName = m.name?.toLowerCase().includes(q);
        const matchesCity = m.city?.toLowerCase().includes(q);
        const matchesOccupation = m.occupation?.toLowerCase().includes(q);
        const matchesCompany = m.company?.toLowerCase().includes(q);
        const matchesSlug = m.slug?.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesOccupation && !matchesCompany && !matchesSlug) {
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
      if (!res.ok) throw new Error("अनुमोदन स्थिति अद्यतन करने में विफल");
      const data = await res.json();
      setMembers((prev) => prev.map((item) => (item._id === id || item.id === id ? data.member : item)));
      showBanner(`सदस्य "${m.name}" को ${newStatus ? "अनुमोदित" : "प्रतीक्षारत"} किया गया।`);
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
      if (!res.ok) throw new Error("दृश्यता अद्यतन करने में विफल");
      const data = await res.json();
      setMembers((prev) => prev.map((item) => (item._id === id || item.id === id ? data.member : item)));
      showBanner(`सदस्य "${m.name}" की दृश्यता ${newPub ? "प्रकाशित" : "अप्रकाशित"} निर्धारित की गई।`);
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  const toggleMemberArchive = (m) => {
    const isCurrentlyArchived = m.isArchived || m.membershipStatus === "archived";
    const nextState = !isCurrentlyArchived;

    requestConfirmation({
      title: nextState ? "सदस्य रिकॉर्ड संग्रहीत करें" : "सदस्य रिकॉर्ड पुनर्स्थापित करें",
      message: nextState ? "संग्रहीत सदस्य डेटाबेस में सुरक्षित रहते हैं, किंतु सार्वजनिक खोजों से बाहर रहते हैं।" : "इस रिकॉर्ड को पुनर्स्थापित करने पर अनुमोदन उपरांत यह पुनः सार्वजनिक डायरेक्टरी में दृश्यमान होगा।",
      targetName: m.name,
      confirmText: nextState ? "सदस्य संग्रहीत करें" : "सदस्य पुनर्स्थापित करें",
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
          if (!res.ok) throw new Error("सदस्य संग्रहीत/पुनर्स्थापित करने में विफल");
          const data = await res.json();
          setMembers((prev) => prev.map((item) => (item._id === id || item.id === id ? data.member : item)));
          showBanner(`सदस्य "${m.name}" को ${nextState ? "संग्रहीत" : "पुनर्स्थापित"} किया गया।`);
        } catch (err) {
          showBanner(err.message, true);
        }
      },
    });
  };

  const confirmDeleteMember = (m) => {
    requestConfirmation({
      title: "सदस्य रिकॉर्ड हटाएं",
      message: "क्या आप निश्चित रूप से इस सदस्य रिकॉर्ड को स्थायी रूप से हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।",
      targetName: m.name,
      confirmText: "स्थायी रूप से हटाएं",
      confirmBtnClass: "bg-red-700 hover:bg-red-800 text-white",
      onConfirm: async () => {
        try {
          const id = m._id || m.id;
          const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("सदस्य हटाने में विफल");
          setMembers((prev) => prev.filter((item) => item._id !== id && item.id !== id));
          showBanner(`सदस्य "${m.name}" सफलतापूर्वक हटा दिया गया।`);
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
        if (!res.ok) throw new Error(data.error || "सदस्य अद्यतन करने में विफल");
        setMembers((prev) => prev.map((item) => (item._id === editingMemberId || item.id === editingMemberId ? data.member : item)));
        showBanner(`सदस्य "${payload.name}" सफलतापूर्वक अद्यतन किया गया।`);
      } else {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "सदस्य जोड़ने में विफल");
        setMembers((prev) => [data.member, ...prev]);
        showBanner(`सदस्य "${payload.name}" सफलतापूर्वक जोड़ा गया।`);
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
        showBanner("छायाचित्र सफलतापूर्वक अपलोड किया गया।");
      } else if (targetField === "gallery") {
        setGalleryForm((prev) => ({ ...prev, imageUrl: data.url, publicId: data.publicId }));
        showBanner("गैलरी छायाचित्र सफलतापूर्वक अपलोड किया गया।");
      } else if (targetField === "ogImage") {
        setSettings((prev) => ({ ...prev, ogImage: data.url }));
        showBanner("सोशल छायाचित्र अपलोड किया गया।");
      } else if (targetField === "heroImage") {
        setSettings((prev) => ({ ...prev, heroImage: data.url }));
        showBanner("हीरो बैनर छायाचित्र अपलोड किया गया! कृपया सेटिंग्स सुरक्षित करें।");
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

      showBanner(`पृष्ठ "${data.page.title || selectedPageSlug}" सुरक्षित किया गया।`);
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePage = (slug) => {
    requestConfirmation({
      title: "डिफ़ॉल्ट प्रारूप पर रीसेट करें",
      message: "क्या आप इस पृष्ठ की कस्टम सामग्री हटाना चाहते हैं? इसके स्थान पर सिस्टम का डिफ़ॉल्ट टेम्पलेट उपयोग किया जाएगा।",
      targetName: slug,
      confirmText: "सामग्री रीसेट करें",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/pages/${slug}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete page");
          setPagesList((prev) => prev.filter((p) => p.slug !== slug));
          showBanner(`पृष्ठ "${slug}" डिफ़ॉल्ट पर रीसेट कर दिया गया।`);
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
        showBanner("गैलरी छायाचित्र अद्यतन किया गया।");
      } else {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(galleryForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add item");
        setGalleryItems((prev) => [data.item, ...prev]);
        showBanner("गैलरी में नया छायाचित्र जोड़ा गया।");
      }
      setGalleryModalOpen(false);
      setEditingGalleryId(null);
      setGalleryForm({
        title: "",
        category: "National Convention",
        eventDate: "",
        imageUrl: "",
        publicId: "",
        description: "",
        isPublished: true,
      });
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGalleryItem = (item) => {
    requestConfirmation({
      title: "गैलरी छायाचित्र हटाएं",
      message: "यह छायाचित्र रिकॉर्ड सार्वजनिक गैलरी से हटा दिया जाएगा।",
      targetName: item.title,
      confirmText: "छायाचित्र हटाएं",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/gallery/${item._id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete");
          setGalleryItems((prev) => prev.filter((it) => it._id !== item._id));
          showBanner(`छायाचित्र "${item.title}" हटा दिया गया।`);
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
      showBanner("सेटिंग्स सफलतापूर्वक सुरक्षित की गईं।");
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
      showBanner(`प्रशासक "${data.user.email}" जोड़ा गया।`);
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = (adminUser) => {
    requestConfirmation({
      title: "प्रशासक पहुंच निरस्त करें",
      message: "क्या आप निश्चित रूप से इस प्रशासक की सीएमएस लॉगिन अनुमतियां निरस्त करना चाहते हैं?",
      targetName: `${adminUser.name} (${adminUser.email})`,
      confirmText: "पहुंच निरस्त करें",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users?id=${adminUser._id}`, { method: "DELETE" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to delete user");
          setAdminUsers((prev) => prev.filter((u) => u._id !== adminUser._id));
          showBanner(`प्रशासक "${adminUser.email}" हटा दिया गया।`);
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
      title: "पूछताछ संदेश हटाएं",
      message: "क्या आप निश्चित रूप से इस प्राप्त संपर्क संदेश को हटाना चाहते हैं?",
      targetName: `Inquiry #${id}`,
      confirmText: "हटाएं",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("संदेश हटाने में विफल");
          setMessages((prev) => prev.filter((m) => m.id !== id && m._id !== id));
          showBanner("संदेश हटा दिया गया।");
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
      subject: `Re: ${inquiry.subject || "अखिल भारतीय लोधी समाज संपर्क"}`,
      message: `नमस्ते ${inquiry.name} जी,\n\nआपके संदेश के संदर्भ में:\n\nसस्नेह,\nकेंद्रीय सचिवालय,\nअखिल भारतीय लोधी अधिकारी-कर्मचारी संघ`,
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
      if (!res.ok) throw new Error(data.error || "उत्तर प्रेषित करने में विफल");

      showBanner(`ईमेल उत्तर ${replyModal.recipientEmail} को सफलतापूर्वक भेजा गया।`);
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
      if (!res.ok) throw new Error(data.error || "पुनः प्रयास विफल");
      showBanner("ईमेल पुनः सफलतापूर्वक प्रेषित किया गया।");
      fetch("/api/admin/emails").then((r) => r.json()).then((d) => {
        if (d?.logs) setEmailsList(d.logs);
        if (d?.stats) setEmailStats(d.stats);
      });
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  // ==========================================
  // EDITORIAL NAVIGATION STRUCTURE (6 ORGANIZED GROUPS)
  // ==========================================
  const navigationSections = [
    {
      title: "डैशबोर्ड",
      items: [
        { id: "overview", label: "अवलोकन एवं आंकड़े (Overview)", icon: "overview" },
        { id: "system_health", label: "साइट एवं सिस्टम स्थिति", icon: "server" },
      ],
    },
    {
      title: "सामग्री प्रबंधन (CMS)",
      items: [
        { id: "pages", label: "पृष्ठ सामग्री (सीएमएस पृष्ठ)", icon: "document", count: pagesList.length },
        {
          id: "hero_widgets",
          label: "हीरो बैनर एवं घोषणाएं",
          icon: "widgets",
          activeIndicator: settings.announcementEnabled,
        },
        { id: "navigation", label: "शीर्ष नेविगेशन मेनू", icon: "navigation" },
        { id: "gallery", label: "छायाचित्र दीर्घा", icon: "photo", count: galleryItems.length },
      ],
    },
    {
      title: "सदस्य एवं समाज",
      items: [
        {
          id: "members",
          label: "सदस्य निर्देशिका",
          icon: "users",
          count: memberStats.total,
          onClick: () => {
            setActiveTab("members");
            setStatusFilter("all");
          },
        },
        {
          id: "add_member",
          label: "नया सदस्य जोड़ें",
          icon: "user-plus",
          onClick: () => {
            resetMemberForm();
            setActiveTab("add_member");
          },
        },
        {
          id: "messages",
          label: "ईमेल एवं संपर्क प्रबंधन",
          icon: "mail",
          count: messages.length,
          activeIndicator: messages.some((m) => !m.isRead),
        },
      ],
    },
    {
      title: "वेबसाइट सेटिंग्स",
      items: [
        { id: "site_settings", label: "साइट जानकारी एवं संपर्क", icon: "settings" },
        {
          id: "maintenance",
          label: "रखरखाव मोड (Maintenance)",
          icon: "shield",
          activeIndicator: settings.maintenanceMode,
        },
      ],
    },
    {
      title: "तकनीकी एसईओ (SEO)",
      items: [
        { id: "seo_settings", label: "एसईओ एवं मेटा सेटिंग्स", icon: "search" },
      ],
    },
    {
      title: "प्रशासन एवं सुरक्षा",
      items: [
        { id: "audit_logs", label: "ऑडिट लॉग्स (कार्यवाही विवरण)", icon: "clipboard" },
        ...(currentUser?.role === "superadmin"
          ? [{ id: "admin_team", label: "प्रशासक टीम एवं अनुमतियां", icon: "key", count: adminUsers.length }]
          : []),
      ],
    },
  ];

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center p-4">
        <div className="bg-white border border-[#E2DDD5] p-6 text-center text-xs font-mono text-[#55657E]">
          प्रशासनिक नियंत्रण कक्ष लोड हो रहा है...
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
            <span className="text-xs font-medium text-[#55657E] hidden xs:inline">केंद्रीय नियंत्रण कक्ष</span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5 text-xs">
          <div className="text-[#55657E] hidden sm:flex items-center gap-1.5">
            <span className="font-medium text-[#1E293B]">{currentUser?.email}</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#F2EDE4] text-[#102F6B] border border-[#E2DDD5] rounded-xs font-semibold">
              {currentUser?.role || "Editor"}
            </span>
          </div>

          <span className="text-[#E2DDD5] hidden sm:inline">|</span>

          <Link
            href="/directory"
            target="_blank"
            className="text-[#102F6B] hover:text-[#D9531E] font-medium transition-colors flex items-center gap-1"
          >
            <span>वेबसाइट देखें</span>
            <span className="text-[11px]">↗</span>
          </Link>

          <span className="text-[#E2DDD5]">|</span>

          <button
            onClick={handleLogout}
            className="text-red-700 hover:text-red-900 font-medium transition-colors cursor-pointer"
          >
            लॉग आउट
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
            <span className="font-bold text-xs text-white">वेबसाइट नियंत्रण केंद्र</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
              aria-label="नेविगेशन बंद करें"
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
                  <h1 className="text-lg font-bold text-[#102F6B]">प्रकाशन अवलोकन एवं सांख्यिकी</h1>
                  <p className="text-xs text-[#55657E]">
                    सिस्टम सारांश एवं हाल की निर्देशिका गतिविधियां।
                  </p>
                </div>
                <div className="text-xs text-[#55657E] font-mono">
                  {settings.maintenanceMode ? "● रखरखाव सूचना सक्रिय" : "● लाइव पोर्टल सक्रिय"}
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
                  <div className="text-[10px] uppercase font-semibold text-[#55657E]">कुल सदस्य</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#102F6B] mt-0.5">
                    {dashboardStats?.members?.total ?? memberStats.total}
                  </div>
                  <div className="text-[10px] text-[#55657E] mt-0.5">निर्देशिका डेटाबेस</div>
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
                  <div className="text-[10px] text-[#55657E] mt-0.5">सार्वजनिक सक्रिय</div>
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
                  <div className="text-[10px] uppercase font-semibold text-amber-800">समीक्षा प्रतीक्षित</div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-800 mt-0.5">
                    {dashboardStats?.members?.pending ?? memberStats.pending}
                  </div>
                  <div className="text-[10px] text-[#55657E] mt-0.5">
                    {(dashboardStats?.members?.pending ?? memberStats.pending) > 0 ? "● समीक्षा अपेक्षित" : "सभी स्वीकृत"}
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
                  <div className="text-[10px] text-[#55657E] mt-0.5">संपादकीय आलेख</div>
                </div>

                <div
                  className="p-3.5 cursor-pointer hover:bg-[#FAF8F3] transition-colors"
                  onClick={() => setActiveTab("gallery")}
                >
                  <div className="text-[10px] uppercase font-semibold text-[#55657E]">Photo Gallery</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#1E293B] mt-0.5">
                    {dashboardStats?.cms?.gallery ?? galleryItems.length}
                  </div>
                  <div className="text-[10px] text-[#55657E] mt-0.5">क्लाउडिनरी मीडिया</div>
                </div>

                <div
                  className="p-3.5 cursor-pointer hover:bg-[#FAF8F3] transition-colors"
                  onClick={() => setActiveTab("messages")}
                >
                  <div className="text-[10px] uppercase font-semibold text-[#55657E]">पूछताछ व ईमेल्स</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#102F6B] mt-0.5">
                    {dashboardStats?.inquiries?.total ?? messages.length}
                  </div>
                  <div className="text-[10px] text-[#55657E] mt-0.5">
                    {(dashboardStats?.inquiries?.unread ?? messages.filter((m) => !m.isRead).length) > 0 ? (
                      <span className="text-[#D9531E] font-medium font-mono">
                        {dashboardStats?.inquiries?.unread ?? messages.filter((m) => !m.isRead).length} नए अपठित
                      </span>
                    ) : (
                      "सभी उत्तरित"
                    )}
                  </div>
                </div>
              </div>

              {/* Email Gateway & Telemetry Strip */}
              <div className="bg-white border border-[#E2DDD5] p-3 rounded-xs text-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 flex-wrap text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[#55657E]">प्रेषित ईमेल्स:</span>
                    <span className="font-semibold text-[#102F6B]">
                      {dashboardStats?.emails?.sent ?? emailStats.sent} (वितरित: {dashboardStats?.emails?.delivered ?? emailStats.delivered})
                    </span>
                  </div>
                  <span className="text-[#E2DDD5]">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${(dashboardStats?.emails?.failed ?? emailStats.failed) > 0 ? "bg-red-500" : "bg-emerald-500"}`}></span>
                    <span className="text-[#55657E]">ईमेल विफलताएं:</span>
                    <span className={`font-semibold ${(dashboardStats?.emails?.failed ?? emailStats.failed) > 0 ? "text-red-700" : "text-[#1E293B]"}`}>
                      {dashboardStats?.emails?.failed ?? emailStats.failed}
                    </span>
                  </div>
                  <span className="text-[#E2DDD5]">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-[#55657E]">इनबाउंड ईमेल्स:</span>
                    <span className="font-semibold text-[#1E293B]">
                      {dashboardStats?.emails?.received ?? emailStats.received} प्राप्त
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("messages")}
                  className="text-xs text-[#102F6B] hover:text-[#D9531E] font-semibold cursor-pointer underline"
                >
                  ईमेल प्रबंधन केंद्र खोलें →
                </button>
              </div>

              {/* System & Portal Live Status Strip */}
              <div className="bg-white border border-[#E2DDD5] p-3 rounded-xs text-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 flex-wrap text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[#55657E]">डेटाबेस:</span>
                    <span className="font-semibold text-[#1E293B]">MongoDB Online</span>
                  </div>
                  <span className="text-[#E2DDD5]">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${settings.announcementEnabled ? "bg-[#D9531E]" : "bg-slate-400"}`}></span>
                    <span className="text-[#55657E]">घोषणा पट्टी:</span>
                    <span className="font-semibold text-[#1E293B]">
                      {settings.announcementEnabled ? "सक्रिय" : "निष्क्रिय"}
                    </span>
                  </div>
                  <span className="text-[#E2DDD5]">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${settings.maintenanceMode ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                    <span className="text-[#55657E]">रखरखाव सूचना:</span>
                    <span className="font-semibold text-[#1E293B]">
                      {settings.maintenanceMode ? "सूचना पट्टी सक्रिय" : "सामान्य स्थिति"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("system_health")}
                    className="text-[11px] text-[#102F6B] hover:text-[#D9531E] font-medium underline"
                  >
                    सिस्टम स्थिति एवं निदान देखें →
                  </button>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                <span className="font-semibold text-[#102F6B] mr-1">त्वरित कार्य:</span>
                <button
                  onClick={() => { resetMemberForm(); setActiveTab("add_member"); }}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer shadow-2xs"
                >
                  + सदस्य जोड़ें
                </button>
                <button
                  onClick={() => setActiveTab("pages")}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer shadow-2xs"
                >
                  पृष्ठ सामग्री संपादित करें
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
                  छायाचित्र अपलोड करें
                </button>
                <button
                  onClick={() => setActiveTab("site_settings")}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer shadow-2xs"
                >
                  साइट सेटिंग्स
                </button>
                <button
                  onClick={() => setActiveTab("audit_logs")}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer shadow-2xs"
                >
                  ऑडिट लॉग्स देखें
                </button>
              </div>

              {/* Two Column Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Recent Members */}
                <div className="bg-white border border-[#E2DDD5] rounded-xs">
                  <div className="p-3 border-b border-[#E2DDD5] flex items-center justify-between font-bold text-xs text-[#102F6B]">
                    <span>हाल के सदस्य पंजीकरण</span>
                    <button
                      onClick={() => { setActiveTab("members"); setStatusFilter("all"); }}
                      className="text-[#D9531E] hover:underline font-normal text-[11px]"
                    >
                      सभी देखें →
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
                            {m.isApproved ? "Approved" : "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Audit Logs */}
                <div className="bg-white border border-[#E2DDD5] rounded-xs">
                  <div className="p-3 border-b border-[#E2DDD5] flex items-center justify-between font-bold text-xs text-[#102F6B]">
                    <span>प्रशासनिक गतिविधि लॉग</span>
                    <button
                      onClick={() => setActiveTab("audit_logs")}
                      className="text-[#D9531E] hover:underline font-normal text-[11px]"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="divide-y divide-[#EFECE6] text-xs">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log._id} className="p-2.5 flex items-center justify-between hover:bg-[#FAF8F3]">
                        <div className="min-w-0 pr-2">
                          <span className="font-mono text-[11px] text-[#102F6B] mr-1.5">{log.action}</span>
                          <span className="text-[#55657E] text-[11px] truncate block">{log.details || log.targetEntity}</span>
                        </div>
                        <span className="text-[10px] text-[#A09A90] shrink-0 font-mono">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
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
                    समाज सदस्य सूची, सत्यापन स्थिति एवं निर्देशिका प्रकाशन।
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
                    { id: "all", label: "सभी", count: memberStats.total },
                    { id: "active", label: "अनुमोदित", count: memberStats.approved },
                    { id: "pending", label: "प्रतीक्षारत", count: memberStats.pending },
                    { id: "unlisted", label: "अप्रकाशित" },
                    { id: "archived", label: "संग्रहीत", count: memberStats.archived },
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
                    <option value="newest">क्रम: नवीनतम</option>
                    <option value="oldest">क्रम: प्राचीनतम</option>
                    <option value="name_asc">नाम: अ से ज्ञ</option>
                    <option value="name_desc">नाम: ज्ञ से अ</option>
                    <option value="city_asc">शहर: अ से ज्ञ</option>
                  </select>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="नाम, पद, शहर, विभाग द्वारा खोजें..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="h-8 pl-7 pr-3 w-52 sm:w-64 rounded-xs border border-[#D5CEC4] bg-white text-xs text-[#1E293B] focus:border-[#102F6B] outline-hidden"
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
                        <th className="py-2.5 px-3">सदस्य</th>
                        <th className="py-2.5 px-3">पद एवं व्यवसाय</th>
                        <th className="py-2.5 px-3">स्थान</th>
                        <th className="py-2.5 px-3">अनुमोदन</th>
                        <th className="py-2.5 px-3">दृश्यता</th>
                        <th className="py-2.5 px-3 text-right">कार्यवाही</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE6]">
                      {paginatedMembers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-[#55657E]">
                            वर्तमान मानदंडों के अनुसार कोई सदस्य नहीं मिला।
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
                                    [संग्रहीत]
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
                                    {m.isPublished ? "Published" : "अप्रकाशित"}
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
                                    {isArchived ? "पुनर्स्थापित करें" : "संग्रहीत करें"}
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
                    प्रदर्शित{" "}
                    <span className="font-semibold text-[#1E293B]">
                      {filteredMembers.length === 0 ? 0 : (membersPage - 1) * MEMBERS_PER_PAGE + 1}
                    </span>
                    –
                    <span className="font-semibold text-[#1E293B]">
                      {Math.min(membersPage * MEMBERS_PER_PAGE, filteredMembers.length)}
                    </span>{" "}
                    कुल <span className="font-semibold text-[#1E293B]">{filteredMembers.length}</span> सदस्य
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
                    {editingMemberId ? `रिकॉर्ड संपादित करें: ${memberForm.name}` : "समाज सदस्य पंजीकृत करें"}
                  </h1>
                  <p className="text-xs text-[#55657E]">
                    सत्यापित विवरण, पता एवं निर्देशिका गोपनीयता सहमति दर्ज करें।
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
                  ← सदस्य निर्देशिका पर वापस जाएं
                </button>
              </div>

              <form onSubmit={handleMemberSubmit} className="space-y-6 text-xs max-w-4xl">
                {/* Identity */}
                <div className="space-y-3">
                  <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider border-b border-[#E2DDD5] pb-1">
                    पहचान एवं प्रोफ़ाइल छायाचित्र
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-3">
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">पूरा नाम *</label>
                        <input
                          type="text"
                          required
                          value={memberForm.name}
                          onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">प्रोफ़ाइल स्लग (URL)</label>
                        <input
                          type="text"
                          value={memberForm.slug}
                          onChange={(e) => setMemberForm({ ...memberForm, slug: e.target.value })}
                          placeholder="उदा. rajesh-kumar-lodhi"
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs font-mono text-xs focus:border-[#102F6B] outline-hidden"
                        />
                        <span className="text-[11px] text-[#55657E] mt-0.5 block">
                          स्वतः उत्पन्न करने हेतु रिक्त छोड़ें।
                        </span>
                      </div>
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">सामाजिक दायित्व / पद</label>
                        <input
                          type="text"
                          value={memberForm.role}
                          onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                          placeholder="उदा. वरिष्ठ संरक्षक, कार्यकारिणी सदस्य"
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
                        {uploadingImage ? "अपलोड हो रहा है..." : "छायाचित्र अपलोड करें"}
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
                        placeholder="छायाचित्र URL"
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
                    पद, व्यवसाय एवं स्थान
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">पद एवं व्यवसाय *</label>
                      <input
                        type="text"
                        required
                        value={memberForm.occupation}
                        onChange={(e) => setMemberForm({ ...memberForm, occupation: e.target.value })}
                        placeholder="उदा. सिविल इंजीनियर / प्राध्यापक / चिकित्सक"
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">विभाग / प्रतिष्ठान / संगठन</label>
                      <input
                        type="text"
                        value={memberForm.company}
                        onChange={(e) => setMemberForm({ ...memberForm, company: e.target.value })}
                        placeholder="उदा. लोक निर्माण विभाग / निजी प्रतिष्ठान"
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">शहर / नगर *</label>
                      <input
                        type="text"
                        required
                        value={memberForm.city}
                        onChange={(e) => setMemberForm({ ...memberForm, city: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">राज्य *</label>
                      <input
                        type="text"
                        required
                        value={memberForm.state}
                        onChange={(e) => setMemberForm({ ...memberForm, state: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">पिन कोड</label>
                      <input
                        type="text"
                        value={memberForm.pincode}
                        onChange={(e) => setMemberForm({ ...memberForm, pincode: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">स्थाई / कार्यालय का पूरा पता</label>
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
                    संपर्क सूत्र एवं जीवन-परिचय
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">मोबाइल / फोन नंबर</label>
                      <input
                        type="text"
                        value={memberForm.phone}
                        onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                        placeholder="+91 98260 12345"
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">ईमेल पता</label>
                      <input
                        type="email"
                        value={memberForm.email}
                        onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                        placeholder="उदा. name@example.com"
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div className="col-span-full">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-medium text-[#1E293B]">
                          जीवन-परिचय, उपलब्धियां एवं सामाजिक योगदान
                        </label>
                        <span className="text-[10px] text-[#55657E]">
                          बोल्ड, इटैलिक, सूची, शीर्षक, लिंक एवं हिंदी/अंग्रेजी का समर्थन
                        </span>
                      </div>
                      <RichTextEditor
                        value={memberForm.biography}
                        onChange={(html) => setMemberForm((prev) => ({ ...prev, biography: html }))}
                        minHeight="180px"
                        placeholder="विस्तृत जीवन-परिचय, सामाजिक योगदान एवं उपलब्धियां लिखें..."
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy & Permissions */}
                <div className="space-y-3">
                  <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider border-b border-[#E2DDD5] pb-1">
                    निर्देशिका दृश्यता एवं सहमति
                  </h2>
                  <div className="p-3 bg-[#FAF8F3] border border-[#E2DDD5] rounded-xs space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1E293B]">
                      <input
                        type="checkbox"
                        checked={memberForm.isApproved}
                        onChange={(e) => setMemberForm({ ...memberForm, isApproved: e.target.checked })}
                      />
                      <span>अनुमोदित समाज सदस्य</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1E293B]">
                      <input
                        type="checkbox"
                        checked={memberForm.isPublished}
                        onChange={(e) => setMemberForm({ ...memberForm, isPublished: e.target.checked })}
                      />
                      <span>समाज निर्देशिका में सार्वजनिक रूप से प्रदर्शित</span>
                    </label>

                    <div className="pt-1 border-t border-[#E2DDD5] grid grid-cols-1 sm:grid-cols-3 gap-2 text-[#55657E]">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={memberForm.showPhone}
                          onChange={(e) => setMemberForm({ ...memberForm, showPhone: e.target.checked })}
                        />
                        <span>फोन नंबर सार्वजनिक प्रदर्शित करें</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={memberForm.showEmail}
                          onChange={(e) => setMemberForm({ ...memberForm, showEmail: e.target.checked })}
                        />
                        <span>ईमेल पता सार्वजनिक प्रदर्शित करें</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={memberForm.showAddress}
                          onChange={(e) => setMemberForm({ ...memberForm, showAddress: e.target.checked })}
                        />
                        <span>पूरा पता सार्वजनिक प्रदर्शित करें</span>
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
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-4 py-1.5 font-medium rounded-xs cursor-pointer shadow-xs"
                  >
                    {submitting ? "सुरक्षित हो रहा है..." : editingMemberId ? "सदस्य अद्यतन करें" : "सदस्य सुरक्षित करें"}
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
                    पोर्टल के विभिन्न पृष्ठों के शीर्षक, बैनर एवं सामग्री को संपादित करें।
                  </p>
                </div>
                <select
                  value={selectedPageSlug}
                  onChange={(e) => handleSelectPage(e.target.value)}
                  className="h-8 px-2.5 rounded-xs border border-[#D5CEC4] bg-white text-xs font-semibold text-[#102F6B]"
                >
                  <option value="about">हमारे बारे में (/about)</option>
                  <option value="history">समाज इतिहास (/history)</option>
                  <option value="organization">संगठन एवं कार्यकारिणी (/organization)</option>
                  <option value="mahasabha">राष्ट्रीय महासभा (/mahasabha)</option>
                  <option value="personalities">महान विभूतियां (/personalities)</option>
                  <option value="contact">सचिवालय संपर्क (/contact)</option>
                  <option value="privacy">गोपनीयता नीति (/privacy)</option>
                  <option value="terms">नियम एवं शर्तें (/terms)</option>
                </select>
              </div>

              <form onSubmit={handleSavePage} className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">पृष्ठ शीर्षक *</label>
                    <input
                      type="text"
                      required
                      value={pageForm.title}
                      onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">उपशीर्षक / टैगलाइन</label>
                    <input
                      type="text"
                      value={pageForm.subtitle}
                      onChange={(e) => setPageForm({ ...pageForm, subtitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">मुख्य बैनर शीर्षक</label>
                    <input
                      type="text"
                      value={pageForm.bannerTitle}
                      onChange={(e) => setPageForm({ ...pageForm, bannerTitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">मुख्य बैनर उपशीर्षक</label>
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
                      विजुअल पृष्ठ सामग्री (संपादक)
                    </label>
                    <span className="text-[11px] text-[#55657E]">
                      शीर्षक, तालिकाएं, हिंदी पाठ, लिंक एवं छायाचित्र आसानी से प्रारूपित करें।
                    </span>
                  </div>

                  <RichTextEditor
                    value={pageForm.content}
                    onChange={(html) => setPageForm((prev) => ({ ...prev, content: html }))}
                    minHeight="340px"
                    placeholder="शीर्षकों, सूचियों, तालिकाओं एवं छायाचित्रों के साथ सामग्री लिखें..."
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E2DDD5]">
                  <button
                    type="button"
                    onClick={() => handleDeletePage(selectedPageSlug)}
                    className="text-xs text-red-700 hover:underline cursor-pointer"
                  >
                    सामग्री को पूर्वनिर्धारित पर रीसेट करें
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-4 py-1.5 font-medium rounded-xs cursor-pointer shadow-xs"
                  >
                    {submitting ? "सुरक्षित हो रहा है..." : "पृष्ठ सामग्री सुरक्षित करें"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: HEADER NAVIGATION */}
          {/* ========================================================================= */}
          {activeTab === "navigation" && (
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">शीर्ष नेविगेशन मेनू</h1>
                  <p className="text-xs text-[#55657E]">
                    पोर्टल के सार्वजनिक नेविगेशन लिंक।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "सुरक्षित हो रहा है..." : "मेनू सुरक्षित करें"}
                </button>
              </div>

              <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-3 text-xs">
                <p className="text-[#55657E]">
                  सार्वजनिक नेविगेशन बार में १० मुख्य लिंक सम्मिलित हैं। प्रशासनिक लिंक सार्वजनिक दृश्यता से सुरक्षित रखे गए हैं।
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs text-[#1E293B]">
                  {["Home (/)", "History (/history)", "Organization (/organization)", "Mahasabha (/mahasabha)", "Matrimonial (/matrimonial)", "Directory (/directory)", "Personalities (/personalities)", "Gallery (/gallery)", "About Us (/about)", "Contact (/contact)"].map((link) => (
                    <div key={link} className="p-2 border border-[#E2DDD5] bg-[#FAF8F3] rounded-xs text-center">
                      {link}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: HERO & WIDGETS */}
          {/* ========================================================================= */}
          {activeTab === "hero_widgets" && (
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">मुख्य हीरो बैनर एवं घोषणाएं</h1>
                  <p className="text-xs text-[#55657E]">
                    होमपेज हीरो बैनर, शीर्ष सूचना टिकर एवं सामुदायिक संदेश कॉन्फ़िगर करें।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "सुरक्षित हो रहा है..." : "परिवर्तन सुरक्षित करें"}
                </button>
              </div>

              <div className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-5 text-xs">
                {/* Hero Section */}
                <div className="space-y-3">
                  <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider border-b border-[#E2DDD5] pb-1">
                    होमपेज मुख्य हीरो बैनर
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">हीरो बैज / लेबल</label>
                      <input
                        type="text"
                        value={settings.heroBadge}
                        onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">मुख्य शीर्षक</label>
                      <input
                        type="text"
                        value={settings.heroTitle}
                        onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden font-semibold"
                      />
                    </div>
                    <div className="col-span-full">
                      <label className="block font-medium text-[#1E293B] mb-1">उपशीर्षक</label>
                      <textarea
                        rows={2}
                        value={settings.heroSubtitle}
                        onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">बटन टेक्स्ट</label>
                      <input
                        type="text"
                        value={settings.heroCtaText}
                        onChange={(e) => setSettings({ ...settings, heroCtaText: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">बटन लिंक</label>
                      <input
                        type="text"
                        value={settings.heroCtaLink}
                        onChange={(e) => setSettings({ ...settings, heroCtaLink: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div className="col-span-full">
                      <label className="block font-medium text-[#1E293B] mb-1">
                        वैकल्पिक हीरो बैनर छायाचित्र (क्लाउडिनरी URL)
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
                          <span>{uploadingImage ? "अपलोड हो रहा है..." : "फ़ाइल अपलोड करें"}</span>
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
                            हटाएं
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
                      लाइव पोर्टल पूर्वावलोकन (डेस्कटॉप दृश्य)
                    </h3>
                    <span className="text-[10px] text-[#55657E]">
                      हीरो अनुभाग एवं सूचना पट्टी का वास्तविक समय पूर्वावलोकन
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
                      शीर्ष घोषणा टिकर पट्टी
                    </h2>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[#1E293B]">
                      <input
                        type="checkbox"
                        checked={settings.announcementEnabled}
                        onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                      />
                      <span>सक्रिय</span>
                    </label>
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">घोषणा संदेश</label>
                    <textarea
                      rows={2}
                      value={settings.announcement}
                      onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                </div>

                {/* साइडबार सामुदायिक सूचना */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-1">
                    <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider">
                      साइडबार सामुदायिक सूचना
                    </h2>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[#1E293B]">
                      <input
                        type="checkbox"
                        checked={settings.sidebarNoticeEnabled}
                        onChange={(e) => setSettings({ ...settings, sidebarNoticeEnabled: e.target.checked })}
                      />
                      <span>सक्रिय</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">सूचना शीर्षक</label>
                      <input
                        type="text"
                        value={settings.sidebarNoticeTitle}
                        onChange={(e) => setSettings({ ...settings, sidebarNoticeTitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">सूचना विवरण</label>
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
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">Photo Gallery</h1>
                  <p className="text-xs text-[#55657E]">
                    राष्ट्रीय अधिवेशन एवं कार्यक्रम छायाचित्र संग्रह।
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingGalleryId(null);
                    setGalleryForm({
                      title: "",
                      category: "National Convention",
                      eventDate: "",
                      imageUrl: "",
                      publicId: "",
                      description: "",
                      isPublished: true,
                    });
                    setGalleryModalOpen(true);
                  }}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer shadow-xs"
                >
                  + छायाचित्र जोड़ें
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                {galleryItems.map((it) => (
                  <div key={it._id} className="bg-white border border-[#E2DDD5] rounded-xs overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="h-36 bg-[#FAF8F3] border-b border-[#E2DDD5] overflow-hidden">
                        <img src={it.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2.5">
                        <div className="font-semibold text-[#102F6B] truncate">{it.title}</div>
                        <div className="text-[11px] text-[#55657E] mt-0.5">{it.category}</div>
                      </div>
                    </div>
                    <div className="px-2.5 py-2 border-t border-[#EFECE6] flex items-center justify-between text-[11px] bg-[#FAF8F3]">
                      <span className="text-[#8896AB]">{it.eventDate || "Archive"}</span>
                      <div className="space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingGalleryId(it._id);
                            setGalleryForm(it);
                            setGalleryModalOpen(true);
                          }}
                          className="text-[#102F6B] hover:underline"
                        >
                          Edit
                        </button>
                        <span className="text-[#D5CEC4]">·</span>
                        <button
                          onClick={() => handleDeleteGalleryItem(it)}
                          className="text-red-700 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gallery Modal */}
              {galleryModalOpen && (
                <div className="fixed inset-0 bg-[#0D1B2A]/40 z-50 flex items-center justify-center p-4">
                  <div className="bg-white max-w-md w-full border border-[#D5CEC4] p-5 rounded-xs space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-2 font-bold text-[#102F6B]">
                      <span>{editingGalleryId ? "छायाचित्र संपादित करें" : "छायाचित्र जोड़ें"}</span>
                      <button onClick={() => setGalleryModalOpen(false)} className="text-slate-500 font-bold">✕</button>
                    </div>

                    <form onSubmit={handleSaveGalleryItem} className="space-y-3">
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">शीर्षक *</label>
                        <input
                          type="text"
                          required
                          value={galleryForm.title}
                          onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">श्रेणी</label>
                        <select
                          value={galleryForm.category}
                          onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                        >
                          <option value="National Convention">राष्ट्रीय महाधिवेशन</option>
                          <option value="Community Gathering">सामाजिक सम्मेलन</option>
                          <option value="Youth Meet">युवा सम्मेलन</option>
                          <option value="Historical Heritage">ऐतिहासिक धरोहर</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">छायाचित्र URL / फ़ाइल</label>
                        <input
                          type="url"
                          required
                          value={galleryForm.imageUrl}
                          onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden mb-1.5"
                        />
                        <label className="px-2 py-0.5 bg-white border border-[#D5CEC4] text-[11px] font-medium cursor-pointer rounded-xs inline-block">
                          {uploadingImage ? "अपलोड हो रहा है..." : "छायाचित्र अपलोड करें"}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage}
                            onChange={(e) => handleImageUpload(e, "gallery")}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-[#E2DDD5]">
                        <button
                          type="button"
                          onClick={() => setGalleryModalOpen(false)}
                          className="px-3 py-1 border border-[#D5CEC4] rounded-xs text-[#55657E]"
                        >
                          रद्द करें
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-[#102F6B] text-white px-3 py-1 rounded-xs font-medium cursor-pointer"
                        >
                          {submitting ? "सुरक्षित हो रहा है..." : "छायाचित्र सुरक्षित करें"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: TECHNICAL SEO */}
          {/* ========================================================================= */}
          {activeTab === "seo_settings" && (
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">तकनीकी एसईओ एवं इंडेक्सिंग</h1>
                  <p className="text-xs text-[#55657E]">
                    सर्च इंजन मेटाडेटा, कैनोनिकल डोमेन, ओपन ग्राफ एवं सत्यापन टोकन।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "सुरक्षित हो रहा है..." : "एसईओ सुरक्षित करें"}
                </button>
              </div>

              <div className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">मुख्य मेटा शीर्षक</label>
                    <input
                      type="text"
                      value={settings.seoTitle}
                      onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">कैनोनिकल बेस URL</label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">संगठन नाम (Schema.org)</label>
                    <input
                      type="text"
                      value={settings.organizationName}
                      onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">गूगल सर्च कंसोल सत्यापन टोकन</label>
                    <input
                      type="text"
                      value={settings.googleVerificationId}
                      onChange={(e) => setSettings({ ...settings, googleVerificationId: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs font-mono"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block font-medium text-[#1E293B] mb-1">मेटा विवरण</label>
                    <textarea
                      rows={2}
                      value={settings.seoDescription}
                      onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block font-medium text-[#1E293B] mb-1">मेटा कीवर्ड्स</label>
                    <input
                      type="text"
                      value={settings.seoKeywords}
                      onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block font-medium text-[#1E293B] mb-1">
                      सोशल मीडिया शेयर छायाचित्र (Open Graph Image - 1200×630px)
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
                        <span>{uploadingImage ? "अपलोड हो रहा है..." : "छायाचित्र अपलोड करें"}</span>
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
                          हटाएं
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
                  <h1 className="text-lg font-bold text-[#102F6B]">साइट जानकारी एवं संपर्क सूत्र</h1>
                  <p className="text-xs text-[#55657E]">
                    सचिवालय संपर्क दूरभाष, ईमेल पता एवं कार्यालय का पता।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "सुरक्षित हो रहा है..." : "जानकारी सुरक्षित करें"}
                </button>
              </div>

              <div className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">पोर्टल नाम</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">टैगलाइन</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">सचिवालय ईमेल</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">आधिकारिक दूरभाष</label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">व्हाट्सएप नंबर</label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">कार्यालय का पता</label>
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
                  <h1 className="text-lg font-bold text-[#102F6B]">रखरखाव मोड (Maintenance)</h1>
                  <p className="text-xs text-[#55657E]">
                    विकास कार्य सूचना पट्टी एवं आगंतुक परामर्श नियंत्रित करें।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "सुरक्षित हो रहा है..." : "सेटिंग्स सुरक्षित करें"}
                </button>
              </div>

              <div className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-4 text-xs">
                <div className="p-3 bg-[#FAF8F3] border border-[#E2DDD5] flex items-center justify-between rounded-xs">
                  <div>
                    <div className="font-semibold text-[#1E293B]">रखरखाव मोड सक्रिय</div>
                    <div className="text-[11px] text-[#55657E]">
                      सभी सार्वजनिक पृष्ठों पर शीर्ष विकास सूचना पट्टी प्रदर्शित होती है।
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
                  <label className="block font-medium text-[#1E293B] mb-1">परामर्श सूचना संदेश</label>
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
          {/* VIEW: AUDIT TRAIL */}
          {/* ========================================================================= */}
          {activeTab === "audit_logs" && (
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">ऑडिट लॉग्स (कार्यवाही विवरण)</h1>
                  <p className="text-xs text-[#55657E]">
                    प्रशासक लॉगिन, संपादन एवं विलोपन का सुरक्षा ऑडिट अभिलेख।
                  </p>
                </div>
                <select
                  value={auditFilterAction}
                  onChange={(e) => {
                    setAuditFilterAction(e.target.value);
                    setAuditPage(1);
                  }}
                  className="h-8 px-2 rounded-xs border border-[#D5CEC4] bg-white text-xs font-medium text-[#1E293B]"
                >
                  <option value="All">सभी घटनाएं</option>
                  <option value="ADMIN_LOGIN">प्रशासक लॉगिन</option>
                  <option value="ADMIN_LOGOUT">प्रशासक लॉगआउट</option>
                  <option value="create_member">सदस्य निर्माण</option>
                  <option value="update_member">सदस्य अद्यतन</option>
                  <option value="delete_member">सदस्य विलोपन</option>
                </select>
              </div>

              <div className="bg-white border border-[#E2DDD5] rounded-xs overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead className="bg-[#FAF8F3] border-b border-[#E2DDD5] text-[11px] uppercase tracking-wider text-[#55657E] font-semibold">
                      <tr>
                        <th className="py-2 px-3">समय</th>
                        <th className="py-2 px-3">प्रशासक</th>
                        <th className="py-2 px-3">कार्यवाही</th>
                        <th className="py-2 px-3">इकाई</th>
                        <th className="py-2 px-3">विवरण</th>
                        <th className="py-2 px-3 text-right">आईपी पता</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE6]">
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#55657E]">
                            कोई ऑडिट रिकॉर्ड नहीं मिला।
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map((log) => (
                          <tr key={log._id} className="hover:bg-[#FAF8F3]">
                            <td className="py-2 px-3 font-mono text-[11px] text-[#55657E] whitespace-nowrap">
                              {new Date(log.createdAt).toLocaleString()}
                            </td>
                            <td className="py-2 px-3 font-medium text-[#1E293B]">
                              {log.adminName || log.adminEmail}
                            </td>
                            <td className="py-2 px-3">
                              <span className="font-mono text-[11px] text-[#102F6B] font-semibold">
                                {log.action}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-[#55657E]">{log.targetEntity || "—"}</td>
                            <td className="py-2 px-3 text-[#55657E] max-w-xs truncate" title={log.details}>
                              {log.details || "—"}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-[11px] text-[#8896AB]">
                              {log.ipAddress}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {auditTotalPages > 1 && (
                  <div className="bg-[#FAF8F3] px-3 py-2 border-t border-[#E2DDD5] text-xs text-[#55657E] flex items-center justify-between">
                    <span>{auditTotal} कुल दर्ज घटनाएं</span>
                    <div className="space-x-1">
                      <button
                        disabled={auditPage <= 1}
                        onClick={() => setAuditPage((p) => Math.max(1, p - 1))}
                        className="px-2 py-0.5 bg-white border border-[#D5CEC4] rounded-xs disabled:opacity-40"
                      >
                        Prev
                      </button>
                      <span className="px-2 font-mono font-medium">{auditPage}/{auditTotalPages}</span>
                      <button
                        disabled={auditPage >= auditTotalPages}
                        onClick={() => setAuditPage((p) => Math.min(auditTotalPages, p + 1))}
                        className="px-2 py-0.5 bg-white border border-[#D5CEC4] rounded-xs disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: STAFF & PERMISSIONS (Superadmin) */}
          {/* ========================================================================= */}
          {activeTab === "admin_team" && currentUser?.role === "superadmin" && (
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3">
                <h1 className="text-lg font-bold text-[#102F6B]">प्रशासक टीम एवं अनुमतियां</h1>
                <p className="text-xs text-[#55657E]">
                  अधिकृत प्रशासक एवं पद स्तर।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-white border border-[#E2DDD5] rounded-xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F3] border-b border-[#E2DDD5] text-[11px] uppercase tracking-wider text-[#55657E]">
                      <tr>
                        <th className="py-2 px-3">नाम</th>
                        <th className="py-2 px-3">ईमेल</th>
                        <th className="py-2 px-3">भूमिका</th>
                        <th className="py-2 px-3 text-right">कार्यवाही</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE6]">
                      {adminUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-[#FAF8F3]">
                          <td className="py-2 px-3 font-medium text-[#1E293B]">{u.name}</td>
                          <td className="py-2 px-3 text-[#55657E] font-mono text-[11px]">{u.email}</td>
                          <td className="py-2 px-3">
                            <span className="text-[11px] uppercase font-mono font-medium text-[#102F6B]">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">
                            {u._id !== currentUser?.id && (
                              <button
                                onClick={() => handleDeleteAdmin(u)}
                                className="text-red-700 hover:underline cursor-pointer text-xs"
                              >
                                निरस्त करें
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-3 text-xs">
                  <div className="font-bold text-[#102F6B] border-b border-[#E2DDD5] pb-1">
                    नया प्रशासक खाता जोड़ें
                  </div>
                  <form onSubmit={handleCreateAdmin} className="space-y-2.5">
                    <div>
                      <label className="block text-[#1E293B] font-medium mb-1">पूरा नाम</label>
                      <input
                        type="text"
                        required
                        value={newAdminForm.name}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                        className="w-full px-2.5 py-1 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1E293B] font-medium mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={newAdminForm.email}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                        className="w-full px-2.5 py-1 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1E293B] font-medium mb-1">पासवर्ड</label>
                      <input
                        type="password"
                        required
                        value={newAdminForm.password}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                        className="w-full px-2.5 py-1 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1E293B] font-medium mb-1">Role</label>
                      <select
                        value={newAdminForm.role}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                        className="w-full px-2.5 py-1 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      >
                        <option value="editor">संपादक (Editor)</option>
                        <option value="superadmin">मुख्य प्रशासक (Superadmin)</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#102F6B] hover:bg-[#0D1B2A] text-white py-1.5 font-medium rounded-xs cursor-pointer shadow-xs"
                    >
                      {submitting ? "जोड़ा जा रहा है..." : "प्रशासक जोड़ें"}
                    </button>
                  </form>
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
                  <h1 className="text-lg font-bold text-[#102F6B]">ईमेल एवं संपर्क प्रबंधन</h1>
                  <p className="text-xs text-[#55657E]">
                    सार्वजनिक संपर्क पूछताछ, प्राप्त ईमेल्स, एवं प्रेषित ईमेल्स का लाइव डिलीवरी स्थिति इतिहास।
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#55657E]">
                    कुल पूछताछ: <strong className="text-[#102F6B] font-bold">{messages.length}</strong>
                  </span>
                  <span className="text-[#D5CEC4]">·</span>
                  <span className="text-xs text-[#55657E]">
                    प्रेषित ईमेल्स: <strong className="text-[#102F6B] font-bold">{emailStats.sent + emailStats.delivered + emailStats.failed + emailStats.bounced}</strong>
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
                  संपर्क पूछताछ ({messages.length})
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
                  प्राप्त ईमेल्स ({emailsList.filter((e) => e.direction === "inbound").length})
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
                  प्रेषित ईमेल्स एवं लाइव स्थिति ({emailsList.filter((e) => e.direction === "outbound").length})
                </button>
              </div>

              {/* ========================================================= */}
              {/* SUB-TAB 1: CONTACT INQUIRIES                               */}
              {/* ========================================================= */}
              {messagesSubTab === "inquiries" && (
                <div className="space-y-2.5">
                  {messages.length === 0 ? (
                    <div className="bg-white border border-[#E2DDD5] p-6 text-center text-xs text-[#55657E]">
                      अभी तक कोई संपर्क संदेश दर्ज नहीं हुआ है।
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
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleString("hi-IN") : "हाल ही में"}
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
                              सूचना: {msg.notificationStatus === "sent" ? "प्रेषित ✓" : msg.notificationStatus === "failed" ? "विफल ✕" : "प्रतीक्षारत"}
                            </span>

                            {/* Actions */}
                            <button
                              type="button"
                              onClick={() => handleOpenReply(msg)}
                              className="px-2.5 py-1 bg-[#102F6B] hover:bg-[#091D42] text-white rounded-xs text-[11px] font-medium cursor-pointer shadow-xs"
                            >
                              ✉️ उत्तर दें
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleMessageRead(msg._id || msg.id, msg.isRead)}
                              className="px-2 py-1 bg-white border border-[#D5CEC4] text-[#55657E] hover:text-[#102F6B] rounded-xs text-[11px] cursor-pointer"
                            >
                              {msg.isRead ? "अपठित" : "पढ़ा हुआ"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg._id || msg.id)}
                              className="px-2 py-1 bg-white border border-red-200 text-red-700 hover:bg-red-50 rounded-xs text-[11px] cursor-pointer"
                            >
                              हटाएं
                            </button>
                          </div>
                        </div>

                        <div className="font-semibold text-[#102F6B]">विषय: {msg.subject || "सामान्य पूछताछ"}</div>
                        <p className="text-[#263449] leading-relaxed bg-[#FAF8F3] p-2.5 border border-[#E2DDD5] rounded-xs whitespace-pre-wrap">
                          {msg.message}
                        </p>

                        {/* Display Thread of Previous Replies */}
                        {Array.isArray(msg.replies) && msg.replies.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-[#E2DDD5] space-y-1.5">
                            <span className="text-[10px] font-bold uppercase text-[#55657E] tracking-wider">
                              सचिवालय द्वारा भेजे गए उत्तर ({msg.replies.length}):
                            </span>
                            {msg.replies.map((rep, idx) => (
                              <div key={idx} className="bg-white p-2 border border-[#E2DDD5] rounded-xs text-[11px] space-y-1">
                                <div className="flex items-center justify-between text-[#64748B]">
                                  <span>द्वारा: {rep.adminEmail}</span>
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
                    <strong>इनबाउंड ईमेल सुविधा:</strong> डोमेन <code className="text-[#102F6B] font-mono">contact@alokworld.in</code> पर प्राप्त होने वाले ईमेल्स वेबहुक <code className="text-[#102F6B] font-mono">/api/webhooks/inbound-email</code> द्वारा स्वतः रिकॉर्ड होते हैं।
                  </div>

                  {emailsList.filter((e) => e.direction === "inbound").length === 0 ? (
                    <div className="bg-white border border-[#E2DDD5] p-6 text-center text-xs text-[#55657E]">
                      अभी तक कोई इनबाउंड ईमेल प्राप्त नहीं हुआ है।
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E2DDD5] rounded-xs overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#FAF8F3] border-b border-[#E2DDD5] text-[#102F6B] font-bold">
                            <th className="py-2.5 px-3">समय</th>
                            <th className="py-2.5 px-3">प्रेषक (From)</th>
                            <th className="py-2.5 px-3">विषय (Subject)</th>
                            <th className="py-2.5 px-3">स्थिति</th>
                            <th className="py-2.5 px-3 text-right">कार्यवाही</th>
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
                                    प्राप्त (Received)
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-right space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedEmailDetail(em)}
                                    className="text-[#102F6B] hover:underline cursor-pointer text-xs"
                                  >
                                    विवरण देखें
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
                                    उत्तर दें
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
                      <div className="text-[10px] uppercase font-bold text-[#55657E]">कुल प्रेषित</div>
                      <div className="text-xl font-bold text-[#102F6B] mt-0.5">
                        {emailStats.sent + emailStats.delivered + emailStats.failed + emailStats.bounced}
                      </div>
                    </div>
                    <div className="bg-white border border-emerald-200 p-3 rounded-xs text-center">
                      <div className="text-[10px] uppercase font-bold text-emerald-800">सफल वितरण (Delivered)</div>
                      <div className="text-xl font-bold text-emerald-800 mt-0.5">
                        {emailStats.delivered}
                      </div>
                    </div>
                    <div className="bg-white border border-blue-200 p-3 rounded-xs text-center">
                      <div className="text-[10px] uppercase font-bold text-blue-800">प्रेषित (Sent / Accepted)</div>
                      <div className="text-xl font-bold text-blue-800 mt-0.5">
                        {emailStats.sent}
                      </div>
                    </div>
                    <div className="bg-white border border-red-200 p-3 rounded-xs text-center">
                      <div className="text-[10px] uppercase font-bold text-red-800">विफल (Failed)</div>
                      <div className="text-xl font-bold text-red-800 mt-0.5">
                        {emailStats.failed}
                      </div>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="bg-white border border-[#E2DDD5] p-2.5 rounded-xs flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <label className="font-semibold text-[#102F6B]">स्थिति फ़िल्टर:</label>
                      <select
                        value={emailFilterStatus}
                        onChange={(e) => setEmailFilterStatus(e.target.value)}
                        className="px-2 py-1 border border-[#D5CEC4] bg-white rounded-xs text-xs"
                      >
                        <option value="all">सभी स्थितियां</option>
                        <option value="delivered">सफल वितरण (Delivered)</option>
                        <option value="sent">प्रेषित (Sent)</option>
                        <option value="failed">विफल (Failed)</option>
                        <option value="bounced">बाउंस (Bounced)</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="प्राप्तकर्ता अथवा विषय खोजें..."
                      value={emailSearch}
                      onChange={(e) => setEmailSearch(e.target.value)}
                      className="px-2.5 py-1 border border-[#D5CEC4] bg-white rounded-xs text-xs min-w-[200px]"
                    />
                  </div>

                  {/* Outbound Table */}
                  {emailsList.filter((e) => e.direction === "outbound").length === 0 ? (
                    <div className="bg-white border border-[#E2DDD5] p-6 text-center text-xs text-[#55657E]">
                      अभी तक कोई आउटबाउंड ईमेल रिकॉर्ड नहीं मिला।
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E2DDD5] rounded-xs overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#FAF8F3] border-b border-[#E2DDD5] text-[#102F6B] font-bold">
                            <th className="py-2.5 px-3">समय</th>
                            <th className="py-2.5 px-3">प्राप्तकर्ता (To)</th>
                            <th className="py-2.5 px-3">विषय (Subject)</th>
                            <th className="py-2.5 px-3">प्रकार</th>
                            <th className="py-2.5 px-3">प्रोवाइडर ID</th>
                            <th className="py-2.5 px-3">लाइव स्थिति</th>
                            <th className="py-2.5 px-3 text-right">कार्यवाही</th>
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
                                    ? "सचिवालय सूचना"
                                    : em.emailType === "visitor_confirmation"
                                    ? "आगंतुक पुष्टिकरण"
                                    : em.emailType === "admin_reply"
                                    ? "सचिवालय उत्तर"
                                    : "सिस्टम"}
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
                                      ? "वितरित (Delivered)"
                                      : em.status === "sent"
                                      ? "प्रेषित (Sent)"
                                      : em.status === "failed"
                                      ? "विफल (Failed)"
                                      : em.status === "bounced"
                                      ? "बाउंस (Bounced)"
                                      : "प्रतीक्षारत"}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-right space-x-1.5 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedEmailDetail(em)}
                                    className="text-[#102F6B] hover:underline cursor-pointer text-xs"
                                  >
                                    विवरण
                                  </button>
                                  {em.status === "failed" && (
                                    <button
                                      type="button"
                                      onClick={() => handleRetryEmail(em._id || em.id)}
                                      className="text-[#F26A21] hover:underline cursor-pointer text-xs font-bold"
                                    >
                                      पुनः प्रयास
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
                  <h1 className="text-lg font-bold text-[#102F6B]">साइट एवं सिस्टम स्थिति व एकीकरण</h1>
                  <p className="text-xs text-[#55657E]">
                    वास्तविक समय कनेक्शन निगरानी, डेटाबेस टेलीमेट्री एवं सिस्टम निदान।
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
                    setStatusMsg("सभी सिस्टम टेलीमेट्री एवं कनेक्शन स्वास्थ्य जांच को ताज़ा किया गया।");
                  }}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] text-xs font-medium rounded-xs cursor-pointer shadow-2xs"
                >
                  पुनः जांच करें ↺
                </button>
              </div>

              {/* 6-Card Diagnostic Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* 1. Database Connection */}
                <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#102F6B]">मोंगोडीबी डेटाबेस (MongoDB)</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                      सक्रिय
                    </span>
                  </div>
                  <p className="text-xs text-[#55657E] leading-relaxed">
                    मोंगूज ओडीएम कनेक्शन पूल के साथ स्थानीय मोंगोडीबी सक्रिय है।
                  </p>
                  <div className="text-[11px] font-mono text-[#55657E] pt-2 border-t border-[#EFECE6] space-y-1">
                    <div className="flex justify-between"><span>Members:</span> <span className="font-bold text-[#1E293B]">{memberStats.total} रिकॉर्ड्स</span></div>
                    <div className="flex justify-between"><span>CMS Pages:</span> <span className="font-bold text-[#1E293B]">{pagesList.length} दस्तावेज</span></div>
                    <div className="flex justify-between"><span>Gallery Media:</span> <span className="font-bold text-[#1E293B]">{galleryItems.length} छायाचित्र</span></div>
                    <div className="flex justify-between"><span>Contact Inquiries:</span> <span className="font-bold text-[#1E293B]">{messages.length} messages</span></div>
                  </div>
                </div>

                {/* 2. Media Storage / CDN */}
                <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#102F6B]">क्लाउडिनरी मीडिया सीडीएन</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                      सक्रिय
                    </span>
                  </div>
                  <p className="text-xs text-[#55657E] leading-relaxed">
                    प्रमाणीकृत सर्वर-साइड एंडपॉइंट के माध्यम से छायाचित्र अपलोड होते हैं।
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
                    <span className="font-bold text-xs text-[#102F6B]">प्रमाणीकरण प्रॉक्सी (Next.js)</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                      लागू
                    </span>
                  </div>
                  <p className="text-xs text-[#55657E] leading-relaxed">
                    नेक्स्ट.जेएस प्रॉक्सी मिडलवेयर द्वारा एचटीटीपी-ओनली कुकीज में जेडब्ल्यूटी टोकन सत्यापित होते हैं।
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
                    <span className="font-bold text-xs text-[#102F6B]">सर्च इंजन क्रॉल निर्देश (SEO)</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                      ऑनलाइन
                    </span>
                  </div>
                  <p className="text-xs text-[#55657E] leading-relaxed">
                    गतिशील XML साइटमैप एवं robots.txt सभी प्रकाशित मार्गों एवं सदस्यों को अनुक्रमित करते हैं।
                  </p>
                  <div className="text-[11px] pt-2 border-t border-[#EFECE6] flex items-center justify-between">
                    <a href="/sitemap.xml" target="_blank" className="text-[#102F6B] hover:text-[#D9531E] font-medium underline">
                      sitemap.xml देखें ↗
                    </a>
                    <a href="/robots.txt" target="_blank" className="text-[#102F6B] hover:text-[#D9531E] font-medium underline">
                      robots.txt देखें ↗
                    </a>
                  </div>
                </div>

                {/* 5. Email Dispatch Service */}
                <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#102F6B]">ईमेल प्रेषण गेटवे</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                      कॉन्फ़िगर
                    </span>
                  </div>
                  <p className="text-xs text-[#55657E] leading-relaxed">
                    संपर्क पूछताछ डेटाबेस में सुरक्षित होती है और सूचनाएं प्रेषित की जाती हैं।
                  </p>
                  <div className="text-[11px] font-mono text-[#55657E] pt-2 border-t border-[#EFECE6] space-y-1">
                    <div className="flex justify-between"><span>Total Inquiries:</span> <span className="font-bold text-[#1E293B]">{messages.length}</span></div>
                    <div className="flex justify-between"><span>Inbox Address:</span> <span className="text-[#1E293B] truncate max-w-[140px]">{settings.contactEmail}</span></div>
                  </div>
                </div>

                {/* 6. OWASP Security Headers */}
                <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#102F6B]">एचटीटीपी सुरक्षा हेडर (OWASP)</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-xs border border-emerald-200">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-[#55657E] leading-relaxed">
                    प्रॉक्सी मिडलवेयर के माध्यम से सभी अनुरोधों पर OWASP सुरक्षा हेडर लागू होते हैं।
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
              <span className="font-bold text-sm text-[#102F6B]">आधिकारिक ईमेल उत्तर प्रेषित करें</span>
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
                <label className="block font-semibold text-[#1E293B] mb-1">प्राप्तकर्ता ईमेल:</label>
                <input
                  type="email"
                  readOnly
                  value={replyModal.recipientEmail}
                  className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-[#FAF8F3] rounded-xs font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">ईमेल विषय:</label>
                <input
                  type="text"
                  required
                  value={replyModal.subject}
                  onChange={(e) => setReplyModal({ ...replyModal, subject: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">उत्तर संदेश विवरण:</label>
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
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={replyModal.sending}
                  className="px-4 py-1.5 bg-[#102F6B] hover:bg-[#091D42] text-white font-medium rounded-xs cursor-pointer shadow-xs"
                >
                  {replyModal.sending ? "प्रेषित हो रहा है..." : "ईमेल भेजें →"}
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
              <span className="font-bold text-sm text-[#102F6B]">ईमेल विवरण एवं टेलीमेट्री</span>
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
                <span className="text-[#64748B] font-semibold">दिशा:</span>
                <span className="font-bold uppercase text-[#102F6B]">{selectedEmailDetail.direction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">प्रेषक (From):</span>
                <span className="font-mono">{selectedEmailDetail.from}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">प्राप्तकर्ता (To):</span>
                <span className="font-mono">{Array.isArray(selectedEmailDetail.to) ? selectedEmailDetail.to.join(", ") : selectedEmailDetail.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">विषय:</span>
                <span className="font-bold">{selectedEmailDetail.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">प्रोवाइडर ID:</span>
                <span className="font-mono text-[11px]">{selectedEmailDetail.providerMessageId || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">स्थिति:</span>
                <span className="font-bold text-[#F26A21]">{selectedEmailDetail.status}</span>
              </div>
              {selectedEmailDetail.errorMessage && (
                <div className="p-2 bg-red-50 border border-red-200 text-red-800 rounded-xs text-[11px]">
                  <strong>त्रुटि विवरण:</strong> {selectedEmailDetail.errorMessage}
                </div>
              )}
            </div>

            <div>
              <span className="font-semibold text-[#1E293B] block mb-1">संदेश सामग्री:</span>
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
                बंद करें
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
