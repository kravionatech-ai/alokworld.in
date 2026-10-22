import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "गोपनीयता नीति - डेटा संरक्षण एवं डायरेक्टरी सहमति | alokworld.in",
  description:
    "alokworld.in समाज डायरेक्टरी पोर्टल की गोपनीयता प्रतिबद्धताएं, सदस्य सहमति नीति, डेटा सुरक्षा एवं सूचना संरक्षा मानक।",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "गोपनीयता नीति | alokworld.in",
    description: "alokworld.in समाज डायरेक्टरी पोर्टल की गोपनीयता प्रतिबद्धताएं एवं डेटा सुरक्षा नियम।",
    locale: "hi_IN",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-3 sm:px-4 py-8">
        <div className="bg-white rounded-lg border border-[#F0E5D5] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#F0E5D5] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
              विधिक एवं गोपनीयता
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#102F6B] mt-2 tracking-tight">
              गोपनीयता नीति (Privacy Policy)
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              अंतिम अद्यतन: अक्टूबर 2026 • alokworld.in समाज पोर्टल
            </p>
          </div>

          <div className="text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4">
            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              १. जानकारी का संकलन एवं सहमति
            </h2>
            <p className="pl-2">
              alokworld.in सत्यापित समाज बंधुओं के लिए एक ऑनलाइन समुदाय डायरेक्टरी के रूप में कार्य करता है। हम डायरेक्टरी संबंधी मूलभूत विवरण (जैसे पूरा नाम, पद / व्यवसाय, शहर, राज्य, संपर्क सूत्र, ईमेल एवं छायाचित्र) केवल संबंधित सदस्य अथवा उनके परिवार के प्राधिकृत प्रतिनिधि की स्पष्ट सहमति के पश्चात ही संकलित करते हैं।
            </p>

            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              २. संपर्क प्रदर्शन एवं गोपनीयता नियंत्रण
            </h2>
            <p className="pl-2">
              प्रत्येक पंजीकृत सदस्य प्रोफ़ाइल में गोपनीयता के विशेष विकल्प उपलब्ध हैं:
            </p>
            <ul className="list-disc pl-7 space-y-1 text-[#64748B]">
              <li><strong className="text-[#263449]">सार्वजनिक फोन नंबर प्रदर्शन:</strong> केवल तभी सार्वजनिक रूप से प्रदर्शित होता है जब सदस्य ने स्वयं इसके लिए स्पष्ट अनुमति दी हो।</li>
              <li><strong className="text-[#263449]">सार्वजनिक ईमेल प्रदर्शन:</strong> केवल सदस्य की स्पष्ट सहमति के पश्चात ही दृश्यमान होता है।</li>
              <li><strong className="text-[#263449]">स्थाई / आवासीय पता:</strong> अवांछित व्यावसायिक कॉल्स व दुरुपयोग को रोकने के लिए व्यक्तिगत पते को सुरक्षित रखा जाता है।</li>
            </ul>

            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              ३. डेटा सुरक्षा एवं प्रशासनिक प्रमाणीकरण
            </h2>
            <p className="pl-2">
              समस्त प्रशासनिक लॉगिन एवं डेटा एक्सेस एन्क्रिप्टेड JSON Web Tokens (JWT) और सुरक्षित सॉल्टेड bcrypt पासवर्ड हैशिंग तकनीक द्वारा सुरक्षित हैं। डेटाबेस एवं मीडिया फ़ाइलें केवल सुरक्षित सर्वर-साइड क्रेडेंशियल्स के माध्यम से प्रबंधित की जाती हैं।
            </p>

            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              ४. जानकारी में संशोधन अथवा निष्कासन
            </h2>
            <p className="pl-2">
              यदि कोई सदस्य अपनी डायरेक्टरी जानकारी को संशोधित, अप्रकाशित अथवा स्थायी रूप से हटाना चाहते हैं, तो वे हमारे प्रशासनिक सचिवालय से <a href="/contact" className="text-[#F26A21] hover:underline font-semibold">संपर्क प्रपत्र</a> के माध्यम से अथवा admin@alokworld.in पर ईमेल करके कभी भी अनुरोध कर सकते हैं।
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
