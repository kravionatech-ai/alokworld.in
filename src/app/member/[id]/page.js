"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function MemberProfileDetail({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/members/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Member not found or profile is unlisted");
        return res.json();
      })
      .then((data) => {
        if (data?.member) setMember(data.member);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <main className="flex-1 max-w-[900px] w-full mx-auto px-3 sm:px-4 py-6">
      <Link
        href="/directory"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#082F75] hover:text-[#F4510B] mb-5 bg-[#FFFDF6] border border-[#F3D8B0] px-3 py-1.5 rounded shadow-xs transition-colors"
      >
        ← Back to Directory
      </Link>

      {loading ? (
        <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-16 text-center text-[#64748B] font-medium">
          Loading member profile...
        </div>
      ) : error || !member ? (
        <div className="bg-[#FFFDF6] p-8 rounded-lg border border-[#F4510B]/50 text-center">
          <h2 className="text-base font-bold text-[#C83B08] mb-1">Notice</h2>
          <p className="text-xs text-[#64748B]">{error || "Member profile not available."}</p>
        </div>
      ) : (
        <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] shadow-sm overflow-hidden">
          {/* Top Profile Header */}
          <div className="bg-[#FFF9E8] p-5 sm:p-7 border-b border-[#F3D8B0] flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border-2 border-[#F3D8B0] shadow-xs"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-[#082F75] text-white flex items-center justify-center font-bold text-3xl shadow-xs border-2 border-[#F4510B]">
                {member.name ? member.name.charAt(0) : "म"}
              </div>
            )}

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-[#FFE6C7] text-[#C83B08] border border-[#F3D8B0] uppercase">
                  {member.role || "Samaj Member"}
                </span>
                <span className="text-[#F3D8B0]">•</span>
                <span className="text-xs font-medium text-[#082F75]">Verified Profile</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#082F75] tracking-tight">
                {member.name}
              </h1>
              <p className="text-sm text-[#172B4D] font-medium mt-1">
                {member.occupation} {member.company && <span className="text-[#64748B]">• {member.company}</span>}
              </p>
              <p className="text-xs text-[#64748B] mt-1 flex items-center justify-center sm:justify-start gap-1">
                <span className="text-[#F4510B]">📍</span> {member.city}, {member.state}
              </p>
            </div>
          </div>

          {/* Profile Body & Contact Details */}
          <div className="p-5 sm:p-7 space-y-6">
            <div className="bg-[#FFF9E8] rounded border border-[#F3D8B0] p-4 sm:p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#082F75] border-l-3 border-[#F4510B] pl-2">
                Verified Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#64748B] block text-[11px] font-medium">Phone / Mobile:</span>
                  {member.phone ? (
                    <a href={`tel:${member.phone}`} className="font-semibold text-[#F4510B] hover:text-[#C83B08] hover:underline mt-0.5 inline-block">
                      📞 {member.phone}
                    </a>
                  ) : (
                    <span className="text-[#64748B] italic">Kept private by member</span>
                  )}
                </div>

                <div>
                  <span className="text-[#64748B] block text-[11px] font-medium">Email Address:</span>
                  {member.email ? (
                    <a href={`mailto:${member.email}`} className="font-semibold text-[#082F75] hover:text-[#F4510B] hover:underline mt-0.5 inline-block">
                      ✉️ {member.email}
                    </a>
                  ) : (
                    <span className="text-[#64748B] italic">Kept private by member</span>
                  )}
                </div>

                {member.address && (
                  <div className="sm:col-span-2">
                    <span className="text-[#64748B] block text-[11px] font-medium">Address:</span>
                    <p className="font-medium text-[#172B4D] mt-0.5">
                      {member.address} {member.pincode && `- ${member.pincode}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#082F75] uppercase tracking-wider mb-2.5 pb-2 border-b border-[#F3D8B0]">
                व्यक्तिगत परिचय एवं सामाजिक योगदान (Biography)
              </h3>
              {member.biography ? (
                <div
                  className="prose prose-sm max-w-none text-[#172B4D] text-xs sm:text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: member.biography }}
                />
              ) : (
                <p className="text-xs text-[#64748B] italic">
                  {member.name} has not submitted an extended biography yet.
                </p>
              )}
            </div>

            {member.tags && member.tags.length > 0 && (
              <div className="pt-2 border-t border-[#F3D8B0]/60">
                <h4 className="text-xs font-semibold text-[#64748B] mb-2">Specializations &amp; Groups:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {member.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 bg-[#FFE6C7]/50 text-[#082F75] border border-[#F3D8B0] rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function MemberProfilePage({ params }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#172B4D]">
      <Header />
      <Suspense fallback={<div className="p-16 text-center text-[#64748B] font-medium">Loading...</div>}>
        <MemberProfileDetail params={params} />
      </Suspense>
      <Footer />
    </div>
  );
}
