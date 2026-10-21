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
      title: "Annual National Samaj Convention - Bhopal",
      category: "National Convention",
      eventDate: "2025",
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80",
      description: "Historic national gathering uniting over 5,000 community delegates and families from across India.",
    },
    {
      _id: "g2",
      title: "Youth Merit & Academic Felicitation Ceremony",
      category: "Education & Youth",
      eventDate: "2025",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80",
      description: "Honoring 150+ accomplished students selected in civil services, medical, and engineering disciplines.",
    },
    {
      _id: "g3",
      title: "Veerangana Rani Avanti Bai Commemoration & Valor Day",
      category: "Heritage Festival",
      eventDate: "2025",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
      description: "Memorial convention celebrating the courage and supreme patriotism of the immortal freedom fighter.",
    },
    {
      _id: "g4",
      title: "Community Health Camp & Blood Donation Drive",
      category: "Social Welfare",
      eventDate: "2025",
      imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80",
      description: "Specialist doctors providing comprehensive healthcare screenings and assistance to over 800 rural families.",
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
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-[#263449]">
      <Header />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
            Moments &amp; Memories
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
            Community Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Glimpses of community conventions, cultural celebrations, youth symposiums, and felicitation events.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((img) => (
            <div
              key={img._id}
              className="bg-white rounded-lg border border-[#F0E5D5] overflow-hidden shadow-xs hover:shadow-md hover:border-[#102F6B] transition-all group"
            >
              <div className="h-48 overflow-hidden bg-[#FFFCF5]">
                <img
                  src={img.imageUrl}
                  alt={img.title ? `${img.title} - Samaj Community Photo Gallery` : "Samaj Community Event Photo"}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#F26A21] font-semibold">
                  <span>{img.category}</span>
                  {img.eventDate && <span className="text-[#64748B]">{img.eventDate}</span>}
                </div>
                <h3 className="text-sm font-bold text-[#102F6B] line-clamp-1 group-hover:text-[#F26A21] transition-colors">
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
