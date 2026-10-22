"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCF5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#263449]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-13 h-13 mx-auto rounded-full bg-[#102F6B] text-white border-2 border-[#F26A21] flex items-center justify-center font-bold text-2xl shadow-xs mb-3">
          🏛️
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#102F6B] tracking-tight">
          प्रशासन नियंत्रण पोर्टल प्रवेश
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          अखिल भारतीय समाज डायरेक्टरी • alokworld.in
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xs rounded-lg border border-[#F0E5D5]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#263449] mb-1">
                प्रशासक ईमेल पता
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alokworld.in"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#F0E5D5] bg-white focus:border-[#102F6B] focus:ring-2 focus:ring-[#102F6B]/15 outline-hidden font-medium text-[#263449]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#263449] mb-1">
                पासवर्ड / कूटशब्द
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#F0E5D5] bg-white focus:border-[#102F6B] focus:ring-2 focus:ring-[#102F6B]/15 outline-hidden font-medium text-[#263449]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-xs sm:text-sm shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? "सत्यापन जारी है..." : "प्रशासन डैशबोर्ड में प्रवेश करें →"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#F0E5D5] flex items-center justify-between text-[11px] text-[#64748B]">
            <Link href="/" className="hover:text-[#F26A21] text-[#102F6B] underline font-medium">
              ← मुख्य डायरेक्टरी पर वापस जाएं
            </Link>
            <span className="text-[#64748B]">Default: admin@alokworld.in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
