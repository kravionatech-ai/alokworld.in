"use client";

import { useState } from "react";

export default function SearchFilterBar({
  searchQuery = "",
  onSearchChange,
  selectedCity,
  selectedLocation,
  onCityChange,
  onLocationChange,
  selectedState = "All",
  onStateChange,
  selectedProfession = "All",
  onProfessionChange,
  selectedOrganization = "All",
  onOrganizationChange,
  selectedSort = "newest",
  onSortChange,
  cities = [],
  locations = [],
  states = [],
  professions = [],
  organizations = [],
  totalResults = 0,
  onResetFilters,
  viewMode = "grid",
  onViewModeChange,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeCity = selectedCity !== undefined ? selectedCity : (selectedLocation || "All");
  const handleCityChange = onCityChange || onLocationChange;
  const cityList = cities.length > 0 ? cities : locations;

  const hasActiveFilters =
    Boolean(searchQuery) ||
    activeCity !== "All" ||
    selectedState !== "All" ||
    selectedProfession !== "All" ||
    selectedOrganization !== "All" ||
    selectedSort !== "newest";

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      if (onSearchChange) onSearchChange("");
      if (handleCityChange) handleCityChange("All");
      if (onStateChange) onStateChange("All");
      if (onProfessionChange) onProfessionChange("All");
      if (onOrganizationChange) onOrganizationChange("All");
      if (onSortChange) onSortChange("newest");
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-5 border border-[#E9D9C5] shadow-xs mb-5 space-y-3.5">
      {/* Primary Row: Search Input + City Filter + Sort + Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search by name, profession, city, organization..."
            className="w-full pl-3 pr-14 py-2.5 bg-white text-[#263449] placeholder-[#64748B] text-xs sm:text-sm rounded border border-[#E9D9C5] focus:border-[#102F6B] focus:ring-2 focus:ring-[#102F6B]/15 transition-all outline-hidden font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange && onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748B] hover:text-[#F26A21] cursor-pointer"
              title="Clear search input"
            >
              Clear ✕
            </button>
          )}
        </div>

        {/* City Filter */}
        <div className="md:col-span-3 relative">
          <select
            value={activeCity}
            onChange={(e) => handleCityChange && handleCityChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-white text-[#263449] text-xs sm:text-sm rounded border border-[#E9D9C5] focus:border-[#102F6B] focus:ring-2 focus:ring-[#102F6B]/15 transition-all outline-hidden cursor-pointer font-medium"
          >
            <option value="All">All Cities &amp; Regions</option>
            {cityList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order Selector */}
        <div className="md:col-span-2 relative">
          <select
            value={selectedSort}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-white text-[#263449] text-xs sm:text-sm rounded border border-[#E9D9C5] focus:border-[#102F6B] focus:ring-2 focus:ring-[#102F6B]/15 transition-all outline-hidden cursor-pointer font-medium"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="name_asc">Sort: Name (A to Z)</option>
            <option value="name_desc">Sort: Name (Z to A)</option>
            <option value="city_asc">Sort: By City</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>

        {/* Advanced Filter Toggle Button */}
        <div className="md:col-span-2 flex items-center justify-between sm:justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`w-full py-2.5 px-3 text-xs font-bold rounded border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              showAdvanced || selectedState !== "All" || selectedProfession !== "All" || selectedOrganization !== "All"
                ? "bg-[#102F6B] text-white border-[#102F6B]"
                : "bg-[#FFF9ED] text-[#102F6B] border-[#E9D9C5] hover:bg-[#FFF0E2]"
            }`}
          >
            <span>Filters</span>
            <span>{showAdvanced ? "▲" : "▾"}</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Drawer: State, Profession, Organization */}
      {showAdvanced && (
        <div className="pt-3 border-t border-[#E9D9C5] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
          {/* State Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1">State / Province</label>
            <select
              value={selectedState}
              onChange={(e) => onStateChange && onStateChange(e.target.value)}
              className="w-full px-3 py-2 bg-white text-[#263449] text-xs rounded border border-[#E9D9C5] focus:border-[#102F6B] outline-hidden cursor-pointer"
            >
              <option value="All">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Profession Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1">Profession / Occupation</label>
            <select
              value={selectedProfession}
              onChange={(e) => onProfessionChange && onProfessionChange(e.target.value)}
              className="w-full px-3 py-2 bg-white text-[#263449] text-xs rounded border border-[#E9D9C5] focus:border-[#102F6B] outline-hidden cursor-pointer"
            >
              <option value="All">All Professions</option>
              {professions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Organization / Company Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1">Company / Organization</label>
            <select
              value={selectedOrganization}
              onChange={(e) => onOrganizationChange && onOrganizationChange(e.target.value)}
              className="w-full px-3 py-2 bg-white text-[#263449] text-xs rounded border border-[#E9D9C5] focus:border-[#102F6B] outline-hidden cursor-pointer"
            >
              <option value="All">All Organizations</option>
              {organizations.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Footer Strip: Results Counter + View Toggle + Reset */}
      <div className="pt-2 border-t border-[#E9D9C5] flex flex-wrap items-center justify-between text-xs text-[#64748B] gap-2">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-[#102F6B] font-bold">{totalResults}</strong> verified member{totalResults === 1 ? "" : "s"}
          </span>

          {hasActiveFilters && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF0E2] text-[#F26A21] border border-[#E9D9C5]">
              Filters Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          {onViewModeChange && (
            <div className="inline-flex rounded border border-[#E9D9C5] overflow-hidden">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                className={`px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#102F6B] text-white"
                    : "bg-white text-[#263449] hover:bg-[#FFF0E2]"
                }`}
                title="Grid view"
              >
                ▦ Grid
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                className={`px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#102F6B] text-white"
                    : "bg-white text-[#263449] hover:bg-[#FFF0E2]"
                }`}
                title="Table view"
              >
                ☰ Table
              </button>
            </div>
          )}

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-[#F26A21] hover:underline font-bold cursor-pointer transition-colors"
            >
              Reset Filters ↺
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
