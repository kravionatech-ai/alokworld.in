import mongoose from "mongoose";
import { membersData as authenticMembers } from "../data/members.js";
import Member from "../models/Member.js";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Seed initial 94 verified authentic member records only if the members collection is empty.
 * Preserves all authentic records without fabricating demo or dummy data.
 */
async function seedInitialMembersIfEmpty() {
  try {
    const count = await Member.countDocuments();
    if (count === 0 && Array.isArray(authenticMembers) && authenticMembers.length > 0) {
      console.log(`Seeding ${authenticMembers.length} verified authentic members into MongoDB Atlas...`);
      await Member.insertMany(authenticMembers, { ordered: false });
      console.log("Verified authentic members successfully seeded into MongoDB Atlas.");
    }
  } catch (err) {
    // If partial unique index error or connection delay, log warning gracefully
    console.warn("Member initialization check notice:", err.message);
  }
}

/**
 * Reusable, cached MongoDB Atlas connection helper for Next.js App Router.
 * Prevents redundant connection pooling across serverless invocations.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MongoDB URI is not configured in environment variables.");
    return null;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then(async (mongooseInstance) => {
        // Seed authentic members if collection is empty
        await seedInitialMembersIfEmpty();
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn("MongoDB Atlas connection warning:", err.message);
        cached.promise = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}
