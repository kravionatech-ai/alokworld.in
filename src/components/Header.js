export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Samaj Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-orange-500/20">
              <span>स्</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 block leading-tight">
                समाज <span className="text-orange-600">डिरेक्टरी</span>
              </span>
              <span className="text-xs font-medium text-gray-500 tracking-wide uppercase">
                Community Directory Portal
              </span>
            </div>
          </div>

          {/* Quick Badges / Navigation */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Community Directory
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
