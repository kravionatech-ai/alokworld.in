import mongoose from "mongoose";

const PageContentSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String, // Rich-text sanitized HTML content
      default: "",
    },
    bannerTitle: {
      type: String,
      default: "",
      trim: true,
    },
    bannerSubtitle: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },
    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },
    lastEditedBy: {
      type: String,
      default: "admin@alokworld.in",
    },
  },
  { timestamps: true }
);

export default mongoose.models.PageContent || mongoose.model("PageContent", PageContentSchema);
