"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Active top navigation tab
  const [activeTab, setActiveTab] = useState("members");
  // Sub-tabs / filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminSearch, setAdminSearch] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 1. Members state
  const [members, setMembers] = useState([]);
  const [membersPage, setMembersPage] = useState(1);
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

  // 7. Messages state
  const [messages, setMessages] = useState([]);

  // Confirmation Modal state for destructive actions
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    targetName: "",
    confirmText: "Confirm",
    confirmBtnClass: "bg-red-600 hover:bg-red-700",
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

  // Load data once auth is verified
  const loadAllData = () => {
    // 1. Members
    fetch("/api/members?admin=true&limit=100")
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

    // 4. Gallery Items (fetch all including drafts)
    fetch("/api/gallery?all=true")
      .then((r) => r.json())
      .then((d) => {
        if (d?.items) setGalleryItems(d.items);
      })
      .catch(console.error);

    // 5. Contact Inquiries
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

  // Load audit logs when switching to logs tab or pagination changes
  useEffect(() => {
    if (authChecked && activeTab === "audit_logs") {
      const params = new URLSearchParams();
      params.set("page", String(auditPage));
      params.set("limit", "20");
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

  // Helper auto-dismiss banners
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

  // ==========================================
  // CONFIRMATION MODAL HELPER
  // ==========================================
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
  // 1. MEMBER MANAGEMENT
  // ==========================================
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Status filter
      if (statusFilter === "active" && (!m.isApproved || m.isArchived)) return false;
      if (statusFilter === "pending" && (m.isApproved || m.isArchived)) return false;
      if (statusFilter === "archived" && !m.isArchived && m.membershipStatus !== "archived") return false;
      if (statusFilter === "unlisted" && m.isPublished) return false;

      // Text search
      if (adminSearch) {
        const query = adminSearch.toLowerCase();
        const n = (m.name || "").toLowerCase();
        const c = (m.city || "").toLowerCase();
        const o = (m.occupation || "").toLowerCase();
        const comp = (m.company || "").toLowerCase();
        const e = (m.email || "").toLowerCase();
        const p = (m.phone || "").toLowerCase();
        return n.includes(query) || c.includes(query) || o.includes(query) || comp.includes(query) || e.includes(query) || p.includes(query);
      }
      return true;
    });
  }, [members, statusFilter, adminSearch]);

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg("");
    setErrorMsg("");

    if (!memberForm.name || memberForm.name.trim().length < 2) {
      showBanner("Full Name is required (minimum 2 characters).", true);
      setSubmitting(false);
      return;
    }
    if (!memberForm.occupation) {
      showBanner("Profession / Occupation is required.", true);
      setSubmitting(false);
      return;
    }
    if (!memberForm.city) {
      showBanner("City is required.", true);
      setSubmitting(false);
      return;
    }
    if (!memberForm.state) {
      showBanner("State is required.", true);
      setSubmitting(false);
      return;
    }

    const payload = {
      ...memberForm,
      tags: memberForm.tags
        ? typeof memberForm.tags === "string"
          ? memberForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : memberForm.tags
        : [],
    };

    try {
      let res;
      if (editingMemberId) {
        res = await fetch(`/api/members/${editingMemberId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save member profile.");

      if (editingMemberId) {
        setMembers((prev) =>
          prev.map((m) => ((m._id || m.id) === editingMemberId ? data.member : m))
        );
        showBanner(`Member "${data.member.name}" updated successfully.`);
      } else {
        setMembers((prev) => [data.member, ...prev]);
        showBanner(`New member "${data.member.name}" added to the directory.`);
      }

      resetMemberForm();
      setActiveTab("members");
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditMember = (member) => {
    setEditingMemberId(member._id || member.id);
    setMemberForm({
      name: member.name || "",
      slug: member.slug || "",
      role: member.role || "Member",
      occupation: member.occupation || "",
      company: member.company || "",
      city: member.city || "",
      state: member.state || "",
      address: member.address || "",
      pincode: member.pincode || "",
      phone: member.phone || "",
      email: member.email || "",
      avatar: member.avatar || "",
      biography: member.biography || "",
      tags: Array.isArray(member.tags) ? member.tags.join(", ") : member.tags || "",
      membershipStatus: member.membershipStatus || (member.isArchived ? "archived" : member.isApproved ? "active" : "pending"),
      isApproved: member.isApproved !== undefined ? member.isApproved : true,
      isPublished: member.isPublished !== undefined ? member.isPublished : true,
      isArchived: member.isArchived !== undefined ? member.isArchived : false,
      showPhone: member.showPhone !== undefined ? member.showPhone : true,
      showEmail: member.showEmail !== undefined ? member.showEmail : true,
      showAddress: member.showAddress !== undefined ? member.showAddress : false,
    });
    setActiveTab("add_member");
  };

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

  const confirmDeleteMember = (member) => {
    if (currentUser?.role !== "superadmin") {
      showBanner("Access Denied: Only Superadmins can permanently delete member profiles. You may archive or unpublish instead.", true);
      return;
    }

    requestConfirmation({
      title: "Permanent Member Deletion",
      message: `Are you certain you wish to permanently delete the profile of "${member.name}"? This will remove their record and slug from the directory completely.`,
      targetName: `${member.name} (${member.city}, ${member.occupation})`,
      confirmText: "Delete Permanently",
      confirmBtnClass: "bg-red-600 hover:bg-red-700 text-white font-bold",
      onConfirm: async () => {
        const id = member._id || member.id;
        try {
          const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
          const d = await res.json();
          if (res.ok) {
            setMembers((prev) => prev.filter((m) => (m._id || m.id) !== id));
            showBanner(d.message || "Member deleted successfully.");
          } else {
            showBanner(d.error || "Failed to delete member.", true);
          }
        } catch (err) {
          showBanner("Error deleting member: " + err.message, true);
        }
      },
    });
  };

  const toggleMemberApproval = async (member) => {
    const id = member._id || member.id;
    const newApproved = !member.isApproved;
    const newStatus = newApproved ? "active" : "pending";
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: newApproved, membershipStatus: newStatus }),
      });
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => ((m._id || m.id) === id ? { ...m, isApproved: newApproved, membershipStatus: newStatus } : m))
        );
        showBanner(`Member "${member.name}" set to ${newApproved ? "Approved" : "Pending Approval"}.`);
      }
    } catch (err) {
      showBanner("Failed to update status", true);
    }
  };

  const toggleMemberPublish = async (member) => {
    const id = member._id || member.id;
    const newPub = !member.isPublished;
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newPub }),
      });
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => ((m._id || m.id) === id ? { ...m, isPublished: newPub } : m))
        );
        showBanner(`Member "${member.name}" set to ${newPub ? "Published" : "Unlisted"}.`);
      }
    } catch (err) {
      showBanner("Failed to toggle publication", true);
    }
  };

  const toggleMemberArchive = (member) => {
    const isCurrentlyArchived = member.isArchived || member.membershipStatus === "archived";
    const nextArchived = !isCurrentlyArchived;

    if (nextArchived) {
      requestConfirmation({
        title: "Archive Member Profile",
        message: `Archiving will remove "${member.name}" from public searches and directory listings while retaining their records safely in the database.`,
        targetName: member.name,
        confirmText: "Archive Profile",
        confirmBtnClass: "bg-[#102F6B] hover:bg-[#091D42] text-white",
        onConfirm: async () => {
          const id = member._id || member.id;
          const res = await fetch(`/api/members/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isArchived: true, membershipStatus: "archived" }),
          });
          if (res.ok) {
            setMembers((prev) =>
              prev.map((m) => ((m._id || m.id) === id ? { ...m, isArchived: true, membershipStatus: "archived" } : m))
            );
            showBanner(`Member "${member.name}" archived.`);
          }
        },
      });
    } else {
      const id = member._id || member.id;
      fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: false, membershipStatus: "active", isApproved: true }),
      }).then((r) => {
        if (r.ok) {
          setMembers((prev) =>
            prev.map((m) => ((m._id || m.id) === id ? { ...m, isArchived: false, membershipStatus: "active", isApproved: true } : m))
          );
          showBanner(`Member "${member.name}" restored to Active.`);
        }
      });
    }
  };

  // Upload image to Cloudinary with MIME and 5MB validation
  const handleCloudinaryUpload = async (file, folder = "alokworld_members", onSuccess) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      showBanner(`Invalid image format (${file.type}). Allowed: JPG, PNG, WebP, GIF.`, true);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showBanner(`Image file exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`, true);
      return;
    }

    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      onSuccess(data.url, data.publicId);
      showBanner("Image uploaded successfully to Cloudinary!");
    } catch (err) {
      showBanner("Cloudinary Upload Notice: " + err.message + " (Manual URL input also supported)", true);
    } finally {
      setUploadingImage(false);
    }
  };

  // ==========================================
  // 2. PAGE CONTENT CMS
  // ==========================================
  const handleSelectPage = (slug) => {
    setSelectedPageSlug(slug);
    const existing = pagesList.find((p) => p.slug === slug);
    if (existing) {
      setPageForm(existing);
    } else {
      // Default template
      setPageForm({
        slug,
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        subtitle: "",
        bannerTitle: "",
        bannerSubtitle: "",
        content: "<p>Page content under preparation.</p>",
        status: "published",
        metaTitle: "",
        metaDescription: "",
      });
    }
  };

  const handleSavePage = async (statusOverride) => {
    setSubmitting(true);
    setStatusMsg("");
    setErrorMsg("");

    const targetStatus = statusOverride || pageForm.status;
    const payload = {
      ...pageForm,
      status: targetStatus,
    };

    try {
      const res = await fetch(`/api/pages/${pageForm.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update page content.");

      setPageForm(data.page);
      setPagesList((prev) => {
        const idx = prev.findIndex((p) => p.slug === data.page.slug);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = data.page;
          return updated;
        }
        return [...prev, data.page];
      });

      showBanner(
        `Page "${data.page.title}" saved successfully as ${targetStatus === "published" ? "Published (Live)" : "Draft"}.`
      );
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  // Rich-text editor insertion helper
  const insertHtmlTag = (openTag, closeTag = "") => {
    const textarea = document.getElementById("cmsContentTextarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = openTag + (selected || "Text here") + closeTag;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    setPageForm((prev) => ({ ...prev, content: newContent }));
  };

  // ==========================================
  // 3. PHOTO GALLERY CMS
  // ==========================================
  const filteredGallery = useMemo(() => {
    if (galleryCategoryFilter === "All") return galleryItems;
    return galleryItems.filter((item) => item.category === galleryCategoryFilter);
  }, [galleryItems, galleryCategoryFilter]);

  const openNewGalleryModal = () => {
    setEditingGalleryId(null);
    setGalleryForm({
      title: "",
      category: "National Convention",
      eventDate: "2025",
      imageUrl: "",
      publicId: "",
      description: "",
      isPublished: true,
    });
    setGalleryModalOpen(true);
  };

  const openEditGalleryModal = (item) => {
    setEditingGalleryId(item._id);
    setGalleryForm({
      title: item.title || "",
      category: item.category || "National Convention",
      eventDate: item.eventDate || "",
      imageUrl: item.imageUrl || "",
      publicId: item.publicId || "",
      description: item.description || "",
      isPublished: item.isPublished !== undefined ? item.isPublished : true,
    });
    setGalleryModalOpen(true);
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryForm.title.trim()) {
      showBanner("Title is required for photo entry.", true);
      return;
    }
    if (!galleryForm.imageUrl.trim()) {
      showBanner("Photo image URL or upload is required.", true);
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (editingGalleryId) {
        res = await fetch(`/api/gallery/${editingGalleryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(galleryForm),
        });
      } else {
        res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(galleryForm),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save photo item.");

      if (editingGalleryId) {
        setGalleryItems((prev) =>
          prev.map((item) => (item._id === editingGalleryId ? data.item : item))
        );
        showBanner("Gallery item updated successfully.");
      } else {
        setGalleryItems((prev) => [data.item, ...prev]);
        showBanner("New photo published to gallery.");
      }
      setGalleryModalOpen(false);
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteGallery = (item) => {
    requestConfirmation({
      title: "Delete Gallery Photo",
      message: `Are you sure you want to permanently delete "${item.title}" from the gallery?`,
      targetName: item.title,
      confirmText: "Delete Photo",
      confirmBtnClass: "bg-red-600 hover:bg-red-700 text-white font-bold",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/gallery/${item._id}`, { method: "DELETE" });
          const d = await res.json();
          if (res.ok) {
            setGalleryItems((prev) => prev.filter((i) => i._id !== item._id));
            showBanner(d.message || "Photo deleted successfully.");
          } else {
            showBanner(d.error || "Failed to delete photo", true);
          }
        } catch (err) {
          showBanner("Error: " + err.message, true);
        }
      },
    });
  };

  const toggleGalleryPublish = async (item) => {
    const newPub = !item.isPublished;
    try {
      const res = await fetch(`/api/gallery/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newPub }),
      });
      if (res.ok) {
        setGalleryItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, isPublished: newPub } : i))
        );
        showBanner(`Photo "${item.title}" set to ${newPub ? "Published" : "Draft"}.`);
      }
    } catch (err) {
      showBanner("Failed to toggle status", true);
    }
  };

  // ==========================================
  // 4. WEBSITE SETTINGS & BANNERS
  // ==========================================
  const handleSaveSettings = async (e) => {
    e.preventDefault();
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
      if (!res.ok) throw new Error(data.error || "Failed to update website settings.");

      showBanner("Website settings and banner configurations updated successfully!");
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  // Navigation Links manager
  const addNavigationLink = () => {
    setSettings((prev) => ({
      ...prev,
      navigationLinks: [
        ...(prev.navigationLinks || []),
        { label: "New Link", href: "/", isEnabled: true, order: (prev.navigationLinks?.length || 0) + 1 },
      ],
    }));
  };

  const removeNavigationLink = (idx) => {
    setSettings((prev) => ({
      ...prev,
      navigationLinks: prev.navigationLinks.filter((_, i) => i !== idx),
    }));
  };

  const updateNavigationLink = (idx, field, val) => {
    setSettings((prev) => {
      const updated = [...(prev.navigationLinks || [])];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, navigationLinks: updated };
    });
  };

  // ==========================================
  // 5. ADMIN TEAM & ROLES (Superadmin Only)
  // ==========================================
  const handleAddAdminUser = async (e) => {
    e.preventDefault();
    if (!newAdminForm.name || !newAdminForm.email || !newAdminForm.password) {
      showBanner("All fields are required.", true);
      return;
    }
    if (newAdminForm.password.length < 8) {
      showBanner("Password must be at least 8 characters long.", true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdminForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create administrator account.");

      setAdminUsers((prev) => [data.user, ...prev]);
      setNewAdminForm({ name: "", email: "", role: "editor", password: "" });
      showBanner(`Administrator account for "${data.user.name}" (${data.user.role}) created successfully.`);
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteAdminUser = (adminUser) => {
    requestConfirmation({
      title: "Remove Administrator",
      message: `Are you sure you want to revoke administrative access for "${adminUser.name}" (${adminUser.email})? They will immediately be logged out and cannot access the CMS dashboard.`,
      targetName: `${adminUser.name} (${adminUser.email})`,
      confirmText: "Remove Administrator",
      confirmBtnClass: "bg-red-600 hover:bg-red-700 text-white font-bold",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users?id=${adminUser._id}`, { method: "DELETE" });
          const d = await res.json();
          if (res.ok) {
            setAdminUsers((prev) => prev.filter((u) => u._id !== adminUser._id));
            showBanner(d.message || "Administrator removed successfully.");
          } else {
            showBanner(d.error || "Failed to remove administrator.", true);
          }
        } catch (err) {
          showBanner("Error: " + err.message, true);
        }
      },
    });
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9ED] text-[#102F6B]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#102F6B] border-t-[#F26A21] rounded-full animate-spin"></div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Verifying CMS Administrative Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9ED] text-[#263449]">
      {/* Top Administrative Header */}
      <header className="bg-[#091D42] text-white border-b-2 border-[#F26A21] sticky top-0 z-30 shadow-md">
        <div className="max-w-[1240px] mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-black text-lg text-white tracking-tight flex items-center gap-1.5 hover:opacity-90">
              <span className="w-3 h-3 rounded-full bg-[#F26A21] inline-block"></span>
              alokworld<span className="text-[#F26A21]">.in</span>
              <span className="text-[11px] font-bold text-[#FFF0E2] bg-[#102F6B] px-2 py-0.5 rounded border border-[#E9D9C5]/30 ml-1">
                CMS CONTROL CENTER
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-300">Logged in:</span>
              <span className="font-semibold text-white">{currentUser?.name || currentUser?.email}</span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  currentUser?.role === "superadmin"
                    ? "bg-[#F26A21] text-white"
                    : "bg-[#102F6B] text-[#FFF0E2] border border-[#E9D9C5]/40"
                }`}
              >
                {currentUser?.role || "Editor"}
              </span>
            </div>

            <Link
              href="/directory"
              target="_blank"
              className="text-xs font-semibold px-2.5 py-1 rounded bg-[#102F6B] hover:bg-[#102F6B]/80 text-[#FFF0E2] transition-colors border border-[#E9D9C5]/20"
            >
              View Public Site ↗
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-bold px-3 py-1 rounded bg-red-600/90 hover:bg-red-700 text-white transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Primary CMS Navigation Bar */}
        <div className="bg-[#102F6B] border-t border-[#091D42]/60 overflow-x-auto">
          <div className="max-w-[1240px] mx-auto px-4 flex items-center gap-1">
            <button
              onClick={() => setActiveTab("members")}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === "members"
                  ? "border-[#F26A21] text-white bg-[#091D42]/60"
                  : "border-transparent text-slate-200 hover:text-white hover:bg-white/5"
              }`}
            >
              👥 Member Directory ({members.length})
            </button>

            <button
              onClick={() => {
                resetMemberForm();
                setActiveTab("add_member");
              }}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === "add_member"
                  ? "border-[#F26A21] text-white bg-[#091D42]/60"
                  : "border-transparent text-slate-200 hover:text-white hover:bg-white/5"
              }`}
            >
              ➕ {editingMemberId ? "Edit Member" : "Add Member"}
            </button>

            <button
              onClick={() => setActiveTab("pages")}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === "pages"
                  ? "border-[#F26A21] text-white bg-[#091D42]/60"
                  : "border-transparent text-slate-200 hover:text-white hover:bg-white/5"
              }`}
            >
              📝 Page Content CMS
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === "gallery"
                  ? "border-[#F26A21] text-white bg-[#091D42]/60"
                  : "border-transparent text-slate-200 hover:text-white hover:bg-white/5"
              }`}
            >
              📸 Photo Gallery ({galleryItems.length})
            </button>

            <button
              onClick={() => setActiveTab("navigation_widgets")}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === "navigation_widgets"
                  ? "border-[#F26A21] text-white bg-[#091D42]/60"
                  : "border-transparent text-slate-200 hover:text-white hover:bg-white/5"
              }`}
            >
              🧭 Navigation, Hero &amp; Widgets
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === "settings"
                  ? "border-[#F26A21] text-white bg-[#091D42]/60"
                  : "border-transparent text-slate-200 hover:text-white hover:bg-white/5"
              }`}
            >
              ⚙️ Settings &amp; Maintenance
            </button>

            <button
              onClick={() => {
                setActiveTab("audit_logs");
                setAuditPage(1);
              }}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === "audit_logs"
                  ? "border-[#F26A21] text-white bg-[#091D42]/60"
                  : "border-transparent text-slate-200 hover:text-white hover:bg-white/5"
              }`}
            >
              📋 Audit Logs
            </button>

            {currentUser?.role === "superadmin" && (
              <button
                onClick={() => setActiveTab("admin_team")}
                className={`px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                  activeTab === "admin_team"
                    ? "border-[#F26A21] text-white bg-[#091D42]/60"
                    : "border-transparent text-slate-200 hover:text-white hover:bg-white/5"
                }`}
              >
                🔐 Team &amp; Roles
              </button>
            )}

            <button
              onClick={() => setActiveTab("messages")}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === "messages"
                  ? "border-[#F26A21] text-white bg-[#091D42]/60"
                  : "border-transparent text-slate-200 hover:text-white hover:bg-white/5"
              }`}
            >
              ✉️ Inquiries ({messages.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Work Area */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 py-5 space-y-4">
        {/* Global Feedback Banners */}
        {statusMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold text-sm">✓</span>
              <span>{statusMsg}</span>
            </div>
            <button onClick={() => setStatusMsg("")} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-300 text-red-800 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-bold text-sm">⚠</span>
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg("")} className="text-red-700 hover:text-red-900 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: MEMBERS DIRECTORY LIST */}
        {/* ========================================================================= */}
        {activeTab === "members" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-[#E9D9C5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold text-[#102F6B]">Samaj Member Directory Management</h1>
                <p className="text-xs text-[#64748B]">
                  Manage verification, approvals, profile slugs, publication status, and privacy settings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    resetMemberForm();
                    setActiveTab("add_member");
                  }}
                  className="btn-primary text-xs px-3.5 py-2 font-bold shadow-xs cursor-pointer"
                >
                  + Add New Member
                </button>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white p-3 rounded-lg border border-[#E9D9C5] shadow-xs flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-[#102F6B] mr-1">Status:</span>
                {[
                  { id: "all", label: "All Members" },
                  { id: "active", label: "Approved & Active" },
                  { id: "pending", label: "Pending Approval" },
                  { id: "unlisted", label: "Unlisted" },
                  { id: "archived", label: "Archived" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id)}
                    className={`px-2.5 py-1 rounded cursor-pointer font-medium transition-colors ${
                      statusFilter === s.id
                        ? "bg-[#102F6B] text-white font-bold"
                        : "bg-[#FFF9ED] text-[#263449] hover:bg-[#FFF0E2] border border-[#E9D9C5]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search by name, city, profession..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449] focus:outline-none focus:border-[#F26A21]"
                />
              </div>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-lg border border-[#E9D9C5] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#102F6B] text-white text-[11px] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Member</th>
                      <th className="py-2.5 px-3">Role / Profession</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Visibility</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9D9C5]">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-[#64748B]">
                          No members match the current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((m) => {
                        const isArchived = m.isArchived || m.membershipStatus === "archived";
                        return (
                          <tr key={m._id || m.id} className="hover:bg-[#FFF9ED]/60 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#FFF0E2] border border-[#E9D9C5] shrink-0">
                                  {m.avatar ? (
                                    <img
                                      src={m.avatar}
                                      alt={m.name || "Member avatar"}
                                      loading="lazy"
                                      decoding="async"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#102F6B]">
                                      {m.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-[#102F6B] hover:text-[#F26A21]">
                                    <Link href={`/member/${m.slug || m._id || m.id}`} target="_blank">
                                      {m.name}
                                    </Link>
                                  </div>
                                  <div className="text-[11px] text-[#64748B]">
                                    slug: <code className="text-[#F26A21]">{m.slug || "none"}</code>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-[#263449]">{m.occupation}</div>
                              <div className="text-[11px] text-[#64748B]">{m.company || m.role}</div>
                            </td>

                            <td className="py-2.5 px-3">
                              <div className="font-medium text-[#263449]">{m.city}</div>
                              <div className="text-[11px] text-[#64748B]">{m.state}</div>
                            </td>

                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => toggleMemberApproval(m)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                    m.isApproved
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                      : "bg-amber-100 text-amber-800 border border-amber-300"
                                  }`}
                                  title="Click to toggle approval"
                                >
                                  {m.isApproved ? "Approved" : "Pending"}
                                </button>

                                {isArchived && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                                    Archived
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-2.5 px-3">
                              <button
                                onClick={() => toggleMemberPublish(m)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                  m.isPublished
                                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                                    : "bg-rose-100 text-rose-800 border border-rose-300"
                                }`}
                                title="Click to toggle directory publication"
                              >
                                {m.isPublished ? "Published" : "Unlisted"}
                              </button>
                            </td>

                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => startEditMember(m)}
                                  className="px-2 py-1 rounded bg-[#FFF0E2] text-[#F26A21] hover:bg-[#F26A21] hover:text-white font-semibold transition-colors cursor-pointer border border-[#E9D9C5]"
                                  title="Edit full profile details"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() => toggleMemberArchive(m)}
                                  className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer border border-[#E9D9C5] ${
                                    isArchived
                                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                                      : "bg-slate-100 text-slate-700 hover:bg-slate-700 hover:text-white"
                                  }`}
                                  title={isArchived ? "Restore to active directory" : "Archive member profile"}
                                >
                                  {isArchived ? "Restore" : "Archive"}
                                </button>

                                {currentUser?.role === "superadmin" && (
                                  <button
                                    onClick={() => confirmDeleteMember(m)}
                                    className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-700 hover:text-white font-semibold transition-colors cursor-pointer border border-red-200"
                                    title="Permanently delete member profile (Superadmin)"
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

              <div className="bg-[#FFF9ED] p-3 border-t border-[#E9D9C5] text-xs text-[#64748B] flex items-center justify-between">
                <span>Showing {filteredMembers.length} of {members.length} total members</span>
                <span className="italic">Slugs enable direct links (e.g. /member/dr-rajesh-lodhi)</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ADD / EDIT MEMBER FORM */}
        {/* ========================================================================= */}
        {activeTab === "add_member" && (
          <div className="bg-white rounded-lg border border-[#E9D9C5] p-5 shadow-xs space-y-5">
            <div className="border-b border-[#E9D9C5] pb-3 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-[#102F6B]">
                  {editingMemberId ? "Edit Member Profile" : "Register New Community Member"}
                </h1>
                <p className="text-xs text-[#64748B]">
                  Ensure information is verified. Slugs and duplicate checks are enforced on server save.
                </p>
              </div>

              {editingMemberId && (
                <button
                  type="button"
                  onClick={resetMemberForm}
                  className="text-xs font-semibold px-3 py-1 rounded bg-[#FFF0E2] text-[#F26A21] border border-[#E9D9C5] cursor-pointer"
                >
                  Cancel Edit (Switch to New)
                </button>
              )}
            </div>

            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Kumar Lodhi"
                    className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449] focus:outline-none focus:border-[#F26A21]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">
                    Profession / Occupation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.occupation}
                    onChange={(e) => setMemberForm({ ...memberForm, occupation: e.target.value })}
                    placeholder="e.g. Senior Medical Officer / Cardiologist"
                    className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449] focus:outline-none focus:border-[#F26A21]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Organization / Enterprise</label>
                  <input
                    type="text"
                    value={memberForm.company}
                    onChange={(e) => setMemberForm({ ...memberForm, company: e.target.value })}
                    placeholder="e.g. AIIMS Bhopal / Self-Employed"
                    className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449] focus:outline-none focus:border-[#F26A21]"
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
                    className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449] focus:outline-none focus:border-[#F26A21]"
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
                    className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449] focus:outline-none focus:border-[#F26A21]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Postal Pincode</label>
                  <input
                    type="text"
                    value={memberForm.pincode}
                    onChange={(e) => setMemberForm({ ...memberForm, pincode: e.target.value })}
                    placeholder="e.g. 462001"
                    className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449] focus:outline-none focus:border-[#F26A21]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449] focus:outline-none focus:border-[#F26A21]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    placeholder="e.g. doctor.rajesh@example.com"
                    className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449] focus:outline-none focus:border-[#F26A21]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Community Role</label>
                  <select
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449] focus:outline-none focus:border-[#F26A21]"
                  >
                    <option value="Member">Regular Member</option>
                    <option value="Patron">Community Patron / Elder</option>
                    <option value="Executive Member">Executive Committee</option>
                    <option value="Youth Leader">Youth Network</option>
                    <option value="Medical Council">Healthcare Advisory</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload with Cloudinary */}
              <div className="p-3.5 bg-[#FFF9ED] rounded-lg border border-[#E9D9C5] space-y-2">
                <label className="block font-semibold text-[#102F6B] text-xs">Profile Photo (Cloudinary Upload or Direct URL)</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) =>
                      handleCloudinaryUpload(e.target.files?.[0], "alokworld_members", (url) =>
                        setMemberForm((prev) => ({ ...prev, avatar: url }))
                      )
                    }
                    className="text-xs file:mr-2.5 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#102F6B] file:text-white hover:file:bg-[#091D42] cursor-pointer"
                  />
                  {uploadingImage && <span className="text-xs text-[#F26A21] font-semibold animate-pulse">Uploading to Cloudinary...</span>}
                  <input
                    type="url"
                    placeholder="Or paste direct image URL here"
                    value={memberForm.avatar}
                    onChange={(e) => setMemberForm({ ...memberForm, avatar: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded border border-[#E9D9C5] bg-white text-xs text-[#263449]"
                  />
                </div>
              </div>

              {/* Biography Rich-Text / HTML Area */}
              <div>
                <label className="block font-semibold text-[#102F6B] text-xs mb-1">
                  Biography &amp; Social Contribution
                </label>
                <textarea
                  rows={4}
                  value={memberForm.biography}
                  onChange={(e) => setMemberForm({ ...memberForm, biography: e.target.value })}
                  placeholder="Detailed professional experience, community contributions, awards, and educational background..."
                  className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449] focus:outline-none focus:border-[#F26A21]"
                />
              </div>

              {/* Privacy Consent & Visibility Controls */}
              <div className="p-3 bg-[#FFF0E2]/60 rounded-lg border border-[#E9D9C5] space-y-2 text-xs">
                <span className="font-bold text-[#102F6B] uppercase tracking-wider text-[11px]">
                  Member Privacy &amp; Consent Directives (Server-Masked)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#263449]">
                    <input
                      type="checkbox"
                      checked={memberForm.showPhone}
                      onChange={(e) => setMemberForm({ ...memberForm, showPhone: e.target.checked })}
                      className="accent-[#F26A21]"
                    />
                    Display Phone publicly
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#263449]">
                    <input
                      type="checkbox"
                      checked={memberForm.showEmail}
                      onChange={(e) => setMemberForm({ ...memberForm, showEmail: e.target.checked })}
                      className="accent-[#F26A21]"
                    />
                    Display Email publicly
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#263449]">
                    <input
                      type="checkbox"
                      checked={memberForm.showAddress}
                      onChange={(e) => setMemberForm({ ...memberForm, showAddress: e.target.checked })}
                      className="accent-[#F26A21]"
                    />
                    Display Physical Address
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs px-5 py-2 font-bold shadow-xs cursor-pointer"
                >
                  {submitting ? "Saving..." : editingMemberId ? "Update Member Profile" : "Save New Member"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("members")}
                  className="btn-outline text-xs px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PAGE CONTENT CMS */}
        {/* ========================================================================= */}
        {activeTab === "pages" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-[#E9D9C5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold text-[#102F6B]">Page Content Management System</h1>
                <p className="text-xs text-[#64748B]">
                  Edit dynamic multi-page content with rich formatting, draft/publish workflow, and instant preview.
                </p>
              </div>

              {/* Page Selectors */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {["about", "history", "organization", "mahasabha", "home"].map((slug) => (
                  <button
                    key={slug}
                    onClick={() => handleSelectPage(slug)}
                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-colors cursor-pointer ${
                      selectedPageSlug === slug
                        ? "bg-[#102F6B] text-white"
                        : "bg-[#FFF9ED] text-[#263449] hover:bg-[#FFF0E2] border border-[#E9D9C5]"
                    }`}
                  >
                    {slug}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Editor Grid */}
            <div className="bg-white rounded-lg border border-[#E9D9C5] p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E9D9C5] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-[#FFF0E2] text-[#F26A21] border border-[#E9D9C5]">
                    Slug: /{pageForm.slug}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                      pageForm.status === "published"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    Status: {pageForm.status}
                  </span>
                  {pageForm.lastEditedBy && (
                    <span className="text-[11px] text-[#64748B]">
                      (Last edited by: {pageForm.lastEditedBy})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPageEditorMode(pageEditorMode === "edit" ? "preview" : "edit")}
                    className="btn-outline text-xs px-3 py-1 cursor-pointer"
                  >
                    {pageEditorMode === "edit" ? "👁 View Live Preview" : "✏️ Return to Editor"}
                  </button>
                </div>
              </div>

              {pageEditorMode === "edit" ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Page Title</label>
                      <input
                        type="text"
                        value={pageForm.title}
                        onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449] font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Page Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={pageForm.subtitle}
                        onChange={(e) => setPageForm({ ...pageForm, subtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] focus:bg-white text-xs text-[#263449]"
                      />
                    </div>
                  </div>

                  {/* Rich Text Toolbar */}
                  <div className="border border-[#E9D9C5] rounded-lg overflow-hidden bg-white">
                    <div className="bg-[#FFF9ED] p-2 border-b border-[#E9D9C5] flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#102F6B]">
                      <span className="text-[11px] uppercase tracking-wider text-[#64748B] mr-2">Formatting:</span>
                      <button
                        type="button"
                        onClick={() => insertHtmlTag("<strong>", "</strong>")}
                        className="px-2 py-0.5 rounded bg-white hover:bg-[#FFF0E2] border border-[#E9D9C5] cursor-pointer"
                      >
                        Bold
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlTag("<em>", "</em>")}
                        className="px-2 py-0.5 rounded bg-white hover:bg-[#FFF0E2] border border-[#E9D9C5] cursor-pointer italic"
                      >
                        Italic
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlTag("<h3>", "</h3>\n")}
                        className="px-2 py-0.5 rounded bg-white hover:bg-[#FFF0E2] border border-[#E9D9C5] cursor-pointer"
                      >
                        Heading 3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlTag("<h4>", "</h4>\n")}
                        className="px-2 py-0.5 rounded bg-white hover:bg-[#FFF0E2] border border-[#E9D9C5] cursor-pointer"
                      >
                        Heading 4
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlTag("<p>", "</p>\n")}
                        className="px-2 py-0.5 rounded bg-white hover:bg-[#FFF0E2] border border-[#E9D9C5] cursor-pointer"
                      >
                        Paragraph
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlTag("<ul>\n  <li>", "</li>\n  <li>Item</li>\n</ul>\n")}
                        className="px-2 py-0.5 rounded bg-white hover:bg-[#FFF0E2] border border-[#E9D9C5] cursor-pointer"
                      >
                        • Bullet List
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlTag("<blockquote>", "</blockquote>\n")}
                        className="px-2 py-0.5 rounded bg-white hover:bg-[#FFF0E2] border border-[#E9D9C5] cursor-pointer"
                      >
                        Quote Box
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlTag('<a href="/contact">', "</a>")}
                        className="px-2 py-0.5 rounded bg-white hover:bg-[#FFF0E2] border border-[#E9D9C5] cursor-pointer"
                      >
                        Link
                      </button>
                    </div>

                    <textarea
                      id="cmsContentTextarea"
                      rows={14}
                      value={pageForm.content}
                      onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                      placeholder="Write or format HTML article content here..."
                      className="w-full p-4 font-mono text-xs text-[#263449] focus:outline-none"
                    />
                  </div>

                  {/* SEO Directives */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-[#FFF9ED] rounded-lg border border-[#E9D9C5]">
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Meta Title (SEO)</label>
                      <input
                        type="text"
                        value={pageForm.metaTitle}
                        onChange={(e) => setPageForm({ ...pageForm, metaTitle: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Meta Description (SEO)</label>
                      <input
                        type="text"
                        value={pageForm.metaDescription}
                        onChange={(e) => setPageForm({ ...pageForm, metaDescription: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Draft vs Published Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSavePage("published")}
                      className="btn-primary text-xs px-5 py-2 font-bold shadow-xs cursor-pointer"
                    >
                      {submitting ? "Saving..." : "Publish Page (Make Live)"}
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSavePage("draft")}
                      className="btn-navy text-xs px-4 py-2 font-bold shadow-xs cursor-pointer"
                    >
                      Save as Draft
                    </button>
                    <Link
                      href={`/${pageForm.slug}`}
                      target="_blank"
                      className="btn-outline text-xs px-3 py-2 cursor-pointer"
                    >
                      View Live Page ↗
                    </Link>
                  </div>
                </div>
              ) : (
                /* LIVE PREVIEW PANEL */
                <div className="p-6 bg-[#FFF9ED] rounded-lg border border-[#E9D9C5] space-y-4">
                  <div className="border-b border-[#E9D9C5] pb-3 bg-white p-4 rounded-lg">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#E9D9C5]">
                      Live Preview ({pageForm.status.toUpperCase()})
                    </span>
                    <h1 className="text-2xl font-black text-[#102F6B] mt-2 tracking-tight">
                      {pageForm.title}
                    </h1>
                    <p className="text-xs text-[#64748B] mt-1">{pageForm.subtitle}</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-[#E9D9C5]">
                    <div
                      className="cms-prose text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: pageForm.content }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PHOTO GALLERY CMS */}
        {/* ========================================================================= */}
        {activeTab === "gallery" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-[#E9D9C5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold text-[#102F6B]">Community Photo Gallery CMS</h1>
                <p className="text-xs text-[#64748B]">
                  Upload convention pictures, historical archives, and event photographs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openNewGalleryModal}
                  className="btn-primary text-xs px-3.5 py-2 font-bold shadow-xs cursor-pointer"
                >
                  + Add New Photo
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white p-3 rounded-lg border border-[#E9D9C5] flex items-center gap-1.5 flex-wrap text-xs">
              <span className="font-semibold text-[#102F6B] mr-1">Category:</span>
              {["All", "National Convention", "Education & Youth", "Heritage Festival", "Social Welfare"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded cursor-pointer font-medium transition-colors ${
                    galleryCategoryFilter === cat
                      ? "bg-[#102F6B] text-white font-bold"
                      : "bg-[#FFF9ED] text-[#263449] hover:bg-[#FFF0E2] border border-[#E9D9C5]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGallery.length === 0 ? (
                <div className="col-span-full bg-white p-10 text-center text-[#64748B] rounded-lg border border-[#E9D9C5]">
                  No photo gallery items found in this category.
                </div>
              ) : (
                filteredGallery.map((img) => (
                  <div
                    key={img._id}
                    className="bg-white rounded-lg border border-[#E9D9C5] overflow-hidden shadow-xs flex flex-col"
                  >
                    <div className="h-40 bg-[#FFF9ED] overflow-hidden relative">
                      <img
                        src={img.imageUrl}
                        alt={img.title || "Gallery photo thumbnail"}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute top-2 right-2 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs ${
                          img.isPublished ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                        }`}
                      >
                        {img.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#F26A21] font-bold">
                          <span>{img.category}</span>
                          <span className="text-[#64748B]">{img.eventDate}</span>
                        </div>
                        <h3 className="text-xs font-bold text-[#102F6B] line-clamp-1 mt-1">{img.title}</h3>
                        <p className="text-[11px] text-[#64748B] line-clamp-2 mt-0.5">{img.description}</p>
                      </div>

                      <div className="pt-2 border-t border-[#E9D9C5] flex items-center justify-between text-xs">
                        <button
                          onClick={() => toggleGalleryPublish(img)}
                          className="text-[11px] font-semibold text-[#102F6B] hover:text-[#F26A21] cursor-pointer"
                        >
                          {img.isPublished ? "Set Draft" : "Publish"}
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditGalleryModal(img)}
                            className="px-2 py-0.5 rounded bg-[#FFF0E2] text-[#F26A21] font-semibold text-[11px] cursor-pointer border border-[#E9D9C5]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDeleteGallery(img)}
                            className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-semibold text-[11px] cursor-pointer border border-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal for Add / Edit Photo */}
            {galleryModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                <div className="bg-white rounded-lg border border-[#E9D9C5] max-w-md w-full p-5 space-y-4 shadow-xl">
                  <div className="border-b border-[#E9D9C5] pb-2 flex items-center justify-between">
                    <h3 className="font-bold text-[#102F6B] text-sm">
                      {editingGalleryId ? "Edit Gallery Photo" : "Add New Gallery Photo"}
                    </h3>
                    <button
                      onClick={() => setGalleryModalOpen(false)}
                      className="text-[#64748B] hover:text-[#263449] font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleGallerySubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Photo Title *</label>
                      <input
                        type="text"
                        required
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        placeholder="e.g. National Convention Bhopal Assembly"
                        className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#102F6B] mb-1">Category</label>
                        <select
                          value={galleryForm.category}
                          onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                          className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                        >
                          <option value="National Convention">National Convention</option>
                          <option value="Education & Youth">Education &amp; Youth</option>
                          <option value="Heritage Festival">Heritage Festival</option>
                          <option value="Social Welfare">Social Welfare</option>
                          <option value="Executive Meeting">Executive Meeting</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-[#102F6B] mb-1">Event Date / Year</label>
                        <input
                          type="text"
                          value={galleryForm.eventDate}
                          onChange={(e) => setGalleryForm({ ...galleryForm, eventDate: e.target.value })}
                          placeholder="e.g. 2025"
                          className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                        />
                      </div>
                    </div>

                    {/* Image Upload for Gallery */}
                    <div className="p-3 bg-[#FFF9ED] rounded border border-[#E9D9C5] space-y-1.5">
                      <label className="block font-semibold text-[#102F6B]">Photo Upload (Max 5MB)</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) =>
                          handleCloudinaryUpload(e.target.files?.[0], "alokworld_gallery", (url, publicId) =>
                            setGalleryForm((prev) => ({ ...prev, imageUrl: url, publicId }))
                          )
                        }
                        className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-[#102F6B] file:text-white cursor-pointer"
                      />
                      <input
                        type="url"
                        placeholder="Or direct image URL"
                        value={galleryForm.imageUrl}
                        onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#102F6B] mb-1">Caption / Description</label>
                      <textarea
                        rows={2}
                        value={galleryForm.description}
                        onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                        placeholder="Brief description of the event, venue, or attendees..."
                        className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#263449]">
                      <input
                        type="checkbox"
                        checked={galleryForm.isPublished}
                        onChange={(e) => setGalleryForm({ ...galleryForm, isPublished: e.target.checked })}
                        className="accent-[#F26A21]"
                      />
                      Publish immediately to live gallery
                    </label>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9D9C5]">
                      <button
                        type="button"
                        onClick={() => setGalleryModalOpen(false)}
                        className="btn-outline text-xs px-3 py-1.5 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary text-xs px-4 py-1.5 font-bold cursor-pointer"
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
        {/* TAB 5: NAVIGATION, HERO BANNER & SIDEBAR WIDGETS */}
        {/* ========================================================================= */}
        {activeTab === "navigation_widgets" && (
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-[#E9D9C5] shadow-xs flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-[#102F6B]">Navigation, Hero Banners &amp; Sidebar Widgets</h1>
                <p className="text-xs text-[#64748B]">
                  Manage the top announcement strip, hero title, promotional call-to-actions, and advertisement widgets.
                </p>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-xs px-4 py-2 font-bold shadow-xs cursor-pointer"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Announcement Strip */}
            <div className="bg-white p-5 rounded-lg border border-[#E9D9C5] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E9D9C5] pb-2">
                <h2 className="font-bold text-sm text-[#102F6B]">1. Top Announcement Strip</h2>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#102F6B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.announcementEnabled}
                    onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                    className="accent-[#F26A21]"
                  />
                  Announcement Strip Enabled
                </label>
              </div>

              <div>
                <label className="block font-semibold text-[#102F6B] text-xs mb-1">Announcement Text</label>
                <input
                  type="text"
                  value={settings.announcement}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                  placeholder="e.g. Welcome to the official Samaj Community Directory portal. Connect, unite & empower."
                  className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                />
              </div>
            </div>

            {/* Hero Banner Section */}
            <div className="bg-white p-5 rounded-lg border border-[#E9D9C5] shadow-xs space-y-3">
              <h2 className="font-bold text-sm text-[#102F6B] border-b border-[#E9D9C5] pb-2">
                2. Homepage Hero Banner Customization
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Hero Badge Text</label>
                  <input
                    type="text"
                    value={settings.heroBadge}
                    onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Hero Main Title</label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs font-bold"
                  />
                </div>

                <div className="col-span-full">
                  <label className="block font-semibold text-[#102F6B] mb-1">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Primary CTA Button Label</label>
                  <input
                    type="text"
                    value={settings.heroCtaText}
                    onChange={(e) => setSettings({ ...settings, heroCtaText: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Primary CTA Button Link</label>
                  <input
                    type="text"
                    value={settings.heroCtaLink}
                    onChange={(e) => setSettings({ ...settings, heroCtaLink: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Notices & Ad Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-lg border border-[#E9D9C5] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E9D9C5] pb-2">
                  <h2 className="font-bold text-sm text-[#102F6B]">3. Sidebar Notice Box</h2>
                  <input
                    type="checkbox"
                    checked={settings.sidebarNoticeEnabled}
                    onChange={(e) => setSettings({ ...settings, sidebarNoticeEnabled: e.target.checked })}
                    className="accent-[#F26A21]"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Notice Title</label>
                    <input
                      type="text"
                      value={settings.sidebarNoticeTitle}
                      onChange={(e) => setSettings({ ...settings, sidebarNoticeTitle: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Notice Message</label>
                    <textarea
                      rows={3}
                      value={settings.sidebarNoticeContent}
                      onChange={(e) => setSettings({ ...settings, sidebarNoticeContent: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Key Regions Filter (Comma separated)</label>
                    <input
                      type="text"
                      value={settings.keyRegions}
                      onChange={(e) => setSettings({ ...settings, keyRegions: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-[#E9D9C5] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E9D9C5] pb-2">
                  <h2 className="font-bold text-sm text-[#102F6B]">4. Community Business Ad</h2>
                  <input
                    type="checkbox"
                    checked={settings.adEnabled}
                    onChange={(e) => setSettings({ ...settings, adEnabled: e.target.checked })}
                    className="accent-[#F26A21]"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Ad / Spotlight Title</label>
                    <input
                      type="text"
                      value={settings.adTitle}
                      onChange={(e) => setSettings({ ...settings, adTitle: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Banner Description</label>
                    <textarea
                      rows={2}
                      value={settings.adBannerText}
                      onChange={(e) => setSettings({ ...settings, adBannerText: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Action Link</label>
                    <input
                      type="text"
                      value={settings.adLink}
                      onChange={(e) => setSettings({ ...settings, adLink: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-xs px-5 py-2 font-bold shadow-xs cursor-pointer"
              >
                {submitting ? "Saving..." : "Save All Widget & Banner Settings"}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: WEBSITE SETTINGS, SEO & MAINTENANCE */}
        {/* ========================================================================= */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-[#E9D9C5] shadow-xs flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-[#102F6B]">Global Website Settings &amp; Maintenance Mode</h1>
                <p className="text-xs text-[#64748B]">
                  Configure portal branding, secretariat contact, development mode announcement, and SEO tags.
                </p>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-xs px-4 py-2 font-bold shadow-xs cursor-pointer"
              >
                {submitting ? "Saving..." : "Save Settings"}
              </button>
            </div>

            {/* Maintenance Mode Controls */}
            <div className="bg-white p-5 rounded-lg border border-[#E9D9C5] shadow-xs space-y-3">
              <h2 className="font-bold text-sm text-[#102F6B] border-b border-[#E9D9C5] pb-2 flex items-center justify-between">
                <span>1. Maintenance Mode &amp; Notice Controls</span>
                <span className="text-xs font-semibold text-[#F26A21]">Active on Portal</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium p-3 bg-[#FFF9ED] rounded border border-[#E9D9C5]">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceBarEnabled}
                    onChange={(e) => setSettings({ ...settings, maintenanceBarEnabled: e.target.checked })}
                    className="accent-[#F26A21]"
                  />
                  <span>Show Top Yellow Maintenance Banner</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium p-3 bg-[#FFF9ED] rounded border border-[#E9D9C5]">
                  <input
                    type="checkbox"
                    checked={settings.maintenancePopupEnabled}
                    onChange={(e) => setSettings({ ...settings, maintenancePopupEnabled: e.target.checked })}
                    className="accent-[#F26A21]"
                  />
                  <span>Show Initial Development Notice Dialog</span>
                </label>

                <div className="col-span-full">
                  <label className="block font-semibold text-[#102F6B] mb-1">
                    Top Maintenance Notice (English)
                  </label>
                  <input
                    type="text"
                    value={settings.maintenanceMessage}
                    onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Portal Identity & Secretariat Contact */}
            <div className="bg-white p-5 rounded-lg border border-[#E9D9C5] shadow-xs space-y-3">
              <h2 className="font-bold text-sm text-[#102F6B] border-b border-[#E9D9C5] pb-2">
                2. Secretariat &amp; Identity Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Portal Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Official Contact Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Official Secretariat Phone</label>
                  <input
                    type="text"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">WhatsApp Helpline</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Secretariat Physical Address</label>
                  <input
                    type="text"
                    value={settings.contactAddress}
                    onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white p-5 rounded-lg border border-[#E9D9C5] shadow-xs space-y-3">
              <h2 className="font-bold text-sm text-[#102F6B] border-b border-[#E9D9C5] pb-2">
                3. Global SEO &amp; Social Meta Directives
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Default SEO Meta Title</label>
                  <input
                    type="text"
                    value={settings.seoTitle}
                    onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Canonical Base Site URL</label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    placeholder="https://alokworld.in"
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Default SEO Keywords</label>
                  <input
                    type="text"
                    value={settings.seoKeywords}
                    onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Default Open Graph / Social Image URL</label>
                  <input
                    type="url"
                    value={settings.ogImage}
                    onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                    placeholder="https://alokworld.in/og-image.png"
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Official Organization Name (Schema.org)</label>
                  <input
                    type="text"
                    value={settings.organizationName}
                    onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102F6B] mb-1">Google Search Console Verification Token</label>
                  <input
                    type="text"
                    value={settings.googleVerificationId}
                    onChange={(e) => setSettings({ ...settings, googleVerificationId: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs font-mono"
                  />
                </div>

                <div className="col-span-full">
                  <label className="block font-semibold text-[#102F6B] mb-1">Default SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={settings.seoDescription}
                    onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-xs px-5 py-2 font-bold shadow-xs cursor-pointer"
              >
                {submitting ? "Saving..." : "Save Website Settings"}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: ACTIVITY AUDIT LOGS */}
        {/* ========================================================================= */}
        {activeTab === "audit_logs" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-[#E9D9C5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold text-[#102F6B]">Administrative Activity Audit Log</h1>
                <p className="text-xs text-[#64748B]">
                  Complete chronological immutable record of all administrative actions, logins, mutations, and uploads.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter by admin or details..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs w-56"
                />
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-lg border border-[#E9D9C5] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#102F6B] text-white text-[11px] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Admin</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Target Entity</th>
                      <th className="py-2.5 px-3">Details</th>
                      <th className="py-2.5 px-3">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9D9C5]">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-[#64748B]">
                          No audit events recorded yet.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log._id} className="hover:bg-[#FFF9ED]/60 transition-colors">
                          <td className="py-2 px-3 text-[11px] text-[#64748B] whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-2 px-3">
                            <div className="font-semibold text-[#102F6B]">{log.adminEmail}</div>
                            <span className="text-[10px] text-[#64748B] uppercase font-bold">{log.adminRole}</span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF0E2] text-[#F26A21] border border-[#E9D9C5]">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-semibold text-[#263449]">
                            {log.targetEntity}
                          </td>
                          <td className="py-2 px-3 text-[11px] text-[#64748B] max-w-xs truncate" title={log.details}>
                            {log.details || "-"}
                          </td>
                          <td className="py-2 px-3 text-[11px] text-[#64748B] font-mono whitespace-nowrap">
                            {log.ip || "127.0.0.1"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="bg-[#FFF9ED] p-3 border-t border-[#E9D9C5] flex items-center justify-between text-xs">
                <span>
                  Showing page {auditPage} of {auditTotalPages} ({auditTotal} total records)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={auditPage <= 1}
                    onClick={() => setAuditPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded bg-white border border-[#E9D9C5] disabled:opacity-40 cursor-pointer font-semibold text-[#102F6B]"
                  >
                    Previous
                  </button>
                  <button
                    disabled={auditPage >= auditTotalPages}
                    onClick={() => setAuditPage((p) => p + 1)}
                    className="px-2.5 py-1 rounded bg-white border border-[#E9D9C5] disabled:opacity-40 cursor-pointer font-semibold text-[#102F6B]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: ADMIN TEAM & ROLES (Superadmin Only) */}
        {/* ========================================================================= */}
        {activeTab === "admin_team" && currentUser?.role === "superadmin" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-[#E9D9C5] shadow-xs flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-[#102F6B]">Administrative Team &amp; Access Control</h1>
                <p className="text-xs text-[#64748B]">
                  Manage administrators and editors with role-based permissions and strict credential security.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Existing Team Members Table */}
              <div className="lg:col-span-7 bg-white rounded-lg border border-[#E9D9C5] overflow-hidden shadow-xs">
                <div className="p-3.5 bg-[#FFF9ED] border-b border-[#E9D9C5] font-bold text-[#102F6B] text-xs">
                  Active Administrators ({adminUsers.length})
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#102F6B] text-white text-[11px] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Name &amp; Email</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">Added</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9D9C5]">
                      {adminUsers.map((u) => {
                        const isSelf = u.email === currentUser?.email;
                        return (
                          <tr key={u._id} className="hover:bg-[#FFF9ED]/60 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-[#102F6B]">
                                {u.name} {isSelf && <span className="text-[#F26A21] text-[10px]">(You)</span>}
                              </div>
                              <div className="text-[11px] text-[#64748B]">{u.email}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  u.role === "superadmin"
                                    ? "bg-[#F26A21] text-white"
                                    : "bg-[#102F6B] text-[#FFF0E2]"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-[#64748B]">
                              {new Date(u.createdAt).toLocaleDateString("en-IN")}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {!isSelf && (
                                <button
                                  onClick={() => confirmDeleteAdminUser(u)}
                                  className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-700 hover:text-white font-semibold text-[11px] cursor-pointer border border-red-200"
                                >
                                  Remove
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add New Administrator Card */}
              <div className="lg:col-span-5 bg-white rounded-lg border border-[#E9D9C5] p-5 shadow-xs space-y-4">
                <div className="border-b border-[#E9D9C5] pb-2">
                  <h2 className="font-bold text-sm text-[#102F6B]">Add New Team Administrator</h2>
                  <p className="text-xs text-[#64748B]">Provide credentials for editors or secondary superadmins.</p>
                </div>

                <form onSubmit={handleAddAdminUser} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newAdminForm.name}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Chandra Verma"
                      className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newAdminForm.email}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                      placeholder="e.g. editor.ramesh@alokworld.in"
                      className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Role &amp; Permissions *</label>
                    <select
                      value={newAdminForm.role}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                      className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                    >
                      <option value="editor">Editor (Can create/edit members, CMS &amp; gallery)</option>
                      <option value="superadmin">Superadmin (Unrestricted access &amp; deletions)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#102F6B] mb-1">Initial Password (Min 8 chars) *</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newAdminForm.password}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-1.5 rounded border border-[#E9D9C5] bg-[#FFF9ED] text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full text-xs py-2 font-bold cursor-pointer shadow-xs mt-2"
                  >
                    {submitting ? "Creating Account..." : "Create Administrator Account"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: CONTACT INQUIRIES */}
        {/* ========================================================================= */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-[#E9D9C5] shadow-xs">
              <h1 className="text-lg font-bold text-[#102F6B]">Public Secretariat Contact Inquiries</h1>
              <p className="text-xs text-[#64748B]">Messages and questions submitted through the portal contact form.</p>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="bg-white p-10 text-center text-[#64748B] rounded-lg border border-[#E9D9C5]">
                  No incoming messages found.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className="bg-white p-4 rounded-lg border border-[#E9D9C5] shadow-xs space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#E9D9C5] pb-2">
                      <div className="font-bold text-[#102F6B] text-sm">
                        {msg.name}{" "}
                        <span className="text-xs font-normal text-[#64748B]">({msg.email})</span>
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {new Date(msg.createdAt).toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#F26A21] font-semibold">
                      <span>Phone: {msg.phone || "Not provided"}</span>
                      <span>•</span>
                      <span>Subject: {msg.subject || "General Inquiry"}</span>
                    </div>

                    <p className="text-[#263449] bg-[#FFF9ED] p-3 rounded border border-[#E9D9C5] leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="flex justify-end">
                      <a
                        href={`mailto:${msg.email}?subject=Reply from alokworld.in Secretariat`}
                        className="btn-outline text-xs px-3 py-1 font-semibold"
                      >
                        Reply via Email →
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* ACCESSIBLE CONFIRMATION MODAL FOR DESTRUCTIVE ACTIONS */}
      {/* ========================================================================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className="bg-white rounded-xl border border-[#E9D9C5] max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmDialogTitle"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg shrink-0">
                ⚠
              </div>
              <div>
                <h3 id="confirmDialogTitle" className="text-base font-bold text-[#102F6B]">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            {confirmModal.targetName && (
              <div className="p-3 bg-[#FFF9ED] rounded-lg border border-[#E9D9C5] text-xs font-semibold text-[#102F6B]">
                Target: {confirmModal.targetName}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E9D9C5]">
              <button
                type="button"
                onClick={closeConfirmation}
                className="btn-outline text-xs px-4 py-2 cursor-pointer font-semibold"
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
                className={`text-xs px-4 py-2 rounded font-bold cursor-pointer shadow-xs transition-colors ${confirmModal.confirmBtnClass}`}
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
