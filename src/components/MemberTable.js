"use client";

import Link from "next/link";

export default function MemberTable({ members = [], startIndex = 0 }) {
  if (!members || members.length === 0) {
    return (
      <div className="border border-[#F0E5D5] bg-white p-12 text-center rounded-lg shadow-xs">
        <div className="w-12 h-12 mx-auto mb-3 bg-[#FFF0E2] rounded-full flex items-center justify-center text-xl text-[#102F6B] border border-[#F0E5D5]">
          🔍
        </div>
        <h3 className="text-sm font-bold text-[#102F6B] mb-1">
          No Community Members Found
        </h3>
        <p className="text-xs text-[#64748B] max-w-sm mx-auto">
          Please adjust your search keyword, select &quot;All Cities&quot;, or clear active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile scroll hint */}
      <div className="block sm:hidden text-[11px] text-[#64748B] mb-1.5 px-1 font-medium">
        ⇄ Scroll horizontally to view all table columns
      </div>

      <div className="overflow-x-auto border border-[#E9E2D8] rounded-lg shadow-xs bg-white">
        <table className="w-full text-xs text-left bg-white border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#102F6B] text-white">
              <th
                scope="col"
                className="px-3.5 py-3 font-bold text-xs tracking-wider text-center text-white border-b-2 border-[#091D42] w-[60px]"
              >
                S.No.
              </th>
              <th
                scope="col"
                className="px-3.5 py-3 font-bold text-xs tracking-wider text-left text-white border-b-2 border-[#091D42] min-w-[170px]"
              >
                Full Name
              </th>
              <th
                scope="col"
                className="px-3.5 py-3 font-bold text-xs tracking-wider text-left text-white border-b-2 border-[#091D42] min-w-[160px]"
              >
                Location / Address
              </th>
              <th
                scope="col"
                className="px-3.5 py-3 font-bold text-xs tracking-wider text-left text-white border-b-2 border-[#091D42] min-w-[130px]"
              >
                Contact No.
              </th>
              <th
                scope="col"
                className="px-3.5 py-3 font-bold text-xs tracking-wider text-left text-white border-b-2 border-[#091D42] min-w-[180px]"
              >
                Role &amp; Profession
              </th>
              <th
                scope="col"
                className="px-3.5 py-3 font-bold text-xs tracking-wider text-center text-white border-b-2 border-[#091D42] w-[90px]"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E2D8]">
            {members.map((member, index) => {
              const profileIdentifier = member.slug || member._id || member.id;
              const isEvenRow = index % 2 === 0;
              const cleanPhone = member.phone
                ? String(member.phone).replace(/[^\d+]/g, "")
                : "";

              return (
                <tr
                  key={member._id || member.id || index}
                  className={`transition-colors duration-150 ${
                    isEvenRow ? "bg-white" : "bg-[#FFFCF5]"
                  } hover:bg-[#FFF0E2]/60`}
                >
                  {/* S.No. */}
                  <td className="px-3.5 py-2.5 text-center text-[#64748B] font-bold text-xs align-middle">
                    {startIndex + index + 1}
                  </td>

                  {/* Full Name & Designation */}
                  <td className="px-3.5 py-2.5 align-middle">
                    <div className="flex items-center gap-2.5">
                      <Link
                        href={`/member/${profileIdentifier}`}
                        className="shrink-0 block"
                        title={`View ${member.name || "Member"}'s profile`}
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name || "Member"}
                            width={34}
                            height={34}
                            loading="lazy"
                            decoding="async"
                            className="w-8.5 h-8.5 rounded-full object-cover border border-[#E9E2D8] shadow-2xs hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div
                            className="w-8.5 h-8.5 rounded-full bg-[#102F6B] text-white flex items-center justify-center font-bold text-xs shrink-0 border border-[#F26A21] shadow-2xs"
                            aria-hidden="true"
                          >
                            {member.name ? member.name.replace(/^श्री\s+|^डॉ\.\s*|^इं०?\s*|^श्रीमती\s*/, "").charAt(0).toUpperCase() : "M"}
                          </div>
                        )}
                      </Link>
                      <div className="min-w-0">
                        <Link
                          href={`/member/${profileIdentifier}`}
                          className="font-bold text-[#102F6B] hover:text-[#F26A21] transition-colors text-xs sm:text-[13px] block leading-snug"
                        >
                          {member.name || "Community Member"}
                        </Link>
                        {member.role && (
                          <span className="text-[#F26A21] font-semibold text-[10.5px] block mt-0.5 tracking-tight truncate max-w-[220px]">
                            [{member.role}]
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Location / Address */}
                  <td className="px-3.5 py-2.5 text-[#263449] align-middle">
                    {member.address && (
                      <span className="block text-[#64748B] text-[11px] leading-tight mb-0.5 line-clamp-1">
                        {member.address}
                      </span>
                    )}
                    <span className="font-medium text-[#263449] text-xs">
                      {member.city || "—"}
                      {member.state ? `, ${member.state}` : ""}
                    </span>
                  </td>

                  {/* Contact No. */}
                  <td className="px-3.5 py-2.5 align-middle text-xs">
                    {member.phone && member.showPhone !== false ? (
                      <a
                        href={`tel:${cleanPhone}`}
                        className="text-[#102F6B] hover:text-[#F26A21] font-mono font-medium underline transition-colors whitespace-nowrap inline-flex items-center gap-1"
                        title={`Call ${member.name}: ${member.phone}`}
                      >
                        <span className="text-[#F26A21] text-[10px]" aria-hidden="true">
                          📞
                        </span>
                        <span>{member.phone}</span>
                      </a>
                    ) : (
                      <span className="text-[#64748B] italic text-[11px] whitespace-nowrap">
                        Private
                      </span>
                    )}
                  </td>

                  {/* Role & Profession + Organization */}
                  <td className="px-3.5 py-2.5 align-middle text-xs">
                    <div className="font-semibold text-[#102F6B] leading-tight">
                      {member.occupation || "Community Member"}
                    </div>
                    {member.company ? (
                      <div className="text-[11px] text-[#64748B] mt-0.5 leading-tight">
                        {member.company}
                      </div>
                    ) : null}
                  </td>

                  {/* Action Link */}
                  <td className="px-3.5 py-2.5 text-center align-middle whitespace-nowrap">
                    <Link
                      href={`/member/${profileIdentifier}`}
                      className="text-[#F26A21] font-bold text-xs hover:text-[#091D42] hover:underline transition-colors inline-flex items-center gap-0.5"
                      title={`View complete profile of ${member.name}`}
                    >
                      <span>Details</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
