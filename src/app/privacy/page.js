import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy - Data Protection & Directory Consent",
  description:
    "Privacy commitments, member consent policies, data masking standards, and information security standards for alokworld.in.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9ED] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-3 sm:px-4 py-8">
        <div className="bg-white rounded-lg border border-[#E9D9C5] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#E9D9C5] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#E9D9C5]">
              Legal &amp; Privacy
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#102F6B] mt-2 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Last updated: October 2026 • Applicable to alokworld.in
            </p>
          </div>

          <div className="text-xs sm:text-sm text-[#263449] leading-relaxed space-y-4">
            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              1. Information Collection and Consent
            </h2>
            <p className="pl-2">
              alokworld.in operates as an online community directory portal for verified community members. We collect basic directory details (such as full name, profession, city, state, contact numbers, email addresses, and photographs) strictly with the explicit consent of the member or family representative.
            </p>

            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              2. Contact Visibility and Privacy Controls
            </h2>
            <p className="pl-2">
              Every registered member profile is equipped with granular privacy switches:
            </p>
            <ul className="list-disc pl-7 space-y-1 text-[#64748B]">
              <li><strong className="text-[#263449]">Public Phone Display:</strong> Only displayed publicly if the member explicitly opts in.</li>
              <li><strong className="text-[#263449]">Public Email Display:</strong> Only displayed publicly if the member explicitly opts in.</li>
              <li><strong className="text-[#263449]">Physical Address:</strong> Remains strictly private to prevent unauthorized solicitation unless public consent is granted.</li>
            </ul>

            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              3. Data Security and Admin Authorization
            </h2>
            <p className="pl-2">
              All administrative access is protected through encrypted JSON Web Tokens (JWT) and salted bcrypt password hashing. MongoDB databases and third-party media endpoints (Cloudinary, Resend) are managed with secure server-side credentials and are never exposed to browser bundles.
            </p>

            <h2 className="text-base font-bold text-[#102F6B] border-l-3 border-[#F26A21] pl-2">
              4. Information Modification &amp; Removal
            </h2>
            <p className="pl-2">
              Members wishing to update, unpublish, or permanently delete their profile from the directory can contact our administrative secretariat anytime via the <a href="/contact" className="text-[#F26A21] hover:underline font-semibold">Contact Us</a> form or by emailing admin@alokworld.in.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
