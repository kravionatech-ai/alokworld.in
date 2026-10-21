"use client";

import Link from "next/link";

export default function MemberTable({ members = [], startIndex = 0 }) {
  if (members.length === 0) {
    return (
      <div className="border border-[#E9D9C5] bg-white p-6 text-center text-xs text-[#64748B] rounded-lg">
        No community members found matching your search.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#E9D9C5] rounded-lg shadow-xs bg-white">
      <table className="w-full text-xs bg-white">
        <thead>
          <tr className="bg-[#102F6B] text-white">
            <th className="border-b border-[#091D42] px-3 py-2.5 text-left font-bold w-[50px]">S.No.</th>
            <th className="border-b border-[#091D42] px-3 py-2.5 text-left font-bold">Full Name</th>
            <th className="border-b border-[#091D42] px-3 py-2.5 text-left font-bold">Location / Address</th>
            <th className="border-b border-[#091D42] px-3 py-2.5 text-left font-bold w-[120px]">Contact No.</th>
            <th className="border-b border-[#091D42] px-3 py-2.5 text-left font-bold">Role &amp; Profession</th>
            <th className="border-b border-[#091D42] px-3 py-2.5 text-center font-bold w-[90px]">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E9D9C5]">
          {members.map((member, index) => {
            const profileIdentifier = member.slug || member._id || member.id;
            return (
              <tr
                key={member._id || member.id || index}
                className={index % 2 === 0 ? "bg-[#FFF9ED]/30 hover:bg-[#FFF0E2]/50" : "bg-white hover:bg-[#FFF0E2]/50"}
              >
                <td className="px-3 py-2 text-center text-[#263449] font-medium">
                  {startIndex + index + 1}
                </td>
                <td className="px-3 py-2">
                  <Link href={`/member/${profileIdentifier}`}>
                    <span className="font-bold text-[#102F6B] hover:text-[#F26A21] transition-colors block">
                      {member.name}
                    </span>
                  </Link>
                  {member.role && (
                    <span className="text-[#F26A21] font-semibold text-[10px]">
                      [{member.role}]
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-[#263449]">
                  {member.address ? `${member.address}, ` : ""}
                  {member.city}{member.state ? `, ${member.state}` : ""}
                </td>
                <td className="px-3 py-2 text-[#263449] font-mono">
                  {member.phone ? (
                    <a href={`tel:${member.phone}`} className="hover:text-[#F26A21] underline">
                      {member.phone}
                    </a>
                  ) : (
                    <span className="text-[#64748B] italic text-[11px]">Private</span>
                  )}
                </td>
                <td className="px-3 py-2 text-[#263449]">
                  <div className="font-medium">{member.occupation || "—"}</div>
                  {member.company && (
                    <div className="text-[10px] text-[#64748B]">{member.company}</div>
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  <Link
                    href={`/member/${profileIdentifier}`}
                    className="text-[#F26A21] font-bold hover:text-[#091D42] underline"
                  >
                    Details →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
