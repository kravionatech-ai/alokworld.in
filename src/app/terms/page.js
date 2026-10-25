import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "नियम एवं शर्तें - समुदाय डायरेक्टरी दिशानिर्देश | alokworld.in",
  description:
    "alokworld.in सदस्य डायरेक्टरी के नियम व शर्तें, स्वीकार्य उपयोग नीति एवं सामुदायिक आचार संहिता।",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "नियम एवं शर्तें | alokworld.in",
    description: "alokworld.in सदस्य डायरेक्टरी के नियम व शर्तें एवं सामुदायिक दिशानिर्देश।",
    locale: "hi_IN",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-3 sm:px-4 py-8">
        <div className="bg-white rounded-lg border border-[#F0E5D5] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#F0E5D5] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
              उपयोग की शर्तें
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#102F6B] mt-2 tracking-tight">
              नियम एवं शर्तें (Terms &amp; Conditions)
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              प्रभावी तिथि: अक्टूबर 2026 • alokworld.in
            </p>
          </div>

          <div className="text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4">
            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              1. समुदाय पोर्टल की शर्तों की स्वीकृति
            </h2>
            <p className="pl-2">
              alokworld.in पर आने, विवरण देखने अथवा सदस्य डेटा प्रस्तुत करने पर आप इन शर्तों का पालन करने के लिए बाध्य हैं। यह वेबसाइट विशुद्ध रूप से सकारात्मक सामाजिक सद्भाव, परस्पर परिचय, नेटवर्किंग एवं सांस्कृतिक विरासत के संरक्षण हेतु समर्पित है।
            </p>

            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              2. प्रस्तुत जानकारी की सत्यता एवं प्रामाणिकता
            </h2>
            <p className="pl-2">
              सदस्यों एवं योगदानकर्ताओं से सदैव सत्य, प्रामाणिक एवं वैध जानकारी प्रस्तुत करने की अपेक्षा की जाती है। शैक्षणिक योग्यता, आधिकारिक पदवी अथवा पारिवारिक जानकारी का मिथ्या प्रदर्शन सख्त वर्जित है और ऐसी प्रविष्टियां तत्काल प्रभाव से हटाई जा सकती हैं।
            </p>

            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              3. व्यावसायिक दुरुपयोग एवं डेटा चोरी पर प्रतिबंध
            </h2>
            <p className="pl-2">
              इस डायरेक्टरी से स्वचालित स्क्रैपिंग (Scraping), थोक ईमेल निष्कर्षण, अवांछित टेलीमार्केटिंग अथवा व्यावसायिक प्रचार हेतु सदस्यों के फोन नंबरों व पतों का दुरुपयोग पूर्णतः निषिद्ध है।
            </p>

            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              4. प्रशासनिक सचिवालय के विशेषाधिकार
            </h2>
            <p className="pl-2">
              alokworld.in के प्रशासनिक बोर्ड के पास सामाजिक समरसता, मर्यादा और सत्यनिष्ठा के प्रतिकूल किसी भी प्रोफ़ाइल, वैवाहिक विवरण अथवा टिप्पणी की समीक्षा करने, प्रारूप सुधारने, अस्वीकृत करने अथवा हटाने का पूर्ण अधिकार सुरक्षित है।
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
