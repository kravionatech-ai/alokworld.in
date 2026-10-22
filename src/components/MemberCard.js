import Link from "next/link";

export default function MemberCard({ member = {} }) {
  const {
    _id,
    id,
    slug,
    name,
    role,
    occupation,
    company,
    city,
    state,
    phone,
    email,
    avatar,
  } = member;

  const profileIdentifier = slug || _id || id;

  // Determine privacy & availability of contact details
  const hasPhone = Boolean(phone && String(phone).trim() !== "" && member.showPhone !== false);
  const isPrivatePhone = member.showPhone === false;

  const hasEmail = Boolean(email && String(email).trim() !== "" && member.showEmail !== false);
  const isPrivateEmail = member.showEmail === false;

  // Clean phone number for tel: protocol (e.g., "+91 98260 12345" -> "+919826012345")
  const telHref = hasPhone ? `tel:${String(phone).replace(/[^\d+]/g, "")}` : "#";
  const mailtoHref = hasEmail ? `mailto:${String(email).trim()}` : "#";

  return (
    <div className="bg-white rounded-lg border border-[#F0E5D5] shadow-xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between group hover:border-[#F26A21] h-full">
      <div className="flex-1 flex flex-col">
        {/* Top Header: Avatar + Identity */}
        <div className="flex items-start gap-3.5">
          {/* Avatar or Monogram */}
          <Link
            href={`/member/${profileIdentifier}`}
            className="shrink-0 group/avatar block"
            title={`View ${name || "Member"}'s profile`}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name ? `${name} - Samaj Community Member` : "Samaj Community Member"}
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#F0E5D5] group-hover/avatar:border-[#F26A21] transition-colors shadow-xs"
              />
            ) : (
              <div
                className="w-14 h-14 rounded-full bg-[#102F6B] text-white flex items-center justify-center font-bold text-lg shrink-0 border-2 border-[#F26A21] shadow-xs group-hover/avatar:bg-[#091D42] transition-colors"
                aria-hidden="true"
              >
                {name ? name.charAt(0).toUpperCase() : "M"}
              </div>
            )}
          </Link>

          {/* Member Name & Role */}
          <div className="flex-1 min-w-0">
            <Link href={`/member/${profileIdentifier}`} className="block">
              <h3 className="text-base font-bold text-[#102F6B] leading-snug group-hover:text-[#F26A21] transition-colors break-words">
                {name || "Community Member"}
              </h3>
            </Link>

            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF0E2] text-[#F26A21] border border-[#F0E5D5]">
                {role || "Member"}
              </span>
            </div>
          </div>
        </div>

        {/* Professional & Location Information */}
        <div className="mt-3.5 space-y-1.5 text-xs text-[#263449]">
          {/* Profession */}
          <div className="flex items-start gap-2 font-medium text-[#263449]">
            <span className="text-[#102F6B] shrink-0 mt-0.5 text-xs" aria-hidden="true">
              💼
            </span>
            <span className="leading-snug break-words">
              {occupation || "Community Member"}
            </span>
          </div>

          {/* Company / Organization (only if available) */}
          {company && (
            <div className="flex items-start gap-2 text-[11px] text-[#64748B] font-normal">
              <span className="text-[#F26A21] shrink-0 mt-0.5 text-xs" aria-hidden="true">
                🏢
              </span>
              <span className="leading-snug break-words">{company}</span>
            </div>
          )}

          {/* Location: City and State */}
          <div className="flex items-center gap-2 text-[#64748B] text-[11px] pt-0.5">
            <span className="text-[#F26A21] shrink-0 text-xs" aria-hidden="true">
              📍
            </span>
            <span className="truncate">
              {city || "India"}
              {state ? `, ${state}` : ""}
            </span>
          </div>
        </div>

        {/* Clear Visual Separation: Direct Contact Details Section */}
        <div className="mt-3.5 pt-3 border-t border-[#F0E5D5] bg-[#FFFCF5]/80 rounded-md p-2.5 space-y-2 border border-[#F0E5D5]/60 mt-auto">
          {/* Mobile Number Row */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-6 h-6 rounded-full bg-[#FFF0E2] text-[#F26A21] flex items-center justify-center text-xs shrink-0 border border-[#F0E5D5]"
              aria-hidden="true"
            >
              📞
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider leading-none mb-0.5">
                मोबाइल
              </div>
              {hasPhone ? (
                <a
                  href={telHref}
                  className="text-xs font-semibold text-[#102F6B] hover:text-[#F26A21] hover:underline transition-colors block truncate"
                  title={`संपर्क: ${phone}`}
                >
                  {phone}
                </a>
              ) : (
                <span className="text-[11px] text-[#64748B] italic block">
                  {isPrivatePhone ? "सदस्य द्वारा गोपनीय" : "उपलब्ध नहीं"}
                </span>
              )}
            </div>
          </div>

          {/* Email Address Row */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-6 h-6 rounded-full bg-[#FFF0E2] text-[#F26A21] flex items-center justify-center text-xs shrink-0 border border-[#F0E5D5]"
              aria-hidden="true"
            >
              ✉️
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider leading-none mb-0.5">
                ईमेल
              </div>
              {hasEmail ? (
                <a
                  href={mailtoHref}
                  className="text-xs font-semibold text-[#102F6B] hover:text-[#F26A21] hover:underline transition-colors block truncate"
                  title={`ईमेल: ${email}`}
                >
                  {email}
                </a>
              ) : (
                <span className="text-[11px] text-[#64748B] italic block">
                  {isPrivateEmail ? "सदस्य द्वारा गोपनीय" : "उपलब्ध नहीं"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions: Call, Email, and View Profile */}
      <div className="mt-4 pt-3 border-t border-[#F0E5D5] space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Call Action Button */}
          {hasPhone ? (
            <a
              href={telHref}
              className="btn-outline h-8 px-2 text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 hover:border-[#F26A21] hover:text-[#F26A21] hover:bg-[#FFF0E2] transition-all"
              title={`कॉल करें: ${phone}`}
            >
              <span className="text-[#F26A21]">📞</span>
              <span>कॉल करें</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="btn-outline h-8 px-2 text-xs font-semibold opacity-40 cursor-not-allowed bg-[#F8FAFC] text-[#64748B] border-[#F0E5D5] flex items-center justify-center gap-1.5"
              title={isPrivatePhone ? "सदस्य द्वारा गोपनीय" : "उपलब्ध नहीं"}
            >
              <span className="grayscale opacity-60">📞</span>
              <span>कॉल</span>
            </button>
          )}

          {/* Email Action Button */}
          {hasEmail ? (
            <a
              href={mailtoHref}
              className="btn-outline h-8 px-2 text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 hover:border-[#F26A21] hover:text-[#F26A21] hover:bg-[#FFF0E2] transition-all"
              title={`ईमेल करें: ${email}`}
            >
              <span className="text-[#F26A21]">✉️</span>
              <span>ईमेल करें</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="btn-outline h-8 px-2 text-xs font-semibold opacity-40 cursor-not-allowed bg-[#F8FAFC] text-[#64748B] border-[#F0E5D5] flex items-center justify-center gap-1.5"
              title={isPrivateEmail ? "सदस्य द्वारा गोपनीय" : "उपलब्ध नहीं"}
            >
              <span className="grayscale opacity-60">✉️</span>
              <span>ईमेल</span>
            </button>
          )}
        </div>

        {/* View Profile Action Button */}
        <Link
          href={`/member/${profileIdentifier}`}
          className="btn-navy w-full h-8 px-3 text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 hover:bg-[#F26A21] transition-all text-center"
        >
          <span>प्रोफ़ाइल देखें</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
