"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import PersonalitiesCarousel from "@/components/PersonalitiesCarousel";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  SectionHeadingReveal,
  SubtleHoverCard,
} from "@/components/MotionWrappers";

export default function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default historical icons verified against project archives
  const defaultList = [
    {
      _id: "p1",
      name: "वीरांगना रानी अवंतीबाई लोधी",
      title: "प्रथम स्वतंत्रता संग्राम 1857 की अमर वीरांगना",
      era: "1831 - 1858",
      photo: "/asset/personalities/rani_avanti_bai.png",
      summary: "रामगढ़ की महारानी जिन्होंने 1857 के प्रथम स्वतंत्रता संग्राम में ब्रिटिश हुकूमत के विरुद्ध अद्वितीय शौर्य और पराक्रम का परिचय देते हुए मातृभूमि की रक्षा हेतु अपने प्राणों की आहुति दी।",
    },
    {
      _id: "p2",
      name: "अमर शहीद गुलाब सिंह लोधी",
      title: "अमर स्वतंत्रता सेनानी एवं तिरंगा ध्वजवाहक",
      era: "1903 - 1935",
      photo: "/asset/personalities/shaheed_gulab_singh.png",
      summary: "अमीनाबाद पार्क (लखनऊ) में 23 अगस्त 1935 को ब्रिटिश पुलिस की गोलियों की परवाह न करते हुए विशाल जनसभा के मध्य राष्ट्रीय तिरंगा फहराने वाले अदम्य साहसी अमर बलिदानी।",
    },
    {
      _id: "p3",
      name: "स्वामी ब्रह्मानंद जी महाराज",
      title: "शिक्षा प्रवर्तक, महान समाज सुधारक एवं पूर्व सांसद",
      era: "1894 - 1984",
      photo: "/asset/personalities/swami_brahmanand.png",
      summary: "बुंदेलखंड की धरती पर शिक्षा की अलख जगाने वाले महान संत व हमीरपुर से लोकसभा सांसद, जिन्होंने निर्धन व उपेक्षित समाज के उत्थान हेतु दर्जनों गुरुकुल, स्कूल व महाविद्यालय स्थापित किए।",
    },
    {
      _id: "p4",
      name: "राजा हिरदेशाह लोधी",
      title: "1842 के ऐतिहासिक बुंदेला विद्रोह के महानायक",
      era: "1806 - 1852",
      photo: "/asset/personalities/raja_hridayshah.png",
      summary: "हीरापुर के वीर शासक जिन्होंने ईस्ट इंडिया कंपनी की दमनकारी नीतियों के विरुद्ध 1842 में महाविद्रोह का नेतृत्व कर नरसिंहपुर, दमोह व सागर क्षेत्र को ब्रिटिश दासता से मुक्त कराया था।",
    }
  ];

  useEffect(() => {
    fetch("/api/personalities")
      .then((res) => res.json())
      .then((data) => {
        if (data?.personalities && data.personalities.length > 0) {
          setPersonalities(data.personalities);
        } else {
          setPersonalities(defaultList);
        }
      })
      .catch(() => setPersonalities(defaultList))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            <FadeIn direction="up" distance={14} duration={0.5}>
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                  गौरवशाली महापुरुष एवं विभूतियां
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                  समाज के अमर ऐतिहासिक महापुरुष एवं राष्ट्र निर्माता
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  स्वतंत्रता संग्राम के अमर सेनानियों, समाज सुधारकों, दार्शनिकों एवं राष्ट्र निर्माताओं को सादर नमन।
                </p>
              </div>
            </FadeIn>

            {/* Featured Swiper Carousel */}
            {personalities.length > 0 && (
              <FadeIn direction="up" distance={16} duration={0.55}>
                <PersonalitiesCarousel personalities={personalities} />
              </FadeIn>
            )}

            {/* Complete Grid with Staggered Entrance */}
            <div className="space-y-3">
              <SectionHeadingReveal>
                <h2 className="text-sm font-bold text-[#102F6B] pb-1 border-b border-[#F0E5D5]">
                  समस्त ऐतिहासिक विभूतियां ({personalities.length})
                </h2>
              </SectionHeadingReveal>

              <StaggerContainer
                className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                staggerDelay={0.07}
              >
                {personalities.map((item) => (
                  <StaggerItem key={item._id} className="h-full">
                    <SubtleHoverCard className="h-full">
                      <div className="bg-white rounded-lg border border-[#F0E5D5] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#102F6B] transition-all flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            {item.photo ? (
                              <img
                                src={item.photo}
                                alt={item.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-[#F26A21] shadow-xs shrink-0 bg-white"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const fallback = e.currentTarget.parentElement?.querySelector('.pers-fallback');
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className={`pers-fallback w-14 h-14 rounded-full bg-[#102F6B] text-white ${item.photo ? 'hidden' : 'flex'} items-center justify-center font-bold text-lg shrink-0 border-2 border-[#F26A21] shadow-xs`}
                            >
                              {item.name ? item.name.charAt(0) : "P"}
                            </div>
                            <div>
                              <h3 className="text-sm sm:text-base font-bold text-[#102F6B] leading-tight">
                                {item.name}
                              </h3>
                              <span className="text-[11px] font-semibold text-[#F26A21] block mt-0.5">
                                {item.title}
                              </span>
                              {item.era && (
                                <span className="text-[10px] text-[#64748B] block font-mono">
                                  {item.era}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-[#64748B] leading-relaxed pt-2.5 border-t border-[#F0E5D5]">
                            {item.summary}
                          </p>
                        </div>
                      </div>
                    </SubtleHoverCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>

          <FadeIn
            as="div"
            direction="up"
            distance={14}
            duration={0.5}
            delay={0.1}
            className="lg:col-span-4"
          >
            <Sidebar />
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
}
