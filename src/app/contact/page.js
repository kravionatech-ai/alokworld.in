"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn, InteractiveTap } from "@/components/MotionWrappers";

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
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[700px] w-full mx-auto px-3 sm:px-4 py-8">
        <FadeIn direction="up" distance={16} duration={0.5}>
          <div className="bg-white rounded-lg border border-[#E9E2D8] p-6 sm:p-8 shadow-xs">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#E9E2D8]">
                Get In Touch
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#102F6B] mt-2 tracking-tight">
                Secretariat Contact &amp; Inquiry Form
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 max-w-md mx-auto">
                For directory updates, new member registrations, matrimonial inquiries, or general community assistance.
              </p>
            </div>

            {status.msg && (
              <div
                className={`p-3.5 rounded-lg mb-5 text-xs font-medium border ${
                  status.error
                    ? "bg-red-50 text-red-800 border-red-200"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                }`}
              >
                {status.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#102F6B] mb-1">
                    Your Full Name <span className="text-[#F26A21]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Chandra Lodhi"
                    className="w-full text-xs px-3 py-2 border border-[#F0E5D5] rounded bg-[#FFFCF5] focus:outline-hidden focus:ring-1 focus:ring-[#102F6B] focus:border-[#102F6B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102F6B] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ramesh@alokworld.in"
                    className="w-full text-xs px-3 py-2 border border-[#F0E5D5] rounded bg-[#FFFCF5] focus:outline-hidden focus:ring-1 focus:ring-[#102F6B] focus:border-[#102F6B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#102F6B] mb-1">
                    Contact Phone Number <span className="text-[#F26A21]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98260 12345"
                    className="w-full text-xs px-3 py-2 border border-[#F0E5D5] rounded bg-[#FFFCF5] focus:outline-hidden focus:ring-1 focus:ring-[#102F6B] focus:border-[#102F6B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102F6B] mb-1">
                    Subject / Purpose <span className="text-[#F26A21]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Member Registration / Profile Update"
                    className="w-full text-xs px-3 py-2 border border-[#F0E5D5] rounded bg-[#FFFCF5] focus:outline-hidden focus:ring-1 focus:ring-[#102F6B] focus:border-[#102F6B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102F6B] mb-1">
                  Message / Details <span className="text-[#F26A21]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your query or directory update details..."
                  className="w-full text-xs px-3 py-2 border border-[#F0E5D5] rounded bg-[#FFFCF5] focus:outline-hidden focus:ring-1 focus:ring-[#102F6B] focus:border-[#102F6B]"
                />
              </div>

              <InteractiveTap>
                <button
                  type="submit"
                  disabled={status.loading}
                  className="btn-primary w-full py-2.5 text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {status.loading ? "Submitting Message..." : "Submit Inquiry to Secretariat →"}
                </button>
              </InteractiveTap>
            </form>
          </div>
        </FadeIn>
      </main>

      <Footer />
    </div>
  );
}
