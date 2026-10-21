import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "About Us | हमारे बारे में | alokworld.in",
  description: "Learn about the mission, vision, values, and digital objectives of alokworld.in Samaj Community Directory portal.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#172B4D]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-5 sm:p-7 shadow-sm space-y-5">
            <div className="border-b border-[#F3D8B0] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C83B08] bg-[#FFE6C7] px-2.5 py-0.5 rounded border border-[#F3D8B0]">
                Community Portal
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#082F75] mt-2 tracking-tight">
                हमारे बारे में (About alokworld.in)
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Empowering the Samaj through digital connectivity, mutual support, and leadership.
              </p>
            </div>

            <div className="text-xs sm:text-sm text-[#172B4D] leading-relaxed space-y-4">
              <p className="font-medium text-[#082F75] text-sm sm:text-base leading-relaxed bg-[#FFE6C7]/30 p-4 rounded border border-[#F3D8B0]">
                alokworld.in एक सुरक्षित, आधुनिक एवं प्रामाणिक डिजिटल समुदाय डायरेक्टरी पोर्टल है, जो समाज के बंधुओं, परिवारों, बुजुर्गों, पेशेवरों और युवाओं को एक सूत्र में पिरोने के संकल्प के साथ संचालित किया जा रहा है।
              </p>

              <h2 className="text-base font-bold text-[#082F75] pt-2 border-b border-[#F3D8B0]/60 pb-1">हमारे प्रमुख उद्देश्य (Key Objectives)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 rounded bg-[#FFF9E8] border border-[#F3D8B0]">
                  <h3 className="font-bold text-[#082F75] text-xs sm:text-sm mb-1">1. प्रामाणिक डायरेक्टरी</h3>
                  <p className="text-xs text-[#64748B]">
                    देश के किसी भी शहर में रहने वाले समाज बंधु एक दूसरे से सरलतापूर्वक संपर्क कर सकें एवं आपात स्थिति में परस्पर सहायता कर सकें।
                  </p>
                </div>
                <div className="p-4 rounded bg-[#FFF9E8] border border-[#F3D8B0]">
                  <h3 className="font-bold text-[#082F75] text-xs sm:text-sm mb-1">2. युवा एवं रोजगार नेटवर्क</h3>
                  <p className="text-xs text-[#64748B]">
                    उद्योग, आईटी, चिकित्सा, इंजीनियरिंग और व्यापार में कार्यरत पेशेवरों का युवा पीढ़ी के साथ मार्गदर्शन व नेटवर्किंग।
                  </p>
                </div>
                <div className="p-4 rounded bg-[#FFF9E8] border border-[#F3D8B0]">
                  <h3 className="font-bold text-[#082F75] text-xs sm:text-sm mb-1">3. वैवाहिक समन्वय</h3>
                  <p className="text-xs text-[#64748B]">
                    समाज के सुशिक्षित विवाह योग्य युवक-युवतियों के लिए मर्यादापूर्ण एवं सत्यापित वैवाहिक मंच उपलब्ध कराना।
                  </p>
                </div>
                <div className="p-4 rounded bg-[#FFF9E8] border border-[#F3D8B0]">
                  <h3 className="font-bold text-[#082F75] text-xs sm:text-sm mb-1">4. सांस्कृतिक गौरव का संरक्षण</h3>
                  <p className="text-xs text-[#64748B]">
                    इतिहास, महापुरुषों के त्याग और गौरवशाली परंपराओं को आने वाली पीढ़ियों तक ससम्मान पहुंचाना।
                  </p>
                </div>
              </div>

              <h2 className="text-base font-bold text-[#082F75] pt-3 border-b border-[#F3D8B0]/60 pb-1">गोपनीयता एवं मर्यादा का सम्मान</h2>
              <p>
                पोर्टल पर प्रकाशित किसी भी व्यक्तिगत जानकारी (जैसे फोन नंबर या व्यक्तिगत पता) का प्रकाशन पूर्णतः सदस्य की पूर्व सहमति पर आधारित है। किसी भी अवांछित दुरुपयोग की रोकथाम हेतु एडमिन स्तर पर सत्यापन किया जाता है।
              </p>
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
