"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error("Runtime client/server error caught by ErrorBoundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 py-16 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-[#F0E5D5] p-8 sm:p-12 shadow-sm text-center space-y-6 w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 border border-red-200 flex items-center justify-center text-3xl font-black">
            ⚠
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#102F6B] tracking-tight">
              तकनीकी त्रुटि उत्पन्न हुई
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
              इस पृष्ठ को लोड करते समय एक अस्थायी तकनीकी समस्या आई है। हमारी तकनीकी टीम को सूचित कर दिया गया है।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="btn-primary text-xs px-5 py-2.5 font-bold shadow-xs cursor-pointer"
            >
              🔄 पुनः प्रयास करें
            </button>
            <Link
              href="/"
              className="btn-navy text-xs px-5 py-2.5 font-bold shadow-xs"
            >
              ← मुख्य पृष्ठ पर वापस जाएं
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