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
      index: true,
    },
    role: {
      type: String,
      trim: true,
      default: "Member", // e.g. Community Elder, Core Member, Youth Lead, Legal Advisor
    },
    occupation: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    pincode: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
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
    order: {
      type: Number,
      default: 999,
      index: true,
    },
    // Membership Status & Administrative Controls
    membershipStatus: {
      type: String,
      enum: ["active", "pending", "archived"],
      default: "active",
      index: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Granular Consent & Privacy Settings
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
    // Source Traceability
    sourceFile: {
      type: String,
      default: "",
    },
    sourceRow: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound indexes for rapid filtered searches
MemberSchema.index({ city: 1, isPublished: 1, isApproved: 1, isArchived: 1 });
MemberSchema.index({ state: 1, isPublished: 1, isApproved: 1, isArchived: 1 });
MemberSchema.index({ occupation: 1, isPublished: 1, isApproved: 1, isArchived: 1 });

export default mongoose.models.Member || mongoose.model("Member", MemberSchema);
