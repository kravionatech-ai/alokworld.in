"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("members");
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState({
    siteName: "",
    tagline: "",
    announcement: "",
    sidebarNoticeTitle: "",
    sidebarNoticeContent: "",
    adTitle: "",
    adBannerText: "",
    adLink: "",
    contactEmail: "",
    contactPhone: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    maintenanceMode: true,
    maintenanceBarEnabled: true,
    maintenancePopupEnabled: true,
    maintenanceMessage: "",
    maintenancePopupTitle: "",
    maintenancePopupMessage: "",
  });

  // Member Form State
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
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
    isApproved: true,
    isPublished: true,
    showPhone: true,
    showEmail: true,
    showAddress: false,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Check Admin Session
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setAuthChecked(true);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  // Load Initial Admin Data
  const loadData = () => {
    fetch("/api/members?admin=true&limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (d?.members) setMembers(d.members);
      })
      .catch(console.error);

    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.settings) setSettings(d.settings);
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
      loadData();
    }
  }, [authChecked]);

  // Logout
  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  // Cloudinary Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMsg("");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setForm((prev) => ({ ...prev, avatar: data.url }));
      setStatusMsg("Profile photo uploaded successfully via Cloudinary!");
    } catch (err) {
      setStatusMsg("Notice: " + err.message + " (You can also paste an image URL manually)");
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Member Form
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("");

    const payload = {
      ...form,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/members/${editingId}`, {
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
      if (!res.ok) throw new Error(data.error || "Failed to save member");

      setStatusMsg(editingId ? "Member updated successfully!" : "Member created successfully!");
      resetForm();
      loadData();
      setActiveTab("members");
    } catch (err) {
      setStatusMsg("Error: " + err.message);
    }
  };

  const handleEditMember = (member) => {
    setEditingId(member._id);
    setForm({
      name: member.name || "",
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
      tags: Array.isArray(member.tags) ? member.tags.join(", ") : "",
      isApproved: member.isApproved !== undefined ? member.isApproved : true,
      isPublished: member.isPublished !== undefined ? member.isPublished : true,
      showPhone: member.showPhone !== undefined ? member.showPhone : true,
      showEmail: member.showEmail !== undefined ? member.showEmail : true,
      showAddress: member.showAddress !== undefined ? member.showAddress : false,
    });
    setActiveTab("add_member");
  };

  const handleDeleteMember = async (id) => {
    if (!confirm("Are you sure you want to delete this community member?")) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (member) => {
    try {
      const res = await fetch(`/api/members/${member._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !member.isPublished }),
      });
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => (m._id === member._id ? { ...m, isPublished: !m.isPublished } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
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
      isApproved: true,
      isPublished: true,
      showPhone: true,
      showEmail: true,
      showAddress: false,
    });
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      setStatusMsg("Site & SEO settings saved successfully!");
    } catch (err) {
      setStatusMsg("Error: " + err.message);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center font-semibold text-[#082F75]">
        Checking administrative session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9E8] flex flex-col text-[#172B4D]">
      {/* Top Admin Nav */}
      <header className="bg-[#071D49] border-b-2 border-[#F4510B] py-3.5 px-4 sm:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FFF9E8] text-[#082F75] border border-[#F4510B] flex items-center justify-center font-bold text-sm">
            स्
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base text-white leading-tight">
              alokworld.in Admin Dashboard
            </h1>
            <p className="text-[11px] text-[#FFE6C7]">
              Samaj Directory Central Secretariat &amp; Content Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-block px-3 py-1.5 rounded border border-[#F3D8B0] bg-[#082F75] hover:bg-[#F4510B] text-white font-semibold transition-colors"
          >
            Preview Site ↗
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded bg-[#C83B08] hover:bg-red-700 text-white font-bold transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Left Side Navigation Tabs */}
        <aside className="w-full md:w-56 shrink-0 space-y-1.5">
          <button
            onClick={() => {
              setActiveTab("members");
              resetForm();
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "members"
                ? "bg-[#082F75] text-white font-bold border-l-3 border-[#F4510B]"
                : "bg-[#FFFDF6] text-[#172B4D] hover:bg-[#FFE6C7]/60 border border-[#F3D8B0]"
            }`}
          >
            👥 Directory Members ({members.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("add_member");
              resetForm();
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "add_member"
                ? "bg-[#082F75] text-white font-bold border-l-3 border-[#F4510B]"
                : "bg-[#FFFDF6] text-[#172B4D] hover:bg-[#FFE6C7]/60 border border-[#F3D8B0]"
            }`}
          >
            ➕ Add New Member
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "settings"
                ? "bg-[#082F75] text-white font-bold border-l-3 border-[#F4510B]"
                : "bg-[#FFFDF6] text-[#172B4D] hover:bg-[#FFE6C7]/60 border border-[#F3D8B0]"
            }`}
          >
            ⚙️ Site, SEO &amp; Ads
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "messages"
                ? "bg-[#082F75] text-white font-bold border-l-3 border-[#F4510B]"
                : "bg-[#FFFDF6] text-[#172B4D] hover:bg-[#FFE6C7]/60 border border-[#F3D8B0]"
            }`}
          >
            📬 Inquiries ({messages.length})
          </button>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-5 sm:p-6 shadow-sm">
          {statusMsg && (
            <div className="mb-4 p-3 bg-teal-50 text-teal-800 text-xs rounded-lg border border-teal-200 font-semibold">
              {statusMsg}
            </div>
          )}

          {/* TAB 1: MEMBERS LIST */}
          {activeTab === "members" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#082F75]">
                  Directory Members List
                </h2>
                <button
                  onClick={() => {
                    setActiveTab("add_member");
                    resetForm();
                  }}
                  className="px-3 py-1.5 bg-[#F4510B] text-white text-xs font-bold rounded-lg hover:bg-[#071D49] transition-colors"
                >
                  + Add Member
                </button>
              </div>

              {members.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">
                  No members found in database yet. Click &quot;Add New Member&quot; to begin.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b bg-slate-50 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Role / Profession</th>
                        <th className="py-2.5 px-3">City</th>
                        <th className="py-2.5 px-3">Contact Privacy</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {members.map((m) => (
                        <tr key={m._id || m.id} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-3 font-bold text-[#082F75]">
                            {m.name}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-medium">{m.occupation}</div>
                            <span className="text-[10px] text-slate-400">{m.role}</span>
                          </td>
                          <td className="py-2.5 px-3">{m.city}, {m.state}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] block text-slate-600">
                              Phone: {m.showPhone ? "✅ Public" : "🔒 Private"}
                            </span>
                            <span className="text-[10px] block text-slate-600">
                              Email: {m.showEmail ? "✅ Public" : "🔒 Private"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => togglePublish(m)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                m.isPublished
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {m.isPublished ? "Published" : "Draft / Unlisted"}
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-right space-x-2">
                            <button
                              onClick={() => handleEditMember(m)}
                              className="text-[#F4510B] hover:underline font-bold"
                            >
                              Edit
                            </button>
                            {m._id && (
                              <button
                                onClick={() => handleDeleteMember(m._id)}
                                className="text-red-600 hover:underline font-bold"
                              >
                                Delete
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

          {/* TAB 2: ADD / EDIT MEMBER */}
          {activeTab === "add_member" && (
            <div>
              <h2 className="text-base font-bold text-[#082F75] mb-4">
                {editingId ? "Edit Samaj Member Profile" : "Register New Community Member"}
              </h2>

              <form onSubmit={handleMemberSubmit} className="space-y-4 text-xs">
                {/* Photo Upload */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block font-bold text-slate-700 mb-2">
                    Profile Photo (Cloudinary Integration)
                  </label>
                  <div className="flex items-center gap-4">
                    {form.avatar ? (
                      <img
                        src={form.avatar}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-400">
                        Photo
                      </div>
                    )}
                    <div className="space-y-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-xs"
                      />
                      {uploadingImage && <p className="text-xs text-[#F4510B]">Uploading to Cloudinary...</p>}
                      <input
                        type="url"
                        placeholder="Or paste direct image URL"
                        value={form.avatar}
                        onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Samaj Role / Position</label>
                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g. Core Member, Elder, Youth Lead"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Occupation / Profession *</label>
                    <input
                      type="text"
                      required
                      value={form.occupation}
                      onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                      placeholder="e.g. Civil Engineer, Doctor, CA"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Company / Organization</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">City *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">State *</label>
                    <input
                      type="text"
                      required
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Tags / Specialization (comma separated)</label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="Education, Healthcare, Mentor"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Privacy & Consent Visibility Settings */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-[#082F75] mb-2">
                    Privacy &amp; Publication Settings (Consent-based)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.isPublished}
                        onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                      />
                      <span>Publish on Directory</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.showPhone}
                        onChange={(e) => setForm({ ...form, showPhone: e.target.checked })}
                      />
                      <span>Show Phone Publicly</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.showEmail}
                        onChange={(e) => setForm({ ...form, showEmail: e.target.checked })}
                      />
                      <span>Show Email Publicly</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.showAddress}
                        onChange={(e) => setForm({ ...form, showAddress: e.target.checked })}
                      />
                      <span>Show Full Address</span>
                    </label>
                  </div>
                </div>

                {/* Rich-Text Formatted Biography */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Member Biography &amp; Community Contribution</label>
                    <span className="text-[10px] text-slate-400">Supports HTML / Rich text formatting</span>
                  </div>
                  <div className="flex gap-1 mb-1">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, biography: form.biography + "<b>Bold text</b>" })}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold"
                    >
                      Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, biography: form.biography + "<i>Italic text</i>" })}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold"
                    >
                      Italic
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, biography: form.biography + "<h3>Section Title</h3>" })}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold"
                    >
                      H3 Heading
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, biography: form.biography + "<ul><li>Point 1</li><li>Point 2</li></ul>" })}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold"
                    >
                      Bullet List
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={form.biography}
                    onChange={(e) => setForm({ ...form, biography: e.target.value })}
                    placeholder="Describe personal background, achievements, and social service..."
                    className="w-full p-2 border border-slate-200 rounded font-mono text-xs"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#082F75] text-white font-bold rounded-lg hover:bg-[#071D49] transition-colors"
                  >
                    {editingId ? "Save Member Changes" : "Create Member Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab("members");
                    }}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SETTINGS, SEO & ADS */}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-base font-bold text-[#082F75] mb-4">
                Website Content, SEO &amp; Spotlight Settings
              </h2>

              <form onSubmit={handleSettingsSubmit} className="space-y-4 text-xs">
                {/* Maintenance Mode Configuration Panel */}
                <div className="p-4 bg-[#FFE6C7]/30 rounded-lg border-2 border-[#F4510B]/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F3D8B0] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🛠️</span>
                      <h3 className="font-bold text-sm text-[#082F75]">
                        Temporary Maintenance Mode Controls
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        settings.maintenanceMode
                          ? "bg-[#F4510B] text-white"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {settings.maintenanceMode ? "Active" : "Disabled (Live Mode)"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 text-xs font-semibold text-[#172B4D] cursor-pointer bg-white p-2.5 rounded border border-[#F3D8B0]">
                      <input
                        type="checkbox"
                        checked={!!settings.maintenanceMode}
                        onChange={(e) =>
                          setSettings({ ...settings, maintenanceMode: e.target.checked })
                        }
                        className="w-4 h-4 text-[#F4510B] rounded cursor-pointer"
                      />
                      <span>Enable Maintenance Mode</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-[#172B4D] cursor-pointer bg-white p-2.5 rounded border border-[#F3D8B0]">
                      <input
                        type="checkbox"
                        checked={!!settings.maintenanceBarEnabled}
                        onChange={(e) =>
                          setSettings({ ...settings, maintenanceBarEnabled: e.target.checked })
                        }
                        className="w-4 h-4 text-[#F4510B] rounded cursor-pointer"
                      />
                      <span>Show Announcement Bar</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-[#172B4D] cursor-pointer bg-white p-2.5 rounded border border-[#F3D8B0]">
                      <input
                        type="checkbox"
                        checked={!!settings.maintenancePopupEnabled}
                        onChange={(e) =>
                          setSettings({ ...settings, maintenancePopupEnabled: e.target.checked })
                        }
                        className="w-4 h-4 text-[#F4510B] rounded cursor-pointer"
                      />
                      <span>Show First-Visit Popup</span>
                    </label>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700">
                        Top Announcement Bar Message
                      </label>
                      <input
                        type="text"
                        value={settings.maintenanceMessage || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, maintenanceMessage: e.target.value })
                        }
                        placeholder="Website Under Maintenance — We are improving your experience..."
                        className="w-full px-2.5 py-1.5 border border-[#F3D8B0] rounded bg-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1 text-slate-700">Popup Title</label>
                        <input
                          type="text"
                          value={settings.maintenancePopupTitle || ""}
                          onChange={(e) =>
                            setSettings({ ...settings, maintenancePopupTitle: e.target.value })
                          }
                          placeholder="Website Under Active Development"
                          className="w-full px-2.5 py-1.5 border border-[#F3D8B0] rounded bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 text-slate-700">Popup Short Message</label>
                        <input
                          type="text"
                          value={settings.maintenancePopupMessage || ""}
                          onChange={(e) =>
                            setSettings({ ...settings, maintenancePopupMessage: e.target.value })
                          }
                          placeholder="Welcome to alokworld.in! We are actively updating features..."
                          className="w-full px-2.5 py-1.5 border border-[#F3D8B0] rounded bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Site Title</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Top Announcement Strip</label>
                  <input
                    type="text"
                    value={settings.announcement}
                    onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-[#082F75] mb-2">Sidebar Notice &amp; Announcement</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Notice Title"
                      value={settings.sidebarNoticeTitle}
                      onChange={(e) => setSettings({ ...settings, sidebarNoticeTitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                    <textarea
                      rows={2}
                      placeholder="Notice Content"
                      value={settings.sidebarNoticeContent}
                      onChange={(e) => setSettings({ ...settings, sidebarNoticeContent: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-[#082F75] mb-2">Community Spotlight / Advertisement</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Ad Title"
                      value={settings.adTitle}
                      onChange={(e) => setSettings({ ...settings, adTitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Banner Text"
                      value={settings.adBannerText}
                      onChange={(e) => setSettings({ ...settings, adBannerText: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Target Link URL"
                      value={settings.adLink}
                      onChange={(e) => setSettings({ ...settings, adLink: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-[#082F75] mb-2">Global SEO Directives</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">Meta Title</label>
                      <input
                        type="text"
                        value={settings.seoTitle}
                        onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700">Meta Description</label>
                      <textarea
                        rows={2}
                        value={settings.seoDescription}
                        onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#082F75] text-white font-bold rounded-lg hover:bg-[#071D49] transition-colors"
                >
                  Save Global Configuration
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: CONTACT INQUIRIES */}
          {activeTab === "messages" && (
            <div>
              <h2 className="text-base font-bold text-[#082F75] mb-4">
                Secretariat Messages &amp; Inquiries ({messages.length})
              </h2>

              {messages.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">
                  No contact messages received yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-sm text-[#082F75]">{m.name}</strong>
                        <span className="text-[10px] text-slate-400">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        Email: <a href={`mailto:${m.email}`} className="text-[#F4510B] font-semibold">{m.email}</a> • Phone: {m.phone || "N/A"}
                      </p>
                      <p className="font-bold text-slate-800 pt-1">Subject: {m.subject}</p>
                      <p className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 mt-1">
                        {m.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
