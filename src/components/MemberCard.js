export default function MemberCard({ member }) {
  const { name, role, occupation, company, city, state, phone, email, tags } = member;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between group hover:border-orange-200">
      <div>
        {/* Top Header: Avatar & Basic Info */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm shadow-orange-500/10">
            {name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                {name}
              </h3>
            </div>
            {role && (
              <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
                {role}
              </span>
            )}
          </div>
        </div>

        {/* Occupation & Organization */}
        <div className="mt-4 pt-3 border-t border-gray-50 space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
            <svg
              className="w-4 h-4 text-orange-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="truncate">{occupation}</span>
          </div>

          {company && (
            <div className="text-xs text-gray-500 pl-6 truncate">
              {company}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-gray-600 pt-1">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {city}, {state}
            </span>
          </div>
        </div>

        {/* Tags / Specialization */}
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Quick Contact */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <a
          href={`tel:${phone}`}
          className="inline-flex items-center gap-1.5 text-gray-600 hover:text-orange-600 font-medium py-1 transition-colors"
          title={`Call ${name}`}
        >
          <svg
            className="w-3.5 h-3.5 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>{phone}</span>
        </a>

        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1 text-gray-500 hover:text-orange-600 font-medium py-1 transition-colors"
          title={`Email ${name}`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>Email</span>
        </a>
      </div>
    </div>
  );
}
