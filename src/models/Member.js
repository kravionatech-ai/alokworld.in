import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: "Member", // e.g. Community Elder, Core Member, Youth Lead
    },
    occupation: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String, // Cloudinary or image URL
      default: "",
    },
    biography: {
      type: String, // Sanitized rich HTML content
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // Privacy and Visibility Settings (consent-based)
    isApproved: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    showPhone: {
      type: Boolean,
      default: true,
    },
    showEmail: {
      type: Boolean,
      default: true,
    },
    showAddress: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Member || mongoose.model("Member", MemberSchema);
