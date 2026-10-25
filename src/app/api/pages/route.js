import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PageContent from "@/models/PageContent";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

const DEFAULT_PAGES = [
  {
    slug: "about",
    title: "About Samaj Directory & Portal",
    subtitle: "A digital initiative uniting community members, families, and professionals across India.",
    bannerTitle: "About Samaj Community Portal",
    bannerSubtitle: "Preserving cultural heritage, strengthening social unity, and fostering modern progress.",
    status: "published",
    metaTitle: "About Us | Samaj Community Directory",
    metaDescription: "Learn about the mission, values, and digital directory network of the Samaj Community.",
    content: `<h3>Our Mission & Purpose</h3>
<p>The Akhil Bhartiya Samaj Community Portal serves as a unified digital platform designed to connect community members, families, professionals, and youth across India and abroad. Our objective is to preserve our sacred cultural values, empower members socially and economically, and ensure seamless communication across all regional chapters.</p>
<h3>Core Objectives</h3>
<ul>
  <li><strong>Digital Connectivity:</strong> Provide a verified, modern, and easily searchable directory for all community members.</li>
  <li><strong>Professional Networking:</strong> Connect doctors, advocates, engineers, educators, and entrepreneurs to foster collaboration and mentorship.</li>
  <li><strong>Social Welfare:</strong> Support community development, higher education scholarships, and healthcare assistance programs.</li>
  <li><strong>Cultural Continuity:</strong> Celebrate historical heritage, organize national gatherings, and inspire younger generations with our rich lineage.</li>
</ul>
<h3>National Executive Secretariat</h3>
<p>Governed transparently by dedicated community elders and professionals, the portal adheres to highest standards of data integrity and privacy.</p>`,
  },
  {
    slug: "history",
    title: "Heritage & Historical Legacy",
    subtitle: "Chronicles of dedication, valor, and nation-building service across generations.",
    bannerTitle: "Glorious Community Heritage",
    bannerSubtitle: "A centuries-old lineage of service, scholarship, and patriotism.",
    status: "published",
    metaTitle: "History & Heritage | Samaj Community Directory",
    metaDescription: "Discover the glorious history, origins, and historic contributions of the community.",
    content: `<h3>Glorious Heritage & Origins</h3>
<p>The history of our community is deeply interwoven with India's rich cultural, spiritual, and social fabric. Known historically for unwavering commitment to truth, valor, and scholarship, our ancestors made monumental contributions to state administration, commerce, education, and literature.</p>
<h3>Contributions to the Freedom Struggle</h3>
<p>During India's struggle for independence, numerous community leaders, scholars, and youth stood at the forefront. They led regional movements, established educational institutions, and sacrificed their livelihoods to support the nation's freedom fighters.</p>
<h3>Modern Evolution</h3>
<p>In modern independent India, community professionals have excelled globally in medicine, judiciary, civil administration, technology, and academia, carrying forward the proud legacy of intellectual distinction and social responsibility.</p>`,
  },
  {
    slug: "organization",
    title: "Organizational Structure & Leadership",
    subtitle: "Democratic governance and regional committees dedicated to transparent community service.",
    bannerTitle: "Organizational Structure",
    bannerSubtitle: "Central Working Committee, State Chapters, and Youth & Women Wings.",
    status: "published",
    metaTitle: "Organization & Leadership | Samaj Community Directory",
    metaDescription: "Meet the executive committee, national leadership, and organizational structure.",
    content: `<h3>Governance & Working Structure</h3>
<p>The organizational framework is built on democratic representation, accountability, and collective decision-making. The National Working Committee oversees national initiatives, while State Chapters ensure localized welfare activities.</p>
<h3>Key Wings & Committees</h3>
<ul>
  <li><strong>Central Advisory Board:</strong> Comprising respected community elders, legal luminaries, and retired civil servants providing strategic guidance.</li>
  <li><strong>National Youth Council:</strong> Driving digital transformation, career counseling, entrepreneurship incubators, and sports tournaments.</li>
  <li><strong>Women Empowerment Wing:</strong> Organizing self-reliance workshops, leadership development forums, and family welfare support.</li>
  <li><strong>Education & Scholarship Committee:</strong> Managing merit-based assistance for promising students pursuing higher studies in engineering, medicine, and law.</li>
</ul>`,
  },
  {
    slug: "mahasabha",
    title: "Akhil Bhartiya Mahasabha",
    subtitle: "The apex national assembly representing community interests and social cohesion.",
    bannerTitle: "Akhil Bhartiya Mahasabha",
    bannerSubtitle: "The apex body championing social reform, unity, and community development.",
    status: "published",
    metaTitle: "Akhil Bhartiya Mahasabha | Samaj Community Directory",
    metaDescription: "Official records, resolutions, and leadership initiatives of the Akhil Bhartiya Mahasabha.",
    content: `<h3>Apex Representative Assembly</h3>
<p>The Akhil Bhartiya Mahasabha is the highest deliberative assembly of the community. Convened periodically at national conventions, the Mahasabha debates crucial social reforms, passes community resolutions, and establishes long-term developmental policies.</p>
<h3>Historical Conventions & Milestones</h3>
<p>Over several decades, national conventions held in historic cultural centers across India have addressed vital social topics, including education modernism, simple wedding conventions, youth empowerment, and digital directory creation.</p>
<h3>Ongoing Programs</h3>
<p>The Mahasabha's ongoing initiatives focus on strengthening regional unity, establishing community centers (Bhawan), and digitizing community archives for future generations.</p>`,
  },
  {
    slug: "home",
    title: "Welcome to Samaj Community Central Portal",
    subtitle: "Empowering every community member through digital discovery, unity, and shared heritage.",
    bannerTitle: "Akhil Bhartiya Samaj Directory & Central Portal",
    bannerSubtitle: "A comprehensive digital network connecting community members, elders, doctors, engineers, advocates, merchants, and youth network across India.",
    status: "published",
    metaTitle: "Samaj Community Directory | alokworld.in",
    metaDescription: "Official Samaj Directory - search and connect with community members, elders, doctors, engineers, and professionals.",
    content: `<h3>Central Community Digital Network</h3>
<p>Welcome to alokworld.in — the unified digital portal for our community. Here, members across India and worldwide can discover verified community contacts, stay informed about national events, explore historical personalities, and contribute to social welfare programs.</p>`,
  },
];

export async function GET(req) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ pages: [] });
    }

    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;

    // Seed defaults if table is empty
    const count = await PageContent.countDocuments();
    if (count === 0) {
      await PageContent.insertMany(DEFAULT_PAGES);
    }

    const filter = admin ? {} : { status: "published" };
    const pages = await PageContent.find(filter).sort({ title: 1 }).lean();

    return NextResponse.json({ pages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    if (!body.slug || !body.title) {
      return NextResponse.json({ error: "Page slug and title are required." }, { status: 400 });
    }

    const slug = body.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");

    const existing = await PageContent.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: `Page with slug '${slug}' already exists.` }, { status: 400 });
    }

    const page = await PageContent.create({
      slug,
      title: body.title.trim(),
      subtitle: (body.subtitle || "").trim(),
      content: sanitizeContent(body.content || ""),
      bannerTitle: (body.bannerTitle || body.title).trim(),
      bannerSubtitle: (body.bannerSubtitle || "").trim(),
      status: body.status === "draft" ? "draft" : "published",
      metaTitle: (body.metaTitle || body.title).trim(),
      metaDescription: (body.metaDescription || "").trim(),
      lastEditedBy: admin.email,
    });

    await recordAudit({
      req,
      admin,
      action: "create_page_content",
      targetEntity: "PageContent",
      targetId: page._id,
      details: { slug: page.slug, title: page.title, status: page.status },
    });

    return NextResponse.json({ success: true, page }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
