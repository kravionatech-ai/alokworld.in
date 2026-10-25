"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { FadeIn, StaggerContainer, StaggerItem, SubtleHoverCard } from "@/components/MotionWrappers";

export default function OrganizationPage() {
  const [cmsPage, setCmsPage] = useState(null);
  const [activeTab, setActiveTab] = useState("central"); // "central" | "state" | "bylaws" | "telangana"

  useEffect(() => {
    fetch("/api/pages/organization")
      .then((r) => r.json())
      .then((d) => {
        if (d?.page) setCmsPage(d.page);
      })
      .catch(console.error);
  }, []);

  // Verified authentic committees from Alok_India_National_Executive.xlsx and ALL INDIA_Alok_Designation_List_Hindi_.xlsx
  const centralCommittees = [
    {
      title: "1. राष्ट्रीय परामर्शदात्री समिति (National Advisory Council)",
      desc: "संघ की सर्वोच्च नीतिगत एवं मार्गदर्शक समिति। इसमें सभी वरिष्ठ मार्गदर्शक एवं संस्थापक शामिल हैं जो नीतियों के प्रभावी क्रियान्वयन हेतु दिशा-निर्देश प्रदान करते हैं।",
      lead: "अध्यक्ष: सर्वश्री वीरवल सिंह (मो. 9454412070, उ०प्र०) | संस्थापक संरक्षक मंडल",
      badge: "सर्वोच्च नीति समिति",
    },
    {
      title: "2. राष्ट्रीय संरक्षक मंडल (Council of National Patrons)",
      desc: "वरिष्ठ सेवानिवृत्त महानिदेशक, मुख्य अभियंता एवं प्रशासनिक अधिकारियों का सम्मानित संरक्षक मंडल जो समाज के दीर्घकालिक विकास हेतु सतत मार्गदर्शन करते हैं।",
      lead: "संरक्षक: डॉ. बद्री विशाल सिंह (से०नि० महानिदेशक, चिकित्सा एवं स्वास्थ्य उ०प्र०, प्रभारी महानिदेशक आयुष्मान योजना) | श्रीमती किरन पढेऱिया (प्रशासनिक अधिकारी भेल भोपाल) | श्री ओम प्रकाश वर्मा (मुख्य अभियंता डेसू दिल्ली) | श्री गजराज सिंह (उप-प्रबंधक सरस डेरी जयपुर)",
      badge: "राष्ट्रीय संरक्षक",
    },
    {
      title: "3. केंद्रीय राष्ट्रीय कार्यकारिणी परिषद (Central National Executive Council)",
      desc: "देशभर में आलोक संघ के संगठनात्मक प्रबंधन, 27 केंद्रीय पदाधिकारियों, प्रांतीय एवं जिला शाखाओं के विस्तार तथा वार्षिक राष्ट्रीय अधिवेशनों के आयोजन की मुख्य कार्यकारी संस्था।",
      lead: "राष्ट्रीय अध्यक्ष: सर्वश्री अतिवल सिंह (मो. 9999900079, उ०प्र०) | राष्ट्रीय वरिष्ठ उपाध्यक्ष: सर्वश्री सुरेश शिवसिंह लोधी (मो. 9610069199, राज०) | राष्ट्रीय कोषाध्यक्ष: डॉ. ओमकार सिंह नरवरिया (मो. 9873483657, दिल्ली) | राष्ट्रीय महासचिव मुख्यालय: सर्वश्री काशीराम वर्मा (मो. 9818110683, दिल्ली)",
      badge: "केंद्रीय कार्यकारिणी",
    },
    {
      title: "4. केंद्रीय अनुशासन समिति (Central Disciplinary Committee)",
      desc: "संगठन के संविधान, मर्यादा एवं आचरण संहिता के परिपालन हेतु गठित विशिष्ट समिति जो सांगठनिक शुचिता एवं अनुशासन सुनिश्चित करती है।",
      lead: "अध्यक्ष: डॉ. बद्री विशाल सिंह (राष्ट्रीय संरक्षक) | सदस्य: श्री बीरबल सिंह (रा.प.स. प्रतिनिधि), डॉ. यशपाल सिंह (राष्ट्रीय मार्गदर्शक), श्री रामसेवक राजपूत (राष्ट्रीय संयोजक) | सदस्य सचिव: श्री सुरेशचन्द्र लोधी (राष्ट्रीय वरिष्ठ उपाध्यक्ष)",
      badge: "अनुशासन समिति",
    },
    {
      title: "5. केंद्रीय वित्तीय प्रबंधन समिति (Central Financial Management Committee)",
      desc: "संघ के आय-व्यय, बजट आवंटन, अधिवेशन निधि एवं पारदर्शी लेखा प्रणाली के सुचारू संचालन हेतु अधिकृत वित्तीय संस्था।",
      lead: "अध्यक्ष: इं. हेमंत प्रताप सिंह (रा.प.स.) | सदस्य: श्री अतिबल सिंह राजपूत (राष्ट्रीय अध्यक्ष), डॉ. ओमकार सिंह (अध्यक्ष दिल्ली प्रदेश / राष्ट्रीय कोषाध्यक्ष)",
      badge: "वित्तीय प्रबंधन",
    },
    {
      title: "6. राष्ट्रीय मार्गदर्शक मंडल (Council of National Mentors)",
      desc: "सामाजिक चेतना, शैक्षणिक उत्थान और प्रशासनिक सुधारों हेतु समर्पित वरिष्ठ बुद्धिजीवी एवं विषय विशेषज्ञ।",
      lead: "सामाजिक मार्गदर्शक: श्री विश्वनाथ सिंह (सेवानिवृत्त उप ज़िलाधिकारी राजस्व, लखनऊ, उ०प्र०) | शैक्षणिक मार्गदर्शक: डॉ. यशपाल सिंह (एसोसिएट प्रोफ़ेसर, महाविद्यालय मुरैना, म०प्र०)",
      badge: "मार्गदर्शक मंडल",
    },
    {
      title: "7. राष्ट्रीय संयोजक एवं समन्वय प्रकोष्ठ (National Convenors)",
      desc: "केंद्रीय कार्यकारिणी, राज्य इकाइयों और जिला संगठनों के मध्य समन्वय स्थापित कर राष्ट्रीय संकल्पों एवं कार्यक्रमों का सुचारू संचालन सुनिश्चित करना।",
      lead: "राष्ट्रीय संयोजक: श्री राम सेवक राजपूत (सहायक अभियंता लो०नि०वि० लखनऊ), डॉ. राजेश वर्मा (स्वास्थ्य विभाग बदायूं), इं. सतेंद्र सिंह (मध्य-रेलवे विदिशा), इं. केशव सिंह वर्मा (पंचायती राज राजस्थान), श्री गजेश चंद्र (अधीक्षण अभियंता एनटीपीसी दिल्ली), डॉ. एच आर सिंह (वरिष्ठ वैज्ञानिक उत्तराखण्ड)",
      badge: "समन्वय प्रकोष्ठ",
    },
    {
      title: "8. राष्ट्रीय प्रवक्ता, मीडिया एवं विधि प्रकोष्ठ (National Officers)",
      desc: "संघ की नीतियों, सामाजिक सुधार अभियानों एवं लोक कल्याणकारी गतिविधियों को समाज व मीडिया के समक्ष आधिकारिक रूप से प्रस्तुत करना तथा संवैधानिक अधिकारों की रक्षा करना।",
      lead: "राष्ट्रीय प्रवक्ता: इं० राघवेंद्र सिंह वर्मा (अधिशासी अभियन्ता लो०नि०वि० लखनऊ) | राष्ट्रीय मीडिया प्रभारी: श्री विजय सिंह राजपूत (से०नि० प्रशासनिक अधिकारी नगरपालिका, कासगंज) | राष्ट्रीय विधि सलाहकार: एड० रूप किशोर राजपूत (वरिष्ठ अधिवक्ता तीस हजारी न्यायालय दिल्ली)",
      badge: "राष्ट्रीय प्रवक्ता व विधि",
    },
  ];

  const statePatronsData = [
    {
      state: "उत्तर प्रदेश (Uttar Pradesh)",
      patrons: [
        "श्री यशपाल सिंह (सेवानिवृत्त भारतीय रेलवे, लखनऊ)",
        "श्री बाबूलाल लोधी (सेतुनिगम, लखनऊ)",
        "इं. राजेंद्र सिंह (सेवानिवृत्त अधिशासी अभियंता, मैनपुरी)",
        "डॉ. वाई एन सिंह (तकनीकी उच्च शिक्षा, लखनऊ)",
        "डॉ. अशोकपाल सिंह (सेनि. अधिशासी अभियंता)",
        "श्री अमर सिंह राजपूत (शिक्षा विभाग)",
        "श्री ठाकुर दास (अधिशासी अभियंता, लखनऊ)",
        "प्रो० श्री के० के० वर्मा (उच्च शिक्षा, फर्रुखाबाद)",
        "इं. नारायण सिंह (सेवानिवृत्त अधिशासी अभियंता)",
        "श्री केशव सिंह राजपूत (सेनि. कृषि विभाग, औरैया)",
        "श्री जगदीश कुमार लोधी (सेवानिवृत्त, लखनऊ)",
      ],
      spokesperson: "श्री धर्मेन्द्र सिंह राजपूत (सहायक अभियंता विद्युत विभाग, मो. 9456805229)",
      media: "श्री हरनाम सिंह (प्रधानाध्यापक शिक्षा विभाग, गाजियाबाद)",
      legal: "श्री राजेन्द्र सिंह एडवोकेट (जिला न्यायालय एटा, मो. 7017701613)",
      auditor: "श्री शशिकांत राजपूत (मो. 6393774146)",
    },
    {
      state: "राजस्थान (Rajasthan)",
      patrons: [
        "श्री एल पी वर्मा (विद्युत विभाग)",
        "श्री रविंद्र सिंह (व्याख्याता स्कूल शिक्षा, ब्यावर)",
        "श्री जगमोहन सिंह राजपूत (वाइस प्रिंसिपल, धौलपुर)",
      ],
      spokesperson: "श्री दीपक सिंह (अवर अभियंता विद्युत विभाग, राजसमंद)",
      media: "श्री मनोज कुमार सिंह (एपी डब्लूआई रेलवे, राजस्थान)",
      legal: "श्री कमल सिंह एडवोकेट (जनपद न्यायालय, धौलपुर)",
      auditor: "श्री कीर्ति वर्मा (सहायक लेखाकार विद्युत, अजमेर)",
    },
    {
      state: "मध्य प्रदेश (Madhya Pradesh)",
      patrons: [
        "डॉ. महावीर सिंह (सेवानिवृत्त स्वास्थ्य विभाग, शिवपुरी)",
        "इं. डी एस पटेल (सेवानिवृत्त, जबलपुर)",
      ],
      spokesperson: "श्री प्रदीप कुमार बिंडैया (अधिशासी अभियंता नगर निगम, भोपाल)",
      legal: "श्री विजय कुमार पढेरिया एडवोकेट (जिला न्यायालय, भोपाल)",
    },
    {
      state: "दिल्ली (Delhi)",
      patrons: [
        "श्री मुरारी लाल (सेवानिवृत्त शिक्षक, शिक्षा विभाग, दिल्ली)",
      ],
      spokesperson: "श्री राम प्रकाश (शिक्षक, दिल्ली सरकार, मो. 9540590621)",
      media: "श्री नरेन्द्र पाल सिंह (वरिष्ठ सहायक लोक निर्माण विभाग, दिल्ली)",
      legal: "श्री अनूप सिंह जी एडवोकेट (सेवानिवृत्त एमटीएनएल, मो. 9868132281)",
      auditor: "श्री राजेंद्र सिंह जी (CAG भारत सरकार, मो. 8750703143)",
    },
    {
      state: "उत्तराखंड (Uttarakhand)",
      patrons: [
        "श्री रूप किशोर (शिक्षक सेवानिवृत्त, टनकपुर)",
      ],
      mentor: "श्री शिवचरन (शिक्षा विभाग, बागेश्वर)",
    },
  ];

  const telanganaTeam = [
    { name: "श्री दिनेश लोधी", role: "प्रांतीय प्रतिनिधि", photo: "/asset/photo/dinesh_tel.png" },
    { name: "श्री जश लोधी", role: "प्रांतीय प्रतिनिधि", photo: "/asset/photo/jash_tel.png" },
    { name: "श्री नंद किशोर लोधी", role: "प्रांतीय प्रतिनिधि", photo: "/asset/photo/nand_k_tel.png" },
    { name: "श्री रमेश लोधी", role: "प्रांतीय प्रतिनिधि", photo: "/asset/photo/ramesh_tel.png" },
    { name: "श्री रणवीर लोधी", role: "प्रांतीय प्रतिनिधि", photo: "/asset/photo/ranvir_tel.png" },
    { name: "श्री शैल लोधी", role: "प्रांतीय प्रतिनिधि", photo: "/asset/photo/shail_tel.png" },
    { name: "श्री टी.आर.बी. सिंह", role: "प्रांतीय प्रतिनिधि", photo: "/asset/photo/trbSingh_tel.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            {/* Header Banner */}
            <FadeIn direction="up" distance={14} duration={0.5}>
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                  सांगठनिक संरचना एवं कार्यकारिणी
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
                  {cmsPage?.title || "अखिल भारतीय आलोक संघ सांगठनिक ढांचा एवं समितियां"}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  {cmsPage?.subtitle || "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ की राष्ट्रीय कार्यकारिणी, सलाहकार समिति, अनुशासन समिति एवं प्रांतीय संरक्षक मंडल।"}
                </p>

                {/* Sub-navigation tabs */}
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#F0E5D5]">
                  <button
                    onClick={() => setActiveTab("central")}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === "central"
                        ? "bg-[#102F6B] text-white"
                        : "bg-[#FFFCF5] text-[#55657E] border border-[#F0E5D5] hover:bg-[#F2EDE4]"
                    }`}
                  >
                    🏛️ केंद्रीय समितियां (National Wings)
                  </button>
                  <button
                    onClick={() => setActiveTab("state")}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === "state"
                        ? "bg-[#102F6B] text-white"
                        : "bg-[#FFFCF5] text-[#55657E] border border-[#F0E5D5] hover:bg-[#F2EDE4]"
                    }`}
                  >
                    🗺️ प्रांतीय संरक्षक व विंग्स (State Units)
                  </button>
                  <button
                    onClick={() => setActiveTab("telangana")}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === "telangana"
                        ? "bg-[#102F6B] text-white"
                        : "bg-[#FFFCF5] text-[#55657E] border border-[#F0E5D5] hover:bg-[#F2EDE4]"
                    }`}
                  >
                    🚩 दक्षिण भारत / तेलंगाना प्रतिनिधि
                  </button>
                  <button
                    onClick={() => setActiveTab("bylaws")}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === "bylaws"
                        ? "bg-[#102F6B] text-white"
                        : "bg-[#FFFCF5] text-[#55657E] border border-[#F0E5D5] hover:bg-[#F2EDE4]"
                    }`}
                  >
                    📜 संविधान एवं नियमावली (Constitution)
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Tab 1: Central Committees */}
            {activeTab === "central" && (
              <StaggerContainer className="space-y-3.5" staggerDelay={0.05}>
                {centralCommittees.map((c, i) => (
                  <StaggerItem key={i}>
                    <SubtleHoverCard>
                      <div className="p-4 sm:p-5 rounded-lg bg-white border border-[#F0E5D5] shadow-xs space-y-2 hover:border-[#102F6B] transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="font-bold text-sm sm:text-base text-[#102F6B]">
                            {c.title}
                          </h2>
                          <span className="text-[11px] font-semibold text-[#F26A21] bg-[#FFF0E2] px-2 py-0.5 rounded border border-[#F0E5D5] shrink-0">
                            {c.badge}
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

            {/* Tab 2: State Patrons & Leadership */}
            {activeTab === "state" && (
              <StaggerContainer className="space-y-4" staggerDelay={0.06}>
                {statePatronsData.map((st, i) => (
                  <StaggerItem key={i}>
                    <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F0E5D5]">
                        <h3 className="font-bold text-sm sm:text-base text-[#102F6B]">
                          📍 {st.state}
                        </h3>
                        <span className="text-[11px] font-bold text-[#F26A21] bg-[#FFF0E2] px-2 py-0.5 rounded">
                          {st.patrons.length} प्रांतीय संरक्षक
                        </span>
                      </div>

                      {/* Patrons list */}
                      <div>
                        <h4 className="text-xs font-bold text-[#55657E] mb-1.5 uppercase">
                          प्रांतीय संरक्षक मंडल:
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-[#263449]">
                          {st.patrons.map((p, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 bg-[#FFFCF5] p-1.5 rounded border border-[#F0E5D5]">
                              <span className="text-[#F26A21] font-bold">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Wing Officers */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#F0E5D5] text-xs">
                        {st.spokesperson && (
                          <div className="bg-[#FAF8F3] p-2 rounded">
                            <strong className="text-[#102F6B]">प्रदेश प्रवक्ता:</strong> {st.spokesperson}
                          </div>
                        )}
                        {st.media && (
                          <div className="bg-[#FAF8F3] p-2 rounded">
                            <strong className="text-[#102F6B]">प्रदेश मीडिया:</strong> {st.media}
                          </div>
                        )}
                        {st.legal && (
                          <div className="bg-[#FAF8F3] p-2 rounded">
                            <strong className="text-[#102F6B]">प्रदेश विधि सलाहकार:</strong> {st.legal}
                          </div>
                        )}
                        {st.auditor && (
                          <div className="bg-[#FAF8F3] p-2 rounded">
                            <strong className="text-[#102F6B]">प्रदेश लेखापरीक्षक:</strong> {st.auditor}
                          </div>
                        )}
                        {st.mentor && (
                          <div className="bg-[#FAF8F3] p-2 rounded">
                            <strong className="text-[#102F6B]">प्रदेश मार्गदर्शक:</strong> {st.mentor}
                          </div>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}

            {/* Tab 3: Telangana State Delegation */}
            {activeTab === "telangana" && (
              <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="border-b border-[#F0E5D5] pb-3">
                  <span className="text-xs font-bold text-[#F26A21] bg-[#FFF0E2] px-2 py-0.5 rounded">
                    दक्षिण भारत संगठन
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-[#102F6B] mt-1">
                    तेलंगाना प्रांतीय प्रतिनिधि मंडल (Telangana Delegation)
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    दक्षिण भारत एवं तेलंगाना राज्य में सेवारत व सक्रिय आलोक संघ के समर्पित प्रतिनिधि।
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {telanganaTeam.map((m, idx) => (
                    <div key={idx} className="bg-[#FFFCF5] rounded-lg border border-[#F0E5D5] p-3 text-center space-y-2">
                      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#102F6B] bg-white">
                        <img src={m.photo} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="font-bold text-xs text-[#102F6B]">{m.name}</div>
                      <div className="text-[10px] text-[#F26A21] font-semibold">{m.role}</div>
                      <div className="text-[10px] text-[#64748B]">तेलंगाना</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Constitution & Bylaws */}
            {activeTab === "bylaws" && (
              <FadeIn direction="up" distance={14} duration={0.5}>
                <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs space-y-5">
                  <div className="border-b border-[#F0E5D5] pb-3">
                    <span className="text-[11px] font-bold text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
                      आधिकारिक विधान एवं नियमावली (स्त्रोत: अधिकारी परिचय प्रपत्र)
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-[#102F6B] mt-2">
                      संघ की वैधानिक संरचना, उद्देश्य एवं सदस्यता नियम
                    </h2>
                    <p className="text-xs text-[#64748B] mt-1">
                      अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) के आधिकारिक परिचय प्रपत्र अनुसार
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
            )}

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
