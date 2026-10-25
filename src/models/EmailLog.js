import mongoose from "mongoose";

const EmailLogSchema = new mongoose.Schema(
  {
    direction: {
      type: String,
      enum: ["outbound", "inbound"],
      default: "outbound",
      index: true,
    },
    emailType: {
      type: String,
      enum: [
        "contact_notification",
        "visitor_confirmation",
        "admin_reply",
        "direct_email",
        "inbound_email",
        "system",
      ],
      default: "system",
      index: true,
    },
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    replyTo: {
      type: String,
      default: "",
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    htmlBody: {
      type: String,
      default: "",
    },
    textBody: {
      type: String,
      default: "",
    },
    providerMessageId: {
      type: String,
      default: "",
      index: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "sent",
        "delivered",
        "bounced",
        "failed",
        "received",
        "complained",
      ],
      default: "pending",
      index: true,
    },
    contactInquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      default: null,
      index: true,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    bouncedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    attachments: [
      {
        filename: String,
        contentType: String,
        size: Number,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

EmailLogSchema.index({ createdAt: -1 });
EmailLogSchema.index({ status: 1, direction: 1 });

export default mongoose.models.EmailLog || mongoose.model("EmailLog", EmailLogSchema);
