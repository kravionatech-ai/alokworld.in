import Link from "next/link";

export default function MemberCard({ member }) {
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
    tags,
    avatar,
  } = member;

  const profileIdentifier = slug || _id || id;

  return (
    <div className="bg-white rounded-lg border border-[#E9D9C5] shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group hover:border-[#102F6B] h-full">
      <div>
        {/* Header: Photo / Initials + Identity */}
        <div className="flex items-start gap-3.5">
          {avatar ? (
            <img
              src={avatar}
              alt={name ? `${name} - Samaj Community Member` : "Samaj Community Member"}
              width={56}
              height={56}
              loading="lazy"
              decoding="async"
              className="w-14 h-14 rounded-lg object-cover border border-[#E9D9C5] shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-[#102F6B] text-white flex items-center justify-center font-bold text-lg shrink-0 border border-[#F26A21]">
              {name ? name.charAt(0).toUpperCase() : "M"}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <Link href={`/member/${profileIdentifier}`}>
              <h3 className="text-base font-bold text-[#102F6B] break-words group-hover:text-[#F26A21] transition-colors leading-snug">
                {name}
              </h3>
            </Link>
            {role && (
              <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded bg-[#FFF0E2] text-[#F26A21] border border-[#E9D9C5]">
                {role}
              </span>
            )}
          </div>
        </div>

        {/* Occupation & Organization */}
        <div className="mt-4 pt-3 border-t border-[#E9D9C5] space-y-1.5 text-xs text-[#263449]">
          <div className="flex items-start gap-2 font-medium text-[#263449]">
            <span className="text-[#102F6B] shrink-0 mt-0.5">💼</span>
            <span className="leading-snug break-words">{occupation || "Community Member"}</span>
          </div>

          {company && (
            <div className="text-[11px] text-[#64748B] pl-5 break-words font-normal">
              {company}
            </div>
          )}

          <div className="flex items-center gap-2 text-[#64748B] text-[11px] pt-0.5">
            <span className="text-[#102F6B] shrink-0">📍</span>
            <span>
              {city}{state ? `, ${state}` : ""}
            </span>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 bg-[#FFF0E2] text-[#102F6B] border border-[#E9D9C5] rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Quick Actions */}
      <div className="mt-4 pt-3 border-t border-[#E9D9C5] flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-3">
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="text-[#102F6B] hover:text-[#F26A21] font-semibold inline-flex items-center gap-1 transition-colors"
              title="Call Member"
            >
              <span>📞</span> <span className="underline">Call</span>
            </a>
          ) : (
            <span className="text-[#64748B] text-[11px]" title="Contact details kept private by member">Private</span>
          )}

          {email ? (
            <a
              href={`mailto:${email}`}
              className="text-[#102F6B] hover:text-[#F26A21] font-semibold inline-flex items-center gap-1 transition-colors"
              title="Email Member"
            >
              <span>✉️</span> <span className="underline">Email</span>
            </a>
          ) : null}
        </div>

        <Link
          href={`/member/${profileIdentifier}`}
          className="btn-navy px-3 py-1.5 text-xs shadow-xs"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}
