"use client";

import Link from "next/link";

export default function RightSidebar() {
  return (
    <aside className="space-y-4">
      {/* National Office Bearers */}
      <div className="border border-[#F0E5D5] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2 border-b-2 border-[#F26A21]">
          National Office Bearers
        </div>
        <div className="p-3.5 text-center">
          <div className="w-14 h-14 mx-auto bg-[#FFF0E2] rounded-full flex items-center justify-center text-xl mb-2 border-2 border-[#F0E5D5]">
            👤
          </div>
          <p className="text-xs font-bold text-[#102F6B]">Shri Rakesh Lodhi</p>
          <p className="text-[10px] text-[#64748B]">Agra, Uttar Pradesh</p>
          <p className="text-[11px] text-[#F26A21] font-semibold mt-0.5">National Treasurer</p>
          <p className="text-xs font-bold text-[#263449] mt-1 font-mono">9412720183</p>
        </div>
      </div>

      {/* State Office Bearers */}
      <div className="border border-[#F0E5D5] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2 border-b-2 border-[#F26A21]">
          State Office Bearers
        </div>
        <div className="p-3.5 text-center">
          <div className="w-14 h-14 mx-auto bg-[#FFF0E2] rounded-full flex items-center justify-center text-xl mb-2 border-2 border-[#F0E5D5]">
            👤
          </div>
          <p className="text-xs font-bold text-[#102F6B]">Maharaj Lodhi (Social Worker)</p>
          <p className="text-[10px] text-[#64748B]">Vice President, Uttar Pradesh</p>
          <p className="text-xs font-bold text-[#263449] mt-1 font-mono">9455714545</p>
        </div>
      </div>

      {/* Ministers & Public Representatives */}
      <div className="border border-[#F0E5D5] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2 border-b-2 border-[#F26A21]">
          Public Representatives &amp; Leaders
        </div>
        <div className="p-3.5 text-center">
          <div className="w-14 h-14 mx-auto bg-[#FFF0E2] rounded-full flex items-center justify-center text-xl mb-2 border-2 border-[#F0E5D5]">
            👤
          </div>
          <p className="text-xs font-bold text-[#102F6B]">Shri Ramchandra Lodhi</p>
          <p className="text-[10px] text-[#64748B]">Former Minister, Madhya Pradesh</p>
        </div>
      </div>

      {/* Civil Servants & Professionals */}
      <div className="border border-[#F0E5D5] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2 border-b-2 border-[#F26A21]">
          Civil Servants &amp; Professionals
        </div>
        <div className="p-3.5 text-center">
          <div className="w-14 h-14 mx-auto bg-[#FFF0E2] rounded-full flex items-center justify-center text-xl mb-2 border-2 border-[#F0E5D5]">
            👤
          </div>
          <p className="text-xs font-bold text-[#102F6B]">Amar Pal Ji</p>
          <p className="text-[11px] font-bold text-[#F26A21] mt-0.5">IAS Officer</p>
        </div>
      </div>

      {/* Advertisement Box */}
      <div className="border border-[#F0E5D5] rounded-lg overflow-hidden shadow-xs bg-white">
        <div className="bg-[#102F6B] text-white text-xs font-bold px-3.5 py-2 border-b-2 border-[#F26A21]">
          Community Spotlight
        </div>
        <div className="p-4 text-center text-xs text-[#64748B]">
          <div className="border border-dashed border-[#F0E5D5] p-4 rounded-lg bg-[#FFFCF5]">
            <p className="font-semibold text-[#102F6B]">Enterprise Advertisement</p>
            <p className="text-[10px] mt-1 text-[#64748B]">Contact the secretariat to feature your business</p>
            <Link
              href="/contact"
              className="btn-primary mt-2 px-3 py-1 text-[11px]"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
