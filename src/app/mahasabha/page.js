import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Mahasabha | अखिल भारतीय महासभा | alokworld.in",
  description: "Official portal information of Akhil Bhartiya Samaj Mahasabha, national leadership, annual sessions, and resolutions.",
};

export default function MahasabhaPage() {
  const resolutions = [
    {
      year: "राष्ट्रीय संकल्प 2026",
      title: "डिजिटल डायरेक्टरी एवं प्रतिभा सम्मान महाभियान",
      detail: "देश के प्रत्येक ग्राम एवं नगर तक समाज के बंधुओं को ऑनलाइन डायरेक्टरी से जोड़ना तथा प्रतिवर्ष प्रतिभावान छात्र-छात्राओं को छात्रवृत्ति प्रदान करना।",
    },
    {
      year: "सामाजिक सुधार संकल्प",
      title: "विवाह समारोहों में सादगी एवं मितव्ययिता",
      detail: "अनावश्यक आडंबर, फिजूलखर्ची तथा दहेज प्रथा पर पूर्ण रोक लगाने हेतु सामूहिक विवाह सम्मेलनों को प्रोत्साहन।",
    },
    {
      year: "शैक्षणिक संकल्प",
      title: "महानगरों में समाज छात्रावास एवं अध्ययन केंद्र",
      detail: "दिल्ली, भोपाल, जयपुर, इंदौर और लखनऊ जैसे प्रमुख प्रतियोगी परीक्षा केंद्रों पर छात्र-छात्राओं के लिए सुरक्षित छात्रावास व्यवस्था।",
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
                Central Leadership &amp; Body
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#082F75] mt-2 tracking-tight">
                अखिल भारतीय महासभा (National Mahasabha)
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                The apex representative organization uniting all regional chapters, trusts, and community councils across India.
              </p>
            </div>

            <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-5 sm:p-7 shadow-sm space-y-4 text-xs sm:text-sm text-[#172B4D] leading-relaxed">
              <h2 className="text-base font-bold text-[#082F75] border-l-2 border-[#F4510B] pl-2">
                महासभा का उद्देश्य एवं दूरदृष्टि (Vision &amp; Mission)
              </h2>
              <p className="pl-2">
                अखिल भारतीय महासभा समाज के सर्वांगीण विकास के लिए कटिबद्ध राष्ट्रीय मंच है। इसका मुख्य उद्देश्य समाज के सभी घटकों में पारस्परिक सहयोग, सांस्कृतिक चेतना, उच्च शिक्षा का प्रसार और आर्थिक स्वावलंबन सुनिश्चित करना है।
              </p>

              <h2 className="text-base font-bold text-[#082F75] pt-3 border-l-2 border-[#F4510B] pl-2">
                प्रमुख राष्ट्रीय संकल्प एवं कार्ययोजना
              </h2>
              <div className="space-y-3 pt-1">
                {resolutions.map((r, i) => (
                  <div key={i} className="p-4 rounded border border-[#F3D8B0] bg-[#FFF9E8]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C83B08] bg-[#FFE6C7] px-2 py-0.5 rounded border border-[#F3D8B0]">
                      {r.year}
                    </span>
                    <h3 className="font-bold text-[#082F75] text-xs sm:text-sm mt-1.5">
                      {r.title}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {r.detail}
                    </p>
                  </div>
                ))}
              </div>
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
