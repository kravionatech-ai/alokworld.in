"use client";

import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/MotionWrappers";

export default function Footer({ contactEmail, contactPhone }) {
  return (
    <footer className="bg-[#FFFCF5] border-t-2 border-[#F0E5D5] mt-12 pt-8 pb-6 text-[#263449]">
      <div className="max-w-[1100px] mx-auto px-4">
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 pb-6 border-b border-[#F0E5D5]"
          staggerDelay={0.07}
        >
          {/* Col 1: Identity */}
          <StaggerItem className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#102F6B] text-white border border-[#F26A21] flex items-center justify-center font-bold text-sm">
                🏛️
              </div>
              <span className="font-bold text-sm text-[#102F6B] tracking-tight">
                अखिल भारतीय समाज
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक) एवं समाज डायरेक्टरी — देशभर के सभी सत्यापित सदस्यों, वरिष्ठजनों एवं प्रबुद्धजनों का आधिकारिक मंच।
            </p>
            <p className="text-[11px] text-[#64748B]">
              पोर्टल डोमेन: <span className="font-semibold text-[#102F6B]">alokworld.in</span>
            </p>
          </StaggerItem>

          {/* Col 2: Directory & Samaj Navigation */}
          <StaggerItem className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102F6B] border-b border-[#F26A21]/30 pb-1">
              सामुदायिक नेविगेशन
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/" className="text-[#263449] hover:text-[#F26A21] transition-colors">मुख्य पृष्ठ (होम)</Link></li>
              <li><Link href="/directory" className="text-[#263449] hover:text-[#F26A21] transition-colors">समाज डायरेक्टरी</Link></li>
              <li><Link href="/history" className="text-[#263449] hover:text-[#F26A21] transition-colors">समाज इतिहास</Link></li>
              <li><Link href="/personalities" className="text-[#263449] hover:text-[#F26A21] transition-colors">ऐतिहासिक विभूतियां</Link></li>
              <li><Link href="/organization" className="text-[#263449] hover:text-[#F26A21] transition-colors">संगठन एवं कार्यकारिणी</Link></li>
              <li><Link href="/mahasabha" className="text-[#263449] hover:text-[#F26A21] transition-colors">महासभा विवरण</Link></li>
            </ul>
          </StaggerItem>

          {/* Col 3: Matrimonial & Gallery & Legal */}
          <StaggerItem className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102F6B] border-b border-[#F26A21]/30 pb-1">
              सेवाएं एवं नियम
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/matrimonial" className="text-[#263449] hover:text-[#F26A21] transition-colors">समाज वैवाहिक</Link></li>
              <li><Link href="/gallery" className="text-[#263449] hover:text-[#F26A21] transition-colors">छायाचित्र दीर्घा</Link></li>
              <li><Link href="/about" className="text-[#263449] hover:text-[#F26A21] transition-colors">हमारे बारे में</Link></li>
              <li><Link href="/contact" className="text-[#263449] hover:text-[#F26A21] transition-colors">सचिवालय संपर्क</Link></li>
              <li><Link href="/privacy" className="text-[#263449] hover:text-[#F26A21] transition-colors">गोपनीयता नीति</Link></li>
              <li><Link href="/terms" className="text-[#263449] hover:text-[#F26A21] transition-colors">नियम एवं शर्तें</Link></li>
            </ul>
          </StaggerItem>

          {/* Col 4: Secretariat Contact */}
          <StaggerItem className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102F6B] border-b border-[#F26A21]/30 pb-1">
              केंद्रीय सचिवालय सहायता केंद्र
            </h4>
            <div className="space-y-1.5 text-xs text-[#64748B]">
              <p>ईमेल: <a href={`mailto:${contactEmail || "admin@alokworld.in"}`} className="text-[#F26A21] hover:underline font-medium">{contactEmail || "admin@alokworld.in"}</a></p>
              <p>दूरभाष: <a href={`tel:${contactPhone || "+919608553167"}`} className="text-[#F26A21] hover:underline font-medium">{contactPhone || "+91 96085 53167"}</a></p>
              <p className="text-[11px] text-[#64748B]">कार्यालय समय: सोमवार - शनिवार (प्रातः 10:00 से सायं 6:00 बजे)</p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Bottom Attribution Bar with subtle reveal */}
        <FadeIn direction="up" distance={8} duration={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2 pt-2">
            <p>© 2026 अखिल भारतीय समाज डायरेक्टरी (alokworld.in). सर्वाधिकार सुरक्षित।</p>
            <p className="text-center sm:text-right">
              तकनीकी प्रबंधन{" "}
              <a
                href="https://www.kraviona.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F26A21] hover:text-[#091D42] font-semibold underline underline-offset-2 transition-colors"
              >
                Kraviona
              </a>
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
