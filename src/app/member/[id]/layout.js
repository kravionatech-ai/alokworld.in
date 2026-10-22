import { connectDB } from "@/lib/db";
import Member from "@/models/Member";
import { membersData as fallbackMembers } from "@/data/members";

async function getMemberData(id) {
  try {
    const conn = await connectDB();
    if (conn) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const found = await Member.findById(id).lean();
        if (found) return found;
      }
      const foundBySlug = await Member.findOne({ slug: id.toLowerCase().trim() }).lean();
      if (foundBySlug) return foundBySlug;
    }
  } catch (err) {
    // fallback
  }

  return (
    fallbackMembers.find(
      (m) =>
        String(m.id) === String(id) ||
        String(m._id) === String(id) ||
        (m.slug && m.slug.toLowerCase() === id.toLowerCase())
    ) || null
  );
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alokworld.in";
  const member = await getMemberData(id);

  if (
    !member ||
    !member.isPublished ||
    !member.isApproved ||
    member.isArchived ||
    member.membershipStatus === "archived"
  ) {
    return {
      title: "सदस्य प्रोफ़ाइल उपलब्ध नहीं है",
      description: "अनुरोधित समाज सदस्य प्रोफ़ाइल अनुपलब्ध, अप्रकाशित अथवा गोपनीय है।",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const cleanName = member.name || "समाज सदस्य";
  const occupation = member.occupation || "व्यवसाय / पद";
  const location = [member.city, member.state].filter(Boolean).join(", ");
  const rawBio = member.biography ? member.biography.replace(/<[^>]*>?/gm, "").trim() : "";
  const bioSnippet = rawBio
    ? rawBio.substring(0, 150) + "..."
    : `${cleanName} (${occupation}) का सत्यापित समाज डायरेक्टरी अभिलेख${location ? ` - ${location}` : ""}।`;

  const canonicalPath = `/member/${member.slug || member._id || member.id}`;
  const canonicalUrl = `${baseUrl.replace(/\/+$/, "")}${canonicalPath}`;
  const ogImage =
    member.avatar ||
    "/asset/topofwebsite/web_sit_front.png";

  return {
    title: `${cleanName} - ${occupation}${location ? ` (${location})` : ""}`,
    description: `${cleanName} (${occupation}) ${location ? `निवास: ${location}` : ""}। ${bioSnippet}`,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${cleanName} - ${occupation} | समाज डायरेक्टरी`,
      description: bioSnippet,
      url: canonicalUrl,
      siteName: "alokworld.in",
      locale: "hi_IN",
      type: "profile",
      images: [
        {
          url: ogImage,
          width: 600,
          height: 600,
          alt: cleanName,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${cleanName} - ${occupation} | समाज डायरेक्टरी`,
      description: bioSnippet,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function MemberLayout({ children }) {
  return children;
}
