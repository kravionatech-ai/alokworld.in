"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function AboutPage() {
  const [cmsPage, setCmsPage] = useState(null);

  useEffect(() => {
    fetch("/api/pages/about")
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
          <div className="lg:col-span-8 bg-white rounded-lg border border-[#E9D9C5] p-5 sm:p-7 shadow-xs space-y-5">
            <div className="border-b border-[#E9D9C5] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#E9D9C5]">
                Community Portal
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                {cmsPage?.title || "About alokworld.in"}
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                {cmsPage?.subtitle || "Empowering the Samaj through digital connectivity, mutual support, and purposeful leadership."}
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
                  alokworld.in is a secure, modern, and verified digital community directory portal, established with the vision of uniting community members, families, elders, professionals, and youth across India under a trusted digital foundation.
                </p>

                <h2 className="text-base font-bold text-[#102F6B] pt-2 border-b border-[#E9D9C5] pb-1">
                  Core Objectives &amp; Vision
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="p-4 rounded-lg bg-[#FFF9ED] border border-[#E9D9C5]">
                    <h3 className="font-bold text-[#102F6B] text-xs sm:text-sm mb-1">1. Verified Community Directory</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Enabling community members residing across every city and state to easily connect, build professional associations, and assist one another in times of need.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#FFF9ED] border border-[#E9D9C5]">
                    <h3 className="font-bold text-[#102F6B] text-xs sm:text-sm mb-1">2. Youth &amp; Career Mentorship</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Connecting young aspirants with experienced mentors in civil services (IAS, IPS, State PSC), medicine, engineering, technology, law, and business.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#FFF9ED] border border-[#E9D9C5]">
                    <h3 className="font-bold text-[#102F6B] text-xs sm:text-sm mb-1">3. Dignified Matrimonial Coordination</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Providing a respectable, verified, and family-centered matchmaking directory for educated community youth and their families.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#FFF9ED] border border-[#E9D9C5]">
                    <h3 className="font-bold text-[#102F6B] text-xs sm:text-sm mb-1">4. Preserving Cultural Heritage</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Honoring community history, celebrating the sacrifices of immortal patriots, and passing down noble ideals to coming generations.
                    </p>
                  </div>
                </div>

                <h2 className="text-base font-bold text-[#102F6B] pt-3 border-b border-[#E9D9C5] pb-1">
                  Commitment to Privacy and Dignity
                </h2>
                <p>
                  The publication of contact details (such as phone numbers and addresses) on this portal is strictly based on the voluntary consent of the member. All profile submissions undergo administrative verification to prevent unauthorized misuse and maintain community integrity.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
