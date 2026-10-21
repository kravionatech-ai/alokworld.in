import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms and Conditions | नियम एवं शर्तें | alokworld.in",
  description: "Terms and conditions governing the usage and member participation on alokworld.in Samaj Community Directory.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#172B4D]">
      <Header />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-3 sm:px-4 py-8">
        <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-6 sm:p-8 shadow-sm space-y-5">
          <div className="border-b border-[#F3D8B0] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C83B08] bg-[#FFE6C7] px-2.5 py-0.5 rounded border border-[#F3D8B0]">
              Terms of Use
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#082F75] mt-2 tracking-tight">
              नियम एवं शर्तें (Terms and Conditions)
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Effective Date: October 2026 • alokworld.in
            </p>
          </div>

          <div className="text-xs sm:text-sm text-[#172B4D] leading-relaxed space-y-4">
            <h2 className="text-base font-bold text-[#082F75] border-l-2 border-[#F4510B] pl-2">1. Acceptance of Community Portal Terms</h2>
            <p className="pl-2">
              By accessing, browsing, or submitting member data to alokworld.in, you agree to comply with and be bound by these terms. This website is dedicated to positive social fellowship, networking, and cultural preservation.
            </p>

            <h2 className="text-base font-bold text-[#082F75] border-l-2 border-[#F4510B] pl-2">2. Accuracy of Submitted Information</h2>
            <p className="pl-2">
              Members and contributors are expected to submit accurate, truthful, and lawful information. Misrepresentation of educational credentials, official titles, or family information is strictly prohibited and subject to removal.
            </p>

            <h2 className="text-base font-bold text-[#082F75] border-l-2 border-[#F4510B] pl-2">3. Prohibited Misuse and Commercial Harvesting</h2>
            <p className="pl-2">
              Automated scraping, bulk email extraction, unauthorized telemarketing, or commercial solicitation using directory member phone numbers or emails is strictly prohibited under applicable digital privacy standards.
            </p>

            <h2 className="text-base font-bold text-[#082F75] border-l-2 border-[#F4510B] pl-2">4. Secretariat Rights of Moderation</h2>
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
