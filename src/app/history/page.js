import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Samaj History | अखिल भारतीय समाज का इतिहास | alokworld.in",
  description: "Learn about the heritage, rich history, cultural background and contributions of our Samaj across centuries.",
};

export default function HistoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#172B4D]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Article Content */}
          <article className="lg:col-span-8 bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-5 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-[#F3D8B0] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C83B08] bg-[#FFE6C7] px-2.5 py-0.5 rounded border border-[#F3D8B0]">
                Heritage &amp; History
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#082F75] mt-2 tracking-tight">
                अखिल भारतीय समाज का गौरवशाली इतिहास
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                A chronicle of service, courage, cultural legacy, and nation-building.
              </p>
            </div>

            <div className="text-xs sm:text-sm text-[#172B4D] leading-relaxed space-y-4">
              <p className="font-medium text-[#082F75] text-sm sm:text-base leading-relaxed bg-[#FFE6C7]/30 p-4 rounded border border-[#F3D8B0]">
                समाज का इतिहास त्याग, तपस्या, शौर्य और राष्ट्रभक्ति से परिपूर्ण रहा है। समाज के पूर्वजों ने भारतीय संस्कृति की रक्षा, कृषि विस्तार और राष्ट्रीय स्वतंत्रता संग्राम में अभूतपूर्व योगदान दिया है।
              </p>

              <h2 className="text-base font-bold text-[#082F75] pt-2 border-b border-[#F3D8B0]/60 pb-1">1. ऐतिहासिक पृष्ठभूमि एवं मूल उत्पत्ति</h2>
              <p>
                ऐतिहासिक अभिलेखों के अनुसार, समाज का मूल संबंध प्राचीन काल से भूमि-संरक्षण, कृषि संवर्धन, और सैन्य पराक्रम से जुड़ा रहा है। समाज के लोगों ने सदैव सत्य, धर्म और न्याय की रक्षा के लिए अग्रणी भूमिका निभाई।
              </p>

              <h2 className="text-base font-bold text-[#082F75] pt-2 border-b border-[#F3D8B0]/60 pb-1">2. स्वतंत्रता संग्राम में समाज का अमूल्य योगदान</h2>
              <p>
                1857 के प्रथम स्वतंत्रता संग्राम से लेकर 1947 के राष्ट्रीय स्वतंत्रता आंदोलन तक, समाज के वीरों और वीरांगनाओं ने मातृभूमि की स्वाधीनता के लिए अपना सर्वस्व न्योछावर किया। राजा बख्तियार सिंह, वीरांगना अवंतीबाई और अनेक अमर सेनानियों ने ब्रिटिश शासन के विरुद्ध अदम्य साहस का परिचय दिया।
              </p>

              <h2 className="text-base font-bold text-[#082F75] pt-2 border-b border-[#F3D8B0]/60 pb-1">3. आधुनिक काल में सामाजिक एवं शैक्षणिक पुनर्जागरण</h2>
              <p>
                आजादी के पश्चात समाज में शिक्षा, संगठनात्मक एकता और आर्थिक आत्मनिर्भरता के लिए अनेक संस्थाओं और छात्रावासों की स्थापना की गई। वर्तमान में समाज के युवा सिविल सेवा (IAS, IPS, RAS), चिकित्सा, इंजीनियरिंग, न्यायपालिका और व्यापार के क्षेत्र में देश का नाम रोशन कर रहे हैं।
              </p>

              <div className="p-4 bg-[#FFF9E8] rounded border border-[#F3D8B0] mt-5">
                <h3 className="font-bold text-[#082F75] text-xs uppercase tracking-wider mb-2 border-l-2 border-[#F4510B] pl-2">
                  समाज के मूल आदर्श एवं संकल्प
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#64748B]">
                  <li>शिक्षा का सार्वभौमिक विस्तार एवं बालिका शिक्षा प्रोत्साहन</li>
                  <li>सामाजिक कुरीतियों एवं अनावश्यक आडंबरों का उन्मूलन</li>
                  <li>आपसी बंधुत्व, सहयोग और युवा मार्गदर्शन</li>
                  <li>राष्ट्र निर्माण एवं सर्वसमाज कल्याण में सहभागिता</li>
                </ul>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
