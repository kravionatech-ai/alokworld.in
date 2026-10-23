import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    notificationStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
      index: true,
    },
    notificationMessageId: {
      type: String,
      default: "",
    },
    confirmationStatus: {
      type: String,
      enum: ["not_applicable", "pending", "sent", "failed"],
      default: "not_applicable",
    },
    confirmationMessageId: {
      type: String,
      default: "",
    },
    lastError: {
      type: String,
      default: "",
    },
    replies: [
      {
        adminEmail: String,
        subject: String,
        message: String,
        sentAt: { type: Date, default: Date.now },
        messageId: String,
        status: { type: String, default: "sent" },
      },
    ],
  },
  { timestamps: true }
);

ContactSchema.index({ createdAt: -1 });

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
