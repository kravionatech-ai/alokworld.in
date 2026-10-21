import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | गोपनीयता नीति | alokworld.in",
  description: "Privacy policy and member data protection practices of alokworld.in Samaj Community Directory.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#172B4D]">
      <Header />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-3 sm:px-4 py-8">
        <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-6 sm:p-8 shadow-sm space-y-5">
          <div className="border-b border-[#F3D8B0] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C83B08] bg-[#FFE6C7] px-2.5 py-0.5 rounded border border-[#F3D8B0]">
              Legal &amp; Privacy
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#082F75] mt-2 tracking-tight">
              गोपनीयता नीति (Privacy Policy)
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Last updated: October 2026 • Applicable to alokworld.in
            </p>
          </div>

          <div className="text-xs sm:text-sm text-[#172B4D] leading-relaxed space-y-4">
            <h2 className="text-base font-bold text-[#082F75] border-l-2 border-[#F4510B] pl-2">1. Information Collection and Consent</h2>
            <p className="pl-2">
              alokworld.in operates as an online community directory portal for verified samaj members. We collect basic directory details (such as full name, profession, city, state, contact numbers, email addresses, and photographs) strictly with the explicit consent of the member or family representative.
            </p>

            <h2 className="text-base font-bold text-[#082F75] border-l-2 border-[#F4510B] pl-2">2. Contact Visibility and Privacy Controls</h2>
            <p className="pl-2">
              Every registered member profile is equipped with granular privacy switches:
            </p>
            <ul className="list-disc pl-7 space-y-1 text-[#64748B]">
              <li><strong className="text-[#172B4D]">Public Phone Display:</strong> Only displayed publicly if the member opts-in.</li>
              <li><strong className="text-[#172B4D]">Public Email Display:</strong> Only displayed publicly if the member opts-in.</li>
              <li><strong className="text-[#172B4D]">Physical Address:</strong> Remains strictly private to prevent unauthorized solicitation unless public consent is granted.</li>
            </ul>

            <h2 className="text-base font-bold text-[#082F75] border-l-2 border-[#F4510B] pl-2">3. Data Security and Admin Authorization</h2>
            <p className="pl-2">
              All administrative access is protected through encrypted JSON Web Tokens (JWT) and salted bcrypt password hashing. MongoDB databases and third-party media endpoints (Cloudinary, Resend) are managed with secure server-side credentials and are never exposed to browser bundles.
            </p>

            <h2 className="text-base font-bold text-[#082F75] border-l-2 border-[#F4510B] pl-2">4. Information Modification &amp; Removal</h2>
            <p className="pl-2">
              Members wishing to update, unpublish, or permanently delete their profile from the directory can contact our administrative secretariat anytime via the <a href="/contact" className="text-[#F4510B] hover:text-[#C83B08] font-semibold underline">Contact Us</a> form or by emailing admin@alokworld.in.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
