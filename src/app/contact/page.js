"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, msg: "", error: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, msg: "", error: false });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to submit message");

      setStatus({
        loading: false,
        msg: "Thank you! Your message has been received by the Samaj secretariat.",
        error: false,
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ loading: false, msg: err.message, error: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#172B4D]">
      <Header />

      <main className="flex-1 max-w-[700px] w-full mx-auto px-3 sm:px-4 py-8">
        <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C83B08] bg-[#FFE6C7] px-2.5 py-0.5 rounded border border-[#F3D8B0]">
              Get In Touch
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#082F75] mt-2 tracking-tight">
              संपर्क एवं पूछताछ फॉर्म (Contact Secretariat)
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 max-w-md mx-auto">
              For directory corrections, new member registration assistance, or community inquiries.
            </p>
          </div>

          {status.msg && (
            <div
              className={`p-3.5 rounded mb-5 text-xs sm:text-sm font-semibold ${
                status.error
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-[#FFE6C7]/60 text-[#082F75] border border-[#F3D8B0]"
              }`}
            >
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Full Name (पूरा नाम) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar Lodhi"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#F3D8B0] bg-white focus:border-[#082F75] focus:ring-2 focus:ring-[#082F75]/20 outline-hidden font-medium text-[#172B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#F3D8B0] bg-white focus:border-[#082F75] focus:ring-2 focus:ring-[#082F75]/20 outline-hidden font-medium text-[#172B4D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Phone / Mobile
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#F3D8B0] bg-white focus:border-[#082F75] focus:ring-2 focus:ring-[#082F75]/20 outline-hidden font-medium text-[#172B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Member Registration / Profile Update"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#F3D8B0] bg-white focus:border-[#082F75] focus:ring-2 focus:ring-[#082F75]/20 outline-hidden font-medium text-[#172B4D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Your Message / Details (संदेश) *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your inquiry or details here..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#F3D8B0] bg-white focus:border-[#082F75] focus:ring-2 focus:ring-[#082F75]/20 outline-hidden font-medium text-[#172B4D]"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full py-2.5 bg-[#F4510B] text-white hover:bg-[#C83B08] font-bold text-xs sm:text-sm rounded transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {status.loading ? "Sending..." : "Submit Inquiry to Secretariat →"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
