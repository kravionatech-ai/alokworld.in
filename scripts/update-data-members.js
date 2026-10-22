const fs = require('fs');
const path = require('path');

const verifiedList = JSON.parse(fs.readFileSync(path.join(__dirname, 'verified-source-members.json'), 'utf-8'));

const mapped = verifiedList.map((m, idx) => ({
  id: idx + 1,
  _id: `65a000000000000000000${String(idx + 1).padStart(3, '0')}`,
  name: m.name,
  slug: `member-${idx + 1}`,
  role: m.role || 'आलोक पदाधिकारी',
  occupation: m.occupation || m.role,
  company: m.company || 'अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)',
  city: m.city || 'अखिल भारतीय',
  state: m.state || 'अखिल भारतीय',
  address: m.address || m.city || '',
  pincode: m.pincode || '',
  phone: m.phone || '', // ONLY real phone, no fake
  email: '',            // NO fake email
  avatar: m.avatar || '', // ONLY verified photo
  biography: m.biography || '',
  tags: [],             // NO hashtags
  membershipStatus: 'active',
  isApproved: true,
  isPublished: true,
  isArchived: false,
  showPhone: Boolean(m.phone),
  showEmail: false,
  showAddress: Boolean(m.address),
  sourceFile: m.sourceFile,
  sourceRow: m.sourceRow,
}));

const fileContent = `// Auto-generated verified fallback member data from official project assets
export const membersData = ${JSON.stringify(mapped, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'members.js'), fileContent);
console.log(`Successfully updated src/data/members.js with ${mapped.length} verified members.`);
