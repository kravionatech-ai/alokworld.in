import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service - Community Directory Guidelines",
  description:
    "Terms and conditions, acceptable use policies, and community standards for the alokworld.in member directory.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9ED] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-3 sm:px-4 py-8">
        <div className="bg-white rounded-lg border border-[#E9D9C5] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#E9D9C5] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#E9D9C5]">
              Terms of Use
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#102F6B] mt-2 tracking-tight">
              Terms and Conditions
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Effective Date: October 2026 • alokworld.in
            </p>
          </div>

          <div className="text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4">
            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              1. Acceptance of Community Portal Terms
            </h2>
            <p className="pl-2">
              By accessing, browsing, or submitting member data to alokworld.in, you agree to comply with and be bound by these terms. This website is dedicated to positive social fellowship, networking, and cultural preservation.
            </p>

            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              2. Accuracy of Submitted Information
            </h2>
            <p className="pl-2">
              Members and contributors are expected to submit accurate, truthful, and lawful information. Misrepresentation of educational credentials, official titles, or family information is strictly prohibited and subject to immediate removal.
            </p>

            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              3. Prohibited Misuse and Commercial Harvesting
            </h2>
            <p className="pl-2">
              Automated scraping, bulk email extraction, unauthorized telemarketing, or commercial solicitation using directory member phone numbers or emails is strictly prohibited under applicable digital privacy standards.
            </p>

            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              4. Secretariat Rights of Moderation
            </h2>
            <p className="pl-2">
              The administrative body of alokworld.in reserves the right to review, edit for formatting, approve, decline, or unpublish any profile, matrimonial bio, or comment that conflicts with community harmony and integrity.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
