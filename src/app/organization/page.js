"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function OrganizationPage() {
  const [cmsPage, setCmsPage] = useState(null);

  useEffect(() => {
    fetch("/api/pages/organization")
      .then((r) => r.json())
      .then((d) => {
        if (d?.page) setCmsPage(d.page);
      })
      .catch(console.error);
  }, []);

  const fallbackCommittees = [
    {
      title: "National Advisory Council (Rashtriya Sanrakshak Mandal)",
      desc: "Comprising esteemed community elders, retired senior civil administrators, and distinguished social patrons providing visionary strategic guidance.",
      lead: "Guidance: Senior Advisory Board of Patrons",
    },
    {
      title: "Central Working Committee (Rashtriya Karyasamiti)",
      desc: "Executing policy resolutions, orchestrating national conventions, coordinating developmental budgets, and overseeing regional state chapters.",
      lead: "Conveners: National President & General Secretary",
    },
    {
      title: "Youth Network & IT Cell (Rashtriya Yuva Morcha)",
      desc: "Spearheading skill development, competitive examination mentorship, technology enablement, and nationwide digital directory operations.",
      lead: "Incharge: National Youth & Technology Cell",
    },
    {
      title: "Women Empowerment Wing (Rashtriya Mahila Morcha)",
      desc: "Championing girls' higher education, vocational self-help groups, social welfare, maternal health, and leadership initiatives.",
      lead: "Incharge: National Women's Council",
    },
    {
      title: "Legal & Statutory Advisory Panel (Vidhi Prakoshth)",
      desc: "Providing legal assistance, family and property dispute mediation, and safeguarding civil and community rights.",
      lead: "Coordination: Panel of Senior Advocates & Jurists",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9ED] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white rounded-lg border border-[#E9D9C5] p-5 sm:p-7 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#E9D9C5]">
                Structure &amp; Governance
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                {cmsPage?.title || "National Organization Structure & Committees"}
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                {cmsPage?.subtitle || "An organized framework dedicated to community welfare, youth enablement, and nationwide harmony."}
              </p>
            </div>

            {cmsPage?.content ? (
              <div className="bg-white rounded-lg border border-[#E9D9C5] p-5 sm:p-7 shadow-xs">
                <div
                  className="cms-prose text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: cmsPage.content }}
                />
              </div>
            ) : (
              <div className="space-y-3.5">
                {fallbackCommittees.map((c, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 rounded-lg bg-white border border-[#E9D9C5] shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-bold text-sm sm:text-base text-[#102F6B]">
                        {c.title}
                      </h2>
                      <span className="text-[11px] font-semibold text-[#F26A21] bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#E9D9C5] shrink-0">
                        Active Body
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      {c.desc}
                    </p>
                    <div className="pt-2 border-t border-[#E9D9C5] text-xs font-semibold text-[#102F6B]">
                      {c.lead}
                    </div>
                  </div>
                ))}
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
