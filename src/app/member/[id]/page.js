"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn } from "@/components/MotionWrappers";

function MemberProfileDetail({ params }) {
  const resolvedParams = use(params);
  const idOrSlug = resolvedParams.id;

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`/api/members/${encodeURIComponent(idOrSlug)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Member profile not found or profile is unlisted");
        }
        return res.json();
      })
      .then((data) => {
        if (data?.member) {
          setMember(data.member);
        } else {
          throw new Error("Member record not returned");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="flex-1 max-w-[900px] w-full mx-auto px-3 sm:px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/directory"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#102F6B] hover:text-[#F26A21] bg-white border border-[#F0E5D5] px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
        >
          ← Back to Directory
        </Link>

        {member && (
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#102F6B] hover:text-[#F26A21] bg-white border border-[#F0E5D5] px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Copy profile link to clipboard"
          >
            <span>🔗</span>
            <span>{copied ? "Link Copied!" : "Share Profile"}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-[#F0E5D5] p-16 text-center text-[#64748B] font-medium shadow-xs">
          <div className="w-8 h-8 border-3 border-[#102F6B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading member profile...
        </div>
      ) : error || !member ? (
        <div className="bg-white p-10 rounded-lg border border-[#F0E5D5] text-center shadow-xs space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF0E2] text-[#F26A21] border border-[#F0E5D5] flex items-center justify-center text-2xl font-bold">
            🔒
          </div>
          <h2 className="text-lg font-black text-[#102F6B]">Profile Not Available</h2>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
            {error || "This member profile could not be located, is currently archived, or requires administrative approval."}
          </p>
          <div className="pt-2">
            <Link
              href="/directory"
              className="btn-navy px-4 py-2 text-xs shadow-xs"
            >
              Browse Public Directory →
            </Link>
          </div>
        </div>
      ) : (
        <FadeIn direction="up" distance={14} duration={0.5}>
          <div className="bg-white rounded-lg border border-[#F0E5D5] shadow-xs overflow-hidden">
          {/* Top Profile Header Banner */}
          <div className="bg-[#FFFCF5] p-5 sm:p-7 border-b border-[#F0E5D5] flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={`${member.name} - Verified Samaj Community Profile Photo`}
                width={112}
                height={112}
                decoding="async"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border-2 border-[#F0E5D5] shadow-xs shrink-0 bg-white"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-[#102F6B] text-white flex items-center justify-center font-bold text-3xl shadow-xs border-2 border-[#F26A21] shrink-0">
                {member.name ? member.name.charAt(0).toUpperCase() : "M"}
              </div>
            )}

            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-[#FFF0E2] text-[#F26A21] border border-[#F0E5D5] uppercase">
                  {member.role || "Samaj Member"}
                </span>
                <span className="text-[#F0E5D5]">•</span>
                <span className="text-xs font-medium text-[#102F6B]">Verified Community Record</span>
                {member.slug && (
                  <>
                    <span className="text-[#F0E5D5]">•</span>
                    <span className="text-[11px] font-mono text-[#64748B]">@{member.slug}</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#102F6B] tracking-tight break-words">
                {member.name}
              </h1>
              <p className="text-sm text-[#263449] font-medium mt-1">
                {member.occupation} {member.company && <span className="text-[#64748B] font-normal">• {member.company}</span>}
              </p>
              <p className="text-xs text-[#64748B] mt-1 flex items-center justify-center sm:justify-start gap-1">
                <span className="text-[#F26A21]">📍</span> {member.city}{member.state ? `, ${member.state}` : ""}
              </p>
            </div>
          </div>

          {/* Profile Body & Contact Details */}
          <div className="p-5 sm:p-7 space-y-6">
            {/* Contact Details Card with Privacy Badges */}
            <div className="bg-[#FFFCF5] rounded-lg border border-[#F0E5D5] p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#F0E5D5] pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
                  Verified Contact &amp; Geographic Information
                </h3>
                <span className="text-[10px] text-[#64748B]">
                  🛡️ Protected by consent settings
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-[#64748B] block text-[11px] font-medium">Telephone / Mobile:</span>
                  {member.phone ? (
                    <a href={`tel:${member.phone}`} className="font-semibold text-[#F26A21] hover:underline mt-0.5 inline-flex items-center gap-1.5">
                      <span>📞</span> <span>{member.phone}</span>
                    </a>
                  ) : (
                    <span className="text-[#64748B] italic flex items-center gap-1">
                      <span>🔒</span> <span>Kept private at member request</span>
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[#64748B] block text-[11px] font-medium">Email Address:</span>
                  {member.email ? (
                    <a href={`mailto:${member.email}`} className="font-semibold text-[#102F6B] hover:text-[#F26A21] hover:underline mt-0.5 inline-flex items-center gap-1.5">
                      <span>✉️</span> <span>{member.email}</span>
                    </a>
                  ) : (
                    <span className="text-[#64748B] italic flex items-center gap-1">
                      <span>🔒</span> <span>Kept private at member request</span>
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[#64748B] block text-[11px] font-medium">City &amp; State:</span>
                  <p className="font-medium text-[#263449] mt-0.5">
                    {member.city}, {member.state} {member.pincode ? `(${member.pincode})` : ""}
                  </p>
                </div>

                <div>
                  <span className="text-[#64748B] block text-[11px] font-medium">Organization / Enterprise:</span>
                  <p className="font-medium text-[#263449] mt-0.5">
                    {member.company || "Not specified / Independent"}
                  </p>
                </div>

                {member.address && (
                  <div className="sm:col-span-2 pt-2 border-t border-[#F0E5D5]/60">
                    <span className="text-[#64748B] block text-[11px] font-medium">Full Residential / Office Address:</span>
                    <p className="font-medium text-[#263449] mt-0.5">
                      {member.address} {member.pincode && `- ${member.pincode}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Biography Section */}
            <div>
              <h3 className="text-xs font-bold text-[#102F6B] uppercase tracking-wider mb-2.5 pb-2 border-b border-[#F0E5D5]">
                Biography &amp; Community Contributions
              </h3>
              {member.biography ? (
                <div
                  className="cms-prose text-[#263449] text-xs sm:text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: member.biography }}
                />
              ) : (
                <p className="text-xs text-[#64748B] italic">
                  {member.name} has not submitted an extended community biography yet.
                </p>
              )}
            </div>

            {/* Specializations & Tags */}
            {member.tags && member.tags.length > 0 && (
              <div className="pt-2 border-t border-[#F0E5D5]">
                <h4 className="text-xs font-semibold text-[#64748B] mb-2">Specializations &amp; Affinity Groups:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {member.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 bg-[#FFF0E2] text-[#102F6B] border border-[#F0E5D5] rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </FadeIn>
      )}
      {member && member.isPublished && member.isApproved && !member.isArchived && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: "https://alokworld.in" },
                    { "@type": "ListItem", position: 2, name: "Directory", item: "https://alokworld.in/directory" },
                    { "@type": "ListItem", position: 3, name: member.name, item: `https://alokworld.in/member/${member.slug || member._id || member.id}` },
                  ],
                },
                {
                  "@type": "ProfilePage",
                  "@id": `https://alokworld.in/member/${member.slug || member._id || member.id}#profilepage`,
                  url: `https://alokworld.in/member/${member.slug || member._id || member.id}`,
                  name: `${member.name} - Samaj Directory Profile`,
                  mainEntity: {
                    "@type": "Person",
                    name: member.name,
                    jobTitle: member.occupation,
                    worksFor: member.company ? { "@type": "Organization", name: member.company } : undefined,
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: member.city,
                      addressRegion: member.state,
                      addressCountry: "IN",
                    },
                    image: member.avatar || undefined,
                    description: member.biography ? member.biography.replace(/<[^>]*>?/gm, "").substring(0, 200) : undefined,
                  },
                },
              ],
            }),
          }}
        />
      )}
    </main>
  );
}

export default function MemberProfilePage({ params }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />
      <Suspense fallback={<div className="p-16 text-center text-[#64748B] font-medium">Loading member profile...</div>}>
        <MemberProfileDetail params={params} />
      </Suspense>
      <Footer />
    </div>
  );
}
