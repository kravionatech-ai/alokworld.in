export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  locations = [],
  totalResults = 0,
}) {
  return (
    <div className="bg-[#FFFDF6] rounded-lg p-4 sm:p-5 border border-[#F3D8B0] shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="md:col-span-7 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search member by name, profession, business, or keyword..."
            className="w-full pl-3 pr-16 py-2.5 bg-white hover:bg-[#FFFDF6] focus:bg-white text-[#172B4D] placeholder-[#64748B] text-xs sm:text-sm rounded border border-[#F3D8B0] focus:border-[#082F75] focus:ring-2 focus:ring-[#082F75]/20 transition-all outline-hidden font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748B] hover:text-[#F4510B]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Location selector */}
        <div className="md:col-span-5 relative">
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-white hover:bg-[#FFFDF6] focus:bg-white text-[#172B4D] text-xs sm:text-sm rounded border border-[#F3D8B0] focus:border-[#082F75] focus:ring-2 focus:ring-[#082F75]/20 transition-all outline-hidden cursor-pointer font-medium"
          >
            <option value="All">All Locations &amp; Cities (सभी क्षेत्र)</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-[#F3D8B0]/60 flex items-center justify-between text-xs text-[#64748B]">
        <span>
          Showing <strong className="text-[#082F75] font-bold">{totalResults}</strong> community member{totalResults === 1 ? "" : "s"}
        </span>
        {(searchQuery || selectedLocation !== "All") && (
          <button
            onClick={() => {
              onSearchChange("");
              onLocationChange("All");
            }}
            className="text-[#F4510B] hover:text-[#C83B08] font-semibold underline underline-offset-2 cursor-pointer transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
