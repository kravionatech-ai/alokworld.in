"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { FadeIn, StaggerContainer, StaggerItem, SubtleHoverCard } from "@/components/MotionWrappers";

export default function AlokSanghPage() {
  const [cmsPage, setCmsPage] = useState(null);

  useEffect(() => {
    fetch("/api/pages/aloksangh")
      .then((r) => r.json())
      .then((d) => {
        if (d?.page) {
          setCmsPage(d.page);
        } else {
          // Fallback to mahasabha slug if not migrated yet
          fetch("/api/pages/mahasabha")
            .then((r2) => r2.json())
            .then((d2) => {
              if (d2?.page) setCmsPage(d2.page);
            })
            .catch(() => {});
        }
      })
      .catch(console.error);
  }, []);

  const fallbackResolutions = [
    {
      year: "राष्ट्रीय अधिवेशन संकल्प 2026",
      title: "अखिल भारतीय समाज डायरेक्टरी एवं प्रतिभा सम्मान मिशन",
      detail: "देशभर के सभी अधिकारियों, कर्मचारियों, प्रबुद्धजनों एवं युवाओं को एकीकृत डायरेक्टरी से जोड़ना तथा सिविल सेवा व उच्च शिक्षा में उत्कृष्ट छात्र-छात्राओं को विशेष मार्गदर्शन व प्रोत्साहन प्रदान करना।",
    },
    {
      year: "सामाजिक सुधार संकल्प",
      title: "दहेज, मृत्युभोज एवं फिजूलखर्ची उन्मूलन अभियान",
      detail: "वैवाहिक समारोहों में फिजूलखर्ची, दहेज प्रथा व मृत्युभोज जैसी कुरीतियों को समाप्त करने हेतु जनजागरूकता तथा आदर्श सामूहिक विवाह सम्मेलनों को पूर्ण सहयोग।",
    },
    {
      year: "शैक्षणिक एवं छात्रावास संकल्प",
      title: "दिल्ली एवं राज्य राजधानियों में आधुनिक छात्र छात्रावास",
      detail: "उच्च शिक्षा एवं संघ लोक सेवा आयोग (UPSC) सहित प्रतियोगी परीक्षाओं की तैयारी कर रहे समाज के मेधावी छात्र-छात्राओं हेतु दिल्ली एवं प्रांतीय राजधानियों में सुरक्षित व सुसज्जित छात्रावासों की स्थापना।",
    },
    {
      year: "संगठन एवं सदस्यता विधान",
      title: "आलोक संघ सदस्यता श्रेणियां एवं कर्तव्य",
      detail: "संस्थापक सदस्यता: ₹31,000/- | आजीवन सदस्यता: ₹1,100/- | वार्षिक सदस्यता: ₹100/-। प्रत्येक सदस्य समाज उत्थान, स्वास्थ्य शिविरों एवं निःशुल्क विधिक परामर्श शिविरों में सक्रिय योगदान हेतु संकल्पित है।",
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
                  केंद्रीय नेतृत्व एवं संगठन विधान
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                  {cmsPage?.title || "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)"}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  {cmsPage?.subtitle || "देशभर के समस्त अधिकारी, कर्मचारी, प्रबुद्धजन और समाजसेवियों को संगठित करने वाला राष्ट्रीय शीर्ष संगठन।"}
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
                    आलोक संघ का विजन एवं रणनीतिक उद्देश्य
                  </h2>
                  <p className="pl-2">
                    अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) देशभर के समस्त लोधी, लोधा, लोध समाज के सरकारी, अर्द्ध-सरकारी एवं निजी क्षेत्रों में कार्यरत अधिकारियों, कर्मचारियों और प्रबुद्धजनों का राष्ट्रीय संगठन है। इसका मुख्य उद्देश्य समाज के प्रत्येक वर्ग का सर्वांगीण उत्थान, शैक्षणिक मार्गदर्शन, प्रशासनिक सेवाओं में सहभागिता तथा सामाजिक कुरीतियों का उन्मूलन करना है।
                  </p>

                  <h2 className="text-base font-bold text-[#102F6B] pt-3 border-l-3 border-[#F26A21] pl-2">
                    प्रमुख राष्ट्रीय संकल्प एवं कार्ययोजना
                  </h2>
                  <StaggerContainer className="space-y-3 pt-1" staggerDelay={0.06}>
                    {fallbackResolutions.map((r, i) => (
                      <StaggerItem key={i}>
                        <SubtleHoverCard>
                          <div className="p-3.5 sm:p-4 rounded-md bg-[#FAF8F5] border border-[#F0E5D5] space-y-1">
                            <span className="text-[10px] font-bold uppercase text-[#F26A21] tracking-wider block">
                              {r.year}
                            </span>
                            <h3 className="text-xs sm:text-sm font-bold text-[#102F6B]">
                              {r.title}
                            </h3>
                            <p className="text-xs text-[#55657E] leading-relaxed pt-0.5">
                              {r.detail}
                            </p>
                          </div>
                        </SubtleHoverCard>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  <div className="mt-4 p-4 rounded-md bg-[#FFF0E2]/40 border border-[#F26A21]/20 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#102F6B]">
                      आलोक संघ सदस्यता एवं सहयोग
                    </h4>
                    <p className="text-xs text-[#55657E] leading-relaxed">
                      आलोक संघ का प्रत्येक सदस्य समाज सेवा, शिक्षा संवर्धन, प्रशासनिक मार्गदर्शन एवं जरूरतमंद छात्र-छात्राओं को सहयोग देने के लिए प्रतिबद्ध है। डायरेक्टरी से जुड़कर आप भी इस राष्ट्रीय अभियान का हिस्सा बन सकते हैं।
                    </p>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
