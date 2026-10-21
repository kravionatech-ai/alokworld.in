"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { FadeIn, StaggerContainer, StaggerItem, SubtleHoverCard } from "@/components/MotionWrappers";

export default function MahasabhaPage() {
  const [cmsPage, setCmsPage] = useState(null);

  useEffect(() => {
    fetch("/api/pages/mahasabha")
      .then((r) => r.json())
      .then((d) => {
        if (d?.page) setCmsPage(d.page);
      })
      .catch(console.error);
  }, []);

  const fallbackResolutions = [
    {
      year: "National Resolution 2026",
      title: "Centralized Digital Directory & Merit Scholarship Mission",
      detail: "Connecting community members across all rural and urban sectors into the centralized directory while conferring annual merit scholarships upon high-achieving students in competitive examinations.",
    },
    {
      year: "Social Reform Resolution",
      title: "Modesty & Simplicity in Social Celebrations",
      detail: "Actively discouraging ostentatious spending, social waste, and dowry demands by organizing and supporting subsidized community mass wedding conventions.",
    },
    {
      year: "Educational Infrastructure Initiative",
      title: "Student Hostels & Competitive Examination Centers",
      detail: "Establishing safe, modern community student hostels and educational mentorship centers in key hubs such as Delhi NCR, Bhopal, Jaipur, Indore, and Lucknow.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            <FadeIn direction="up" distance={14} duration={0.5}>
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                  Central Leadership &amp; Body
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                  {cmsPage?.title || "Akhil Bhartiya Mahasabha (National Assembly)"}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  {cmsPage?.subtitle || "The apex representative organization uniting all regional chapters, trusts, and community councils across India."}
                </p>
              </div>
            </FadeIn>

            {cmsPage?.content ? (
              <FadeIn direction="up" distance={14} duration={0.5}>
                <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs">
                  <div
                    className="cms-prose text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: cmsPage.content }}
                  />
                </div>
              </FadeIn>
            ) : (
              <FadeIn direction="up" distance={14} duration={0.5}>
                <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs space-y-4 text-xs sm:text-sm text-[#263449] leading-relaxed">
                  <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
                    Vision &amp; Strategic Mission
                  </h2>
                  <p className="pl-2">
                    The Akhil Bhartiya Mahasabha serves as the premier apex organization uniting state chapters, community trusts, and councils across the country. Its primary mandate is to foster holistic social development, educational excellence, cultural preservation, and economic self-reliance for all community members.
                  </p>

                  <h2 className="text-base font-bold text-[#102F6B] pt-3 border-l-3 border-[#F26A21] pl-2">
                    Key National Resolutions &amp; Action Plans
                  </h2>
                  <StaggerContainer className="space-y-3 pt-1" staggerDelay={0.06}>
                    {fallbackResolutions.map((r, i) => (
                      <StaggerItem key={i}>
                        <SubtleHoverCard>
                          <div className="p-3.5 sm:p-4 rounded-lg bg-[#FFFCF5] border border-[#F0E5D5] space-y-1.5 hover:border-[#102F6B] transition-colors">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-[#F26A21] bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5]">
                                {r.year}
                              </span>
                            </div>
                            <h3 className="font-bold text-xs sm:text-sm text-[#102F6B]">
                              {r.title}
                            </h3>
                            <p className="text-xs text-[#64748B] leading-relaxed">
                              {r.detail}
                            </p>
                          </div>
                        </SubtleHoverCard>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  <div className="p-4 bg-[#FFF0E2] rounded-lg border border-[#F0E5D5] mt-4">
                    <h3 className="font-bold text-[#102F6B] text-xs uppercase tracking-wider mb-1">
                      Secretariat Inquiries &amp; State Chapter Affiliations
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      For convening regional conventions, submitting agenda resolutions, or affiliating local trust bodies, please reach out to the National General Secretary at the Central Secretariat.
                    </p>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

          <FadeIn as="div" direction="up" distance={14} duration={0.5} delay={0.1} className="lg:col-span-4">
            <Sidebar />
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
}
