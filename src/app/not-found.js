import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "404 - Page Not Found | alokworld.in",
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
              Page or Record Not Found
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
              The community page, directory slug, or record you requested does not exist, may have been relocated, or is currently private.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="btn-primary text-xs px-5 py-2.5 font-bold shadow-xs"
            >
              ← Return to Homepage
            </Link>
            <Link
              href="/directory"
              className="btn-navy text-xs px-5 py-2.5 font-bold shadow-xs"
            >
              Explore Member Directory →
            </Link>
            <Link
              href="/contact"
              className="btn-outline text-xs px-4 py-2.5 font-semibold shadow-xs"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
