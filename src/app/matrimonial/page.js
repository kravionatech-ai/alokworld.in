"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function MatrimonialPage() {
  const [profiles, setProfiles] = useState([]);
  const [genderFilter, setGenderFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Default sample matrimonial entries
  const defaultProfiles = [
    {
      _id: "m1",
      fullName: "Ankit Lodhi",
      gender: "Male",
      dob: "15 Oct 1996 (Age: 29)",
      height: "5 ft 10 in",
      education: "B.Tech (Computer Science), NIT Bhopal",
      occupation: "Senior Software Engineer @ MNC",
      annualIncome: "₹24 LPA",
      city: "Bengaluru",
      state: "Karnataka",
      gotra: "Kashyap",
      fatherName: "Shri Kailash Lodhi (Retd. Govt Officer)",
      familyCity: "Bhopal, MP",
    },
    {
      _id: "m2",
      fullName: "Pooja Lodha",
      gender: "Female",
      dob: "22 Aug 1998 (Age: 27)",
      height: "5 ft 4 in",
      education: "MBBS, MD (General Medicine)",
      occupation: "Doctor (Resident Physician)",
      annualIncome: "₹18 LPA",
      city: "Jaipur",
      state: "Rajasthan",
      gotra: "Vashishta",
      fatherName: "Dr. R. K. Lodha (Civil Surgeon)",
      familyCity: "Jaipur, Rajasthan",
    },
    {
      _id: "m3",
      fullName: "Rohit Lodhi",
      gender: "Male",
      dob: "04 May 1995 (Age: 30)",
      height: "5 ft 9 in",
      education: "Chartered Accountant (CA), B.Com",
      occupation: "Assistant Director (Auditing Firm)",
      annualIncome: "₹20 LPA",
      city: "Mumbai",
      state: "Maharashtra",
      gotra: "Bharadwaj",
      fatherName: "Shri Suresh Chandra Lodhi (Businessman)",
      familyCity: "Indore, MP",
    },
  ];

  useEffect(() => {
    const params = new URLSearchParams();
    if (genderFilter !== "All") params.set("gender", genderFilter);
    if (cityFilter !== "All") params.set("city", cityFilter);

    fetch(`/api/matrimonial?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.profiles && data.profiles.length > 0) {
          setProfiles(data.profiles);
        } else {
          setProfiles(defaultProfiles);
        }
      })
      .catch(() => setProfiles(defaultProfiles))
      .finally(() => setLoading(false));
  }, [genderFilter, cityFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#172B4D]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-5 sm:p-7 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C83B08] bg-[#FFE6C7] px-2.5 py-0.5 rounded border border-[#F3D8B0]">
                Community Matchmaking
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#082F75] mt-2 tracking-tight">
                समाज वैवाहिक मंच (Samaj Matrimonial)
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                A verified, respectful matrimonial directory helping families connect across cities with trust and community dignity.
              </p>

              {/* Filters */}
              <div className="mt-4 pt-4 border-t border-[#F3D8B0]/60 flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold text-[#172B4D]">Filter by Gender:</span>
                <div className="flex gap-1.5">
                  {["All", "Male", "Female"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenderFilter(g)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer border ${
                        genderFilter === g
                          ? "bg-[#082F75] text-white border-[#082F75]"
                          : "bg-[#FFF9E8] text-[#172B4D] border-[#F3D8B0] hover:bg-[#FFE6C7]/60"
                      }`}
                    >
                      {g === "All" ? "All Profiles" : g === "Male" ? "Groom (वर)" : "Bride (वधू)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profiles Grid */}
            <div className="space-y-3.5">
              {profiles.map((p) => (
                <div
                  key={p._id}
                  className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#082F75] transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F3D8B0]/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[#082F75]">{p.fullName}</h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFE6C7] text-[#C83B08] border border-[#F3D8B0]">
                          {p.gender === "Male" ? "वर (Groom)" : "वधू (Bride)"}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {p.dob} • Height: {p.height} • Gotra: {p.gotra}
                      </p>
                    </div>

                    <a
                      href="/contact"
                      className="px-3.5 py-1.5 bg-[#F4510B] hover:bg-[#C83B08] text-white text-xs font-bold rounded transition-colors shrink-0 shadow-xs"
                    >
                      Express Interest →
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs text-[#172B4D]">
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Education:</span>
                      <strong className="text-[#082F75]">{p.education}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Occupation &amp; Income:</span>
                      <strong className="text-[#082F75]">{p.occupation} {p.annualIncome && `(${p.annualIncome})`}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Current Location:</span>
                      <span className="font-medium">{p.city}, {p.state}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Family Background:</span>
                      <span className="font-medium">{p.fatherName} • {p.familyCity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
