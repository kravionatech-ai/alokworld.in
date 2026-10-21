import mongoose from "mongoose";

const MatrimonialSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    dob: { type: String, required: true },
    height: { type: String, default: "" },
    education: { type: String, required: true },
    occupation: { type: String, required: true },
    annualIncome: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    gotra: { type: String, default: "" },
    fatherName: { type: String, default: "" },
    fatherOccupation: { type: String, default: "" },
    motherName: { type: String, default: "" },
    familyCity: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    photo: { type: String, default: "" },
    bio: { type: String, default: "" },
    isApproved: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    showContact: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Matrimonial || mongoose.model("Matrimonial", MatrimonialSchema);
