const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alokworld';

// Member Schema
const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, trim: true, index: true },
    role: { type: String, trim: true, default: "Member" },
    occupation: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: "" },
    city: { type: String, required: true, trim: true, index: true },
    state: { type: String, required: true, trim: true, index: true },
    address: { type: String, trim: true, default: "" },
    pincode: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, lowercase: true, trim: true, default: "" },
    avatar: { type: String, default: "" },
    biography: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    order: { type: Number, default: 999, index: true },
    membershipStatus: { type: String, enum: ["active", "pending", "archived"], default: "active" },
    isApproved: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: true },
    showAddress: { type: Boolean, default: false },
    sourceFile: { type: String, default: "" },
    sourceRow: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Member = mongoose.models.Member || mongoose.model('Member', MemberSchema);

async function importVerifiedRecords() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for verified data import...');

  // 1. Create backup of current members before any modifications
  const currentMembers = await Member.find({}).lean();
  const backupDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  const backupPath = path.join(backupDir, `members-backup-${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(currentMembers, null, 2));
  console.log(`✓ Safety backup created: ${backupPath} (${currentMembers.length} records backed up)`);

  // 2. Load verified records
  const dataPath = path.join(__dirname, 'verified-source-members.json');
  if (!fs.existsSync(dataPath)) {
    throw new Error(`Verified source data not found at ${dataPath}. Run scripts/verify-real-records.js first.`);
  }
  const verifiedList = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`Loaded ${verifiedList.length} verified records from source extraction.`);

  // 3. Process records with full traceability report
  let importedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let duplicateCount = 0;
  let invalidCount = 0;

  const seenInBatch = new Set();

  for (const record of verifiedList) {
    if (!record.name || record.name.trim().length < 2) {
      console.warn(`[INVALID] Skipping record without valid name:`, record);
      invalidCount++;
      continue;
    }

    const cleanName = record.name.trim();

    if (seenInBatch.has(cleanName)) {
      console.warn(`[DUPLICATE IN BATCH] Record already processed in this batch: ${cleanName}`);
      duplicateCount++;
      continue;
    }
    seenInBatch.add(cleanName);

    // Look for existing record by exact name
    const existing = await Member.findOne({ name: cleanName });

    const memberData = {
      name: cleanName,
      slug: record.slug || '',
      role: record.role || 'आलोक पदाधिकारी',
      occupation: record.occupation || record.role || 'वरिष्ठ अधिकारी',
      company: record.company || 'अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)',
      city: record.city || 'अखिल भारतीय',
      state: record.state || 'अखिल भारतीय',
      address: record.address || record.city || '',
      pincode: record.pincode || '',
      phone: record.phone || '', // REAL phone or empty string
      email: '',                 // NO fabricated emails
      avatar: record.avatar || '', // ONLY verified photo or empty string
      biography: record.biography || '',
      order: record.order || 999,
      tags: [],                  // NO hashtags
      membershipStatus: 'active',
      isApproved: true,
      isPublished: true,
      isArchived: false,
      showPhone: Boolean(record.phone),
      showEmail: false,
      showAddress: Boolean(record.address),
      sourceFile: record.sourceFile || '',
      sourceRow: record.sourceRow || 0,
    };

    if (existing) {
      await Member.updateOne({ _id: existing._id }, { $set: memberData });
      updatedCount++;
    } else {
      await Member.create(memberData);
      importedCount++;
    }
  }

  // Remove any leftover demo/dummy members that do not match verified source names
  const allCurrent = await Member.find({});
  let removedDummyCount = 0;
  for (const m of allCurrent) {
    if (!seenInBatch.has(m.name)) {
      await Member.deleteOne({ _id: m._id });
      removedDummyCount++;
    }
  }

  const finalTotal = await Member.countDocuments({ isPublished: true });

  console.log('\n======================================================');
  console.log('       SAFE VERIFIED DATA IMPORT AUDIT REPORT         ');
  console.log('======================================================');
  console.log(`Source records parsed:      ${verifiedList.length}`);
  console.log(`New records imported:       ${importedCount}`);
  console.log(`Existing records updated:   ${updatedCount}`);
  console.log(`Duplicate batch skipped:    ${duplicateCount}`);
  console.log(`Invalid records skipped:    ${invalidCount}`);
  console.log(`Unverified dummy removed:   ${removedDummyCount}`);
  console.log(`Final published directory:  ${finalTotal} verified members`);
  console.log('======================================================\n');

  await mongoose.disconnect();
}

importVerifiedRecords().catch(err => {
  console.error('Import error:', err);
  process.exit(1);
});
