import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Samaj Organization | संगठन संरचना एवं कार्यसमिति | alokworld.in",
  description: "Organizational leadership, core committees, youth wing, women cell, and state chapters.",
};

export default function OrganizationPage() {
  const committees = [
    {
      title: "राष्ट्रीय संरक्षक मंडल (National Advisory Council)",
      desc: "समाज के वरिष्ठ विद्वतजनों, पूर्व प्रशासनिक अधिकारियों और प्रतिष्ठित समाजसेवियों का मार्गदर्शन मंडल।",
      lead: "मार्गदर्शन: वरिष्ठ संरक्षकगण",
    },
    {
      title: "राष्ट्रीय कार्यसमिति (Central Working Committee)",
      desc: "महासभा के दैनिक सामाजिक, शैक्षणिक एवं संगठनात्मक निर्णयों का क्रियान्वयन एवं निगरानी।",
      lead: "संयोजक: राष्ट्रीय अध्यक्ष एवं महासचिव",
    },
    {
      title: "युवा मोर्चा (Youth Network & IT Cell)",
      desc: "समाज के युवाओं को स्वरोजगार, कौशल विकास, सिविल सेवा मार्गदर्शन एवं डिजिटल डायरेक्टरी से जोड़ना।",
      lead: "प्रभारी: राष्ट्रीय युवा प्रकोष्ठ",
    },
    {
      title: "महिला प्रकोष्ठ (Women Empowerment Cell)",
      desc: "बालिका शिक्षा प्रोत्साहन, मातृशक्ति सम्मेलन, स्वयं सहायता समूह एवं सामाजिक कुरीतियों का निवारण।",
      lead: "प्रभारी: राष्ट्रीय महिला अध्यक्ष",
    },
    {
      title: "विधि एवं वैधानिक प्रकोष्ठ (Legal Advisory Panel)",
      desc: "समाज बंधुओं को विधिक सहायता, पारिवारिक विवादों में मध्यस्थता एवं सामाजिक अधिकारों का संरक्षण।",
      lead: "समन्वयक: वरिष्ठ अधिवक्ता मंडल",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#172B4D]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-5 sm:p-7 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C83B08] bg-[#FFE6C7] px-2.5 py-0.5 rounded border border-[#F3D8B0]">
                Structure &amp; Governance
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#082F75] mt-2 tracking-tight">
                अखिल भारतीय संगठन संरचना एवं कार्यसमिति
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                An organized framework dedicated to community welfare, youth enablement, and nationwide harmony.
              </p>
            </div>

            <div className="space-y-3.5">
              {committees.map((c, i) => (
                <div
                  key={i}
                  className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-4 sm:p-5 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm sm:text-base font-bold text-[#082F75] border-l-2 border-[#F4510B] pl-2">
                      {c.title}
                    </h2>
                    <span className="text-[10px] font-bold text-[#C83B08] bg-[#FFE6C7] px-2 py-0.5 rounded border border-[#F3D8B0]">
                      Active Wing
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-3 pl-2">
                    {c.desc}
                  </p>
                  <div className="text-[11px] font-semibold text-[#082F75] bg-[#FFF9E8] p-2.5 rounded border border-[#F3D8B0]">
                    {c.lead}
                  </div>
                </div>
              ))}
            </div>
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
