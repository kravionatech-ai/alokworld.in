"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Layout & Navigation State
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "members" | "add_member" | "pages" | "navigation" | "hero_widgets" | "gallery" | "seo_settings" | "site_settings" | "maintenance" | "audit_logs" | "admin_team" | "messages"
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global UI feedback state
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 1. Members state
  const [members, setMembers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminSearch, setAdminSearch] = useState("");
  const [memberSort, setMemberSort] = useState("newest");
  const [membersPage, setMembersPage] = useState(1);
  const MEMBERS_PER_PAGE = 12;

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

  // 2. Page Content CMS state
  const [pagesList, setPagesList] = useState([]);
  const [selectedPageSlug, setSelectedPageSlug] = useState("about");
  const [pageEditorMode, setPageEditorMode] = useState("edit"); // "edit" | "preview"
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

  // 3. Photo Gallery CMS state
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState("All");
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

  // 4. Website Settings & Banners state
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

  // 5. Activity Audit Logs state
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [auditFilterAction, setAuditFilterAction] = useState("All");
  const [auditSearch, setAuditSearch] = useState("");

  // 6. Admin Team & Roles state
  const [adminUsers, setAdminUsers] = useState([]);
  const [newAdminForm, setNewAdminForm] = useState({
    name: "",
    email: "",
    role: "editor",
    password: "",
  });

  // 7. Messages / Inquiries state
  const [messages, setMessages] = useState([]);

  // Confirmation Modal state for destructive operations
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    targetName: "",
    confirmText: "Confirm",
    confirmBtnClass: "bg-red-600 hover:bg-red-700 text-white",
    action: null,
  });

  // ==========================================
  // AUTHENTICATION & INITIALIZATION
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

  // Load all administrative data once auth is verified
  const loadAllData = () => {
    // 1. Members
    fetch("/api/members?admin=true&limit=150")
      .then((r) => r.json())
      .then((d) => {
        if (d?.members) setMembers(d.members);
      })
      .catch(console.error);

    // 2. Settings
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

    // 3. Pages CMS
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

    // 4. Gallery Items
    fetch("/api/gallery?all=true")
      .then((r) => r.json())
      .then((d) => {
        if (d?.items) setGalleryItems(d.items);
      })
      .catch(console.error);

    // 5. Inquiries
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

  // Load audit logs on demand
  useEffect(() => {
    if (authChecked && (activeTab === "audit_logs" || activeTab === "overview")) {
      const params = new URLSearchParams();
      params.set("page", String(auditPage));
      params.set("limit", activeTab === "overview" ? "5" : "20");
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

  // Load admin team when superadmin opens team tab
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
      setTimeout(() => setStatusMsg(""), 6000);
    }
  };

  // Confirmation modal trigger
  const requestConfirmation = ({ title, message, targetName, confirmText, confirmBtnClass, onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      targetName,
      confirmText: confirmText || "Confirm Action",
      confirmBtnClass: confirmBtnClass || "bg-red-600 hover:bg-red-700 text-white",
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
      // Status filter
      if (statusFilter === "active" && (!m.isApproved || m.isArchived)) return false;
      if (statusFilter === "pending" && (m.isApproved || m.isArchived)) return false;
      if (statusFilter === "archived" && !m.isArchived && m.membershipStatus !== "archived") return false;
      if (statusFilter === "unlisted" && m.isPublished) return false;

      // Text search
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

    // Sorting
    list = [...list].sort((a, b) => {
      if (memberSort === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (memberSort === "name_asc") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (memberSort === "name_desc") {
        return (b.name || "").localeCompare(a.name || "");
      } else if (memberSort === "city_asc") {
        return (a.city || "").localeCompare(b.city || "");
      }
      // default: newest first
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return list;
  }, [members, statusFilter, adminSearch, memberSort]);

  // Paginated member list
  const totalMemberPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE) || 1;
  const paginatedMembers = useMemo(() => {
    const start = (membersPage - 1) * MEMBERS_PER_PAGE;
    return filteredMembers.slice(start, start + MEMBERS_PER_PAGE);
  }, [filteredMembers, membersPage]);

  // Reset page when filters change
  useEffect(() => {
    setMembersPage(1);
  }, [statusFilter, adminSearch, memberSort]);

  // Summary counts
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
      if (!res.ok) throw new Error("Failed to update member approval status");
      const data = await res.json();
      setMembers((prev) => prev.map((item) => (item._id === id || item.id === id ? data.member : item)));
      showBanner(`Member "${m.name}" ${newStatus ? "approved and active" : "marked pending approval"}.`);
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
      if (!res.ok) throw new Error("Failed to update directory publication status");
      const data = await res.json();
      setMembers((prev) => prev.map((item) => (item._id === id || item.id === id ? data.member : item)));
      showBanner(`Member "${m.name}" visibility changed to ${newPub ? "Published" : "Unlisted"}.`);
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  const toggleMemberArchive = (m) => {
    const isCurrentlyArchived = m.isArchived || m.membershipStatus === "archived";
    const nextState = !isCurrentlyArchived;

    requestConfirmation({
      title: nextState ? "Archive Member Profile?" : "Restore Member Profile?",
      message: nextState
        ? "Archived members are hidden from the active community directory but retained for administrative records."
        : "Restoring this member will re-activate their record in the directory.",
      targetName: m.name,
      confirmText: nextState ? "Yes, Archive Profile" : "Yes, Restore Profile",
      confirmBtnClass: nextState ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white",
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
          showBanner(`Member "${m.name}" ${nextState ? "archived successfully" : "restored to active directory"}.`);
        } catch (err) {
          showBanner(err.message, true);
        }
      },
    });
  };

  const confirmDeleteMember = (m) => {
    requestConfirmation({
      title: "Permanently Delete Member?",
      message: "This action is irreversible. All profile data, contact visibility, and associated records will be permanently removed from MongoDB.",
      targetName: m.name,
      confirmText: "Delete Permanently",
      confirmBtnClass: "bg-red-600 hover:bg-red-700 text-white",
      onConfirm: async () => {
        try {
          const id = m._id || m.id;
          const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete member");
          setMembers((prev) => prev.filter((item) => item._id !== id && item.id !== id));
          showBanner(`Member "${m.name}" permanently deleted.`);
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
        showBanner(`Member "${payload.name}" updated successfully.`);
      } else {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create member");
        setMembers((prev) => [data.member, ...prev]);
        showBanner(`Member "${payload.name}" created successfully.`);
      }
      resetMemberForm();
      setActiveTab("members");
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  // Image upload handler (Cloudinary API integration)
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
      if (!res.ok) throw new Error(data.error || "Image upload failed");

      if (targetField === "member") {
        setMemberForm((prev) => ({ ...prev, avatar: data.url }));
        showBanner("Profile avatar uploaded successfully.");
      } else if (targetField === "gallery") {
        setGalleryForm((prev) => ({ ...prev, imageUrl: data.url, publicId: data.publicId }));
        showBanner("Gallery image uploaded successfully.");
      } else if (targetField === "ogImage") {
        setSettings((prev) => ({ ...prev, ogImage: data.url }));
        showBanner("Social Open Graph image uploaded successfully.");
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
      if (!res.ok) throw new Error(data.error || "Failed to save page content");

      setPagesList((prev) => {
        const idx = prev.findIndex((p) => p.slug === selectedPageSlug);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = data.page;
          return updated;
        }
        return [...prev, data.page];
      });

      showBanner(`Page "${data.page.title || selectedPageSlug}" published successfully.`);
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePage = (slug) => {
    requestConfirmation({
      title: "Delete Custom CMS Page?",
      message: "Are you sure you want to delete this custom page? Built-in fallback template content will be restored for visitors.",
      targetName: slug,
      confirmText: "Delete Page",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/pages/${slug}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete page content");
          setPagesList((prev) => prev.filter((p) => p.slug !== slug));
          showBanner(`CMS override for page "${slug}" removed. Default template restored.`);
        } catch (err) {
          showBanner(err.message, true);
        }
      },
    });
  };

  // ==========================================
  // 3. PHOTO GALLERY CMS LOGIC
  // ==========================================
  const filteredGallery = useMemo(() => {
    if (galleryCategoryFilter === "All") return galleryItems;
    return galleryItems.filter((item) => item.category === galleryCategoryFilter);
  }, [galleryItems, galleryCategoryFilter]);

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
        if (!res.ok) throw new Error(data.error || "Failed to update photo item");
        setGalleryItems((prev) => prev.map((it) => (it._id === editingGalleryId ? data.item : it)));
        showBanner("Photo gallery item updated.");
      } else {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(galleryForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add photo item");
        setGalleryItems((prev) => [data.item, ...prev]);
        showBanner("New photo item added to gallery.");
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
      title: "Delete Gallery Photo?",
      message: "This photo item and description will be permanently removed from the community photo gallery.",
      targetName: item.title,
      confirmText: "Delete Photo",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/gallery/${item._id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete photo");
          setGalleryItems((prev) => prev.filter((it) => it._id !== item._id));
          showBanner(`Gallery photo "${item.title}" removed.`);
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
      if (!res.ok) throw new Error(data.error || "Failed to update site settings");
      showBanner("Website settings and configuration saved successfully.");
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
      if (!res.ok) throw new Error(data.error || "Failed to create administrator");

      setAdminUsers((prev) => [data.user, ...prev]);
      setNewAdminForm({ name: "", email: "", role: "editor", password: "" });
      showBanner(`Admin user "${data.user.name}" created with role "${data.user.role}".`);
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = (adminUser) => {
    requestConfirmation({
      title: "Revoke Administrator Access?",
      message: "Are you sure you want to permanently revoke this administrator's CMS login privileges?",
      targetName: `${adminUser.name} (${adminUser.email})`,
      confirmText: "Revoke Access",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users?id=${adminUser._id}`, { method: "DELETE" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to delete administrator");
          setAdminUsers((prev) => prev.filter((u) => u._id !== adminUser._id));
          showBanner(`Administrator account "${adminUser.email}" removed.`);
        } catch (err) {
          showBanner(err.message, true);
        }
      },
    });
  };

  // ==========================================
  // 6. CONTACT MESSAGES / INQUIRIES LOGIC
  // ==========================================
  const handleDeleteMessage = (id) => {
    requestConfirmation({
      title: "Delete Inquiry Message?",
      message: "Are you sure you want to delete this received contact inquiry?",
      targetName: `Message #${id}`,
      confirmText: "Delete Message",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete message");
          setMessages((prev) => prev.filter((m) => m.id !== id && m._id !== id));
          showBanner("Contact inquiry deleted.");
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
  // NAVIGATION CONFIGURATION (Grouped Sections)
  // ==========================================
  const navigationGroups = [
    {
      group: "Dashboard",
      items: [
        { id: "overview", label: "Overview", icon: "📊" },
      ],
    },
    {
      group: "Directory",
      items: [
        {
          id: "members",
          label: "Members",
          icon: "👥",
          badge: members.length,
          onClick: () => {
            setActiveTab("members");
            setStatusFilter("all");
          },
        },
        {
          id: "add_member",
          label: editingMemberId ? "Edit Member" : "Add Member",
          icon: "➕",
          onClick: () => {
            resetMemberForm();
            setActiveTab("add_member");
          },
        },
        {
          id: "pending_approvals",
          label: "Pending Approvals",
          icon: "⏳",
          badge: memberStats.pending > 0 ? memberStats.pending : null,
          badgeColor: "bg-amber-500 text-white",
          activeCheck: activeTab === "members" && statusFilter === "pending",
          onClick: () => {
            setActiveTab("members");
            setStatusFilter("pending");
          },
        },
        {
          id: "archived_members",
          label: "Archived Members",
          icon: "📦",
          badge: memberStats.archived > 0 ? memberStats.archived : null,
          activeCheck: activeTab === "members" && statusFilter === "archived",
          onClick: () => {
            setActiveTab("members");
            setStatusFilter("archived");
          },
        },
      ],
    },
    {
      group: "Content",
      items: [
        { id: "pages", label: "Pages CMS", icon: "📝", badge: pagesList.length },
        { id: "navigation", label: "Navigation Links", icon: "🧭" },
        { id: "hero_widgets", label: "Hero & Widgets", icon: "📢" },
        { id: "gallery", label: "Photo Gallery", icon: "📸", badge: galleryItems.length },
      ],
    },
    {
      group: "Website",
      items: [
        { id: "seo_settings", label: "SEO Settings", icon: "🔍" },
        { id: "site_settings", label: "Site Settings", icon: "⚙️" },
        {
          id: "maintenance",
          label: "Maintenance",
          icon: "🚨",
          badge: settings.maintenanceMode ? "ACTIVE" : null,
          badgeColor: "bg-[#F26A21] text-white",
        },
      ],
    },
    {
      group: "Administration",
      items: [
        { id: "audit_logs", label: "Audit Logs", icon: "📋" },
        ...(currentUser?.role === "superadmin"
          ? [{ id: "admin_team", label: "Team & Roles", icon: "🔐", badge: adminUsers.length }]
          : []),
        { id: "messages", label: "Inquiries", icon: "✉️", badge: messages.length },
      ],
    },
  ];

  // Map active tab to breadcrumb title
  const currentTitle = useMemo(() => {
    switch (activeTab) {
      case "overview": return "Executive Dashboard Overview";
      case "members":
        if (statusFilter === "pending") return "Pending Member Approvals";
        if (statusFilter === "archived") return "Archived Member Records";
        return "Member Directory Management";
      case "add_member": return editingMemberId ? "Edit Member Profile" : "Register New Community Member";
      case "pages": return "Page Content CMS Editor";
      case "navigation": return "Navigation Menu Management";
      case "hero_widgets": return "Hero Banner & Sidebar Widgets";
      case "gallery": return "Photo Gallery Management";
      case "seo_settings": return "Technical SEO & Structured Data";
      case "site_settings": return "Portal Site Information";
      case "maintenance": return "Maintenance Mode & Announcements";
      case "audit_logs": return "Activity Audit Trail";
      case "admin_team": return "Administrative Team & Roles";
      case "messages": return "Contact Form Inquiries";
      default: return "Admin Control Center";
    }
  }, [activeTab, statusFilter, editingMemberId]);

  // Loading Screen while verifying session
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#FFFCF5] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg border border-[#E9E2D8] shadow-xs text-center max-w-sm w-full space-y-3">
          <div className="w-10 h-10 border-3 border-[#102F6B] border-t-[#F26A21] rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#102F6B]">Verifying CMS Administrative Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCF5] text-[#263449] flex flex-col antialiased">
      {/* ========================================================================= */}
      {/* 1. COMPACT TOP HEADER */}
      {/* ========================================================================= */}
      <header className="h-14 bg-white border-b border-[#E9E2D8] sticky top-0 z-30 shadow-xs px-3 sm:px-6 flex items-center justify-between shrink-0">
        {/* Left: Mobile Toggle + Text Brand */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded text-[#102F6B] hover:bg-[#FFF0E2] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
          >
            <span className="text-lg leading-none">☰</span>
          </button>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex p-1.5 rounded text-[#102F6B] hover:bg-[#FFF0E2] transition-colors cursor-pointer"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <span className="text-xs font-bold">{sidebarCollapsed ? "▶" : "◀"}</span>
          </button>

          {/* Text Brand */}
          <Link href="/admin" className="flex items-center gap-2 group">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F26A21] inline-block shrink-0"></span>
            <span className="font-black text-sm sm:text-base text-[#102F6B] tracking-tight">
              alokworld<span className="text-[#F26A21]">.in</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold text-[#102F6B] bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#E9E2D8]">
              CMS Control
            </span>
          </Link>
        </div>

        {/* Right: User Profile, Public Site, Logout */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Admin Identity Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FFFCF5] border border-[#E9E2D8]">
            <span className="w-5 h-5 rounded-full bg-[#102F6B] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
            </span>
            <span className="font-semibold text-[#263449] hidden sm:inline max-w-[120px] truncate">
              {currentUser?.name || currentUser?.email}
            </span>
            <span
              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                currentUser?.role === "superadmin"
                  ? "bg-[#F26A21] text-white"
                  : "bg-[#102F6B] text-white"
              }`}
            >
              {currentUser?.role || "Editor"}
            </span>
          </div>

          {/* View Public Site */}
          <Link
            href="/directory"
            target="_blank"
            className="btn-outline px-2.5 py-1 text-xs font-semibold shadow-xs hidden xs:inline-flex items-center gap-1"
          >
            <span>Public Site</span>
            <span className="text-[10px]">↗</span>
          </Link>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="px-2.5 py-1 rounded text-xs font-bold bg-white text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200 transition-colors cursor-pointer"
            title="End administrative session"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN LAYOUT WITH COLLAPSIBLE SIDEBAR */}
      {/* ========================================================================= */}
      <div className="flex-1 flex min-w-0 overflow-x-hidden">
        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#091D42]/60 z-40 md:hidden backdrop-blur-xs animate-in fade-in duration-200"
          />
        )}

        {/* Sidebar Container: Fixed Desktop Sidebar & Drawer for Mobile */}
        <aside
          className={`
            fixed md:sticky top-0 md:top-14 h-screen md:h-[calc(100vh-3.5rem)]
            bg-[#091D42] text-white z-50 md:z-20 shrink-0 border-r border-[#102F6B]
            flex flex-col justify-between transition-all duration-200 ease-in-out
            ${mobileMenuOpen ? "left-0 w-64 shadow-xl" : "-left-64 md:left-0"}
            ${sidebarCollapsed ? "md:w-16" : "md:w-64"}
          `}
        >
          {/* Top Brand (Mobile only header) */}
          <div className="md:hidden h-14 px-4 flex items-center justify-between border-b border-[#102F6B] bg-[#091D42]">
            <div className="font-bold text-sm text-white">
              alokworld<span className="text-[#F26A21]">.in</span> Navigation
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Sidebar Navigation Items */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 text-xs">
            {navigationGroups.map((grp) => (
              <div key={grp.group} className="space-y-1">
                {/* Group Heading */}
                {!sidebarCollapsed && (
                  <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    {grp.group}
                  </div>
                )}

                {/* Group Items */}
                <div className="space-y-0.5">
                  {grp.items.map((item) => {
                    const isSelected = item.activeCheck !== undefined ? item.activeCheck : activeTab === item.id;
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
                          w-full flex items-center justify-between px-3 py-2 rounded-md font-semibold text-left transition-colors cursor-pointer
                          ${
                            isSelected
                              ? "bg-[#102F6B] text-white border-l-3 border-[#F26A21] shadow-xs"
                              : "text-slate-300 hover:text-white hover:bg-white/5 border-l-3 border-transparent"
                          }
                        `}
                        title={sidebarCollapsed ? `${grp.group}: ${item.label}` : undefined}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-sm shrink-0" aria-hidden="true">
                            {item.icon}
                          </span>
                          {!sidebarCollapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </div>

                        {/* Optional Badge */}
                        {!sidebarCollapsed && item.badge !== null && item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                              item.badgeColor || "bg-[#102F6B]/80 text-[#FFF0E2] border border-[#F0E5D5]/30"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 border-t border-[#102F6B] bg-[#071530] text-[11px] text-slate-400">
            {!sidebarCollapsed ? (
              <div className="flex items-center justify-between">
                <span>CMS Version 2.0</span>
                <span className="text-[#F26A21] font-semibold">Active</span>
              </div>
            ) : (
              <div className="text-center font-bold text-[#F26A21]">v2.0</div>
            )}
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* 3. MAIN WORKSPACE CONTENT AREA */}
        {/* ========================================================================= */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto w-full space-y-5 overflow-x-hidden">
          {/* Breadcrumb strip */}
          <div className="flex items-center justify-between text-xs text-[#64748B] border-b border-[#E9E2D8] pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[#102F6B] font-semibold">Admin</span>
              <span>/</span>
              <span className="text-[#263449] font-bold">{currentTitle}</span>
            </div>
            <div className="text-[11px] text-[#64748B] hidden sm:block">
              alokworld.in • Akhil Bhartiya Samaj Portal
            </div>
          </div>

          {/* Global Alert Feedback Banners */}
          {statusMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold text-sm">✓</span>
                <span>{statusMsg}</span>
              </div>
              <button
                onClick={() => setStatusMsg("")}
                className="text-emerald-700 hover:text-emerald-900 cursor-pointer text-sm font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-300 text-red-800 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold text-sm">⚠</span>
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => setErrorMsg("")}
                className="text-red-700 hover:text-red-900 cursor-pointer text-sm font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 0: DASHBOARD OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Header greeting */}
              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-[#102F6B]">
                    Welcome back, {currentUser?.name || "Administrator"}!
                  </h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Central Control Center for alokworld.in. Review member verifications, publish CMS pages, and monitor portal activity.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      resetMemberForm();
                      setActiveTab("add_member");
                    }}
                    className="btn-primary text-xs px-3.5 py-2 font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>+ Add New Member</span>
                  </button>
                </div>
              </div>

              {/* 4 Summary Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Total Registered */}
                <div
                  onClick={() => {
                    setActiveTab("members");
                    setStatusFilter("all");
                  }}
                  className="bg-white p-4 rounded-lg border border-[#E9E2D8] shadow-xs hover:border-[#102F6B] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B]">Total Members</span>
                    <span className="w-8 h-8 rounded-full bg-[#FFF0E2] text-[#F26A21] flex items-center justify-center text-sm font-bold">
                      👥
                    </span>
                  </div>
                  <div className="text-2xl font-black text-[#102F6B] mt-2 group-hover:text-[#F26A21] transition-colors">
                    {memberStats.total}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">Full Samaj Community Roster</p>
                </div>

                {/* Active & Approved */}
                <div
                  onClick={() => {
                    setActiveTab("members");
                    setStatusFilter("active");
                  }}
                  className="bg-white p-4 rounded-lg border border-[#E9E2D8] shadow-xs hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B]">Approved &amp; Active</span>
                    <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                  </div>
                  <div className="text-2xl font-black text-emerald-700 mt-2">
                    {memberStats.approved}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">Verified Directory Records</p>
                </div>

                {/* Pending Approvals */}
                <div
                  onClick={() => {
                    setActiveTab("members");
                    setStatusFilter("pending");
                  }}
                  className={`bg-white p-4 rounded-lg border shadow-xs hover:shadow-md transition-all cursor-pointer group ${
                    memberStats.pending > 0 ? "border-amber-400 bg-amber-50/20" : "border-[#E9E2D8]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B]">Pending Approvals</span>
                    <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                      ⏳
                    </span>
                  </div>
                  <div className="text-2xl font-black text-amber-700 mt-2">
                    {memberStats.pending}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    {memberStats.pending > 0 ? "Requires review & approval" : "All members verified"}
                  </p>
                </div>

                {/* Archived */}
                <div
                  onClick={() => {
                    setActiveTab("members");
                    setStatusFilter("archived");
                  }}
                  className="bg-white p-4 rounded-lg border border-[#E9E2D8] shadow-xs hover:border-slate-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B]">Archived Records</span>
                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">
                      📦
                    </span>
                  </div>
                  <div className="text-2xl font-black text-[#263449] mt-2">
                    {memberStats.archived}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">Hidden from public directory</p>
                </div>
              </div>

              {/* Second Row: System Overview & Content Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CMS Content Metrics */}
                <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-3">
                  <h3 className="font-bold text-sm text-[#102F6B] border-b border-[#E9E2D8] pb-2 flex items-center justify-between">
                    <span>Content &amp; Media</span>
                    <span className="text-xs text-[#F26A21]">Live</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-[#E9E2D8]/60">
                      <span className="text-[#64748B]">Published CMS Pages</span>
                      <span className="font-bold text-[#102F6B]">{pagesList.length} pages</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#E9E2D8]/60">
                      <span className="text-[#64748B]">Photo Gallery Items</span>
                      <span className="font-bold text-[#102F6B]">{galleryItems.length} photos</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[#64748B]">Contact Inquiries</span>
                      <span className="font-bold text-[#F26A21]">{messages.length} inquiries</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("pages")}
                    className="w-full btn-outline py-1.5 text-xs font-semibold"
                  >
                    Manage CMS Pages →
                  </button>
                </div>

                {/* Maintenance & Portal Health */}
                <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-3">
                  <h3 className="font-bold text-sm text-[#102F6B] border-b border-[#E9E2D8] pb-2 flex items-center justify-between">
                    <span>System Status</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-[#E9E2D8]/60">
                      <span className="text-[#64748B]">Maintenance Mode</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          settings.maintenanceMode ? "bg-[#FFF0E2] text-[#F26A21]" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {settings.maintenanceMode ? "ENABLED (Notice Active)" : "OFF (Live Mode)"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#E9E2D8]/60">
                      <span className="text-[#64748B]">Top Banner Announcement</span>
                      <span className="font-bold text-[#102F6B]">
                        {settings.announcementEnabled ? "Active" : "Disabled"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[#64748B]">Database Connection</span>
                      <span className="font-bold text-emerald-700">MongoDB Online</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("maintenance")}
                    className="w-full btn-outline py-1.5 text-xs font-semibold"
                  >
                    Configure Maintenance Mode →
                  </button>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-3">
                  <h3 className="font-bold text-sm text-[#102F6B] border-b border-[#E9E2D8] pb-2">
                    Quick Shortcuts
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {
                        resetMemberForm();
                        setActiveTab("add_member");
                      }}
                      className="p-2.5 rounded border border-[#E9E2D8] bg-[#FFFCF5] hover:bg-[#FFF0E2] text-left transition-colors cursor-pointer"
                    >
                      <div className="text-sm mb-1">👤</div>
                      <div className="font-bold text-[#102F6B]">Add Member</div>
                    </button>
                    <button
                      onClick={() => setActiveTab("gallery")}
                      className="p-2.5 rounded border border-[#E9E2D8] bg-[#FFFCF5] hover:bg-[#FFF0E2] text-left transition-colors cursor-pointer"
                    >
                      <div className="text-sm mb-1">📸</div>
                      <div className="font-bold text-[#102F6B]">Upload Photos</div>
                    </button>
                    <button
                      onClick={() => setActiveTab("seo_settings")}
                      className="p-2.5 rounded border border-[#E9E2D8] bg-[#FFFCF5] hover:bg-[#FFF0E2] text-left transition-colors cursor-pointer"
                    >
                      <div className="text-sm mb-1">🔍</div>
                      <div className="font-bold text-[#102F6B]">SEO Tags</div>
                    </button>
                    <button
                      onClick={() => setActiveTab("audit_logs")}
                      className="p-2.5 rounded border border-[#E9E2D8] bg-[#FFFCF5] hover:bg-[#FFF0E2] text-left transition-colors cursor-pointer"
                    >
                      <div className="text-sm mb-1">📋</div>
                      <div className="font-bold text-[#102F6B]">Audit Logs</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Member Registrations Table Preview */}
              <div className="bg-white rounded-lg border border-[#E9E2D8] shadow-xs overflow-hidden">
                <div className="p-4 border-b border-[#E9E2D8] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#102F6B]">Recent Community Members</h3>
                    <p className="text-xs text-[#64748B]">Latest members registered in the community directory</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("members");
                      setStatusFilter("all");
                    }}
                    className="text-xs font-bold text-[#F26A21] hover:underline cursor-pointer"
                  >
                    View All {members.length} Members →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#102F6B] text-white text-[11px] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-2.5 px-3.5">Member</th>
                        <th className="py-2.5 px-3.5">Profession</th>
                        <th className="py-2.5 px-3.5">Location</th>
                        <th className="py-2.5 px-3.5">Status</th>
                        <th className="py-2.5 px-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E2D8]">
                      {members.slice(0, 5).map((m) => (
                        <tr key={m._id || m.id} className="hover:bg-[#FFFCF5] transition-colors">
                          <td className="py-2.5 px-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#102F6B] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                {m.name ? m.name.charAt(0) : "M"}
                              </div>
                              <span className="font-bold text-[#102F6B]">{m.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3.5 text-[#263449] font-medium">{m.occupation || "Community Member"}</td>
                          <td className="py-2.5 px-3.5 text-[#64748B]">{m.city}, {m.state}</td>
                          <td className="py-2.5 px-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                m.isApproved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {m.isApproved ? "Approved" : "Pending"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <button
                              onClick={() => startEditMember(m)}
                              className="text-xs font-semibold text-[#F26A21] hover:underline cursor-pointer"
                            >
                              Edit Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 1: MEMBERS DIRECTORY LIST */}
          {/* ========================================================================= */}
          {activeTab === "members" && (
            <div className="space-y-4">
              {/* Page Title & Add New Member Button in Header */}
              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-[#102F6B]">
                    Member Discovery &amp; Directory Management
                  </h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Review, approve, edit, and organize community member profiles, publication status, and privacy consent.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      resetMemberForm();
                      setActiveTab("add_member");
                    }}
                    className="btn-primary text-xs px-4 py-2.5 font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>+ Add New Member</span>
                  </button>
                </div>
              </div>

              {/* 4 Summary Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`p-3.5 rounded-lg border text-left shadow-xs transition-all cursor-pointer ${
                    statusFilter === "all"
                      ? "bg-[#FFF0E2] border-[#F26A21] ring-2 ring-[#F26A21]/20"
                      : "bg-white border-[#E9E2D8] hover:border-[#102F6B]"
                  }`}
                >
                  <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Total Members</div>
                  <div className="text-2xl font-black text-[#102F6B] mt-1">{memberStats.total}</div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">All registered records</div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("active")}
                  className={`p-3.5 rounded-lg border text-left shadow-xs transition-all cursor-pointer ${
                    statusFilter === "active"
                      ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                      : "bg-white border-[#E9E2D8] hover:border-emerald-600"
                  }`}
                >
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Approved Members</div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{memberStats.approved}</div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">Verified active directory</div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("pending")}
                  className={`p-3.5 rounded-lg border text-left shadow-xs transition-all cursor-pointer ${
                    statusFilter === "pending"
                      ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20"
                      : "bg-white border-[#E9E2D8] hover:border-amber-600"
                  }`}
                >
                  <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending Approvals</div>
                  <div className="text-2xl font-black text-amber-700 mt-1">{memberStats.pending}</div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">Awaiting verification</div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("archived")}
                  className={`p-3.5 rounded-lg border text-left shadow-xs transition-all cursor-pointer ${
                    statusFilter === "archived"
                      ? "bg-slate-100 border-slate-500 ring-2 ring-slate-500/20"
                      : "bg-white border-[#E9E2D8] hover:border-slate-500"
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Archived Members</div>
                  <div className="text-2xl font-black text-[#263449] mt-1">{memberStats.archived}</div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">Hidden inactive records</div>
                </button>
              </div>

              {/* Separate Toolbar: Search, Status Filters & Sorting */}
              <div className="bg-white p-3.5 rounded-lg border border-[#E9E2D8] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: "all", label: "All Members" },
                    { id: "active", label: "Approved & Active" },
                    { id: "pending", label: "Pending" },
                    { id: "unlisted", label: "Unlisted" },
                    { id: "archived", label: "Archived" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStatusFilter(s.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        statusFilter === s.id
                          ? "bg-[#102F6B] text-white shadow-xs"
                          : "bg-[#FFFCF5] text-[#263449] hover:bg-[#FFF0E2] border border-[#E9E2D8]"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Search & Sort Controls */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Sorting dropdown */}
                  <select
                    value={memberSort}
                    onChange={(e) => setMemberSort(e.target.value)}
                    className="px-2.5 py-1.5 rounded-md border border-[#E9E2D8] bg-[#FFFCF5] text-xs font-semibold text-[#263449] focus:outline-none focus:border-[#F26A21] shrink-0"
                  >
                    <option value="newest">Sort: Newest Added</option>
                    <option value="oldest">Sort: Oldest Added</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                    <option value="city_asc">City: A to Z</option>
                  </select>

                  {/* Search input */}
                  <div className="relative flex-1 sm:w-64">
                    <input
                      type="text"
                      placeholder="Search name, city, role, slug..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-md border border-[#E9E2D8] bg-[#FFFCF5] focus:bg-white text-xs text-[#263449] focus:outline-none focus:border-[#F26A21] transition-colors"
                    />
                    <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">🔍</span>
                    {adminSearch && (
                      <button
                        onClick={() => setAdminSearch("")}
                        className="absolute right-2.5 top-1.5 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Members Table in Dedicated Horizontal Scroll Container */}
              <div className="bg-white rounded-lg border border-[#E9E2D8] shadow-xs overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-[#102F6B] text-white text-[11px] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-3.5">Member Profile</th>
                        <th className="py-3 px-3.5">Role &amp; Profession</th>
                        <th className="py-3 px-3.5">Location</th>
                        <th className="py-3 px-3.5">Approval Status</th>
                        <th className="py-3 px-3.5">Directory Visibility</th>
                        <th className="py-3 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E2D8]">
                      {paginatedMembers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-[#64748B]">
                            <div className="text-2xl mb-1">🔍</div>
                            <div className="font-bold text-sm text-[#102F6B]">No matching members found</div>
                            <p className="text-xs text-[#64748B] mt-0.5">Try adjusting your status filter or search keyword.</p>
                          </td>
                        </tr>
                      ) : (
                        paginatedMembers.map((m) => {
                          const isArchived = m.isArchived || m.membershipStatus === "archived";
                          return (
                            <tr key={m._id || m.id} className="hover:bg-[#FFFCF5] transition-colors">
                              {/* Member info with avatar & slug */}
                              <td className="py-3 px-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full overflow-hidden bg-[#102F6B] text-white border border-[#E9E2D8] shrink-0 flex items-center justify-center font-bold text-xs">
                                    {m.avatar ? (
                                      <img
                                        src={m.avatar}
                                        alt={m.name || "Member avatar"}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span>{m.name ? m.name.charAt(0).toUpperCase() : "M"}</span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <Link
                                      href={`/member/${m.slug || m._id || m.id}`}
                                      target="_blank"
                                      className="font-bold text-[#102F6B] hover:text-[#F26A21] transition-colors block truncate max-w-[180px]"
                                    >
                                      {m.name}
                                    </Link>
                                    <div className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5">
                                      <span>slug:</span>
                                      <span className="font-mono text-[#F26A21] bg-[#FFF0E2] px-1 rounded truncate max-w-[120px]">
                                        {m.slug || "none"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Profession & Organization */}
                              <td className="py-3 px-3.5">
                                <div className="font-semibold text-[#263449] truncate max-w-[200px]">
                                  {m.occupation || "Community Member"}
                                </div>
                                <div className="text-[11px] text-[#64748B] truncate max-w-[200px]">
                                  {m.company || m.role || "Samaj"}
                                </div>
                              </td>

                              {/* Location */}
                              <td className="py-3 px-3.5">
                                <div className="font-medium text-[#263449]">{m.city || "—"}</div>
                                <div className="text-[11px] text-[#64748B]">{m.state || "—"}</div>
                              </td>

                              {/* Approval status toggle */}
                              <td className="py-3 px-3.5">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => toggleMemberApproval(m)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                      m.isApproved
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                        : "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                                    }`}
                                    title="Click to toggle approval status"
                                  >
                                    {m.isApproved ? "✓ Approved" : "⏳ Pending"}
                                  </button>

                                  {isArchived && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                                      Archived
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Directory publication visibility toggle */}
                              <td className="py-3 px-3.5">
                                <button
                                  onClick={() => toggleMemberPublish(m)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                    m.isPublished
                                      ? "bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200"
                                      : "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200"
                                  }`}
                                  title="Click to toggle directory public listing"
                                >
                                  {m.isPublished ? "🌐 Published" : "🔒 Unlisted"}
                                </button>
                              </td>

                              {/* Action buttons: Edit, Archive, Delete */}
                              <td className="py-3 px-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => startEditMember(m)}
                                    className="px-2.5 py-1 rounded bg-[#FFF0E2] text-[#F26A21] hover:bg-[#F26A21] hover:text-white font-bold transition-all cursor-pointer border border-[#E9E2D8]"
                                    title="Edit member details"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() => toggleMemberArchive(m)}
                                    className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer border border-[#E9E2D8] ${
                                      isArchived
                                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-700 hover:text-white"
                                    }`}
                                    title={isArchived ? "Restore to active directory" : "Archive member record"}
                                  >
                                    {isArchived ? "Restore" : "Archive"}
                                  </button>

                                  {currentUser?.role === "superadmin" && (
                                    <button
                                      onClick={() => confirmDeleteMember(m)}
                                      className="px-2.5 py-1 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold transition-all cursor-pointer border border-red-200"
                                      title="Permanently delete member record (Superadmin)"
                                    >
                                      Delete
                                    </button>
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

                {/* Pagination Toolbar */}
                <div className="bg-[#FFFCF5] p-3.5 border-t border-[#E9E2D8] text-xs text-[#64748B] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    Showing{" "}
                    <span className="font-bold text-[#102F6B]">
                      {filteredMembers.length === 0 ? 0 : (membersPage - 1) * MEMBERS_PER_PAGE + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-bold text-[#102F6B]">
                      {Math.min(membersPage * MEMBERS_PER_PAGE, filteredMembers.length)}
                    </span>{" "}
                    of <span className="font-bold text-[#102F6B]">{filteredMembers.length}</span> filtered members
                  </div>

                  {totalMemberPages > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={membersPage <= 1}
                        onClick={() => setMembersPage((p) => Math.max(1, p - 1))}
                        className="btn-outline px-2.5 py-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        ← Prev
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalMemberPages }, (_, i) => i + 1).map((pNum) => (
                          <button
                            key={pNum}
                            onClick={() => setMembersPage(pNum)}
                            className={`w-7 h-7 rounded text-xs font-bold transition-colors cursor-pointer ${
                              membersPage === pNum
                                ? "bg-[#102F6B] text-white"
                                : "bg-white border border-[#E9E2D8] text-[#263449] hover:bg-[#FFF0E2]"
                            }`}
                          >
                            {pNum}
                          </button>
                        ))}
                      </div>

                      <button
                        disabled={membersPage >= totalMemberPages}
                        onClick={() => setMembersPage((p) => Math.min(totalMemberPages, p + 1))}
                        className="btn-outline px-2.5 py-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: ADD / EDIT MEMBER FORM */}
          {/* ========================================================================= */}
          {activeTab === "add_member" && (
            <div className="bg-white rounded-lg border border-[#E9E2D8] p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E9E2D8] pb-3">
                <div>
                  <h1 className="text-xl font-black text-[#102F6B]">
                    {editingMemberId ? `Edit Member: ${memberForm.name}` : "Register New Community Member"}
                  </h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Fill in verified identity, professional credentials, address, and privacy permissions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetMemberForm();
                    setActiveTab("members");
                  }}
                  className="btn-outline text-xs px-3.5 py-1.5"
                >
                  ← Back to Members
                </button>
              </div>

              <form onSubmit={handleMemberSubmit} className="space-y-6 text-xs">
                {/* 1. Identity & Avatar */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-[#102F6B] border-b border-[#E9E2D8] pb-1">
                    1. Member Identity &amp; Profile Picture
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-3">
                      <div>
                        <label className="block font-semibold text-[#102F6B] mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={memberForm.name}
                          onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                          placeholder="e.g. Shri Rajesh Kumar Lodhi"
                          className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] focus:bg-white text-xs font-semibold focus:outline-none focus:border-[#F26A21]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#102F6B] mb-1">
                          Custom Profile URL Slug (Unique Identifier)
                        </label>
                        <input
                          type="text"
                          value={memberForm.slug}
                          onChange={(e) => setMemberForm({ ...memberForm, slug: e.target.value })}
                          placeholder="e.g. rajesh-kumar-lodhi"
                          className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] focus:bg-white text-xs font-mono focus:outline-none focus:border-[#F26A21]"
                        />
                        <span className="text-[10px] text-[#64748B] mt-0.5 block">
                          Leave blank to automatically generate from name.
                        </span>
                      </div>
                      <div>
                        <label className="block font-semibold text-[#102F6B] mb-1">Membership Role</label>
                        <input
                          type="text"
                          value={memberForm.role}
                          onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                          placeholder="e.g. Community Elder, Core Member, Youth Lead"
                          className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                        />
                      </div>
                    </div>

                    {/* Avatar Upload */}
                    <div className="p-3 bg-[#FFFCF5] rounded border border-[#E9E2D8] flex flex-col items-center justify-center text-center space-y-2">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-[#E9E2D8] flex items-center justify-center font-bold text-lg text-[#102F6B]">
                        {memberForm.avatar ? (
                          <img src={memberForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span>{memberForm.name ? memberForm.name.charAt(0) : "M"}</span>
                        )}
                      </div>
                      <label className="btn-outline px-3 py-1 text-xs cursor-pointer">
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
                        placeholder="or paste image URL"
                        value={memberForm.avatar}
                        onChange={(e) => setMemberForm({ ...memberForm, avatar: e.target.value })}
                        className="w-full text-[10px] p-1 rounded border border-[#E9E2D8] bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Professional & Location */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-[#102F6B] border-b border-[#E9E2D8] pb-1">
                    2. Profession &amp; Geographic Location
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-[#102F6B] mb-1">
                        Profession / Occupation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={memberForm.occupation}
                        onChange={(e) => setMemberForm({ ...memberForm, occupation: e.target.value })}
                        placeholder="e.g. Civil Engineer & Contractor"
                        className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-[#102F6B] mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={memberForm.company}
                        onChange={(e) => setMemberForm({ ...memberForm, company: e.target.value })}
                        placeholder="e.g. Lodhi Infra Builders Pvt Ltd"
                        className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={memberForm.city}
                        onChange={(e) => setMemberForm({ ...memberForm, city: e.target.value })}
                        placeholder="e.g. Bhopal"
                        className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={memberForm.state}
                        onChange={(e) => setMemberForm({ ...memberForm, state: e.target.value })}
                        placeholder="e.g. Madhya Pradesh"
                        className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">PIN Code</label>
                      <input
                        type="text"
                        value={memberForm.pincode}
                        onChange={(e) => setMemberForm({ ...memberForm, pincode: e.target.value })}
                        placeholder="e.g. 462016"
                        className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Street Address</label>
                      <input
                        type="text"
                        value={memberForm.address}
                        onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
                        placeholder="Plot / Colony / Sector"
                        className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Contact & Biography */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-[#102F6B] border-b border-[#E9E2D8] pb-1">
                    3. Contact Details &amp; Biography
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={memberForm.phone}
                        onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                        placeholder="+91 98260 12345"
                        className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Email Address</label>
                      <input
                        type="email"
                        value={memberForm.email}
                        onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                      />
                    </div>
                    <div className="col-span-full">
                      <label className="block font-semibold text-[#102F6B] mb-1">
                        Member Biography / Accomplishments
                      </label>
                      <textarea
                        rows={4}
                        value={memberForm.biography}
                        onChange={(e) => setMemberForm({ ...memberForm, biography: e.target.value })}
                        placeholder="Provide details of community service, career achievements, and leadership background..."
                        className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Privacy Consent & Publication Status */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-[#102F6B] border-b border-[#E9E2D8] pb-1">
                    4. Privacy Controls &amp; Administrative Status
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#FFFCF5] rounded border border-[#E9E2D8]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={memberForm.isApproved}
                        onChange={(e) => setMemberForm({ ...memberForm, isApproved: e.target.checked })}
                        className="accent-[#F26A21]"
                      />
                      <span className="font-bold text-[#102F6B]">Approved Member</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={memberForm.isPublished}
                        onChange={(e) => setMemberForm({ ...memberForm, isPublished: e.target.checked })}
                        className="accent-[#F26A21]"
                      />
                      <span className="font-bold text-[#102F6B]">Publicly Listed in Directory</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={memberForm.showPhone}
                        onChange={(e) => setMemberForm({ ...memberForm, showPhone: e.target.checked })}
                        className="accent-[#F26A21]"
                      />
                      <span className="font-medium text-[#263449]">Publicly Display Phone</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={memberForm.showEmail}
                        onChange={(e) => setMemberForm({ ...memberForm, showEmail: e.target.checked })}
                        className="accent-[#F26A21]"
                      />
                      <span className="font-medium text-[#263449]">Publicly Display Email</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={memberForm.showAddress}
                        onChange={(e) => setMemberForm({ ...memberForm, showAddress: e.target.checked })}
                        className="accent-[#F26A21]"
                      />
                      <span className="font-medium text-[#263449]">Publicly Display Full Address</span>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E2D8]">
                  <button
                    type="button"
                    onClick={() => {
                      resetMemberForm();
                      setActiveTab("members");
                    }}
                    className="btn-outline px-4 py-2 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary px-6 py-2.5 font-bold shadow-xs cursor-pointer"
                  >
                    {submitting ? "Saving Profile..." : editingMemberId ? "Update Member Profile" : "Save & Register Member"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: PAGES CONTENT CMS */}
          {/* ========================================================================= */}
          {activeTab === "pages" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-[#102F6B]">Page Content CMS Editor</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Customize titles, headers, hero banners, and formatted rich-text content across community pages.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedPageSlug}
                    onChange={(e) => handleSelectPage(e.target.value)}
                    className="px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs font-bold text-[#102F6B]"
                  >
                    <option value="about">About Us Page (/about)</option>
                    <option value="history">Samaj History (/history)</option>
                    <option value="organization">Organization (/organization)</option>
                    <option value="mahasabha">Mahasabha Information (/mahasabha)</option>
                    <option value="personalities">Historical Personalities (/personalities)</option>
                    <option value="contact">Contact Secretariat (/contact)</option>
                    <option value="privacy">Privacy Policy (/privacy)</option>
                    <option value="terms">Terms of Service (/terms)</option>
                  </select>
                </div>
              </div>

              <form onSubmit={handleSavePage} className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Page Main Title</label>
                    <input
                      type="text"
                      required
                      value={pageForm.title}
                      onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs font-bold focus:outline-none focus:border-[#F26A21]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Page Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={pageForm.subtitle}
                      onChange={(e) => setPageForm({ ...pageForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Banner Title</label>
                    <input
                      type="text"
                      value={pageForm.bannerTitle}
                      onChange={(e) => setPageForm({ ...pageForm, bannerTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Banner Subtitle</label>
                    <input
                      type="text"
                      value={pageForm.bannerSubtitle}
                      onChange={(e) => setPageForm({ ...pageForm, bannerSubtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs focus:outline-none focus:border-[#F26A21]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-[#102F6B]">Page HTML Body Content</label>
                    <div className="space-x-1">
                      <button
                        type="button"
                        onClick={() => setPageEditorMode("edit")}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${pageEditorMode === "edit" ? "bg-[#102F6B] text-white" : "bg-slate-100"}`}
                      >
                        Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setPageEditorMode("preview")}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${pageEditorMode === "preview" ? "bg-[#102F6B] text-white" : "bg-slate-100"}`}
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  {pageEditorMode === "edit" ? (
                    <textarea
                      rows={12}
                      value={pageForm.content}
                      onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                      placeholder="<h3>Section Heading</h3><p>Detailed formatted paragraph content...</p>"
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] font-mono text-xs focus:outline-none focus:border-[#F26A21]"
                    />
                  ) : (
                    <div
                      className="p-4 rounded border border-[#E9E2D8] bg-[#FFFCF5] cms-prose min-h-[200px]"
                      dangerouslySetInnerHTML={{ __html: pageForm.content }}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E9E2D8]">
                  <button
                    type="button"
                    onClick={() => handleDeletePage(selectedPageSlug)}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Reset to Default Hardcoded Template
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary px-5 py-2 text-xs font-bold shadow-xs cursor-pointer"
                  >
                    {submitting ? "Publishing Changes..." : "Publish Page Updates"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: NAVIGATION MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === "navigation" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-[#102F6B]">Navigation Menu Management</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Configure the primary header menu links shown across all pages for visitors.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="btn-primary text-xs px-4 py-2 font-bold shadow-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Navigation"}
                </button>
              </div>

              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-4 text-xs">
                <p className="text-xs text-[#64748B]">
                  Default navigation contains 10 core links: Home, History, Organization, Mahasabha, Matrimonial, Directory, Personalities, Gallery, About Us, Contact Us.
                </p>

                <div className="p-4 bg-[#FFFCF5] rounded border border-[#E9E2D8] space-y-2">
                  <div className="font-bold text-sm text-[#102F6B]">Active Primary Links:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {["Home (/)", "History (/history)", "Organization (/organization)", "Mahasabha (/mahasabha)", "Matrimonial (/matrimonial)", "Directory (/directory)", "Personalities (/personalities)", "Gallery (/gallery)", "About Us (/about)", "Contact Us (/contact)"].map((link) => (
                      <div key={link} className="p-2 bg-white rounded border border-[#E9E2D8] text-center font-semibold text-[#102F6B]">
                        {link}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: HERO & WIDGETS */}
          {/* ========================================================================= */}
          {activeTab === "hero_widgets" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-[#102F6B]">Hero Banner &amp; Sidebar Widgets</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Configure homepage hero banner, top announcements, community business spotlight, and sidebar notices.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="btn-primary text-xs px-4 py-2 font-bold shadow-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save All Widgets"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Hero Banner */}
                <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-3">
                  <h3 className="font-bold text-sm text-[#102F6B] border-b border-[#E9E2D8] pb-1">
                    Homepage Hero Section
                  </h3>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={settings.heroBadge}
                      onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={settings.heroTitle}
                      onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Hero Subtitle</label>
                    <textarea
                      rows={2}
                      value={settings.heroSubtitle}
                      onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={settings.heroCtaText}
                        onChange={(e) => setSettings({ ...settings, heroCtaText: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">CTA Button Link</label>
                      <input
                        type="text"
                        value={settings.heroCtaLink}
                        onChange={(e) => setSettings({ ...settings, heroCtaLink: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                      />
                    </div>
                  </div>
                </div>

                {/* Top Announcement Bar */}
                <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E9E2D8] pb-1">
                    <h3 className="font-bold text-sm text-[#102F6B]">Top Announcement Bar</h3>
                    <input
                      type="checkbox"
                      checked={settings.announcementEnabled}
                      onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                      className="accent-[#F26A21]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Announcement Message</label>
                    <textarea
                      rows={3}
                      value={settings.announcement}
                      onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                </div>

                {/* Community Business Spotlight Ad */}
                <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E9E2D8] pb-1">
                    <h3 className="font-bold text-sm text-[#102F6B]">Community Business Spotlight</h3>
                    <input
                      type="checkbox"
                      checked={settings.adEnabled}
                      onChange={(e) => setSettings({ ...settings, adEnabled: e.target.checked })}
                      className="accent-[#F26A21]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Spotlight Title</label>
                    <input
                      type="text"
                      value={settings.adTitle}
                      onChange={(e) => setSettings({ ...settings, adTitle: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={settings.adBannerText}
                      onChange={(e) => setSettings({ ...settings, adBannerText: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                </div>

                {/* Sidebar Notice */}
                <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E9E2D8] pb-1">
                    <h3 className="font-bold text-sm text-[#102F6B]">Sidebar Notice</h3>
                    <input
                      type="checkbox"
                      checked={settings.sidebarNoticeEnabled}
                      onChange={(e) => setSettings({ ...settings, sidebarNoticeEnabled: e.target.checked })}
                      className="accent-[#F26A21]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Notice Title</label>
                    <input
                      type="text"
                      value={settings.sidebarNoticeTitle}
                      onChange={(e) => setSettings({ ...settings, sidebarNoticeTitle: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Notice Message</label>
                    <textarea
                      rows={2}
                      value={settings.sidebarNoticeContent}
                      onChange={(e) => setSettings({ ...settings, sidebarNoticeContent: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 6: PHOTO GALLERY CMS */}
          {/* ========================================================================= */}
          {activeTab === "gallery" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-[#102F6B]">Photo Gallery Management</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Upload and categorize high-resolution photos from national conventions and youth meets.
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
                  className="btn-primary text-xs px-3.5 py-2 font-bold shadow-xs cursor-pointer"
                >
                  + Add New Photo
                </button>
              </div>

              {/* Gallery Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryItems.map((it) => (
                  <div key={it._id} className="bg-white rounded-lg border border-[#E9E2D8] overflow-hidden shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="h-40 bg-slate-100 overflow-hidden relative">
                        <img src={it.imageUrl} alt={it.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-[#102F6B] text-white px-2 py-0.5 rounded shadow-xs">
                          {it.category}
                        </span>
                      </div>
                      <div className="p-3 text-xs">
                        <div className="font-bold text-[#102F6B] truncate">{it.title}</div>
                        <div className="text-[11px] text-[#64748B] mt-1 line-clamp-2">{it.description}</div>
                      </div>
                    </div>
                    <div className="p-3 pt-0 flex items-center justify-between border-t border-[#E9E2D8] text-xs">
                      <span className="text-[10px] text-[#64748B]">{it.eventDate || "Convention"}</span>
                      <div className="space-x-1">
                        <button
                          onClick={() => {
                            setEditingGalleryId(it._id);
                            setGalleryForm(it);
                            setGalleryModalOpen(true);
                          }}
                          className="text-[#F26A21] font-bold hover:underline"
                        >
                          Edit
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={() => handleDeleteGalleryItem(it)}
                          className="text-red-600 font-bold hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add/Edit Photo Modal */}
              {galleryModalOpen && (
                <div className="fixed inset-0 bg-[#091D42]/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                  <div className="bg-white max-w-md w-full rounded-lg border border-[#E9E2D8] p-5 shadow-xl space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-[#E9E2D8] pb-2">
                      <h3 className="font-bold text-sm text-[#102F6B]">
                        {editingGalleryId ? "Edit Gallery Item" : "Add Photo to Gallery"}
                      </h3>
                      <button onClick={() => setGalleryModalOpen(false)} className="text-slate-500 font-bold">
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveGalleryItem} className="space-y-3">
                      <div>
                        <label className="block font-semibold text-[#102F6B] mb-1">Photo Title</label>
                        <input
                          type="text"
                          required
                          value={galleryForm.title}
                          onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                          className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#102F6B] mb-1">Category</label>
                        <select
                          value={galleryForm.category}
                          onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                          className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                        >
                          <option value="National Convention">National Convention</option>
                          <option value="Community Gathering">Community Gathering</option>
                          <option value="Youth Meet">Youth Meet</option>
                          <option value="Historical Heritage">Historical Heritage</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#102F6B] mb-1">Image URL / Upload</label>
                        <input
                          type="url"
                          required
                          value={galleryForm.imageUrl}
                          onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5] mb-2"
                        />
                        <label className="btn-outline px-3 py-1 text-xs cursor-pointer inline-block">
                          {uploadingImage ? "Uploading..." : "Upload from Device"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "gallery")}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#102F6B] mb-1">Description / Caption</label>
                        <textarea
                          rows={2}
                          value={galleryForm.description}
                          onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                          className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-[#E9E2D8]">
                        <button
                          type="button"
                          onClick={() => setGalleryModalOpen(false)}
                          className="btn-outline px-3 py-1.5"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn-primary px-4 py-1.5 font-bold shadow-xs"
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
          {/* VIEW 7: SEO SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === "seo_settings" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-[#102F6B]">Technical SEO &amp; Social Directives</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Configure search engine indexing, default meta tags, Google Search Console, and Open Graph previews.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="btn-primary text-xs px-4 py-2 font-bold shadow-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save SEO Settings"}
                </button>
              </div>

              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Default SEO Meta Title</label>
                    <input
                      type="text"
                      value={settings.seoTitle}
                      onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Canonical Base URL</label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Organization Name (Schema.org)</label>
                    <input
                      type="text"
                      value={settings.organizationName}
                      onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Google Search Console Verification Token</label>
                    <input
                      type="text"
                      value={settings.googleVerificationId}
                      onChange={(e) => setSettings({ ...settings, googleVerificationId: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5] font-mono"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block font-semibold text-[#102F6B] mb-1">Default SEO Meta Description</label>
                    <textarea
                      rows={2}
                      value={settings.seoDescription}
                      onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block font-semibold text-[#102F6B] mb-1">Keywords (Comma separated)</label>
                    <input
                      type="text"
                      value={settings.seoKeywords}
                      onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 8: SITE SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === "site_settings" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-[#102F6B]">Portal Information &amp; Contacts</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Update community secretariat name, official phone, support email, and physical office location.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="btn-primary text-xs px-4 py-2 font-bold shadow-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Site Settings"}
                </button>
              </div>

              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Official Portal Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Official Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Official Helpdesk Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Official Secretariat Phone</label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">WhatsApp Helpline</label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Physical Secretariat Address</label>
                    <input
                      type="text"
                      value={settings.contactAddress}
                      onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 9: MAINTENANCE SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === "maintenance" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-[#102F6B]">Maintenance Mode &amp; Announcements</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Control portal development warnings, announcement banners, and visitor maintenance notifications.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={submitting}
                  className="btn-primary text-xs px-4 py-2 font-bold shadow-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Maintenance Settings"}
                </button>
              </div>

              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-4 text-xs">
                {/* Master Switch */}
                <div className="p-4 bg-[#FFFCF5] rounded-lg border border-[#E9E2D8] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#102F6B]">Master Maintenance Mode</div>
                    <p className="text-xs text-[#64748B]">
                      When enabled, visitors are shown development notices while exploring the portal.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F26A21]"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Top Announcement Bar Notice */}
                  <div className="p-4 rounded border border-[#E9E2D8] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E9E2D8] pb-1">
                      <span className="font-bold text-[#102F6B]">Top Announcement Strip</span>
                      <input
                        type="checkbox"
                        checked={settings.maintenanceBarEnabled}
                        onChange={(e) => setSettings({ ...settings, maintenanceBarEnabled: e.target.checked })}
                        className="accent-[#F26A21]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">English Notice Text</label>
                      <textarea
                        rows={3}
                        value={settings.maintenanceMessage}
                        onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                      />
                    </div>
                  </div>

                  {/* Popup Modal Notice */}
                  <div className="p-4 rounded border border-[#E9E2D8] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E9E2D8] pb-1">
                      <span className="font-bold text-[#102F6B]">Welcome Modal Popup</span>
                      <input
                        type="checkbox"
                        checked={settings.maintenancePopupEnabled}
                        onChange={(e) => setSettings({ ...settings, maintenancePopupEnabled: e.target.checked })}
                        className="accent-[#F26A21]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Modal Title</label>
                      <input
                        type="text"
                        value={settings.maintenancePopupTitle}
                        onChange={(e) => setSettings({ ...settings, maintenancePopupTitle: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5] mb-2"
                      />
                      <label className="block font-semibold text-[#102F6B] mb-1">Modal Message</label>
                      <textarea
                        rows={2}
                        value={settings.maintenancePopupMessage}
                        onChange={(e) => setSettings({ ...settings, maintenancePopupMessage: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 10: AUDIT LOGS */}
          {/* ========================================================================= */}
          {activeTab === "audit_logs" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-[#102F6B]">Administrative Activity Audit Trail</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Immutable security log of all admin sign-ins, profile edits, deletions, and site modifications.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={auditFilterAction}
                    onChange={(e) => {
                      setAuditFilterAction(e.target.value);
                      setAuditPage(1);
                    }}
                    className="px-2.5 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5] text-xs font-semibold text-[#102F6B]"
                  >
                    <option value="All">All Actions</option>
                    <option value="ADMIN_LOGIN">Admin Logins</option>
                    <option value="ADMIN_LOGOUT">Admin Logouts</option>
                    <option value="create_member">Member Creations</option>
                    <option value="update_member">Member Updates</option>
                    <option value="delete_member">Member Deletions</option>
                    <option value="update_site_settings">Settings Modifications</option>
                  </select>
                </div>
              </div>

              {/* Audit Table */}
              <div className="bg-white rounded-lg border border-[#E9E2D8] shadow-xs overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-[#102F6B] text-white text-[11px] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-2.5 px-3.5">Administrator</th>
                        <th className="py-2.5 px-3.5">Action</th>
                        <th className="py-2.5 px-3.5">Target Entity</th>
                        <th className="py-2.5 px-3.5">Details</th>
                        <th className="py-2.5 px-3.5">IP Address</th>
                        <th className="py-2.5 px-3.5 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E2D8]">
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#64748B]">
                            No audit trail logs recorded yet.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map((log) => (
                          <tr key={log._id} className="hover:bg-[#FFFCF5] transition-colors">
                            <td className="py-2.5 px-3.5 font-bold text-[#102F6B]">
                              {log.adminName}
                              <div className="text-[10px] text-[#64748B] font-normal">{log.adminEmail}</div>
                            </td>
                            <td className="py-2.5 px-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF0E2] text-[#F26A21] border border-[#E9E2D8]">
                                {log.action}
                              </span>
                            </td>
                            <td className="py-2.5 px-3.5 text-[#263449] font-medium">{log.targetEntity || "—"}</td>
                            <td className="py-2.5 px-3.5 text-[#64748B] max-w-xs truncate" title={log.details}>
                              {log.details || "—"}
                            </td>
                            <td className="py-2.5 px-3.5 font-mono text-[11px] text-[#64748B]">{log.ipAddress}</td>
                            <td className="py-2.5 px-3.5 text-right text-[11px] text-[#64748B]">
                              {new Date(log.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {auditTotalPages > 1 && (
                  <div className="bg-[#FFFCF5] p-3 border-t border-[#E9E2D8] flex items-center justify-between text-xs text-[#64748B]">
                    <span>Total {auditTotal} activity entries</span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={auditPage <= 1}
                        onClick={() => setAuditPage((p) => Math.max(1, p - 1))}
                        className="btn-outline px-2 py-1 text-xs disabled:opacity-40"
                      >
                        ← Prev
                      </button>
                      <span className="px-2 font-bold text-[#102F6B]">
                        Page {auditPage} of {auditTotalPages}
                      </span>
                      <button
                        disabled={auditPage >= auditTotalPages}
                        onClick={() => setAuditPage((p) => Math.min(auditTotalPages, p + 1))}
                        className="btn-outline px-2 py-1 text-xs disabled:opacity-40"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 11: TEAM & ROLES (Superadmin Only) */}
          {/* ========================================================================= */}
          {activeTab === "admin_team" && currentUser?.role === "superadmin" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs">
                <h1 className="text-xl font-black text-[#102F6B]">Administrative Team &amp; Role Management</h1>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Manage administrator accounts, assign superadmin privileges, and revoke CMS credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Users List */}
                <div className="md:col-span-2 bg-white rounded-lg border border-[#E9E2D8] shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-[#E9E2D8] font-bold text-sm text-[#102F6B]">
                    Authorized Administrators ({adminUsers.length})
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#102F6B] text-white text-[11px] uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3.5">Name / Email</th>
                          <th className="py-2.5 px-3.5">Role</th>
                          <th className="py-2.5 px-3.5">Created</th>
                          <th className="py-2.5 px-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E9E2D8]">
                        {adminUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-[#FFFCF5]">
                            <td className="py-2.5 px-3.5">
                              <div className="font-bold text-[#102F6B]">{u.name}</div>
                              <div className="text-[11px] text-[#64748B]">{u.email}</div>
                            </td>
                            <td className="py-2.5 px-3.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.role === "superadmin" ? "bg-[#F26A21] text-white" : "bg-[#102F6B] text-white"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="py-2.5 px-3.5 text-[#64748B] text-[11px]">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              {u._id !== currentUser?.id && (
                                <button
                                  onClick={() => handleDeleteAdmin(u)}
                                  className="text-xs text-red-600 hover:underline font-bold"
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
                </div>

                {/* Add Admin Form */}
                <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs space-y-3 text-xs">
                  <h3 className="font-bold text-sm text-[#102F6B] border-b border-[#E9E2D8] pb-1">
                    Add Team Administrator
                  </h3>
                  <form onSubmit={handleCreateAdmin} className="space-y-3">
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAdminForm.name}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={newAdminForm.email}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Temporary Password</label>
                      <input
                        type="password"
                        required
                        value={newAdminForm.password}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Assigned Role</label>
                      <select
                        value={newAdminForm.role}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-[#E9E2D8] bg-[#FFFCF5]"
                      >
                        <option value="editor">Editor (Members, Pages, Gallery)</option>
                        <option value="superadmin">Superadmin (Full Access &amp; Settings)</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full btn-primary py-2 text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {submitting ? "Adding..." : "Add Administrator"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 12: INQUIRIES / MESSAGES */}
          {/* ========================================================================= */}
          {activeTab === "messages" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-[#E9E2D8] shadow-xs flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-[#102F6B]">Contact Form Inquiries</h1>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Messages received through the secretariat public contact page.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#FFF0E2] text-[#F26A21] border border-[#E9E2D8]">
                  Total: {messages.length} inquiries
                </span>
              </div>

              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="bg-white p-8 rounded-lg border border-[#E9E2D8] text-center text-[#64748B]">
                    No contact form submissions recorded yet.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id || msg._id}
                      className={`p-4 rounded-lg border transition-all text-xs space-y-2 ${
                        msg.isRead ? "bg-white border-[#E9E2D8]" : "bg-[#FFF0E2]/40 border-[#F26A21]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#102F6B]">{msg.name}</span>
                          <span className="text-slate-400">•</span>
                          <a href={`mailto:${msg.email}`} className="text-[#F26A21] hover:underline font-semibold">
                            {msg.email}
                          </a>
                          {msg.phone && (
                            <>
                              <span className="text-slate-400">•</span>
                              <a href={`tel:${msg.phone}`} className="text-[#102F6B] hover:underline">
                                {msg.phone}
                              </a>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#64748B]">{msg.date || "Recent"}</span>
                          <button
                            onClick={() => handleToggleMessageRead(msg.id || msg._id)}
                            className="text-[11px] font-semibold text-[#102F6B] hover:underline cursor-pointer"
                          >
                            {msg.isRead ? "Mark Unread" : "Mark Read"}
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id || msg._id)}
                            className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="font-semibold text-[#263449]">Subject: {msg.subject || "General Inquiry"}</div>
                      <p className="text-[#64748B] leading-relaxed bg-[#FFFCF5] p-2.5 rounded border border-[#E9E2D8]">
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
      {/* 4. CONFIRMATION MODAL FOR DESTRUCTIVE ACTIONS */}
      {/* ========================================================================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-[#091D42]/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white max-w-md w-full rounded-lg border border-[#E9E2D8] p-5 shadow-2xl space-y-4 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-red-600 font-bold text-sm border-b border-[#E9E2D8] pb-2">
              <span className="text-lg">⚠</span>
              <span>{confirmModal.title}</span>
            </div>

            <p className="text-[#263449] leading-relaxed">{confirmModal.message}</p>

            {confirmModal.targetName && (
              <div className="p-2.5 bg-[#FFFCF5] rounded border border-[#E9E2D8] text-[11px] font-semibold text-[#102F6B] truncate">
                Target: {confirmModal.targetName}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E9E2D8]">
              <button
                type="button"
                onClick={closeConfirmation}
                className="btn-outline px-4 py-2 font-semibold"
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
                className={`px-4 py-2 rounded font-bold text-xs shadow-xs cursor-pointer ${confirmModal.confirmBtnClass}`}
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
