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
      title: "Member Profile Not Found",
      description: "The requested Samaj community member profile is unavailable, unlisted, or private.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const cleanName = member.name || "Community Member";
  const occupation = member.occupation || "Professional";
  const location = [member.city, member.state].filter(Boolean).join(", ");
  const rawBio = member.biography ? member.biography.replace(/<[^>]*>?/gm, "").trim() : "";
  const bioSnippet = rawBio
    ? rawBio.substring(0, 150) + "..."
    : `Verified Samaj directory profile of ${cleanName}, ${occupation}${location ? ` based in ${location}` : ""}.`;

  const canonicalPath = `/member/${member.slug || member._id || member.id}`;
  const canonicalUrl = `${baseUrl.replace(/\/+$/, "")}${canonicalPath}`;
  const ogImage =
    member.avatar ||
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80";

  return {
    title: `${cleanName} - ${occupation}${location ? ` (${location})` : ""}`,
    description: `${cleanName} (${occupation}) from ${location}. ${bioSnippet}`,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${cleanName} - ${occupation} | Samaj Directory`,
      description: bioSnippet,
      url: canonicalUrl,
      siteName: "alokworld.in",
      locale: "en_IN",
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
      title: `${cleanName} - ${occupation} | Samaj Directory`,
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
