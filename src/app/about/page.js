"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { FadeIn, StaggerContainer, StaggerItem, SubtleHoverCard } from "@/components/MotionWrappers";

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
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <FadeIn as="div" direction="up" distance={14} duration={0.5} className="lg:col-span-8 bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs space-y-5">
            <div className="border-b border-[#F0E5D5] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                समुदाय पोर्टल
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                {cmsPage?.title || "alokworld.in के बारे में"}
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                {cmsPage?.subtitle || "डिजिटल संपर्क, परस्पर सहयोग एवं समर्पित नेतृत्व के माध्यम से समाज सशक्तिकरण।"}
              </p>
            </div>

            {cmsPage?.content ? (
              <div
                className="cms-prose text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: cmsPage.content }}
              />
            ) : (
              <div className="text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4">
                <p className="font-medium text-[#102F6B] text-sm sm:text-base leading-relaxed bg-[#FFFCF5] p-4 rounded-lg border border-[#F0E5D5]">
                  alokworld.in एक सुरक्षित, आधुनिक और सत्यापित समाज डायरेक्टरी पोर्टल है, जिसकी स्थापना देश भर के समाज बंधुओं, परिवारों, वरिष्ठ मार्गदर्शकों, प्रबुद्ध अधिकारियों एवं युवाओं को एक विश्वसनीय डिजिटल मंच पर संगठित करने के ध्येय से की गई है।
                </p>

                <h2 className="text-base font-bold text-[#102F6B] pt-2 border-b border-[#F0E5D5] pb-1">
                  प्रमुख उद्देश्य एवं संकल्पना
                </h2>
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1" staggerDelay={0.06}>
                  <StaggerItem>
                    <SubtleHoverCard>
                      <div className="p-4 rounded-lg bg-[#FFFCF5] border border-[#F0E5D5] h-full hover:border-[#102F6B] transition-colors">
                        <h3 className="font-bold text-[#102F6B] text-xs sm:text-sm mb-1">१. सत्यापित समाज डायरेक्टरी</h3>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          प्रत्येक नगर और राज्य में निवासरत स्वजातीय बंधुओं को आपस में जोड़ना, व्यावसायिक संबंध सुदृढ़ करना और आवश्यकता के समय एक-दूसरे का संबल बनना।
                        </p>
                      </div>
                    </SubtleHoverCard>
                  </StaggerItem>
                  <StaggerItem>
                    <SubtleHoverCard>
                      <div className="p-4 rounded-lg bg-[#FFFCF5] border border-[#F0E5D5] h-full hover:border-[#102F6B] transition-colors">
                        <h3 className="font-bold text-[#102F6B] text-xs sm:text-sm mb-1">२. युवा एवं कैरियर मार्गदर्शन</h3>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          प्रतियोगी परीक्षाओं (UPSC, State PSC), चिकित्सा, इंजीनियरिंग, तकनीकी, विधि और उद्योग जगत के अनुभवी मार्गदर्शकों से युवाओं को जोड़ना।
                        </p>
                      </div>
                    </SubtleHoverCard>
                  </StaggerItem>
                  <StaggerItem>
                    <SubtleHoverCard>
                      <div className="p-4 rounded-lg bg-[#FFFCF5] border border-[#F0E5D5] h-full hover:border-[#102F6B] transition-colors">
                        <h3 className="font-bold text-[#102F6B] text-xs sm:text-sm mb-1">३. गरिमामय वैवाहिक समन्वय</h3>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          उच्च शिक्षित समाज के युवक-युवतियों एवं संभ्रांत परिवारों के लिए एक विश्वसनीय, पारदर्शी एवं पारिवारिक समन्वय मंच उपलब्ध कराना।
                        </p>
                      </div>
                    </SubtleHoverCard>
                  </StaggerItem>
                  <StaggerItem>
                    <SubtleHoverCard>
                      <div className="p-4 rounded-lg bg-[#FFFCF5] border border-[#F0E5D5] h-full hover:border-[#102F6B] transition-colors">
                        <h3 className="font-bold text-[#102F6B] text-xs sm:text-sm mb-1">४. सांस्कृतिक विरासत का संरक्षण</h3>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          समाज के गौरवशाली इतिहास, अमर वीर बलिदानियों के आदर्शों का स्मरण और नई पीढ़ी में स्वाभिमान व संस्कारों का संचार करना।
                        </p>
                      </div>
                    </SubtleHoverCard>
                  </StaggerItem>
                </StaggerContainer>

                <h2 className="text-base font-bold text-[#102F6B] pt-3 border-b border-[#F0E5D5] pb-1">
                  गोपनीयता और सामाजिक गरिमा के प्रति प्रतिबद्धता
                </h2>
                <p>
                  इस पोर्टल पर संपर्क विवरण (जैसे फोन नंबर और पता) केवल सदस्य की ऐच्छिक सहमति के आधार पर ही प्रदर्शित किया जाता है। अनधिकृत दुरुपयोग को रोकने और सामाजिक विश्वास को बनाए रखने के लिए प्रत्येक प्रविष्टि का प्रशासनिक सत्यापन किया जाता है।
                </p>
              </div>
            )}
          </FadeIn>

          <FadeIn as="div" direction="up" distance={14} duration={0.5} delay={0.1} className="lg:col-span-4">
            <Sidebar />
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
}
