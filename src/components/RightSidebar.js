"use client";

import Link from "next/link";

export default function RightSidebar() {
  return (
    <aside className="space-y-3">
      {/* राष्ट्रीय पदाधिकारी */}
      <div className="border border-[#F3D8B0] rounded-sm overflow-hidden shadow-xs">
        <div className="bg-[#082F75] text-white text-xs font-bold px-3 py-1.5 border-b-2 border-[#F4510B]">
          राष्ट्रीय पदाधिकारी
        </div>
        <div className="bg-[#FFFDF6] p-3 text-center">
          <div className="w-16 h-16 mx-auto bg-[#FFE6C7]/60 rounded-full flex items-center justify-center text-2xl mb-2 border-2 border-[#F3D8B0]">
            👤
          </div>
          <p className="text-xs font-bold text-[#082F75]">श्री राकेश लोधी</p>
          <p className="text-[10px] text-[#64748B]">आगरा, उ.प्र.</p>
          <p className="text-[10px] text-[#F4510B] font-semibold">राष्ट्रीय कोषाध्यक्ष</p>
          <p className="text-xs font-bold text-[#172B4D] mt-1">9412720183</p>
        </div>
      </div>

      {/* प्रदेश-पदाधिकारी */}
      <div className="border border-[#F3D8B0] rounded-sm overflow-hidden shadow-xs">
        <div className="bg-[#082F75] text-white text-xs font-bold px-3 py-1.5 border-b-2 border-[#F4510B]">
          प्रदेश-पदाधिकारी
        </div>
        <div className="bg-[#FFFDF6] p-3 text-center">
          <div className="w-16 h-16 mx-auto bg-[#FFE6C7]/60 rounded-full flex items-center justify-center text-2xl mb-2 border-2 border-[#F3D8B0]">
            👤
          </div>
          <p className="text-xs font-bold text-[#082F75]">समाज सेवी महाराज लोधी</p>
          <p className="text-[10px] text-[#64748B]">उपाध्यक्ष, उत्तर प्रदेश</p>
          <p className="text-xs font-bold text-[#172B4D] mt-1">9455714545</p>
        </div>
      </div>

      {/* मंत्री एवं विधायक */}
      <div className="border border-[#F3D8B0] rounded-sm overflow-hidden shadow-xs">
        <div className="bg-[#082F75] text-white text-xs font-bold px-3 py-1.5 border-b-2 border-[#F4510B]">
          मंत्री एवं विधायक
        </div>
        <div className="bg-[#FFFDF6] p-3 text-center">
          <div className="w-16 h-16 mx-auto bg-[#FFE6C7]/60 rounded-full flex items-center justify-center text-2xl mb-2 border-2 border-[#F3D8B0]">
            👤
          </div>
          <p className="text-xs font-bold text-[#082F75]">श्री रामचन्द्र लोधी</p>
          <p className="text-[10px] text-[#64748B]">पूर्व मंत्री, मध्य प्रदेश</p>
        </div>
      </div>

      {/* IAS, RAS, CA, Doctor */}
      <div className="border border-[#F3D8B0] rounded-sm overflow-hidden shadow-xs">
        <div className="bg-[#082F75] text-white text-xs font-bold px-3 py-1.5 border-b-2 border-[#F4510B]">
          IAS, RAS, CA, Doctor
        </div>
        <div className="bg-[#FFFDF6] p-3 text-center">
          <div className="w-16 h-16 mx-auto bg-[#FFE6C7]/60 rounded-full flex items-center justify-center text-2xl mb-2 border-2 border-[#F3D8B0]">
            👤
          </div>
          <p className="text-xs font-bold text-[#082F75]">अमर पाल जी</p>
          <p className="text-[10px] font-bold text-[#F4510B]">IAS Officer</p>
        </div>
      </div>

      {/* विज्ञापन (Advertisement) */}
      <div className="border border-[#F3D8B0] rounded-sm overflow-hidden shadow-xs">
        <div className="bg-[#082F75] text-white text-xs font-bold px-3 py-1.5 border-b-2 border-[#F4510B]">
          विज्ञापन
        </div>
        <div className="bg-[#FFFDF6] p-4 text-center text-xs text-[#64748B]">
          <div className="border border-dashed border-[#F3D8B0] p-4 rounded bg-[#FFF9E8]">
            <p className="font-semibold text-[#082F75]">Advertisement</p>
            <p className="text-[10px] mt-1 text-[#64748B]">विज्ञापन के लिए संपर्क करें</p>
            <Link
              href="/contact"
              className="inline-block mt-2 px-2.5 py-1 bg-[#F4510B] hover:bg-[#C83B08] text-white text-[10px] font-bold rounded"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
