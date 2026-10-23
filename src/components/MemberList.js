"use client";

import MemberCard from "./MemberCard";
import { StaggerContainer, StaggerItem } from "./MotionWrappers";

export default function MemberList({ members = [] }) {
  if (members.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#F0E5D5] p-10 text-center shadow-xs">
        <div className="w-12 h-12 mx-auto mb-3 bg-[#FFF0E2] rounded-full flex items-center justify-center text-xl text-[#102F6B] border border-[#F0E5D5]">
          🔍
        </div>
        <h3 className="text-base font-bold text-[#102F6B] mb-1">
          कोई समाज सदस्य नहीं मिला
        </h3>
        <p className="text-xs text-[#64748B] max-w-sm mx-auto">
          कृपया किसी अन्य नाम, पद या स्थान से खोजें अथवा फ़िल्टर से &quot;सभी स्थान&quot; चुनें।
        </p>
      </div>
    );
  }

  return (
    <StaggerContainer
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      staggerDelay={0.06}
    >
      {members.map((member) => (
        <StaggerItem key={member._id || member.id} className="h-full">
          <MemberCard member={member} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}