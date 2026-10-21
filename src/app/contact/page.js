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
    <div className="min-h-screen flex flex-col bg-[#FFF9ED] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[700px] w-full mx-auto px-3 sm:px-4 py-8">
        <div className="bg-white rounded-lg border border-[#E9D9C5] p-6 sm:p-8 shadow-xs">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#E9D9C5]">
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
              className={`p-3.5 rounded-lg mb-5 text-xs sm:text-sm font-semibold ${
                status.error
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-[#FFF0E2] text-[#102F6B] border border-[#E9D9C5]"
              }`}
            >
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#263449] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar Lodhi"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#E9D9C5] bg-white focus:border-[#102F6B] focus:ring-2 focus:ring-[#102F6B]/15 outline-hidden font-medium text-[#263449]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#263449] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#E9D9C5] bg-white focus:border-[#102F6B] focus:ring-2 focus:ring-[#102F6B]/15 outline-hidden font-medium text-[#263449]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#263449] mb-1">
                  Phone / Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#E9D9C5] bg-white focus:border-[#102F6B] focus:ring-2 focus:ring-[#102F6B]/15 outline-hidden font-medium text-[#263449]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#263449] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Member Registration / Profile Update"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#E9D9C5] bg-white focus:border-[#102F6B] focus:ring-2 focus:ring-[#102F6B]/15 outline-hidden font-medium text-[#263449]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#263449] mb-1">
                Your Message / Inquiry Details *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message or community inquiry here..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#E9D9C5] bg-white focus:border-[#102F6B] focus:ring-2 focus:ring-[#102F6B]/15 outline-hidden font-medium text-[#263449]"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="btn-primary w-full py-2.5 text-xs sm:text-sm shadow-sm disabled:opacity-50 cursor-pointer"
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
