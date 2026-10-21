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
    <div className="min-h-screen bg-[#FFF9E8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#172B4D]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#082F75] text-[#FFF9E8] border-2 border-[#F4510B] flex items-center justify-center font-bold text-xl shadow-xs mb-3">
          स्
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#082F75] tracking-tight">
          Admin Portal Authentication
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          Samaj Community Directory • alokworld.in
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFDF6] py-8 px-6 shadow-sm rounded-lg border border-[#F3D8B0]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alokworld.in"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#F3D8B0] bg-white focus:border-[#082F75] focus:ring-2 focus:ring-[#082F75]/20 outline-hidden font-medium text-[#172B4D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-[#F3D8B0] bg-white focus:border-[#082F75] focus:ring-2 focus:ring-[#082F75]/20 outline-hidden font-medium text-[#172B4D]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#F4510B] hover:bg-[#C83B08] text-white font-bold text-xs sm:text-sm rounded transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying..." : "Sign In to Admin Dashboard →"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#F3D8B0]/60 flex items-center justify-between text-[11px] text-[#64748B]">
            <Link href="/" className="hover:text-[#F4510B] text-[#082F75] underline">
              ← Return to Directory
            </Link>
            <span className="text-[#64748B]">Default: admin@alokworld.in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
