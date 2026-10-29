import mongoose from "mongoose";
import { membersData as authenticMembers } from "../data/members.js";
import Member from "../models/Member.js";
import SiteSettings from "../models/SiteSettings.js";
import Personality from "../models/Personality.js";
import GalleryItem from "../models/GalleryItem.js";
import PageContent from "../models/PageContent.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let isSeeded = false;

// Ensure cached connection is cleared if disconnected
if (typeof mongoose !== "undefined" && mongoose.connection) {
  mongoose.connection.on("disconnected", () => {
    cached.conn = null;
    cached.promise = null;
  });
  mongoose.connection.on("error", (err) => {
    console.warn("[Database] Mongoose connection notice:", err.message);
    cached.conn = null;
    cached.promise = null;
  });
}

/**
 * Seed verified data into MongoDB if collections are empty.
 * Zero dummy data: only authentic records and verified assets.
 */
async function seedInitialDataIfEmpty() {
  if (isSeeded) return;
  try {
    // 1. Seed members if empty
    const memberCount = await Member.countDocuments();
    if (memberCount === 0 && Array.isArray(authenticMembers) && authenticMembers.length > 0) {
      console.log(`[Database] Seeding ${authenticMembers.length} verified authentic members...`);
      await Member.insertMany(authenticMembers, { ordered: false });
      console.log("[Database] Verified authentic members successfully seeded.");
    }

    // 2. Seed site settings if empty
    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      console.log("[Database] Initializing live site settings...");
      await SiteSettings.create({
        siteName: "अखिल भारतीय समाज डिरेक्टरी - alokworld.in",
        tagline: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक)",
        announcement: "राष्ट्रीय अधिवेशन 2026 की पूर्व तैयारी एवं सदस्यता अभियान में सादर आमंत्रित हैं।",
        announcementEnabled: true,
        heroBadge: "आधिकारिक समुदाय पोर्टल",
        heroTitle: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल",
        heroSubtitle: "देश भर के समाज बंधुओं, वरिष्ठ मार्गदर्शकों, चिकित्सकों, अभियंताओं, प्रशासनिक अधिकारियों, अधिवक्ताओं एवं युवाओं को जोड़ने वाला डिजिटल मंच।",
        heroCtaText: "सदस्य डायरेक्टरी देखें →",
        heroCtaLink: "/directory",
        heroImage: "/asset/alokadhivationposter2026/poster1.jpeg",
        sidebarNoticeTitle: "समाज संदेश एवं सूचनाएं",
        sidebarNoticeContent: "सभी समाज बंधुओं से अनुरोध है कि वे अपने परिवार व कार्यक्षेत्र की जानकारी अद्यतन करें।",
        sidebarNoticeEnabled: true,
        keyRegions: ["लखनऊ", "भोपाल", "जयपुर", "नई दिल्ली", "ग्वालियर", "इंदौर", "हैदराबाद", "धौलपुर"],
        adTitle: "समाज व्यापार एवं उद्योग संवर्धन",
        adBannerText: "राष्ट्रव्यापी समाज डायरेक्टरी नेटवर्क के माध्यम से अपने व्यवसाय एवं प्रतिष्ठान का प्रचार करें।",
        adLink: "/contact",
        adEnabled: true,
        contactEmail: "admin@alokworld.in",
        contactPhone: "+91 98734 83657",
        contactAddress: "केंद्रीय राष्ट्रीय सचिवालय, नई दिल्ली, भारत",
        whatsappNumber: "+91 98734 83657",
        seoTitle: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल | alokworld.in",
        seoDescription: "अखिल भारतीय लोधी, लोधा, लोध समाज की आधिकारिक डिजिटल डायरेक्टरी - देश भर के सत्यापित समाज बंधुओं, वरिष्ठ मार्गदर्शकों एवं प्रबुद्ध अधिकारियों से जुड़ें।",
        seoKeywords: "समाज डायरेक्टरी, लोधी समाज, लोधा महासभा, alokworld, समाज पोर्टल, अखिल भारतीय लोधी अधिकारी, लोध समाज डायरेक्टरी",
        siteUrl: "https://alokworld.in",
        ogImage: "/asset/alokadhivationposter2026/poster1.jpeg",
        organizationName: "अखिल भारतीय लोधी, लोधा, लोध समाज महासभा",
        googleVerificationId: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg",
        twitterHandle: "@alokworldin",
        maintenanceMode: false,
        maintenanceBarEnabled: false,
        maintenancePopupEnabled: false,
        maintenanceMessage: "पोर्टल लाइव एवं सक्रिय है।",
        maintenancePopupTitle: "अखिल भारतीय समाज डायरेक्टरी",
        maintenancePopupMessage: "alokworld.in पर आपका स्वागत है!",
      });
      console.log("[Database] Live site settings initialized.");
    }

    // 3. Seed admin if empty
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const email = (process.env.INITIAL_ADMIN_EMAIL || "admin@alokworld.in").toLowerCase();
      const password = process.env.INITIAL_ADMIN_PASSWORD || "AdminSecure@2026";
      const hashedPassword = await bcrypt.hash(password, 10);
      await Admin.create({
        email,
        password: hashedPassword,
        name: "Super Administrator",
        role: "superadmin",
      });
      console.log(`[Database] Default superadmin account initialized: ${email}`);
    }

    isSeeded = true;
  } catch (err) {
    console.warn("[Database] Initialization check notice:", err.message);
  }
}

/**
 * Resilient, cached MongoDB connection helper for Next.js App Router.
 * Automatically tries primary URI (Atlas) and falls back if network whitelist or DNS issues arise.
 */
export async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch {
      cached.promise = null;
    }
  }

  const defaultAtlas = "mongodb+srv://alokworld2018_db_user:BdbDHFnNAyg6yNYX@cluster0.rtasufn.mongodb.net/alokworld";
  const atlasUri = process.env.MONGODB_ATLAS_URI || defaultAtlas;

  // Prefer Atlas URI; if env has a local URI and we are in production or remote, prioritize Atlas
  let primaryUri = process.env.MONGODB_URI;
  if (!primaryUri || (process.env.NODE_ENV === "production" && (primaryUri.includes("127.0.0.1") || primaryUri.includes("localhost")))) {
    primaryUri = atlasUri;
  }
  primaryUri = primaryUri || atlasUri;

  let fallbackUri = process.env.MONGODB_FALLBACK_URI;
  if (!fallbackUri || fallbackUri === primaryUri) {
    fallbackUri = primaryUri.includes("mongodb+srv") ? "mongodb://127.0.0.1:27017/alokworld" : atlasUri;
  }

  const opts = {
    bufferCommands: true,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  };

  cached.promise = (async () => {
    try {
      const conn = await mongoose.connect(primaryUri, opts);
      await seedInitialDataIfEmpty();
      return conn;
    } catch (primaryError) {
      console.warn(`[Database] Primary connection failed: ${primaryError.message}`);

      // Try fallback if primary was different from fallback
      if (primaryUri !== fallbackUri) {
        console.log(`[Database] Attempting fallback to: ${fallbackUri.split("@").pop()}`);
        try {
          const fallbackConn = await mongoose.connect(fallbackUri, opts);
          console.log("[Database] Connected successfully via fallback URI.");
          await seedInitialDataIfEmpty();
          return fallbackConn;
        } catch (fallbackError) {
          console.error("[Database] Fallback connection also failed:", fallbackError.message);
          throw fallbackError;
        }
      }
      throw primaryError;
    }
  })();

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    console.warn("[Database] Could not establish database connection:", err.message);
    return null;
  }
}
