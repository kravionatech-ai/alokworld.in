"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import SearchFilterBar from "@/components/SearchFilterBar";
import MemberList from "@/components/MemberList";
import { membersData } from "@/data/members";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");

  // Derive unique location list (Cities) from the dummy dataset
  const locations = useMemo(() => {
    const citySet = new Set(membersData.map((m) => m.city));
    return Array.from(citySet).sort();
  }, []);

  // Filter members based on search term and selected city
  const filteredMembers = useMemo(() => {
    return membersData.filter((member) => {
      const matchesLocation =
        selectedLocation === "All" || member.city === selectedLocation;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.occupation.toLowerCase().includes(q) ||
        member.city.toLowerCase().includes(q) ||
        member.state.toLowerCase().includes(q) ||
        (member.company && member.company.toLowerCase().includes(q)) ||
        (member.tags && member.tags.some((tag) => tag.toLowerCase().includes(q)));

      return matchesLocation && matchesSearch;
    });
  }, [searchQuery, selectedLocation]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page Hero / Title Banner */}
        <section className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200/60 px-3 py-1 rounded-full uppercase tracking-wider">
            Samaj Directory
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            समाज डायरेक्टरी एवं संपर्क सूची
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 font-normal">
            Find and connect with fellow community members, professionals, elders, and leaders across India.
          </p>
        </section>

        {/* Search & Location Filter Section */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          locations={locations}
          totalResults={filteredMembers.length}
        />

        {/* Member Directory Cards Grid */}
        <MemberList members={filteredMembers} />
      </main>

      {/* Clean Simple Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200/80 py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© 2026 Samaj Community Directory. Built for community networking &amp; fellowship.</p>
          <p className="text-gray-400">
            Website Developed by{" "}
            <a
              href="https://www.kraviona.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 font-medium underline underline-offset-2 transition-colors"
            >
              Kraviona
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
