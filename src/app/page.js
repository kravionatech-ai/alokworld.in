export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-between items-center px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Section: Domain Identity & Status Badge */}
      <div className="w-full flex flex-col items-center gap-3">
        <span className="text-sm sm:text-base font-semibold tracking-wide text-gray-800">
          alokwork<span className="text-orange-600">.in</span>
        </span>
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/70">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          Scheduled Maintenance
        </span>
      </div>

      {/* Main Center Message */}
      <div className="max-w-xl w-full text-center my-auto py-12">
        {/* Subtle orange accent icon container */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-6 shadow-xs">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          Website Under Maintenance
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
          We are working to improve your experience. Please visit us again soon.
        </p>

        {/* Subtle orange accent divider */}
        <div className="mt-8 flex justify-center">
          <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
        </div>
      </div>

      {/* Footer Branding - Plain text only */}
      <footer className="w-full text-center text-xs text-gray-500 pt-6">
        <p>
          Maintained by{" "}
          <a
            href="https://www.kraviona.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2 transition-colors"
          >
            Kraviona
          </a>
        </p>
      </footer>
    </main>
  );
}
