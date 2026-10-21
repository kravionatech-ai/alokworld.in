import Link from "next/link";

export default function MemberCard({ member }) {
  const {
    _id,
    id,
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

  const memberId = _id || id;

  return (
    <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group hover:border-[#082F75]">
      <div>
        {/* Header: Photo / Initials + Identity */}
        <div className="flex items-start gap-3.5">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-13 h-13 rounded-lg object-cover border border-[#F3D8B0] shrink-0"
            />
          ) : (
            <div className="w-13 h-13 rounded-lg bg-[#082F75] text-white flex items-center justify-center font-bold text-lg shrink-0 border border-[#F4510B]">
              {name ? name.charAt(0) : "म"}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <Link href={`/member/${memberId}`}>
              <h3 className="text-base font-bold text-[#082F75] truncate group-hover:text-[#F4510B] transition-colors">
                {name}
              </h3>
            </Link>
            {role && (
              <span className="inline-block mt-0.5 text-[11px] font-bold px-2 py-0.5 rounded bg-[#FFE6C7] text-[#C83B08] border border-[#F3D8B0]">
                {role}
              </span>
            )}
          </div>
        </div>

        {/* Occupation & Organization */}
        <div className="mt-4 pt-3 border-t border-[#F3D8B0]/60 space-y-1.5 text-xs text-[#172B4D]">
          <div className="flex items-center gap-2 font-medium text-[#172B4D] truncate">
            <span className="text-[#082F75]">💼</span>
            <span className="truncate">{occupation}</span>
          </div>

          {company && (
            <div className="text-[11px] text-[#64748B] pl-5 truncate font-normal">
              {company}
            </div>
          )}

          <div className="flex items-center gap-2 text-[#64748B] text-[11px] pt-0.5">
            <span className="text-[#082F75]">📍</span>
            <span>
              {city}, {state}
            </span>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 bg-[#FFE6C7]/50 text-[#082F75] border border-[#F3D8B0] rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Quick Actions */}
      <div className="mt-4 pt-3 border-t border-[#F3D8B0]/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="text-[#082F75] hover:text-[#F4510B] font-semibold inline-flex items-center gap-1 transition-colors"
              title="Call Member"
            >
              📞 <span>Call</span>
            </a>
          ) : (
            <span className="text-[#64748B] text-[11px]">Private</span>
          )}

          {email ? (
            <a
              href={`mailto:${email}`}
              className="text-[#082F75] hover:text-[#F4510B] font-semibold inline-flex items-center gap-1 transition-colors"
              title="Email Member"
            >
              ✉️ <span>Email</span>
            </a>
          ) : null}
        </div>

        <Link
          href={`/member/${memberId}`}
          className="text-xs font-semibold text-white bg-[#082F75] hover:bg-[#F4510B] px-3 py-1 rounded transition-colors"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}
