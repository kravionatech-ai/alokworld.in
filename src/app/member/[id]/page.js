"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn } from "@/components/MotionWrappers";

function MemberProfileDetail({ params }) {
  const resolvedParams = use(params);
  const idOrSlug = resolvedParams.id || resolvedParams.slug;

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
          throw new Error(data.error || "सदस्य प्रोफ़ाइल उपलब्ध नहीं है अथवा अप्रकाशित है");
        }
        return res.json();
      })
      .then((data) => {
        if (data?.member) {
          setMember(data.member);
        } else {
          throw new Error("सदस्य विवरण प्राप्त नहीं हुआ");
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#102F6B] hover:text-[#F26A21] bg-white border border-[#E9E2D8] px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
        >
          ← डायरेक्टरी सूची पर वापस जाएं
        </Link>

        {member && (
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#102F6B] hover:text-[#F26A21] bg-white border border-[#E9E2D8] px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="प्रोफ़ाइल लिंक कॉपी करें"
          >
            <span>🔗</span>
            <span>{copied ? "लिंक कॉपी हो गया!" : "प्रोफ़ाइल साझा करें"}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-[#E9E2D8] p-16 text-center text-[#64748B] font-medium shadow-xs">
          <div className="w-8 h-8 border-3 border-[#102F6B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          सदस्य प्रोफ़ाइल लोड हो रही है...
        </div>
      ) : error || !member ? (
        <div className="bg-white p-10 rounded-lg border border-[#E9E2D8] text-center shadow-xs space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF0E2] text-[#F26A21] border border-[#E9E2D8] flex items-center justify-center text-2xl font-bold">
            🔒
          </div>
          <h2 className="text-lg font-black text-[#102F6B]">प्रोफ़ाइल उपलब्ध नहीं है</h2>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
            {error || "यह सदस्य प्रोफ़ाइल उपलब्ध नहीं है, अभिलेख में सुरक्षित है अथवा प्रशासनिक सत्यापन प्रतीक्षित है।"}
          </p>
          <div className="pt-2">
            <Link
              href="/directory"
              className="btn-navy px-4 py-2 text-xs shadow-xs"
            >
              सार्वजनिक डायरेक्टरी देखें →
            </Link>
          </div>
        </div>
      ) : (
        <FadeIn direction="up" distance={14} duration={0.5}>
          <div className="bg-white rounded-lg border border-[#E9E2D8] shadow-xs overflow-hidden">
          {/* Top Profile Header Banner */}
          <div className="bg-[#FFFCF5] p-5 sm:p-7 border-b border-[#E9E2D8] flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={`${member.name} - सत्यापित समाज सदस्य छायाचित्र`}
                width={112}
                height={112}
                decoding="async"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border-2 border-[#E9E2D8] shadow-xs shrink-0 bg-white"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-[#102F6B] text-white flex items-center justify-center font-bold text-3xl shadow-xs border-2 border-[#F26A21] shrink-0">
                {member.name ? member.name.charAt(0).toUpperCase() : "M"}
              </div>
            )}

            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-[#FFF0E2] text-[#F26A21] border border-[#E9E2D8] uppercase">
                  {member.role || "समाज सदस्य"}
                </span>
                <span className="text-[#E9E2D8]">•</span>
                <span className="text-xs font-medium text-[#102F6B]">सत्यापित समाज अभिलेख</span>
                {member.slug && (
                  <>
                    <span className="text-[#E9E2D8]">•</span>
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
            <div className="bg-[#FFFCF5] rounded-lg border border-[#E9E2D8] p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E9E2D8] pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
                  सत्यापित संपर्क एवं भौगोलिक विवरण
                </h3>
                <span className="text-[10px] text-[#64748B]">
                  🛡️ सदस्य सहमति द्वारा संरक्षित
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-[#64748B] block text-[11px] font-medium">संपर्क मोबाइल / फोन:</span>
                  {member.phone ? (
                    <a href={`tel:${member.phone}`} className="font-semibold text-[#F26A21] hover:underline mt-0.5 inline-flex items-center gap-1.5">
                      <span>📞</span> <span>{member.phone}</span>
                    </a>
                  ) : (
                    <span className="text-[#64748B] italic flex items-center gap-1">
                      <span>🔒</span> <span>सदस्य के अनुरोध पर गोपनीय</span>
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[#64748B] block text-[11px] font-medium">ईमेल पता:</span>
                  {member.email ? (
                    <a href={`mailto:${member.email}`} className="font-semibold text-[#102F6B] hover:text-[#F26A21] hover:underline mt-0.5 inline-flex items-center gap-1.5">
                      <span>✉️</span> <span>{member.email}</span>
                    </a>
                  ) : (
                    <span className="text-[#64748B] italic flex items-center gap-1">
                      <span>🔒</span> <span>सदस्य के अनुरोध पर गोपनीय</span>
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[#64748B] block text-[11px] font-medium">नगर व राज्य:</span>
                  <p className="font-medium text-[#263449] mt-0.5">
                    {member.city}, {member.state} {member.pincode ? `(${member.pincode})` : ""}
                  </p>
                </div>

                <div>
                  <span className="text-[#64748B] block text-[11px] font-medium">प्रतिष्ठान / विभाग / संगठन:</span>
                  <p className="font-medium text-[#263449] mt-0.5">
                    {member.company || "स्वतंत्र / अनिर्दिष्ट"}
                  </p>
                </div>

                {member.address && (
                  <div className="sm:col-span-2 pt-2 border-t border-[#E9E2D8]/60">
                    <span className="text-[#64748B] block text-[11px] font-medium">स्थाई / कार्यालय का पूरा पता:</span>
                    <p className="font-medium text-[#263449] mt-0.5">
                      {member.address} {member.pincode && `- ${member.pincode}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Biography Section */}
            <div>
              <h3 className="text-xs font-bold text-[#102F6B] uppercase tracking-wider mb-2.5 pb-2 border-b border-[#E9E2D8]">
                परिचय, उपलब्धियां एवं सामाजिक योगदान
              </h3>
              {member.biography ? (
                <div
                  className="cms-prose text-[#263449] text-xs sm:text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: member.biography }}
                />
              ) : (
                <p className="text-xs text-[#64748B] italic">
                  {member.name} ने अभी विस्तृत जीवन-परिचय प्रेषित नहीं किया है।
                </p>
              )}
            </div>

            {/* Specializations & Categories */}
            {member.tags && member.tags.length > 0 && (
              <div className="pt-2 border-t border-[#E9E2D8]">
                <h4 className="text-xs font-semibold text-[#64748B] mb-2">दायित्व एवं समिति संबद्धता:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {member.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 bg-[#FFF0E2] text-[#102F6B] border border-[#E9E2D8] rounded"
                    >
                      {tag.replace(/^#/, "")}
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
                    { "@type": "ListItem", position: 1, name: "मुख्य पृष्ठ", item: "https://alokworld.in" },
                    { "@type": "ListItem", position: 2, name: "डायरेक्टरी", item: "https://alokworld.in/directory" },
                    { "@type": "ListItem", position: 3, name: member.name, item: `https://alokworld.in/member/${member.slug || member._id || member.id}` },
                  ],
                },
                {
                  "@type": "ProfilePage",
                  "@id": `https://alokworld.in/member/${member.slug || member._id || member.id}#profilepage`,
                  url: `https://alokworld.in/member/${member.slug || member._id || member.id}`,
                  name: `${member.name} - समाज डायरेक्टरी प्रोफ़ाइल`,
                  inLanguage: "hi",
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
      <Suspense fallback={<div className="p-16 text-center text-[#64748B] font-medium">सदस्य प्रोफ़ाइल लोड हो रही है...</div>}>
        <MemberProfileDetail params={params} />
      </Suspense>
      <Footer />
    </div>
  );
}
