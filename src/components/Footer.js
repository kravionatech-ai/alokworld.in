import Link from "next/link";

export default function Footer({ contactEmail, contactPhone }) {
  return (
    <footer className="bg-[#FFF9E8] border-t-2 border-[#F3D8B0] mt-12 pt-8 pb-6 text-[#172B4D]">
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 pb-6 border-b border-[#F3D8B0]">
          {/* Col 1: Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#082F75] text-[#FFF9E8] border border-[#F4510B] flex items-center justify-center font-bold text-sm">
                स्
              </div>
              <span className="font-bold text-sm text-[#082F75] tracking-tight">
                अखिल भारतीय समाज
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Official Samaj Community Directory connecting verified members, professionals, and community leadership.
            </p>
            <p className="text-[11px] text-[#64748B]">
              Domain: <span className="font-semibold text-[#082F75]">alokworld.in</span>
            </p>
          </div>

          {/* Col 2: Directory & Samaj Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#082F75] border-b border-[#F4510B]/30 pb-1">
              Community Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/" className="text-[#082F75] hover:text-[#F4510B] transition-colors">Home Portal</Link></li>
              <li><Link href="/directory" className="text-[#082F75] hover:text-[#F4510B] transition-colors">Samaj Directory</Link></li>
              <li><Link href="/history" className="text-[#082F75] hover:text-[#F4510B] transition-colors">Samaj History</Link></li>
              <li><Link href="/personalities" className="text-[#082F75] hover:text-[#F4510B] transition-colors">Historical Personalities</Link></li>
              <li><Link href="/organization" className="text-[#082F75] hover:text-[#F4510B] transition-colors">Samaj Organization</Link></li>
              <li><Link href="/mahasabha" className="text-[#082F75] hover:text-[#F4510B] transition-colors">Mahasabha Information</Link></li>
            </ul>
          </div>

          {/* Col 3: Matrimonial & Gallery & Legal */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#082F75] border-b border-[#F4510B]/30 pb-1">
              Community Services &amp; Legal
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/matrimonial" className="text-[#082F75] hover:text-[#F4510B] transition-colors">Samaj Matrimonial</Link></li>
              <li><Link href="/gallery" className="text-[#082F75] hover:text-[#F4510B] transition-colors">Photo Gallery</Link></li>
              <li><Link href="/about" className="text-[#082F75] hover:text-[#F4510B] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-[#082F75] hover:text-[#F4510B] transition-colors">Contact Secretariat</Link></li>
              <li><Link href="/privacy" className="text-[#082F75] hover:text-[#F4510B] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#082F75] hover:text-[#F4510B] transition-colors">Terms and Conditions</Link></li>
            </ul>
          </div>

          {/* Col 4: Secretariat Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#082F75] border-b border-[#F4510B]/30 pb-1">
              Secretariat Helpdesk
            </h4>
            <div className="space-y-1.5 text-xs text-[#64748B]">
              <p>Email: <a href={`mailto:${contactEmail || "admin@alokworld.in"}`} className="text-[#F4510B] hover:text-[#C83B08] font-medium hover:underline">{contactEmail || "admin@alokworld.in"}</a></p>
              <p>Phone: <a href={`tel:${contactPhone || "+919608553167"}`} className="text-[#F4510B] hover:text-[#C83B08] font-medium hover:underline">{contactPhone || "+91 96085 53167"}</a></p>
              <p className="text-[11px] text-[#64748B]">Timings: Mon - Sat (10:00 AM - 6:00 PM)</p>
            </div>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-block text-xs font-semibold text-white bg-[#082F75] hover:bg-[#071D49] px-3 py-1.5 rounded transition-colors"
              >
                Admin Login →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Attribution Bar (Plain text only, subtle) */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2 pt-2">
          <p>© 2026 Samaj Community Directory (alokworld.in). All rights reserved.</p>
          <p className="text-center sm:text-right">
            Maintained by{" "}
            <a
              href="https://www.kraviona.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F4510B] hover:text-[#C83B08] font-semibold underline underline-offset-2 transition-colors"
            >
              Kraviona
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
