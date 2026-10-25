import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "Event", trim: true }, // e.g. Event, Convention, Meeting, Heritage
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    imageUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "", trim: true },
    videoId: { type: String, default: "", trim: true }, // YouTube 11-char ID
    publicId: { type: String, default: "" },
    description: { type: String, default: "", trim: true },
    eventDate: { type: String, default: "", trim: true },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }, // Featured on homepage video section
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

GalleryItemSchema.index({ mediaType: 1, category: 1, isPublished: 1, isFeatured: 1, createdAt: -1 });

export default mongoose.models.GalleryItem || mongoose.model("GalleryItem", GalleryItemSchema);
