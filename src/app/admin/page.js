"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

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
    heroBadge: "Official Community Portal",
    heroTitle: "Akhil Bhartiya Samaj Directory & Central Portal",
    heroSubtitle: "A comprehensive digital network connecting community members, elders, doctors, engineers, advocates, merchants, and youth network across India.",
    heroCtaText: "Explore Member Directory →",
    heroCtaLink: "/directory",
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

  // 7. Messages / Inquiries State
  const [messages, setMessages] = useState([]);

  // Confirmation Modal for Destructive Operations
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    targetName: "",
    confirmText: "Confirm",
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
      if (!res.ok) throw new Error("Failed to update approval status");
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
      if (!res.ok) throw new Error("Failed to update visibility");
      const data = await res.json();
      setMembers((prev) => prev.map((item) => (item._id === id || item.id === id ? data.member : item)));
      showBanner(`Member "${m.name}" visibility set to ${newPub ? "Published" : "Unlisted"}.`);
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  const toggleMemberArchive = (m) => {
    const isCurrentlyArchived = m.isArchived || m.membershipStatus === "archived";
    const nextState = !isCurrentlyArchived;

    requestConfirmation({
      title: nextState ? "Archive Member Record" : "Restore Member Record",
      message: nextState
        ? "Archived members remain stored in the database but are excluded from active public searches."
        : "Restoring this record will re-enable public directory visibility if approved.",
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
          if (!res.ok) throw new Error("Failed to archive/restore member");
          const data = await res.json();
          setMembers((prev) => prev.map((item) => (item._id === id || item.id === id ? data.member : item)));
          showBanner(`Member "${m.name}" ${nextState ? "archived" : "restored"}.`);
        } catch (err) {
          showBanner(err.message, true);
        }
      },
    });
  };

  const confirmDeleteMember = (m) => {
    requestConfirmation({
      title: "Delete Member Record",
      message: "Are you sure you want to permanently delete this member record? This cannot be undone.",
      targetName: m.name,
      confirmText: "Delete Permanently",
      confirmBtnClass: "bg-red-700 hover:bg-red-800 text-white",
      onConfirm: async () => {
        try {
          const id = m._id || m.id;
          const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete member");
          setMembers((prev) => prev.filter((item) => item._id !== id && item.id !== id));
          showBanner(`Member "${m.name}" deleted.`);
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
        if (!res.ok) throw new Error(data.error || "Failed to update member");
        setMembers((prev) => prev.map((item) => (item._id === editingMemberId || item.id === editingMemberId ? data.member : item)));
        showBanner(`Member "${payload.name}" updated.`);
      } else {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create member");
        setMembers((prev) => [data.member, ...prev]);
        showBanner(`Member "${payload.name}" added.`);
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
    formData.append("folder", targetField === "gallery" ? "alokworld_gallery" : "alokworld_members");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (targetField === "member") {
        setMemberForm((prev) => ({ ...prev, avatar: data.url }));
        showBanner("Photo uploaded.");
      } else if (targetField === "gallery") {
        setGalleryForm((prev) => ({ ...prev, imageUrl: data.url, publicId: data.publicId }));
        showBanner("Gallery image uploaded.");
      } else if (targetField === "ogImage") {
        setSettings((prev) => ({ ...prev, ogImage: data.url }));
        showBanner("Social image uploaded.");
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

      showBanner(`Page "${data.page.title || selectedPageSlug}" saved.`);
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePage = (slug) => {
    requestConfirmation({
      title: "Reset to Default Template",
      message: "Are you sure you want to remove custom content for this page? The hardcoded system template will be used.",
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
        showBanner("Gallery photo updated.");
      } else {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(galleryForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add item");
        setGalleryItems((prev) => [data.item, ...prev]);
        showBanner("Photo added to gallery.");
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
      title: "Delete Gallery Photo",
      message: "This photo record will be removed from the public gallery.",
      targetName: item.title,
      confirmText: "Delete Photo",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/gallery/${item._id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete");
          setGalleryItems((prev) => prev.filter((it) => it._id !== item._id));
          showBanner(`Photo "${item.title}" removed.`);
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
      showBanner(`User "${data.user.email}" added.`);
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = (adminUser) => {
    requestConfirmation({
      title: "Revoke Administrator Access",
      message: "Are you sure you want to revoke this administrator's CMS login privileges?",
      targetName: `${adminUser.name} (${adminUser.email})`,
      confirmText: "Revoke Access",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users?id=${adminUser._id}`, { method: "DELETE" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to delete user");
          setAdminUsers((prev) => prev.filter((u) => u._id !== adminUser._id));
          showBanner(`User "${adminUser.email}" removed.`);
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
          if (!res.ok) throw new Error("Failed to delete message");
          setMessages((prev) => prev.filter((m) => m.id !== id && m._id !== id));
          showBanner("Message deleted.");
        } catch (err) {
          showBanner(err.message, true);
        }
      },
    });
  };

  const handleToggleMessageRead = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id || m._id === id ? { ...m, isRead: !m.isRead } : m))
    );
  };

  // ==========================================
  // EDITORIAL NAVIGATION STRUCTURE
  // ==========================================
  const navigationSections = [
    {
      title: "Publishing",
      items: [
        { id: "overview", label: "Overview", icon: "overview" },
        {
          id: "members",
          label: "Member Directory",
          icon: "users",
          count: members.length,
          onClick: () => {
            setActiveTab("members");
            setStatusFilter("all");
          },
        },
        { id: "pages", label: "Page Content", icon: "document", count: pagesList.length },
        { id: "gallery", label: "Photo Gallery", icon: "photo", count: galleryItems.length },
      ],
    },
    {
      title: "Structure & Layout",
      items: [
        { id: "navigation", label: "Header Menu", icon: "navigation" },
        { id: "hero_widgets", label: "Hero & Announcements", icon: "widgets" },
      ],
    },
    {
      title: "Configuration",
      items: [
        { id: "site_settings", label: "Site Information", icon: "settings" },
        { id: "seo_settings", label: "Technical SEO", icon: "search" },
        {
          id: "maintenance",
          label: "Maintenance Mode",
          icon: "shield",
          activeIndicator: settings.maintenanceMode,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        { id: "audit_logs", label: "Audit Trail", icon: "clipboard" },
        ...(currentUser?.role === "superadmin"
          ? [{ id: "admin_team", label: "Staff & Permissions", icon: "key", count: adminUsers.length }]
          : []),
        { id: "messages", label: "Inquiries", icon: "mail", count: messages.length },
      ],
    },
  ];

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center p-4">
        <div className="bg-white border border-[#E2DDD5] p-6 text-center text-xs font-mono text-[#55657E]">
          Loading administrative desk...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1E293B] flex flex-col font-sans antialiased text-[13px]">
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BAR (44px compact, clean typography) */}
      {/* ========================================================================= */}
      <header className="h-11 bg-white border-b border-[#E2DDD5] sticky top-0 z-30 px-3 sm:px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-[#102F6B] hover:text-[#D9531E] cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/admin" className="flex items-center gap-1.5 font-bold text-sm tracking-tight text-[#102F6B]">
            <span>alokworld<span className="text-[#D9531E]">.in</span></span>
            <span className="text-[#A09A90] font-normal mx-0.5">/</span>
            <span className="text-xs font-medium text-[#55657E] hidden xs:inline">Editorial Desk</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="text-[#55657E] hidden sm:flex items-center gap-1.5">
            <span className="font-medium text-[#1E293B]">{currentUser?.email}</span>
            <span className="text-[10px] uppercase font-mono px-1 py-0.2 bg-[#F2EDE4] text-[#102F6B] border border-[#E2DDD5] rounded-xs">
              {currentUser?.role || "Editor"}
            </span>
          </div>

          <span className="text-[#E2DDD5] hidden sm:inline">|</span>

          <Link
            href="/directory"
            target="_blank"
            className="text-[#102F6B] hover:text-[#D9531E] font-medium transition-colors"
          >
            Live Site ↗
          </Link>

          <span className="text-[#E2DDD5]">|</span>

          <button
            onClick={handleLogout}
            className="text-red-700 hover:text-red-900 font-medium transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY LAYOUT: NARROW SIDEBAR + WORKSPACE */}
      {/* ========================================================================= */}
      <div className="flex-1 flex min-w-0 overflow-x-hidden">
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#0D1B2A]/40 z-40 md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-0 md:top-11 h-screen md:h-[calc(100vh-2.75rem)]
            w-56 bg-[#0D1B2A] text-slate-300 z-50 md:z-20 shrink-0 border-r border-[#1B2A40]
            flex flex-col justify-between transition-all duration-150 ease-in-out
            ${mobileMenuOpen ? "left-0 shadow-lg" : "-left-56 md:left-0"}
          `}
        >
          {/* Mobile Header */}
          <div className="md:hidden h-11 px-3 flex items-center justify-between border-b border-[#1B2A40]">
            <span className="font-bold text-xs text-white">Menu Navigation</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 p-1">
              ✕
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-3.5 text-xs">
            {navigationSections.map((sec) => (
              <div key={sec.title} className="space-y-0.5">
                <div className="px-2 text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
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

                      {item.count !== undefined && (
                        <span className="text-[10px] font-mono text-slate-400 ml-1">
                          {item.count}
                        </span>
                      )}

                      {item.activeIndicator && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9531E]" title="Notice Active"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="p-2.5 border-t border-[#1B2A40] text-[11px] text-slate-500 flex items-center justify-between">
            <span>alokworld.in CMS</span>
            <span className="font-mono text-slate-400">v2.0</span>
          </div>
        </aside>

        {/* Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 max-w-6xl mx-auto w-full space-y-4 overflow-x-hidden">
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
                  <h1 className="text-lg font-bold text-[#102F6B]">Publication Overview</h1>
                  <p className="text-xs text-[#55657E]">
                    System summary and recent directory activity.
                  </p>
                </div>
                <div className="text-xs text-[#55657E] font-mono">
                  {settings.maintenanceMode ? "● Maintenance Warning Active" : "● Live Production"}
                </div>
              </div>

              {/* Cohesive Summary Strip */}
              <div className="bg-white border border-[#E2DDD5] divide-y sm:divide-y-0 sm:divide-x divide-[#E2DDD5] grid grid-cols-1 sm:grid-cols-4 rounded-xs">
                <div className="p-4 cursor-pointer hover:bg-[#FAF8F3]" onClick={() => { setActiveTab("members"); setStatusFilter("all"); }}>
                  <div className="text-[11px] uppercase font-semibold text-[#55657E]">Total Members</div>
                  <div className="text-2xl font-bold text-[#102F6B] mt-0.5">{memberStats.total}</div>
                  <div className="text-[11px] text-[#55657E] mt-0.5">Directory database</div>
                </div>

                <div className="p-4 cursor-pointer hover:bg-[#FAF8F3]" onClick={() => { setActiveTab("members"); setStatusFilter("active"); }}>
                  <div className="text-[11px] uppercase font-semibold text-emerald-800">Approved</div>
                  <div className="text-2xl font-bold text-emerald-800 mt-0.5">{memberStats.approved}</div>
                  <div className="text-[11px] text-[#55657E] mt-0.5">Publicly active</div>
                </div>

                <div className="p-4 cursor-pointer hover:bg-[#FAF8F3]" onClick={() => { setActiveTab("members"); setStatusFilter("pending"); }}>
                  <div className="text-[11px] uppercase font-semibold text-amber-800">Pending Approval</div>
                  <div className="text-2xl font-bold text-amber-800 mt-0.5">{memberStats.pending}</div>
                  <div className="text-[11px] text-[#55657E] mt-0.5">
                    {memberStats.pending > 0 ? "Requires review" : "Up to date"}
                  </div>
                </div>

                <div className="p-4 cursor-pointer hover:bg-[#FAF8F3]" onClick={() => { setActiveTab("members"); setStatusFilter("archived"); }}>
                  <div className="text-[11px] uppercase font-semibold text-[#55657E]">Archived</div>
                  <div className="text-2xl font-bold text-[#1E293B] mt-0.5">{memberStats.archived}</div>
                  <div className="text-[11px] text-[#55657E] mt-0.5">Retained records</div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                <span className="font-semibold text-[#102F6B] mr-1">Quick Actions:</span>
                <button
                  onClick={() => { resetMemberForm(); setActiveTab("add_member"); }}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer"
                >
                  + Add Member
                </button>
                <button
                  onClick={() => setActiveTab("pages")}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer"
                >
                  Edit CMS Pages
                </button>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer"
                >
                  Upload Photos
                </button>
                <button
                  onClick={() => setActiveTab("site_settings")}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer"
                >
                  Site Settings
                </button>
                <button
                  onClick={() => setActiveTab("audit_logs")}
                  className="px-2.5 py-1 bg-white border border-[#E2DDD5] hover:border-[#102F6B] text-[#102F6B] font-medium rounded-xs cursor-pointer"
                >
                  View Audit Trail
                </button>
              </div>

              {/* Two Column Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Recent Members */}
                <div className="bg-white border border-[#E2DDD5] rounded-xs">
                  <div className="p-3 border-b border-[#E2DDD5] flex items-center justify-between font-bold text-xs text-[#102F6B]">
                    <span>Recent Member Registrations</span>
                    <button
                      onClick={() => { setActiveTab("members"); setStatusFilter("all"); }}
                      className="text-[#D9531E] hover:underline font-normal text-[11px]"
                    >
                      View All →
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
                    <span>Administrative Activity Log</span>
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
                    Community member roster, verification status, and directory publication.
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
                    { id: "all", label: "All", count: memberStats.total },
                    { id: "active", label: "Approved", count: memberStats.approved },
                    { id: "pending", label: "Pending", count: memberStats.pending },
                    { id: "unlisted", label: "Unlisted" },
                    { id: "archived", label: "Archived", count: memberStats.archived },
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
                    <option value="newest">Sort: Newest</option>
                    <option value="oldest">Sort: Oldest</option>
                    <option value="name_asc">Name: A–Z</option>
                    <option value="name_desc">Name: Z–A</option>
                    <option value="city_asc">City: A–Z</option>
                  </select>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search name, city, profession..."
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
                        <th className="py-2.5 px-3">Member</th>
                        <th className="py-2.5 px-3">Profession &amp; Role</th>
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
                            No members found matching the current criteria.
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
                                    {m.isPublished ? "Published" : "Unlisted"}
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
                    of <span className="font-semibold text-[#1E293B]">{filteredMembers.length}</span> members
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
                    {editingMemberId ? `Edit Record: ${memberForm.name}` : "Register Community Member"}
                  </h1>
                  <p className="text-xs text-[#55657E]">
                    Enter verified credentials, address, and directory privacy consent.
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
                    Identity &amp; Profile Picture
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
                        <label className="block font-medium text-[#1E293B] mb-1">Profile Slug</label>
                        <input
                          type="text"
                          value={memberForm.slug}
                          onChange={(e) => setMemberForm({ ...memberForm, slug: e.target.value })}
                          placeholder="e.g. rajesh-kumar-lodhi"
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs font-mono text-xs focus:border-[#102F6B] outline-hidden"
                        />
                        <span className="text-[11px] text-[#55657E] mt-0.5 block">
                          Leave blank to generate automatically.
                        </span>
                      </div>
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">Community Role</label>
                        <input
                          type="text"
                          value={memberForm.role}
                          onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                          placeholder="e.g. Community Elder, Core Member"
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
                        placeholder="Image URL"
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
                    Profession &amp; Location
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Profession / Occupation *</label>
                      <input
                        type="text"
                        required
                        value={memberForm.occupation}
                        onChange={(e) => setMemberForm({ ...memberForm, occupation: e.target.value })}
                        placeholder="e.g. Civil Engineer & Contractor"
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={memberForm.company}
                        onChange={(e) => setMemberForm({ ...memberForm, company: e.target.value })}
                        placeholder="e.g. Lodhi Infra Builders"
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">City *</label>
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
                      <label className="block font-medium text-[#1E293B] mb-1">Postal PIN Code</label>
                      <input
                        type="text"
                        value={memberForm.pincode}
                        onChange={(e) => setMemberForm({ ...memberForm, pincode: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Street Address</label>
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
                    Contact &amp; Biography
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Phone Number</label>
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
                        placeholder="name@example.com"
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div className="col-span-full">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-medium text-[#1E293B]">
                          Biography &amp; Career Highlights (WYSIWYG Rich Text)
                        </label>
                        <span className="text-[10px] text-[#55657E]">
                          Supports bold, italics, lists, headings, links, and Hindi/English
                        </span>
                      </div>
                      <RichTextEditor
                        value={memberForm.biography}
                        onChange={(html) => setMemberForm((prev) => ({ ...prev, biography: html }))}
                        minHeight="180px"
                        placeholder="Write biographical details, community contributions, and professional honors..."
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy & Permissions */}
                <div className="space-y-3">
                  <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider border-b border-[#E2DDD5] pb-1">
                    Directory Visibility &amp; Consent
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
                      <span>Publicly Listed in Samaj Directory</span>
                    </label>

                    <div className="pt-1 border-t border-[#E2DDD5] grid grid-cols-1 sm:grid-cols-3 gap-2 text-[#55657E]">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={memberForm.showPhone}
                          onChange={(e) => setMemberForm({ ...memberForm, showPhone: e.target.checked })}
                        />
                        <span>Show Phone Number</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={memberForm.showEmail}
                          onChange={(e) => setMemberForm({ ...memberForm, showEmail: e.target.checked })}
                        />
                        <span>Show Email Address</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={memberForm.showAddress}
                          onChange={(e) => setMemberForm({ ...memberForm, showAddress: e.target.checked })}
                        />
                        <span>Show Full Street Address</span>
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
                    {submitting ? "Saving..." : editingMemberId ? "Update Member" : "Save Member"}
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
                    Edit titles, hero headers, and formatted rich content across community portal routes.
                  </p>
                </div>
                <select
                  value={selectedPageSlug}
                  onChange={(e) => handleSelectPage(e.target.value)}
                  className="h-8 px-2.5 rounded-xs border border-[#D5CEC4] bg-white text-xs font-semibold text-[#102F6B]"
                >
                  <option value="about">About Us (/about)</option>
                  <option value="history">Samaj History (/history)</option>
                  <option value="organization">Organization (/organization)</option>
                  <option value="mahasabha">Mahasabha (/mahasabha)</option>
                  <option value="personalities">Personalities (/personalities)</option>
                  <option value="contact">Contact (/contact)</option>
                  <option value="privacy">Privacy Policy (/privacy)</option>
                  <option value="terms">Terms of Service (/terms)</option>
                </select>
              </div>

              <form onSubmit={handleSavePage} className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Page Title *</label>
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
                      Visual Page Content (WYSIWYG Document Editor)
                    </label>
                    <span className="text-[11px] text-[#55657E]">
                      Format headings, tables, Hindi/English text, links, and Cloudinary media visually.
                    </span>
                  </div>

                  <RichTextEditor
                    value={pageForm.content}
                    onChange={(html) => setPageForm((prev) => ({ ...prev, content: html }))}
                    minHeight="340px"
                    placeholder="Compose structured page content with headings, lists, tables, and images..."
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E2DDD5]">
                  <button
                    type="button"
                    onClick={() => handleDeletePage(selectedPageSlug)}
                    className="text-xs text-red-700 hover:underline cursor-pointer"
                  >
                    Reset Content to System Default
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
          {/* VIEW: HEADER NAVIGATION */}
          {/* ========================================================================= */}
          {activeTab === "navigation" && (
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">Header Navigation Menu</h1>
                  <p className="text-xs text-[#55657E]">
                    Standard public navigation links across the community portal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Menu"}
                </button>
              </div>

              <div className="bg-white border border-[#E2DDD5] p-4 rounded-xs space-y-3 text-xs">
                <p className="text-[#55657E]">
                  Default navigation bar consists of 10 primary links. Admin access links are strictly removed from public visibility.
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
                  <h1 className="text-lg font-bold text-[#102F6B]">Hero Section &amp; Announcements</h1>
                  <p className="text-xs text-[#55657E]">
                    Configure homepage hero banner, top announcement ticker, and community notices.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-5 text-xs">
                {/* Hero Section */}
                <div className="space-y-3">
                  <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider border-b border-[#E2DDD5] pb-1">
                    Homepage Hero Banner
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Hero Badge</label>
                      <input
                        type="text"
                        value={settings.heroBadge}
                        onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Hero Title</label>
                      <input
                        type="text"
                        value={settings.heroTitle}
                        onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden font-semibold"
                      />
                    </div>
                    <div className="col-span-full">
                      <label className="block font-medium text-[#1E293B] mb-1">Hero Subtitle</label>
                      <textarea
                        rows={2}
                        value={settings.heroSubtitle}
                        onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">CTA Button Label</label>
                      <input
                        type="text"
                        value={settings.heroCtaText}
                        onChange={(e) => setSettings({ ...settings, heroCtaText: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">CTA Destination URL</label>
                      <input
                        type="text"
                        value={settings.heroCtaLink}
                        onChange={(e) => setSettings({ ...settings, heroCtaLink: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Top Announcement Strip */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-1">
                    <h2 className="text-xs uppercase font-bold text-[#102F6B] tracking-wider">
                      Top Header Announcement Strip
                    </h2>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[#1E293B]">
                      <input
                        type="checkbox"
                        checked={settings.announcementEnabled}
                        onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Announcement Message</label>
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
                      <span>Active</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Notice Heading</label>
                      <input
                        type="text"
                        value={settings.sidebarNoticeTitle}
                        onChange={(e) => setSettings({ ...settings, sidebarNoticeTitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1E293B] mb-1">Notice Content</label>
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
                    Community convention archives and event photographs.
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
                  + Add Photo
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
                      <span>{editingGalleryId ? "Edit Photo" : "Add Photo"}</span>
                      <button onClick={() => setGalleryModalOpen(false)} className="text-slate-500 font-bold">✕</button>
                    </div>

                    <form onSubmit={handleSaveGalleryItem} className="space-y-3">
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={galleryForm.title}
                          onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">Category</label>
                        <select
                          value={galleryForm.category}
                          onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                        >
                          <option value="National Convention">National Convention</option>
                          <option value="Community Gathering">Community Gathering</option>
                          <option value="Youth Meet">Youth Meet</option>
                          <option value="Historical Heritage">Historical Heritage</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-medium text-[#1E293B] mb-1">Image URL / Upload</label>
                        <input
                          type="url"
                          required
                          value={galleryForm.imageUrl}
                          onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden mb-1.5"
                        />
                        <label className="px-2 py-0.5 bg-white border border-[#D5CEC4] text-[11px] font-medium cursor-pointer rounded-xs inline-block">
                          {uploadingImage ? "Uploading..." : "Upload File"}
                          <input
                            type="file"
                            accept="image/*"
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
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-[#102F6B] text-white px-3 py-1 rounded-xs font-medium cursor-pointer"
                        >
                          {submitting ? "Saving..." : "Save Photo"}
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
                  <h1 className="text-lg font-bold text-[#102F6B]">Technical SEO &amp; Indexing</h1>
                  <p className="text-xs text-[#55657E]">
                    Search engine metadata, canonical domain, Open Graph directives, and verification.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save SEO"}
                </button>
              </div>

              <div className="bg-white border border-[#E2DDD5] p-5 rounded-xs space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Default Meta Title</label>
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
                    <label className="block font-medium text-[#1E293B] mb-1">Meta Description</label>
                    <textarea
                      rows={2}
                      value={settings.seoDescription}
                      onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block font-medium text-[#1E293B] mb-1">Meta Keywords</label>
                    <input
                      type="text"
                      value={settings.seoKeywords}
                      onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
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
                  <h1 className="text-lg font-bold text-[#102F6B]">Site Information &amp; Contacts</h1>
                  <p className="text-xs text-[#55657E]">
                    Secretariat contact phone, inquiry email address, and physical location.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="bg-[#102F6B] hover:bg-[#0D1B2A] text-white px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Information"}
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
                    <label className="block font-medium text-[#1E293B] mb-1">Secretariat Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Official Phone</label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">WhatsApp Line</label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded-xs focus:border-[#102F6B] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E293B] mb-1">Physical Address</label>
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
                    Control active development notice bars and visitor advisories.
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
                    <div className="font-semibold text-[#1E293B]">Maintenance Mode Active</div>
                    <div className="text-[11px] text-[#55657E]">
                      Displays top development advisory bar on all public pages.
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
                  <label className="block font-medium text-[#1E293B] mb-1">Advisory Notice Message</label>
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
                  <h1 className="text-lg font-bold text-[#102F6B]">Audit Trail</h1>
                  <p className="text-xs text-[#55657E]">
                    Security record of administrator sign-ins, edits, and deletions.
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
                  <option value="All">All Events</option>
                  <option value="ADMIN_LOGIN">Admin Logins</option>
                  <option value="ADMIN_LOGOUT">Admin Logouts</option>
                  <option value="create_member">Member Creations</option>
                  <option value="update_member">Member Updates</option>
                  <option value="delete_member">Member Deletions</option>
                </select>
              </div>

              <div className="bg-white border border-[#E2DDD5] rounded-xs overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead className="bg-[#FAF8F3] border-b border-[#E2DDD5] text-[11px] uppercase tracking-wider text-[#55657E] font-semibold">
                      <tr>
                        <th className="py-2 px-3">Timestamp</th>
                        <th className="py-2 px-3">Administrator</th>
                        <th className="py-2 px-3">Action</th>
                        <th className="py-2 px-3">Entity</th>
                        <th className="py-2 px-3">Details</th>
                        <th className="py-2 px-3 text-right">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFECE6]">
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#55657E]">
                            No audit records found.
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
                    <span>{auditTotal} total logged events</span>
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
                <h1 className="text-lg font-bold text-[#102F6B]">Staff &amp; Permissions</h1>
                <p className="text-xs text-[#55657E]">
                  Authorized administrators and role access levels.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-white border border-[#E2DDD5] rounded-xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F3] border-b border-[#E2DDD5] text-[11px] uppercase tracking-wider text-[#55657E]">
                      <tr>
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Email</th>
                        <th className="py-2 px-3">Role</th>
                        <th className="py-2 px-3 text-right">Action</th>
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
                                Revoke
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
                    Add Team Account
                  </div>
                  <form onSubmit={handleCreateAdmin} className="space-y-2.5">
                    <div>
                      <label className="block text-[#1E293B] font-medium mb-1">Full Name</label>
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
                      <label className="block text-[#1E293B] font-medium mb-1">Password</label>
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
                        <option value="editor">Editor</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#102F6B] hover:bg-[#0D1B2A] text-white py-1.5 font-medium rounded-xs cursor-pointer shadow-xs"
                    >
                      {submitting ? "Adding..." : "Add Administrator"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: INQUIRIES */}
          {/* ========================================================================= */}
          {activeTab === "messages" && (
            <div className="space-y-3">
              <div className="border-b border-[#E2DDD5] pb-3 flex items-baseline justify-between">
                <div>
                  <h1 className="text-lg font-bold text-[#102F6B]">Contact Inquiries</h1>
                  <p className="text-xs text-[#55657E]">
                    Messages submitted by public visitors through the secretariat helpdesk form.
                  </p>
                </div>
                <span className="text-xs text-[#55657E]">
                  Total: {messages.length} inquiries
                </span>
              </div>

              <div className="space-y-2">
                {messages.length === 0 ? (
                  <div className="bg-white border border-[#E2DDD5] p-6 text-center text-xs text-[#55657E]">
                    No inquiries recorded yet.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id || msg._id}
                      className={`p-3 border rounded-xs text-xs space-y-1.5 ${
                        msg.isRead ? "bg-white border-[#E2DDD5]" : "bg-[#FFFBF5] border-[#D9531E]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#102F6B]">{msg.name}</span>
                          <span className="text-[#D5CEC4]">·</span>
                          <a href={`mailto:${msg.email}`} className="text-[#D9531E] hover:underline font-mono text-[11px]">
                            {msg.email}
                          </a>
                          {msg.phone && (
                            <>
                              <span className="text-[#D5CEC4]">·</span>
                              <span className="text-[#55657E] font-mono text-[11px]">{msg.phone}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <button
                            onClick={() => handleToggleMessageRead(msg.id || msg._id)}
                            className="text-[#102F6B] hover:underline cursor-pointer"
                          >
                            {msg.isRead ? "Mark Unread" : "Mark Read"}
                          </button>
                          <span className="text-[#D5CEC4]">·</span>
                          <button
                            onClick={() => handleDeleteMessage(msg.id || msg._id)}
                            className="text-red-700 hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="font-medium text-[#1E293B]">Subject: {msg.subject || "General Inquiry"}</div>
                      <p className="text-[#55657E] leading-relaxed bg-[#FAF8F3] p-2 border border-[#E2DDD5] rounded-xs">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONFIRMATION MODAL (Clean, Editorial, Non-disruptive) */}
      {/* ========================================================================= */}
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
