"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function HistoryPage() {
  const [cmsPage, setCmsPage] = useState(null);

  useEffect(() => {
    fetch("/api/pages/history")
      .then((r) => r.json())
      .then((d) => {
        if (d?.page) setCmsPage(d.page);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9ED] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <article className="lg:col-span-8 bg-white rounded-lg border border-[#E9D9C5] p-5 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-[#E9D9C5] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#E9D9C5]">
                Heritage &amp; History
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                {cmsPage?.title || "Glorious Heritage & History of the Samaj"}
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                {cmsPage?.subtitle || "A chronicle of selfless service, courage, cultural legacy, and nation-building."}
              </p>
            </div>

            {cmsPage?.content ? (
              <div
                className="cms-prose text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: cmsPage.content }}
              />
            ) : (
              <div className="text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4">
                <p className="font-medium text-[#102F6B] text-sm sm:text-base leading-relaxed bg-[#FFF9ED] p-4 rounded-lg border border-[#E9D9C5]">
                  The historical journey of our community is marked by sacrifice, dedication, valor, and enduring patriotism. Our ancestors played seminal roles in protecting cultural heritage, expanding agrarian prosperity, and contributing decisively to India&apos;s freedom movement.
                </p>

                <h2 className="text-base font-bold text-[#102F6B] pt-2 border-b border-[#E9D9C5] pb-1">
                  1. Historical Roots &amp; Ancient Background
                </h2>
                <p>
                  Historical annals document that our community has been fundamentally rooted in agrarian advancement, land stewardship, and courageous defense of truth and justice. Through generations, community elders and leaders served as steadfast protectors of cultural traditions and civic harmony.
                </p>

                <h2 className="text-base font-bold text-[#102F6B] pt-2 border-b border-[#E9D9C5] pb-1">
                  2. Invaluable Contributions to India&apos;s Freedom Struggle
                </h2>
                <p>
                  From the First War of Independence in 1857 to the nationwide independence struggle culminating in 1947, brave men and women from our community laid down their lives for the motherland. Legendary icons like Veerangana Rani Avanti Bai Lodhi, Shaheed Gulab Singh Lodhi, Raja Bakhtiyar Singh, and countless unsung freedom fighters exhibited supreme courage against colonial oppression.
                </p>

                <h2 className="text-base font-bold text-[#102F6B] pt-2 border-b border-[#E9D9C5] pb-1">
                  3. Modern Era of Social &amp; Educational Renaissance
                </h2>
                <p>
                  In the post-independence era, community reformers recognized education as the paramount vehicle for socio-economic empowerment. Reformers like Swami Brahmanand Ji established schools, colleges, and hostels across regional heartlands. Today, the youth of our community are actively contributing as civil servants (IAS, IPS, State PSC), doctors, engineers, legal luminaries, entrepreneurs, and global scholars.
                </p>

                <div className="p-4 bg-[#FFF9ED] rounded-lg border border-[#E9D9C5] mt-5">
                  <h3 className="font-bold text-[#102F6B] text-xs uppercase tracking-wider mb-2 border-l-3 border-[#F26A21] pl-2">
                    Core Community Ideals &amp; Commitments
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#263449]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F26A21]"></span>
                      Truth, Integrity, and Social Morality
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F26A21]"></span>
                      Prioritizing Higher Education &amp; Modern Science
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F26A21]"></span>
                      Universal Brotherhood &amp; National Service
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F26A21]"></span>
                      Women Empowerment &amp; Social Upliftment
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </article>

          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
