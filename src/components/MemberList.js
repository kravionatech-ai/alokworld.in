import MemberCard from "./MemberCard";

export default function MemberList({ members = [] }) {
  if (members.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#E9D9C5] p-10 text-center shadow-xs">
        <div className="w-12 h-12 mx-auto mb-3 bg-[#FFF0E2] rounded-full flex items-center justify-center text-xl text-[#102F6B] border border-[#E9D9C5]">
          🔍
        </div>
        <h3 className="text-base font-bold text-[#102F6B] mb-1">
          No Community Members Found
        </h3>
        <p className="text-xs text-[#64748B] max-w-sm mx-auto">
          Please try searching with another name, profession, or select &quot;All Locations&quot; from the filter.
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
