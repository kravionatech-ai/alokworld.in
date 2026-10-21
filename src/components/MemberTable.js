"use client";

import Link from "next/link";

export default function MemberTable({ members = [], startIndex = 0 }) {
  if (members.length === 0) {
    return (
      <div className="border border-[#F3D8B0] bg-[#FFFDF6] p-6 text-center text-xs text-[#64748B] rounded">
        कोई सदस्य नहीं मिला / No Members Found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#F3D8B0] rounded shadow-xs">
      <table className="w-full text-xs bg-white">
        <thead>
          <tr className="bg-[#082F75] text-white">
            <th className="border border-[#071D49] px-2 py-1.5 text-left font-bold w-[45px]">क्र.सं.</th>
            <th className="border border-[#071D49] px-2 py-1.5 text-left font-bold">नाम (Name)</th>
            <th className="border border-[#071D49] px-2 py-1.5 text-left font-bold">पता (Address)</th>
            <th className="border border-[#071D49] px-2 py-1.5 text-left font-bold w-[110px]">मोबाइल</th>
            <th className="border border-[#071D49] px-2 py-1.5 text-left font-bold">पद / व्यवसाय</th>
            <th className="border border-[#071D49] px-2 py-1.5 text-center font-bold w-[70px]">विवरण</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => {
            const memberId = member._id || member.id;
            return (
              <tr
                key={memberId}
                className={index % 2 === 0 ? "bg-[#FFFDF6] hover:bg-[#FFE6C7]/30" : "bg-white hover:bg-[#FFE6C7]/30"}
              >
                <td className="border border-[#F3D8B0] px-2 py-1.5 text-center text-[#172B4D] font-medium">
                  {startIndex + index + 1}
                </td>
                <td className="border border-[#F3D8B0] px-2 py-1.5">
                  <span className="font-bold text-[#082F75]">
                    {member.role ? <span className="text-[#C83B08] font-semibold text-[10px] mr-1">[{member.role}]</span> : ""}
                    {member.name}
                  </span>
                </td>
                <td className="border border-[#F3D8B0] px-2 py-1.5 text-[#172B4D]">
                  {member.address || `${member.city || ""}, ${member.state || ""}`}
                </td>
                <td className="border border-[#F3D8B0] px-2 py-1.5 text-[#172B4D] font-mono">
                  {member.phone || "—"}
                </td>
                <td className="border border-[#F3D8B0] px-2 py-1.5 text-[#172B4D]">
                  {member.occupation || "—"}
                </td>
                <td className="border border-[#F3D8B0] px-2 py-1.5 text-center">
                  <Link
                    href={`/member/${memberId}`}
                    className="text-[#F4510B] font-bold hover:text-[#C83B08] underline"
                  >
                    Details
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
