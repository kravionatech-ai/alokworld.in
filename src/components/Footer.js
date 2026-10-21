import Link from "next/link";

export default function Footer({ contactEmail, contactPhone }) {
  return (
    <footer className="bg-[#FFFCF5] border-t-2 border-[#F0E5D5] mt-12 pt-8 pb-6 text-[#263449]">
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 pb-6 border-b border-[#F0E5D5]">
          {/* Col 1: Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#102F6B] text-white border border-[#F26A21] flex items-center justify-center font-bold text-sm">
                🏛️
              </div>
              <span className="font-bold text-sm text-[#102F6B] tracking-tight">
                Akhil Bhartiya Samaj
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Official Samaj Community Directory connecting verified members, professionals, and community leadership nationwide.
            </p>
            <p className="text-[11px] text-[#64748B]">
              Portal Domain: <span className="font-semibold text-[#102F6B]">alokworld.in</span>
            </p>
          </div>

          {/* Col 2: Directory & Samaj Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102F6B] border-b border-[#F26A21]/30 pb-1">
              Community Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/" className="text-[#263449] hover:text-[#F26A21] transition-colors">Home Portal</Link></li>
              <li><Link href="/directory" className="text-[#263449] hover:text-[#F26A21] transition-colors">Samaj Directory</Link></li>
              <li><Link href="/history" className="text-[#263449] hover:text-[#F26A21] transition-colors">Samaj History</Link></li>
              <li><Link href="/personalities" className="text-[#263449] hover:text-[#F26A21] transition-colors">Historical Personalities</Link></li>
              <li><Link href="/organization" className="text-[#263449] hover:text-[#F26A21] transition-colors">Samaj Organization</Link></li>
              <li><Link href="/mahasabha" className="text-[#263449] hover:text-[#F26A21] transition-colors">Mahasabha Information</Link></li>
            </ul>
          </div>

          {/* Col 3: Matrimonial & Gallery & Legal */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102F6B] border-b border-[#F26A21]/30 pb-1">
              Services &amp; Legal
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/matrimonial" className="text-[#263449] hover:text-[#F26A21] transition-colors">Samaj Matrimonial</Link></li>
              <li><Link href="/gallery" className="text-[#263449] hover:text-[#F26A21] transition-colors">Photo Gallery</Link></li>
              <li><Link href="/about" className="text-[#263449] hover:text-[#F26A21] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-[#263449] hover:text-[#F26A21] transition-colors">Contact Secretariat</Link></li>
              <li><Link href="/privacy" className="text-[#263449] hover:text-[#F26A21] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#263449] hover:text-[#F26A21] transition-colors">Terms and Conditions</Link></li>
            </ul>
          </div>

          {/* Col 4: Secretariat Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102F6B] border-b border-[#F26A21]/30 pb-1">
              Secretariat Helpdesk
            </h4>
            <div className="space-y-1.5 text-xs text-[#64748B]">
              <p>Email: <a href={`mailto:${contactEmail || "admin@alokworld.in"}`} className="text-[#F26A21] hover:underline font-medium">{contactEmail || "admin@alokworld.in"}</a></p>
              <p>Phone: <a href={`tel:${contactPhone || "+919608553167"}`} className="text-[#F26A21] hover:underline font-medium">{contactPhone || "+91 96085 53167"}</a></p>
              <p className="text-[11px] text-[#64748B]">Working Hours: Mon - Sat (10:00 AM - 6:00 PM)</p>
            </div>
          </div>
        </div>

        {/* Bottom Attribution Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2 pt-2">
          <p>© 2026 Samaj Community Directory (alokworld.in). All rights reserved.</p>
          <p className="text-center sm:text-right">
            Maintained by{" "}
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
      </div>
    </footer>
  );
}
