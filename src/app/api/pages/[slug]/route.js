import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PageContent from "@/models/PageContent";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

const PROTECTED_SLUGS = ["home", "about", "history", "organization", "mahasabha", "aloksangh", "events"];

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const cleanSlug = String(slug || "").toLowerCase().trim();

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const admin = verifyAdminToken(req);

    let page = await PageContent.findOne({ slug: cleanSlug }).lean();

    // Graceful fallback from aloksangh <-> mahasabha
    if (!page && cleanSlug === "aloksangh") {
      page = await PageContent.findOne({ slug: "mahasabha" }).lean();
      if (page) {
        page = {
          ...page,
          slug: "aloksangh",
          title: "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)",
          subtitle: "देशभर के समस्त अधिकारी, कर्मचारी एवं प्रबुद्धजनों का राष्ट्रीय संगठन।",
        };
      }
    }

    if (!page) {
      return NextResponse.json({ error: `Page '${cleanSlug}' not found.` }, { status: 404 });
    }

    // Public users only see published pages
    if (!admin && page.status !== "published") {
      return NextResponse.json({ error: `Page '${cleanSlug}' is currently in draft mode.` }, { status: 403 });
    }

    return NextResponse.json({ page, isDraft: page.status === "draft" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { slug } = await params;
    const cleanSlug = String(slug || "").toLowerCase().trim();

    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    let page = await PageContent.findOne({ slug: cleanSlug });

    if (!page) {
      // Upsert if not found
      page = new PageContent({
        slug: cleanSlug,
        title: body.title || cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1),
        lastEditedBy: admin.email,
      });
    }

    if (body.title !== undefined) page.title = body.title.trim();
    if (body.subtitle !== undefined) page.subtitle = body.subtitle.trim();
    if (body.bannerTitle !== undefined) page.bannerTitle = body.bannerTitle.trim();
    if (body.bannerSubtitle !== undefined) page.bannerSubtitle = body.bannerSubtitle.trim();
    if (body.content !== undefined) page.content = sanitizeContent(body.content);
    if (body.status !== undefined) {
      page.status = ["draft", "published"].includes(body.status) ? body.status : "published";
    }
    if (body.metaTitle !== undefined) page.metaTitle = body.metaTitle.trim();
    if (body.metaDescription !== undefined) page.metaDescription = body.metaDescription.trim();
    page.lastEditedBy = admin.email;

    await page.save();

    await recordAudit({
      req,
      admin,
      action: "update_page_content",
      targetEntity: "PageContent",
      targetId: page._id,
      details: {
        slug: cleanSlug,
        title: page.title,
        status: page.status,
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { slug } = await params;
    const cleanSlug = String(slug || "").toLowerCase().trim();

    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Only superadmin can delete CMS pages
    if (admin.role !== "superadmin") {
      return NextResponse.json({ error: "Only superadmins can delete pages." }, { status: 403 });
    }

    if (PROTECTED_SLUGS.includes(cleanSlug)) {
      return NextResponse.json({ error: `Core system page '${cleanSlug}' cannot be deleted.` }, { status: 400 });
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const page = await PageContent.findOneAndDelete({ slug: cleanSlug });
    if (!page) {
      return NextResponse.json({ error: "Page not found." }, { status: 404 });
    }

    await recordAudit({
      req,
      admin,
      action: "delete_page_content",
      targetEntity: "PageContent",
      targetId: page._id,
      details: { slug: cleanSlug, title: page.title },
    });

    return NextResponse.json({ success: true, message: `Page '${cleanSlug}' was deleted.` });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
