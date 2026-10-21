import MemberCard from "./MemberCard";

export default function MemberList({ members = [] }) {
  if (members.length === 0) {
    return (
      <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-10 text-center shadow-sm">
        <div className="w-12 h-12 mx-auto mb-3 bg-[#FFE6C7]/50 rounded-full flex items-center justify-center text-xl text-[#082F75] border border-[#F3D8B0]">
          🔍
        </div>
        <h3 className="text-base font-bold text-[#082F75] mb-1">
          कोई सदस्य नहीं मिला / No Members Found
        </h3>
        <p className="text-xs text-[#64748B] max-w-sm mx-auto">
          कृपया अन्य शहर या नाम से खोजें, अथवा &apos;All Locations&apos; चुनें।
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {members.map((member) => (
        <MemberCard key={member._id || member.id} member={member} />
      ))}
    </div>
  );
}
