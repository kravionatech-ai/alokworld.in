"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default historical icons in case database is loading
  const defaultList = [
    {
      _id: "p1",
      name: "वीरांगना रानी अवंतीबाई लोधी",
      title: "1857 स्वतंत्रता संग्राम की अमर नायिका",
      era: "1831 - 1858",
      photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80",
      summary: "रामगढ़ रियासत की महारानी जिन्होंने 1857 के प्रथम स्वतंत्रता संग्राम में अंग्रेजों के विरुद्ध वीरतापूर्वक संघर्ष किया और मातृभूमि के लिए सर्वोच्च बलिदान दिया।",
    },
    {
      _id: "p2",
      name: "शहीद गुलाब सिंह लोधी",
      title: "अमर स्वतंत्रता सेनानी एवं ध्वज वाहक",
      era: "1903 - 1935",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
      summary: "लखनऊ के अमीनाबाद पार्क में ब्रिटिश गोलियों के सामने तिरंगा फहराते हुए अमर बलिदान देने वाले युवा क्रांतिकारी सपूत।",
    },
    {
      _id: "p3",
      name: "स्वामी ब्रह्मानंद जी",
      title: "शिक्षा सुधारक, समाज सुधारक एवं सांसद",
      era: "1894 - 1984",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
      summary: "बुंदेलखंड में शिक्षा क्रांति के जनक, जिन्होंने सैकड़ों गुरुकुल, विद्यालय और महाविद्यालय स्थापित कर वंचित वर्ग के उत्थान का मार्ग प्रशस्त किया।",
    },
    {
      _id: "p4",
      name: "राजा हृदयशाह लोधी",
      title: "1842 बुंदेला विद्रोह के प्रमुख जननायक",
      era: "1806 - 1852",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      summary: "हीरापुर के राजा जिन्होंने अंग्रेजों की शोषणकारी नीतियों के विरुद्ध 1842 में सशस्त्र क्रांति का नेतृत्व किया था।",
    }
  ];

  useEffect(() => {
    fetch("/api/personalities")
      .then((res) => res.json())
      .then((data) => {
        if (data?.personalities && data.personalities.length > 0) {
          setPersonalities(data.personalities);
        } else {
          setPersonalities(defaultList);
        }
      })
      .catch(() => setPersonalities(defaultList))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#172B4D]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-5 sm:p-7 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C83B08] bg-[#FFE6C7] px-2.5 py-0.5 rounded border border-[#F3D8B0]">
                Icons &amp; Legends
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#082F75] mt-2 tracking-tight">
                समाज के गौरवशाली महापुरुष एवं ऐतिहासिक विभूतियां
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Honoring the brave freedom fighters, reformers, philosophers, and nation builders from our community heritage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {personalities.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#082F75] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-13 h-13 rounded-lg bg-[#082F75] text-white flex items-center justify-center font-bold text-lg shrink-0 border border-[#F4510B]">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-[#082F75] leading-tight">
                          {item.name}
                        </h2>
                        <span className="text-[11px] font-semibold text-[#F4510B] block mt-0.5">
                          {item.title}
                        </span>
                        {item.era && (
                          <span className="text-[10px] text-[#64748B] block font-mono">
                            {item.era}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-[#64748B] leading-relaxed pt-2 border-t border-[#F3D8B0]/60">
                      {item.summary}
                    </p>
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
