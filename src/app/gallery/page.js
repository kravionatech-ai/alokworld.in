"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryCarousel from "@/components/GalleryCarousel";

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultGallery = [
    {
      _id: "g1",
      title: "Annual National Samaj Convention - Bhopal",
      category: "National Convention",
      eventDate: "2025",
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
      description: "Historic national gathering uniting over 5,000 community delegates and families from across India.",
    },
    {
      _id: "g2",
      title: "Youth Merit & Academic Felicitation Ceremony",
      category: "Education & Youth",
      eventDate: "2025",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
      description: "Honoring 150+ accomplished students selected in civil services, medical, and engineering disciplines.",
    },
    {
      _id: "g3",
      title: "Veerangana Rani Avanti Bai Commemoration & Valor Day",
      category: "Heritage Festival",
      eventDate: "2025",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
      description: "Memorial convention celebrating the courage and supreme patriotism of the immortal freedom fighter.",
    },
    {
      _id: "g4",
      title: "Community Health Camp & Blood Donation Drive",
      category: "Social Welfare",
      eventDate: "2025",
      imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80",
      description: "Specialist doctors providing comprehensive healthcare screenings and assistance to over 800 rural families.",
    },
    {
      _id: "g5",
      title: "Akhil Bhartiya Executive Working Committee Conference",
      category: "Organization",
      eventDate: "2024",
      imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80",
      description: "Deliberation on youth employment wings, matrimonial assistance, and community welfare funds.",
    },
    {
      _id: "g6",
      title: "Cultural Heritage & Folk Traditions Exhibition",
      category: "Cultural Arts",
      eventDate: "2024",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
      description: "Celebrating traditional arts, literature, folk music, and community history exhibits.",
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

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* Page Title & Intro */}
        <div className="bg-white rounded-lg border border-[#F0E5D5] p-5 sm:p-7 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21] bg-[#FFF0E2] px-2.5 py-0.5 rounded border border-[#F0E5D5]">
            Moments &amp; Memories
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#102F6B] mt-2 tracking-tight">
            Community Photo Gallery &amp; Event Carousel
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Glimpses of community conventions, cultural celebrations, youth symposiums, and felicitation events with interactive touch/swipe support.
          </p>
        </div>

        {/* Swiper Interactive Gallery Carousel & Lightbox */}
        {loading ? (
          <div className="bg-white rounded-lg border border-[#F0E5D5] p-12 text-center text-[#64748B]">
            Loading community gallery...
          </div>
        ) : (
          <GalleryCarousel items={items} />
        )}

        {/* Complete Photo Grid Overview */}
        <section aria-label="All Gallery Photos" className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0E5D5]">
            <h2 className="text-sm sm:text-base font-bold text-[#102F6B]">
              All Gallery Archives ({items.length} Photos)
            </h2>
            <span className="text-xs text-[#64748B]">
              Click any photo to open full-screen slider
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {items.map((img) => (
              <div
                key={img._id}
                className="bg-white rounded-lg border border-[#F0E5D5] overflow-hidden shadow-xs hover:shadow-md hover:border-[#102F6B] transition-all group flex flex-col"
              >
                <div className="h-48 overflow-hidden bg-[#FFFCF5] relative">
                  <img
                    src={img.imageUrl}
                    alt={img.title ? `${img.title} - Samaj Community Photo Gallery` : "Samaj Community Event Photo"}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-[#102F6B]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {img.category || "Community"}
                  </span>
                  {img.eventDate && (
                    <span className="absolute top-2 right-2 bg-white/95 text-[#102F6B] text-[10px] font-bold px-2 py-0.5 rounded border border-[#F0E5D5]">
                      {img.eventDate}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#102F6B] line-clamp-1 group-hover:text-[#F26A21] transition-colors">
                      {img.title}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mt-1">
                      {img.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
