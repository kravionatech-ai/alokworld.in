"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { FadeIn } from "@/components/MotionWrappers";

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
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <FadeIn as="article" direction="up" distance={14} duration={0.5} className="lg:col-span-8 bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-[#F0E5D5] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                विरासत एवं इतिहास
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                {cmsPage?.title || "समाज का गौरवशाली इतिहास एवं अमर विरासत"}
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                {cmsPage?.subtitle || "त्याग, राष्ट्रभक्ति, शौर्य और समाज सेवा की प्रेरणादायी अमर गाथा।"}
              </p>
            </div>

            {/* Authentic Heritage Medallion Banner */}
            <div className="w-full rounded-lg overflow-hidden border border-[#E9E2D8] bg-[#FFFCF5] p-2 shadow-xs">
              <img
                src="/asset/1002458487.jpg"
                alt="अखिल भारतीय समाज महापुरुष एवं राष्ट्रीय प्रतीक — लोधेश्वर भगवान, वीरांगना अवंतीबाई, स्वामी ब्रह्मानंद, स्वामी केशवानंद, राजा हिरदेशाह एवं शहीद गुलाब सिंह"
                className="w-full h-auto object-contain rounded drop-shadow-2xs"
              />
            </div>

            {cmsPage?.content ? (
              <div
                className="cms-prose text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: cmsPage.content }}
              />
            ) : (
              <div className="text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4">
                <p className="font-medium text-[#102F6B] text-sm sm:text-base leading-relaxed bg-[#FFFCF5] p-4 rounded-lg border border-[#F0E5D5]">
                  हमारे समाज की ऐतिहासिक यात्रा त्याग, समर्पण, शौर्य और अटूट राष्ट्रभक्ति से परिपूर्ण है। हमारे पूर्वजों ने सांस्कृतिक विरासत के संरक्षण, कृषि समृद्धि के विस्तार तथा भारत के स्वतंत्रता संग्राम में निर्णायक व अतुलनीय योगदान दिया है।
                </p>

                <h2 className="text-base font-bold text-[#102F6B] pt-2 border-b border-[#F0E5D5] pb-1">
                  १. ऐतिहासिक पृष्ठभूमि एवं प्राचीन गौरव
                </h2>
                <p>
                  ऐतिहासिक स्रोतों और धार्मिक ग्रंथों में लोधी, लोधा समाज का उल्लेख अत्यंत स्वाभिमानी, पुरुषार्थी और धर्मनिष्ठ समुदाय के रूप में मिलता है। भगवान लोधेश्वर महादेव के पावन सानिध्य से लेकर मध्यकालीन कालखंड तक समाज के नायकों ने सदा सत्य, धर्म और प्रजा के अधिकारों की रक्षा हेतु अपने प्राणों की बाजी लगाई।
                </p>

                <h2 className="text-base font-bold text-[#102F6B] pt-2 border-b border-[#F0E5D5] pb-1">
                  २. भारत के स्वतंत्रता संग्राम में अमर योगदान
                </h2>
                <p>
                  सन् 1842 के ऐतिहासिक बुंदेला महाविद्रोह में <strong>राजा हिरदेशाह लोधी (हीरापुर)</strong> ने ईस्ट इंडिया कंपनी की सेनाओं के छक्के छुड़ा दिए थे। सन् 1857 के प्रथम स्वतंत्रता संग्राम में <strong>वीरांगना महारानी अवंतीबाई लोधी (रामगढ़)</strong> ने रणचंडी का रूप धरकर अंग्रेजों की विशाल सेना को पराजित किया और आत्मबलिदान देकर इतिहास में अमर हो गईं। स्वतंत्रता आंदोलन में <strong>अमर शहीद गुलाब सिंह लोधी</strong> ने 23 अगस्त 1935 को लखनऊ के अमीनाबाद पार्क में ब्रिटिश गोलियों के सामने सीना तानकर तिरंगा फहराया और शहादत प्राप्त की।
                </p>

                <h2 className="text-base font-bold text-[#102F6B] pt-2 border-b border-[#F0E5D5] pb-1">
                  ३. आधुनिक सामाजिक एवं शैक्षणिक पुनर्जागरण
                </h2>
                <p>
                  स्वतंत्रता के पश्चात समाज के महान संत, स्वतंत्रता सेनानी एवं पूर्व सांसद <strong>स्वामी ब्रह्मानंद जी महाराज</strong> ने संपूर्ण बुंदेलखंड और उत्तर भारत में शिक्षा की क्रांति का सूत्रपात किया। उन्होंने दर्जनों विद्यालय, महाविद्यालय एवं छात्रावास स्थापित कर निर्धन व ग्रामीण समाज को शिक्षा का प्रकाश दिया। आज समाज के प्रतिभावान युवक-युवतियां सिविल सेवा (आईएएस, आईपीएस, पीसीएस), चिकित्सा, इंजीनियरिंग, न्यायपालिका, व्यापार एवं राजनीति में राष्ट्र निर्माण में अग्रणी भूमिका निभा रहे हैं।
                </p>

                <div className="p-4 bg-[#FFFCF5] rounded-lg border border-[#F0E5D5] mt-5">
                  <h3 className="font-bold text-[#102F6B] text-xs uppercase tracking-wider mb-2 border-l-3 border-[#F26A21] pl-2">
                    समाज के मूलभूत आदर्श एवं संकल्प
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#263449]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F26A21]"></span>
                      सत्य, निष्ठा एवं सामाजिक समरसता
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F26A21]"></span>
                      उच्च शिक्षा एवं आधुनिक विज्ञान को प्राथमिकता
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F26A21]"></span>
                      बंधुत्व, परस्पर सहयोग एवं राष्ट्र सेवा
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F26A21]"></span>
                      महिला सशक्तीकरण एवं सामाजिक कुरीतियों का उन्मूलन
                    </li>
                  </ul>
                </div>
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
