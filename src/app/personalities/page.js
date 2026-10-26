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
  InteractiveTap,
} from "@/components/MotionWrappers";

// Authentic historical icons verified against project archives
const defaultList = [
  {
    _id: "p1",
    name: "वीरांगना रानी अवंतीबाई लोधी",
    title: "प्रथम स्वतंत्रता संग्राम 1857 की अमर महानायिका",
    era: "1831 - 1858",
    photo: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924146/alokworld/personalities/rani_avanti_bai.png",
    region: "रामगढ़ रियासत, मंडला (मध्य प्रदेश)",
    achievement: "1857 के प्रथम स्वाधीनता संग्राम में ब्रिटिश हुकूमत के विरुद्ध 4,000 सैनिकों का साहसी नेतृत्व",
    summary: "रामगढ़ की महारानी जिन्होंने 1857 के प्रथम स्वतंत्रता संग्राम में ब्रिटिश हुकूमत के विरुद्ध अद्वितीय शौर्य और पराक्रम का परिचय देते हुए मातृभूमि की रक्षा हेतु अपने प्राणों की आहुति दी।",
    biography: "<p>वीरांगना महारानी अवंतीबाई लोधी (16 अगस्त 1831 – 20 मार्च 1858) भारत के प्रथम स्वतंत्रता संग्राम (1857) की अप्रतिम वीरांगना थीं। रामगढ़ रियासत के राजा विक्रमादित्य सिंह की अस्वस्थता के उपरांत महारानी ने स्वयं राज्य की बागडोर संभाली। जब ईस्ट इंडिया कंपनी ने 'हड़प नीति' (Doctrine of Lapse) के तहत रामगढ़ को अपने नियंत्रण में लेने का प्रयास किया, तब रानी ने ब्रिटिश हुकूमत के आदेश को सिरे से खारिज कर दिया।</p><p class='mt-2'>सन् 1857 के महासंग्राम में रानी अवंतीबाई ने मंडला, डिंडौरी एवं आसपास के राजाओं व सरदारों का एक विशाल क्रांतिकारी संघ बनाया। 4,000 वीर सैनिकों के साथ खैरी के मैदान में रानी ने ब्रिटिश डिप्टी कमिश्नर वाडिंगटन की सेना को धूल चटा दी और रामगढ़ को स्वतंत्र घोषित कर दिया। बाद में रीवा रियासत व अंग्रेजों की भारी संयुक्त सेना ने जब उन्हें चारों ओर से घेर लिया, तब उन्होंने अंग्रेजों की अधीनता स्वीकार करने के स्थान पर अपनी ही कटार से मातृभूमि की बलिवेदी पर सर्वोच्च बलिदान देकर इतिहास में अमरता प्राप्त की।</p>",
  },
  {
    _id: "p2",
    name: "अमर शहीद गुलाब सिंह लोधी",
    title: "अमीनाबाद लखनऊ झंडा सत्याग्रह के अमर बलिदानी",
    era: "1903 - 1935",
    photo: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924147/alokworld/personalities/shaheed_gulab_singh.png",
    region: "फतेहपुर चौरासी, उन्नाव (उत्तर प्रदेश)",
    achievement: "ब्रिटिश पुलिस की भीषण गोलीबारी के मध्य अमीनाबाद पार्क में राष्ट्रीय तिरंगा फहराकर सर्वोच्च बलिदान",
    summary: "अमीनाबाद पार्क (लखनऊ) में 23 अगस्त 1935 को ब्रिटिश पुलिस की गोलियों की परवाह न करते हुए विशाल जनसभा के मध्य राष्ट्रीय तिरंगा फहराने वाले अदम्य साहसी अमर बलिदानी।",
    biography: "<p>अमर बलिदानी गुलाब सिंह लोधी का जन्म सन् 1903 में उत्तर प्रदेश के उन्नाव जनपद अंतर्गत फतेहपुर चौरासी के ग्राम चंदेहिका में हुआ था। युवावस्था में ही वे महात्मा गांधी के आह्वान पर स्वाधीनता आंदोलन में कूद पड़े। उन्होंने नमक सत्याग्रह और सविनय अवज्ञा आंदोलन में बढ़-चढ़कर भाग लिया और कई बार ब्रिटिश कारागार में यातनाएं सहीं।</p><p class='mt-2'>23 अगस्त 1935 को लखनऊ के अमीनाबाद पार्क (वर्तमान झंडेवाला पार्क) में राष्ट्रीय तिरंगा फहराने का ऐतिहासिक संकल्प लिया गया। ब्रिटिश हुकूमत ने पूरे लखनऊ में कर्फ्यू लगा रखा था और पार्क को हथियारबंद पुलिस छावनी में तब्दील कर दिया था। भारी पुलिस घेराबंदी और लाठियों-गोलियों की परवाह न करते हुए गुलाब सिंह लोधी चुपचाप पार्क में विशाल बरगद के पेड़ पर चढ़ गए और जैसे ही उन्होंने भारत माता की जय के नारों के बीच तिरंगा फहराया, ब्रिटिश पुलिस अधिकारी ने सीधे उन पर गोलियां दाग दीं। सीने पर गोलियां खाकर भी उन्होंने तिरंगे को नीचे नहीं गिरने दिया और देश के लिए हंसते-हंसते वीरगति को प्राप्त हुए।</p>",
  },
  {
    _id: "p3",
    name: "स्वामी ब्रह्मानंद जी महाराज",
    title: "शिक्षा क्रांति के अग्रदूत, महान समाज सुधारक एवं पूर्व सांसद",
    era: "1894 - 1984",
    photo: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924148/alokworld/personalities/swami_brahmanand.png",
    region: "राठ, हमीरपुर (बुंदेलखंड, उत्तर प्रदेश)",
    achievement: "बुंदेलखंड में दर्जनों डिग्री कॉलेजों, संस्कृत विद्यालयों एवं गुरुकुलों की स्थापना तथा संसद में जनहित के मुखर स्वर",
    summary: "बुंदेलखंड की धरती पर शिक्षा की अलख जगाने वाले महान संत व हमीरपुर से लोकसभा सांसद, जिन्होंने निर्धन व उपेक्षित समाज के उत्थान हेतु दर्जनों गुरुकुल, स्कूल व महाविद्यालय स्थापित किए।",
    biography: "<p>स्वामी ब्रह्मानंद जी महाराज (4 दिसंबर 1894 – 13 सितंबर 1984) एक अद्वितीय संन्यासी, स्वतंत्रता संग्राम सेनानी, शिक्षा प्रवर्तक एवं हमीरपुर से लगातार दो बार (1967 एवं 1971) लोकसभा सांसद रहे। सन्यास धारण करने के बाद उन्होंने समाज के सबसे पिछड़े, निर्धन और वंचित तबकों को ज्ञान और शिक्षा से सशक्त करने का महासंकल्प लिया।</p><p class='mt-2'>उन्होंने राठ (हमीरपुर) में 1938 में ब्रह्मानंद विद्यालय, ब्रह्मानंद संस्कृत महाविद्यालय तथा विशाल ब्रह्मानंद डिग्री कॉलेज की स्थापना की, जिसने पूरे बुंदेलखंड में आधुनिक उच्च शिक्षा की नींव रखी। वे एकमात्र ऐसे संन्यासी सांसद थे जिन्होंने संसद में सदैव किसानों, मजदूरों, शिक्षा और सामाजिक समरसता के पक्ष में ऐतिहासिक भाषण दिए। उनकी सादगी, निष्काम कर्मयोग और जनसेवा आज भी करोड़ों लोगों के लिए प्रेरणादायी है।</p>",
  },
  {
    _id: "p4",
    name: "राजा हिरदेशाह लोधी",
    title: "1842 के ऐतिहासिक बुंदेला विद्रोह के महानायक",
    era: "1806 - 1852",
    photo: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924145/alokworld/personalities/raja_hridayshah.png",
    region: "हीरापुर रियासत, नरसिंहपुर (मध्य प्रदेश)",
    achievement: "1857 से 15 वर्ष पूर्व 1842 में ईस्ट इंडिया कंपनी के विरुद्ध सशस्त्र जनक्रांति का सफल नेतृत्व",
    summary: "हीरापुर के वीर शासक जिन्होंने ईस्ट इंडिया कंपनी की दमनकारी नीतियों के विरुद्ध 1842 में महाविद्रोह का नेतृत्व कर नरसिंहपुर, दमोह व सागर क्षेत्र को ब्रिटिश दासता से मुक्त कराया था।",
    biography: "<p>हीरापुर (नरसिंहपुर, मध्य प्रदेश) के पराक्रमी शासक राजा हिरदेशाह लोधी ने 1857 के प्रथम स्वतंत्रता संग्राम से पूरे 15 वर्ष पूर्व, सन् 1842 में ईस्ट इंडिया कंपनी के अन्यायपूर्ण भू-राजस्व और दमनकारी कानूनों के विरुद्ध मध्य भारत के ऐतिहासिक 'बुंदेला विद्रोह' का नेतृत्व किया था।</p><p class='mt-2'>राजा हिरदेशाह ने मधुकर शाह (नरहट), जवाहर सिंह एवं अन्य बुंदेला व गोंड सरदारों के साथ मिलकर जबलपुर, सागर, दमोह और नरसिंहपुर की ब्रिटिश छावनियों को ध्वस्त कर दिया और महीनों तक पूरे क्षेत्र को ब्रिटिश हुकूमत से स्वतंत्र रखा। ब्रिटिश इतिहासकारों ने भी उनके अदम्य साहस, छापामार युद्ध कौशल और जनप्रिय नेतृत्व की भूरि-भूरि प्रशंसा की है।</p>",
  },
];

// Historical Milestones
const historicalMilestones = [
  {
    year: "1842",
    title: "बुंदेला सशस्त्र विद्रोह",
    leader: "राजा हिरदेशाह लोधी",
    desc: "ईस्ट इंडिया कंपनी की साम्राज्यवादी नीतियों के विरुद्ध मध्य भारत में प्रथम संगठित सशस्त्र जनक्रांति।",
  },
  {
    year: "1857",
    title: "प्रथम स्वाधीनता संग्राम",
    leader: "वीरांगना रानी अवंतीबाई लोधी",
    desc: "रामगढ़ रियासत की रक्षा एवं ब्रिटिश सेनाओं के छक्के छुड़ाते हुए रणभूमि में अमर आत्मबलिदान।",
  },
  {
    year: "1935",
    title: "अमीनाबाद झंडा सत्याग्रह",
    leader: "अमर शहीद गुलाब सिंह लोधी",
    desc: "लखनऊ में भारी पुलिस घेराबंदी को चीरते हुए तिरंगा फहराकर भारत माता के चरणों में शहादत।",
  },
  {
    year: "1984",
    title: "शिक्षा क्रांति एवं समाज सुधार",
    leader: "स्वामी ब्रह्मानंद जी महाराज",
    desc: "बुंदेलखंड में दर्जनों शिक्षण संस्थानों की स्थापना कर अज्ञानता के अंधकार को मिटाने का महायज्ञ।",
  },
];

export default function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState(defaultList);
  const [loading, setLoading] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState(null);

  useEffect(() => {
    fetch("/api/personalities")
      .then((res) => res.json())
      .then((data) => {
        if (data?.personalities && data.personalities.length > 0) {
          // Merge API data with default details (like region & achievement)
          const merged = data.personalities.map((item, idx) => {
            const def = defaultList[idx] || {};
            return {
              ...def,
              ...item,
              photo: item.photo || def.photo,
              biography: item.biography || def.biography,
              region: item.region || def.region,
              achievement: item.achievement || def.achievement,
            };
          });
          setPersonalities(merged);
        }
      })
      .catch((err) => {
        console.error("Personalities fetch error, using default verified data:", err);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            {/* Page Header */}
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

            {/* Complete Grid of Historical Icons */}
            <div className="space-y-3">
              <SectionHeadingReveal>
                <div className="flex items-center justify-between pb-1 border-b border-[#F0E5D5]">
                  <h2 className="text-sm font-bold text-[#102F6B]">
                    समस्त ऐतिहासिक विभूतियां ({personalities.length})
                  </h2>
                  <span className="text-[11px] text-[#64748B]">
                    सत्यापित ऐतिहासिक विवरण
                  </span>
                </div>
              </SectionHeadingReveal>

              <StaggerContainer
                key={`pers-grid-${personalities.length}`}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                staggerDelay={0.07}
              >
                {personalities.map((item) => (
                  <StaggerItem key={item._id || item.name} className="h-full">
                    <SubtleHoverCard className="h-full">
                      <div className="bg-white rounded-lg border border-[#F0E5D5] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#102F6B] transition-all flex flex-col justify-between h-full group">
                        <div>
                          {/* Top row: Avatar & Basic Info */}
                          <div className="flex items-center gap-3 mb-3">
                            {item.photo ? (
                              <img
                                src={item.photo}
                                alt={item.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-[#F26A21] shadow-xs shrink-0 bg-[#FFFCF5] group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  const fallback = e.currentTarget.parentElement?.querySelector(".pers-fallback");
                                  if (fallback) fallback.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`pers-fallback w-14 h-14 rounded-full bg-[#102F6B] text-white ${item.photo ? "hidden" : "flex"} items-center justify-center font-bold text-lg shrink-0 border-2 border-[#F26A21] shadow-xs`}
                            >
                              {item.name ? item.name.charAt(0) : "P"}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm sm:text-base font-bold text-[#102F6B] leading-tight truncate">
                                {item.name}
                              </h3>
                              <span className="text-[11px] font-semibold text-[#F26A21] block mt-0.5 line-clamp-1">
                                {item.title}
                              </span>
                              {item.era && (
                                <span className="inline-block text-[10px] text-[#64748B] font-mono bg-[#FFFCF5] px-1.5 py-0.2 rounded border border-[#F0E5D5] mt-1">
                                  {item.era}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Region tag if present */}
                          {item.region && (
                            <div className="text-[11px] text-[#102F6B] font-medium bg-[#FFFCF5] px-2 py-1 rounded border border-[#F0E5D5] mb-2.5 flex items-center gap-1.5">
                              <span className="text-[#F26A21] text-xs">📍</span>
                              <span className="truncate">{item.region}</span>
                            </div>
                          )}

                          {/* Summary text */}
                          <p className="text-xs text-[#64748B] leading-relaxed pt-2 border-t border-[#F0E5D5]">
                            {item.summary}
                          </p>
                        </div>

                        {/* Action: Open full biography modal */}
                        <div className="pt-3 mt-3 border-t border-[#F0E5D5] flex items-center justify-between">
                          <span className="text-[10px] text-[#64748B]">
                            इतिहास एवं जीवनी
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedPersonality(item)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#102F6B] hover:text-[#F26A21] transition-colors cursor-pointer group-hover:translate-x-0.5"
                          >
                            जीवन परिचय पढ़ें →
                          </button>
                        </div>
                      </div>
                    </SubtleHoverCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* Historical Timeline & National Contribution Section */}
            <FadeIn direction="up" distance={14} duration={0.5}>
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="border-b border-[#F0E5D5] pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5]">
                    ऐतिहासिक कालक्रम
                  </span>
                  <h3 className="text-base font-bold text-[#102F6B] mt-1.5">
                    राष्ट्र निर्माण एवं स्वाधीनता संग्राम में ऐतिहासिक उपलब्धियां
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    1842 से 1984 तक समाज के महान नायकों के अमर बलिदान और सामाजिक नवजागरण का कालक्रम
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {historicalMilestones.map((m) => (
                    <div
                      key={m.year}
                      className="bg-[#FFFCF5] p-3.5 rounded-lg border border-[#F0E5D5] hover:border-[#F26A21] transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-[#F26A21] bg-white px-2 py-0.5 rounded border border-[#F0E5D5]">
                          {m.year}
                        </span>
                        <h4 className="text-xs font-bold text-[#102F6B]">
                          {m.title}
                        </h4>
                      </div>
                      <div className="text-[11px] font-semibold text-[#263449] mb-1">
                        {m.leader}
                      </div>
                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Cultural Quote Banner */}
                <div className="bg-gradient-to-r from-[#102F6B] to-[#1a3d82] text-white p-4 rounded-lg mt-3 shadow-xs">
                  <p className="text-xs sm:text-sm font-medium leading-relaxed italic text-center">
                    &ldquo;हमारे अमर महापुरुषों और वीरांगनाओं का शौर्य, त्याग और शिक्षा क्रांति संपूर्ण राष्ट्र व समाज के लिए शाश्वत प्रेरणा का प्रकाशपुंज है।&rdquo;
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Sidebar */}
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

      {/* Biography Detail Modal */}
      {selectedPersonality && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPersonality(null)}
        >
          <div
            className="bg-white rounded-xl border border-[#F0E5D5] max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPersonality(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#FFFCF5] border border-[#F0E5D5] text-[#102F6B] hover:bg-[#102F6B] hover:text-white transition-colors flex items-center justify-center text-sm font-bold cursor-pointer"
              aria-label="बंद करें"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-4 pb-3 border-b border-[#F0E5D5] pr-8">
              {selectedPersonality.photo ? (
                <img
                  src={selectedPersonality.photo}
                  alt={selectedPersonality.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#F26A21] shadow-xs shrink-0 bg-[#FFFCF5]"
                />
              ) : null}
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#102F6B]">
                  {selectedPersonality.name}
                </h3>
                <span className="text-xs font-semibold text-[#F26A21] block">
                  {selectedPersonality.title}
                </span>
                {selectedPersonality.era && (
                  <span className="inline-block text-[10px] text-[#64748B] font-mono bg-[#FFFCF5] px-1.5 py-0.2 rounded border border-[#F0E5D5] mt-1">
                    कालखंड: {selectedPersonality.era}
                  </span>
                )}
              </div>
            </div>

            {/* Region / Achievement Badges */}
            <div className="space-y-1.5 mb-4 bg-[#FFFCF5] p-3 rounded-lg border border-[#F0E5D5] text-xs">
              {selectedPersonality.region && (
                <div className="flex items-start gap-2">
                  <span className="text-[#F26A21] font-bold shrink-0">📍 कार्यक्षेत्र:</span>
                  <span className="text-[#263449]">{selectedPersonality.region}</span>
                </div>
              )}
              {selectedPersonality.achievement && (
                <div className="flex items-start gap-2">
                  <span className="text-[#F26A21] font-bold shrink-0">🎖️ मुख्य योगदान:</span>
                  <span className="text-[#263449]">{selectedPersonality.achievement}</span>
                </div>
              )}
            </div>

            {/* Full Biography Body */}
            <div className="text-xs sm:text-sm text-[#263449] leading-relaxed space-y-2 border-t border-[#F0E5D5] pt-3">
              <h4 className="font-bold text-[#102F6B] text-xs uppercase tracking-wider mb-2">
                विस्तृत ऐतिहासिक जीवन परिचय
              </h4>
              {selectedPersonality.biography ? (
                <div
                  className="space-y-2"
                  dangerouslySetInnerHTML={{ __html: selectedPersonality.biography }}
                />
              ) : (
                <p>{selectedPersonality.summary}</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-3 border-t border-[#F0E5D5] flex justify-end">
              <InteractiveTap>
                <button
                  type="button"
                  onClick={() => setSelectedPersonality(null)}
                  className="px-4 py-1.5 rounded bg-[#102F6B] text-white text-xs font-bold hover:bg-[#F26A21] transition-colors cursor-pointer"
                >
                  बंद करें
                </button>
              </InteractiveTap>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
