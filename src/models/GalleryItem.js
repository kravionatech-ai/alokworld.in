import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "Event", trim: true }, // e.g. Event, Convention, Meeting, Heritage
    imageUrl: { type: String, required: true },
    description: { type: String, default: "" },
    eventDate: { type: String, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.GalleryItem || mongoose.model("GalleryItem", GalleryItemSchema);
