import mongoose from "mongoose";

const PersonalitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true }, // e.g. Freedom Fighter, Social Reformer, Maharaja
    era: { type: String, default: "" }, // e.g. 1804 - 1858
    photo: { type: String, default: "" },
    summary: { type: String, required: true },
    biography: { type: String, default: "" }, // Rich-text HTML
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Personality || mongoose.model("Personality", PersonalitySchema);
