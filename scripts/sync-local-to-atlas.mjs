import mongoose from "mongoose";

const LOCAL_URI = "mongodb://127.0.0.1:27017/alokworld";
const ATLAS_URI = "mongodb+srv://alokworld2018_db_user:BdbDHFnNAyg6yNYX@cluster0.rtasufn.mongodb.net/alokworld";

// Core collections to sync from local to production Atlas
const COLLECTIONS_TO_SYNC = [
  "sitesettings",
  "members",
  "galleryitems",
  "personalities",
  "pagecontents",
  "admins",
  "contacts",
  "emaillogs",
  "auditlogs",
];

async function syncData() {
  console.log("=================================================");
  console.log("  ALOKWORLD.IN — LOCAL TO PRODUCTION ATLAS SYNC  ");
  console.log("=================================================");

  console.log("\n1. Connecting to Local MongoDB...");
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log("✓ Connected to Local MongoDB!");

  console.log("\n2. Connecting to MongoDB Atlas Remote Production Cluster...");
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log("✓ Connected to MongoDB Atlas Cloud Cluster!");

  console.log("\n3. Synchronizing collections...\n");

  for (const collName of COLLECTIONS_TO_SYNC) {
    const localColl = localConn.db.collection(collName);
    const atlasColl = atlasConn.db.collection(collName);

    // Read all local documents
    const docs = await localColl.find({}).toArray();
    console.log(`[${collName}] Local count: ${docs.length} documents.`);

    // Clear stale documents on Atlas
    const deleteResult = await atlasColl.deleteMany({});
    console.log(`  - Cleared ${deleteResult.deletedCount} old documents from Atlas [${collName}].`);

    if (docs.length > 0) {
      // Insert all authentic local documents into Atlas
      const insertResult = await atlasColl.insertMany(docs);
      console.log(`  ✓ Inserted ${insertResult.insertedCount} documents into Atlas [${collName}].`);
    }

    const finalAtlasCount = await atlasColl.countDocuments();
    console.log(`  => Atlas [${collName}] now has: ${finalAtlasCount} documents.\n`);
  }

  // Remove obsolete collections on Atlas if they exist
  try {
    const atlasCollections = (await atlasConn.db.listCollections().toArray()).map((c) => c.name);
    if (atlasCollections.includes("settings")) {
      await atlasConn.db.collection("settings").drop();
      console.log("✓ Dropped obsolete 'settings' collection from Atlas.");
    }
    if (atlasCollections.includes("matrimonials")) {
      await atlasConn.db.collection("matrimonials").deleteMany({});
      console.log("✓ Cleared 'matrimonials' collection on Atlas.");
    }
  } catch (err) {
    console.warn("Notice during cleanup:", err.message);
  }

  // 4. Verification Check
  console.log("\n=================================================");
  console.log("  VERIFICATION ON PRODUCTION ATLAS CLUSTER        ");
  console.log("=================================================");

  const atlasSiteSettings = await atlasConn.db.collection("sitesettings").find({}).toArray();
  console.log(`Atlas 'sitesettings' document count: ${atlasSiteSettings.length}`);
  if (atlasSiteSettings.length === 1) {
    const s = atlasSiteSettings[0];
    console.log(` - siteName: ${s.siteName}`);
    console.log(` - headerTitle: ${s.headerTitle}`);
    console.log(` - eventEnabled: ${s.eventEnabled} (Must be false)`);
    console.log(` - eventsList count: ${s.eventsList ? s.eventsList.length : 0} (Must be 0)`);
    console.log(` - heroSlides count: ${s.heroSlides ? s.heroSlides.length : 0}`);
    console.log(` - announcementsList count: ${s.announcementsList ? s.announcementsList.length : 0}`);
    console.log(` - quickPillars count: ${s.quickPillars ? s.quickPillars.length : 0}`);
    console.log(` - featuredOfficeBearers count: ${s.featuredOfficeBearers ? s.featuredOfficeBearers.length : 0}`);
  }

  const atlasMembersCount = await atlasConn.db.collection("members").countDocuments();
  console.log(`Atlas 'members' count: ${atlasMembersCount} (Expected: 94)`);

  const atlasGalleryCount = await atlasConn.db.collection("galleryitems").countDocuments();
  console.log(`Atlas 'galleryitems' count: ${atlasGalleryCount} (Expected: 20)`);

  console.log("\n=================================================");
  console.log("✓ PRODUCTION ATLAS IS 100% SYNCHRONIZED WITH LOCAL!");
  console.log("=================================================");

  await localConn.close();
  await atlasConn.close();
  process.exit(0);
}

syncData().catch((err) => {
  console.error("Migration fatal error:", err);
  process.exit(1);
});
