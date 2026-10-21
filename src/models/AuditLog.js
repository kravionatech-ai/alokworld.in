import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      required: true,
      trim: true,
    },
    adminName: {
      type: String,
      trim: true,
      default: "Administrator",
    },
    adminRole: {
      type: String,
      trim: true,
      default: "superadmin",
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    targetEntity: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    targetId: {
      type: String,
      trim: true,
      default: "",
    },
    details: {
      type: String,
      trim: true,
      default: "",
    },
    ip: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
