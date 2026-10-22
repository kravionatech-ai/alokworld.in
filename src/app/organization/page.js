"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { FadeIn, StaggerContainer, StaggerItem, SubtleHoverCard } from "@/components/MotionWrappers";

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
      title: "1. राष्ट्रीय परामर्शदात्री समिति (National Advisory Council)",
      desc: "संघ की सर्वोच्च नीतिगत एवं मार्गदर्शक समिति। इसमें सभी संस्थापक सदस्य एवं वरिष्ठ प्रशासनिक मार्गदर्शक शामिल हैं जो नीतियों के प्रभावी क्रियान्वयन हेतु निर्देश प्रदान करते हैं।",
      lead: "अध्यक्ष: सर्वश्री वीरवल सिंह (मो. 9454412070, उ०प्र०) | संस्थापक संरक्षक मंडल",
    },
    {
      title: "2. राष्ट्रीय संरक्षक मंडल (Council of National Patrons)",
      desc: "वरिष्ठ सेवानिवृत्त महानिदेशक, मुख्य अभियंता एवं प्रशासनिक अधिकारियों का सम्मानित संरक्षक मंडल जो समाज के दीर्घकालिक विकास हेतु सतत मार्गदर्शन करते हैं।",
      lead: "संरक्षक: डॉ. बद्री विशाल सिंह (से०नि० महानिदेशक, चिकित्सा), श्रीमती किरन पढेऱिया (भेल भोपाल), श्री ओम प्रकाश वर्मा (डेसू दिल्ली), श्री गजराज सिंह (जयपुर)",
    },
    {
      title: "3. केंद्रीय राष्ट्रीय कार्यकारिणी (Central National Executive)",
      desc: "देशभर में आलोक संघ के संगठनात्मक प्रबंधन, प्रांतीय एवं जिला शाखाओं के विस्तार, वार्षिक राष्ट्रीय अधिवेशनों के आयोजन तथा समाज कल्याण योजनाओं का संचालन।",
      lead: "राष्ट्रीय अध्यक्ष: सर्वश्री अतिवल सिंह (9999900079) | वरिष्ठ उपाध्यक्ष: सर्वश्री सुरेश शिवसिंह लोधी | कोषाध्यक्ष: डॉ. ओमकार सिंह नरवरिया",
    },
    {
      title: "4. राष्ट्रीय संयोजक एवं समन्वय प्रकोष्ठ (National Coordination Wing)",
      desc: "केंद्रीय कार्यकारिणी, राज्य इकाइयों और जिला संगठनों के मध्य समन्वय स्थापित कर राष्ट्रीय संकल्पों एवं कार्यक्रमों का सुचारू संचालन सुनिश्चित करना।",
      lead: "राष्ट्रीय संयोजक: सर्वश्री विश्वनाथ सिंह (9369970069), श्री राम सेवक राजपूत (सहायक अभियंता लो०नि०वि० लखनऊ), डॉ. राजेश वर्मा, इं. सतेंद्र सिंह",
    },
    {
      title: "5. राष्ट्रीय प्रवक्ता एवं जनसंपर्क प्रकोष्ठ (Media & Spokespersons)",
      desc: "संघ की नीतियों, सामाजिक सुधार अभियानों, शिक्षा अभियानों एवं लोक कल्याणकारी गतिविधियों को समाज व मीडिया के समक्ष आधिकारिक रूप से प्रस्तुत करना।",
      lead: "राष्ट्रीय प्रवक्ता: इं. हर्ष राजपूत (मप्र), इं. बृजेश कुमार लोधी | मीडिया प्रभारी: श्री धर्मेन्द्र सिंह (9456805229), श्री रामसेवक राजपूत",
    },
    {
      title: "6. राष्ट्रीय विधिक एवं लेखा प्रकोष्ठ (Legal Advisory & Audit Wing)",
      desc: "अधिकारियों-कर्मचारियों के संवैधानिक अधिकारों की रक्षा, निःशुल्क विधिक परामर्श एवं संगठन की पारदर्शी वित्तीय व लेखा प्रणाली का निष्पादन।",
      lead: "विधिक सलाहकार: श्री राकेश राजपूत, श्री लखन सिंह राजपूत (अधिवक्ता भोपाल) | लेखा परीक्षक: श्री राजेंद्र सिंह (CAG भारत सरकार)",
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
                  Structure &amp; Governance
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                  {cmsPage?.title || "National Organization Structure & Committees"}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  {cmsPage?.subtitle || "An organized framework dedicated to community welfare, youth enablement, and nationwide harmony."}
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
              <StaggerContainer className="space-y-3.5" staggerDelay={0.06}>
                {fallbackCommittees.map((c, i) => (
                  <StaggerItem key={i}>
                    <SubtleHoverCard>
                      <div className="p-4 sm:p-5 rounded-lg bg-white border border-[#F0E5D5] shadow-xs space-y-2 hover:border-[#102F6B] transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="font-bold text-sm sm:text-base text-[#102F6B]">
                            {c.title}
                          </h2>
                          <span className="text-[11px] font-semibold text-[#F26A21] bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5] shrink-0">
                            Active Body
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                          {c.desc}
                        </p>
                        <div className="pt-2 border-t border-[#F0E5D5] text-xs font-semibold text-[#102F6B]">
                          {c.lead}
                        </div>
                      </div>
                    </SubtleHoverCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
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
