import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "Directory Administrator",
    },
    role: {
      type: String,
      enum: ["superadmin", "editor"],
      default: "superadmin",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
