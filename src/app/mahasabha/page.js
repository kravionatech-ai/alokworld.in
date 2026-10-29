"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MahasabhaPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/aloksangh");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFCF5] p-6 text-center text-xs text-[#64748B]">
      <span>रीडायरेक्ट हो रहा है...</span>
      <a href="/aloksangh" className="underline font-bold text-[#F26A21] ml-2">
        आलोक संघ पृष्ठ पर जाएं →
      </a>
    </div>
  );
}
