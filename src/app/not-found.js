import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "404 - पृष्ठ प्राप्त नहीं हुआ | alokworld.in",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 py-16 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-[#F0E5D5] p-8 sm:p-12 shadow-sm text-center space-y-6 w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF0E2] text-[#F26A21] border border-[#F0E5D5] flex items-center justify-center text-3xl font-black">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#102F6B] tracking-tight">
              पृष्ठ अथवा अभिलेख उपलब्ध नहीं है
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
              आपके द्वारा अनुरोधित पृष्ठ, डायरेक्टरी लिंक अथवा सदस्य अभिलेख मौजूद नहीं है, स्थानांतरित कर दिया गया है अथवा गोपनीय रखा गया है।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="btn-primary text-xs px-5 py-2.5 font-bold shadow-xs"
            >
              ← मुख्य पृष्ठ पर वापस जाएं
            </Link>
            <Link
              href="/directory"
              className="btn-navy text-xs px-5 py-2.5 font-bold shadow-xs"
            >
              सदस्य डायरेक्टरी देखें →
            </Link>
            <Link
              href="/contact"
              className="btn-outline text-xs px-4 py-2.5 font-semibold shadow-xs"
            >
              सचिवालय से संपर्क करें
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
