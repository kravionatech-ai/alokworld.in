import fs from "fs";
import mongoose from "mongoose";

const map = JSON.parse(fs.readFileSync("scripts/cloudinary-url-map.json", "utf8"));

// Helper to replace all local asset paths with cloudinary URLs
function replaceAssetUrls(text) {
  let updated = text;
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const k of sortedKeys) {
    if (k.startsWith("/asset/")) {
      const cUrl = map[k];
      updated = updated.split(k).join(cUrl);
      const enc = encodeURI(k);
      if (enc !== k) {
        updated = updated.split(enc).join(cUrl);
      }
    }
  }
  return updated;
}

async function main() {
  console.log("=== APPLYING CLOUDINARY URLS TO FILES & CODEBASE ===");

  const filesToUpdate = [
    "src/data/alok_master_data.json",
    "public/asset/data/alok_master_data.json",
    "scripts/authentic-members.json",
    "scripts/verified-source-members.json",
    "src/data/members.js",
    "src/components/RightSidebar.js",
    "src/app/organization/page.js",
    "src/app/personalities/page.js",
    "src/app/gallery/page.js",
    "src/app/page.js",
    "src/models/SiteSettings.js",
    "src/app/api/settings/route.js",
  ];

  for (const f of filesToUpdate) {
    if (fs.existsSync(f)) {
      const original = fs.readFileSync(f, "utf8");
      const replaced = replaceAssetUrls(original);
      if (original !== replaced) {
        fs.writeFileSync(f, replaced, "utf8");
        console.log(`✓ Updated file with Cloudinary URLs: ${f}`);
      }
    }
  }

  console.log("\n=== UPDATING MONGODB DATABASE COLLECTIONS ===");
  await mongoose.connect("mongodb://127.0.0.1:27017/alokworld");
  const db = mongoose.connection.db;

  // 1. Members
  const members = await db.collection("members").find({}).toArray();
  let memberUpdatedCount = 0;
  for (const m of members) {
    if (m.avatar && typeof m.avatar === "string") {
      let newAvatar = m.avatar;
      for (const k of Object.keys(map)) {
        if (m.avatar.includes(k) || (k.includes("/") && m.avatar === k)) {
          newAvatar = map[k];
          break;
        }
      }
      if (newAvatar !== m.avatar) {
        await db.collection("members").updateOne({ _id: m._id }, { $set: { avatar: newAvatar } });
        memberUpdatedCount++;
      }
    }
  }
  console.log(`✓ Updated ${memberUpdatedCount} members with Cloudinary avatars.`);

  // 2. Personalities
  const personalities = await db.collection("personalities").find({}).toArray();
  let persUpdatedCount = 0;
  for (const p of personalities) {
    if (p.image && typeof p.image === "string") {
      let newImg = p.image;
      for (const k of Object.keys(map)) {
        if (p.image.includes(k) || p.image === k) {
          newImg = map[k];
          break;
        }
      }
      if (newImg !== p.image) {
        await db.collection("personalities").updateOne({ _id: p._id }, { $set: { image: newImg } });
        persUpdatedCount++;
      }
    }
  }
  console.log(`✓ Updated ${persUpdatedCount} personalities with Cloudinary images.`);

  // 3. Gallery Items
  const galleryItems = await db.collection("galleryitems").find({}).toArray();
  let galleryUpdatedCount = 0;
  for (const g of galleryItems) {
    if (g.imageUrl && typeof g.imageUrl === "string") {
      let newUrl = g.imageUrl;
      for (const k of Object.keys(map)) {
        if (g.imageUrl.includes(k) || g.imageUrl === k) {
          newUrl = map[k];
          break;
        }
      }
      if (newUrl !== g.imageUrl) {
        await db.collection("galleryitems").updateOne({ _id: g._id }, { $set: { imageUrl: newUrl } });
        galleryUpdatedCount++;
      }
    }
  }
  console.log(`✓ Updated ${galleryUpdatedCount} gallery items with Cloudinary images.`);

  // 4. Site Settings
  const siteSettings = await db.collection("sitesettings").findOne({});
  if (siteSettings) {
    const updateFields = {};
    ["heroImage", "eventImage", "ogImage"].forEach((field) => {
      if (siteSettings[field] && typeof siteSettings[field] === "string") {
        for (const k of Object.keys(map)) {
          if (siteSettings[field].includes(k) || siteSettings[field] === k) {
            updateFields[field] = map[k];
            break;
          }
        }
      }
    });
    if (Object.keys(updateFields).length > 0) {
      await db.collection("sitesettings").updateOne({ _id: siteSettings._id }, { $set: updateFields });
      console.log("✓ Updated SiteSettings with Cloudinary images:", updateFields);
    }
  }

  await mongoose.disconnect();
  console.log("=== DATABASE MIGRATION TO CLOUDINARY COMPLETE ===");
}

main().catch(console.error);
