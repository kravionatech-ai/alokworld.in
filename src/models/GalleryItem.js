import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "Event", trim: true }, // e.g. Event, Convention, Meeting, Heritage
    imageUrl: { type: String, required: true },
    publicId: { type: String, default: "" },
    description: { type: String, default: "", trim: true },
    eventDate: { type: String, default: "", trim: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

GalleryItemSchema.index({ category: 1, isPublished: 1, createdAt: -1 });

export default mongoose.models.GalleryItem || mongoose.model("GalleryItem", GalleryItemSchema);
