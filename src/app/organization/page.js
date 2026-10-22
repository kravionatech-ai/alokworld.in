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
                  सांगठनिक संरचना एवं कार्यकारिणी
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                  {cmsPage?.title || "अखिल भारतीय आलोक संघ सांगठनिक ढांचा एवं समितियां"}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  {cmsPage?.subtitle || "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ की राष्ट्रीय कार्यकारिणी, सलाहकार समिति एवं विशिष्ट प्रकोष्ठ।"}
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
                            सक्रिय प्रकोष्ठ
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

            {/* Official PDF Constitution & Objectives Section */}
            <FadeIn direction="up" distance={14} duration={0.5} className="mt-6">
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs space-y-5">
                <div className="border-b border-[#F0E5D5] pb-3">
                  <span className="text-[11px] font-bold text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                    आधिकारिक विधान एवं नियमावली (स्त्रोत: अधिकारी परिचय प्रपत्र)
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-[#102F6B] mt-2">
                    संघ की वैधानिक संरचना, उद्देश्य एवं सदस्यता नियम
                  </h2>
                  <p className="text-xs text-[#64748B] mt-1">
                    अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) के आधिकारिक परिचय प्रपत्र अनुसार अधिकृत संगठनात्मक प्रावधान।
                  </p>
                </div>

                {/* Key Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Scope & HQ */}
                  <div className="p-4 rounded-lg bg-[#FFFCF5] border border-[#F0E5D5] space-y-2">
                    <h3 className="font-bold text-xs sm:text-sm text-[#102F6B] flex items-center gap-1.5">
                      <span>🏛️</span>
                      <span>कार्यक्षेत्र एवं मुख्यालय</span>
                    </h3>
                    <ul className="text-xs text-[#64748B] space-y-1 leading-relaxed list-disc pl-4">
                      <li><strong>कार्यक्षेत्र:</strong> संघ का कार्यक्षेत्र संपूर्ण भारत होगा।</li>
                      <li><strong>राष्ट्रीय मुख्यालय:</strong> राष्ट्रीय मुख्यालय नई दिल्ली में स्थित होगा।</li>
                      <li><strong>प्रांतीय व जिला मुख्यालय:</strong> संबंधित राज्य की राजधानी एवं जिला मुख्यालय में स्थापित होगा।</li>
                    </ul>
                  </div>

                  {/* Membership & Fees */}
                  <div className="p-4 rounded-lg bg-[#FFFCF5] border border-[#F0E5D5] space-y-2">
                    <h3 className="font-bold text-xs sm:text-sm text-[#102F6B] flex items-center gap-1.5">
                      <span>💳</span>
                      <span>सदस्यता श्रेणियां एवं शुल्क</span>
                    </h3>
                    <ul className="text-xs text-[#64748B] space-y-1 leading-relaxed list-disc pl-4">
                      <li><strong className="text-[#102F6B]">संस्थापक सदस्य:</strong> ₹31,000/- (परामर्शदात्री समिति सदस्य)</li>
                      <li><strong className="text-[#102F6B]">आजीवन सदस्य:</strong> ₹1,100/- (आजीवन सक्रिय सदस्यता)</li>
                      <li><strong className="text-[#102F6B]">वार्षिक सदस्य:</strong> ₹100/- (वार्षिक नवीनीकरण)</li>
                      <li className="text-[11px] text-[#F26A21]">पात्रता: केंद्र/राज्य सरकार, उपक्रमों एवं अर्ध-सरकारी संस्थानों के सेवारत व सेवानिवृत्त बंधु।</li>
                    </ul>
                  </div>

                  {/* Broad Objectives */}
                  <div className="p-4 rounded-lg bg-[#FFFCF5] border border-[#F0E5D5] space-y-2">
                    <h3 className="font-bold text-xs sm:text-sm text-[#102F6B] flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>प्रमुख ध्येय एवं संकल्प</span>
                    </h3>
                    <ul className="text-xs text-[#64748B] space-y-1 leading-relaxed list-disc pl-4">
                      <li>अधिकारियों एवं कर्मचारियों के संवैधानिक व मौलिक अधिकारों की रक्षा करना।</li>
                      <li>दिल्ली एवं राज्यों की राजधानियों में उच्च शिक्षा व प्रतियोगी परीक्षा हेतु छात्रावास (हॉस्टल) स्थापित करना।</li>
                      <li>समाज की प्रतिभाओं को खोजना, मार्गदर्शन देना और राष्ट्रीय पुरस्कारों से सम्मानित करना।</li>
                      <li>रूढ़ियों, अंधविश्वास, दहेज, मृत्युभोज का उन्मूलन कर बालिका/महिला शिक्षा को शत-प्रतिशत बढ़ावा देना।</li>
                    </ul>
                  </div>

                  {/* Tenures & Elections */}
                  <div className="p-4 rounded-lg bg-[#FFFCF5] border border-[#F0E5D5] space-y-2">
                    <h3 className="font-bold text-xs sm:text-sm text-[#102F6B] flex items-center gap-1.5">
                      <span>⚖️</span>
                      <span>कार्यकाल एवं निर्वाचन प्रणाली</span>
                    </h3>
                    <ul className="text-xs text-[#64748B] space-y-1 leading-relaxed list-disc pl-4">
                      <li><strong>कार्यकारिणी कार्यकाल:</strong> 02 (दो) वर्ष। निर्वाचन से दो वर्ष पूर्ण होने पर कार्यकाल स्वतः समाप्त।</li>
                      <li><strong>मार्गदर्शक व संयोजक कार्यकाल:</strong> परामर्शदात्री समिति द्वारा 03 (तीन) वर्ष हेतु मनोनयन।</li>
                      <li><strong>निर्वाचन:</strong> वार्षिक अधिवेशन में उपस्थित सदस्यों द्वारा लोकतांत्रिक पद्धति से निर्वाचन।</li>
                    </ul>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Official State Executive Document Showcase */}
            <FadeIn direction="up" distance={14} duration={0.5} className="mt-6">
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-6 shadow-xs space-y-3">
                <div className="border-b border-[#F0E5D5] pb-2">
                  <span className="text-[11px] font-bold text-[#F26A21] bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5]">
                    आधिकारिक प्रांतीय प्रपत्र
                  </span>
                  <h2 className="text-base font-bold text-[#102F6B] mt-1.5">
                    उत्तर प्रदेश प्रांतीय कार्यकारिणी आधिकारिक विवरण तालिका
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी (आलोक) संघ उत्तर प्रदेश कार्यकारिणी पदाधिकारी एवं संपर्क सूची।
                  </p>
                </div>
                <div className="rounded-lg overflow-hidden border border-[#E9E2D8] bg-[#FFFCF5] p-2 flex items-center justify-center">
                  <img
                    src="/asset/listofmemberswithdesignation/alok up.jpeg"
                    alt="अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ उत्तर प्रदेश कार्यकारिणी आधिकारिक विवरण"
                    className="w-full h-auto max-h-[600px] object-contain rounded drop-shadow-xs"
                    loading="lazy"
                  />
                </div>
              </div>
            </FadeIn>
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
