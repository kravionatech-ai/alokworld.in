"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultGallery = [
    {
      _id: "g1",
      title: "अखिल भारतीय समाज वार्षिक अधिवेशन - भोपाल",
      category: "National Convention",
      eventDate: "2025",
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80",
      description: "वार्षिक महाधिवेशन में देश भर से पधारे 5000+ समाज बंधुओं का ऐतिहासिक समागम।",
    },
    {
      _id: "g2",
      title: "प्रतिभा सम्मान एवं मेधावी छात्रवृत्ति समारोह",
      category: "Education & Youth",
      eventDate: "2025",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80",
      description: "सिविल सेवा, मेडिकल और इंजीनियरिंग में चयनित 150+ मेधावी छात्र-छात्राओं का अभिनंदन।",
    },
    {
      _id: "g3",
      title: "वीरांगना रानी अवंतीबाई जयंती एवं शौर्य दिवस",
      category: "Heritage Festival",
      eventDate: "2025",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
      description: "मातृभूमि की रक्षा में प्राण न्योछावर करने वाली अमर वीरांगना के शौर्य का स्मरण समारोह।",
    },
    {
      _id: "g4",
      title: "निःशुल्क स्वास्थ्य परीक्षण एवं रक्तदान शिविर",
      category: "Social Welfare",
      eventDate: "2025",
      imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80",
      description: "ग्रामीण अंचलों में समाज के विशेषज्ञ चिकित्सकों द्वारा 800+ परिवारों को निःशुल्क परामर्श।",
    },
  ];

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data?.items && data.items.length > 0) {
          setItems(data.items);
        } else {
          setItems(defaultGallery);
        }
      })
      .catch(() => setItems(defaultGallery))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#172B4D]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] p-5 sm:p-7 shadow-sm mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C83B08] bg-[#FFE6C7] px-2.5 py-0.5 rounded border border-[#F3D8B0]">
            Moments &amp; Memories
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#082F75] mt-2 tracking-tight">
            समाज छायाचित्र दीर्घा (Photo Gallery)
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Glimpses of community conventions, cultural celebrations, youth symposiums, and felicitation events.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((img) => (
            <div
              key={img._id}
              className="bg-[#FFFDF6] rounded-lg border border-[#F3D8B0] overflow-hidden shadow-xs hover:shadow-md hover:border-[#082F75] transition-all group"
            >
              <div className="h-48 overflow-hidden bg-[#FFF9E8]">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#F4510B] font-semibold">
                  <span>{img.category}</span>
                  {img.eventDate && <span className="text-[#64748B]">{img.eventDate}</span>}
                </div>
                <h3 className="text-sm font-bold text-[#082F75] line-clamp-1 group-hover:text-[#F4510B] transition-colors">
                  {img.title}
                </h3>
                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                  {img.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
