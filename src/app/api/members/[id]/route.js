import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Member from "@/models/Member";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { generateUniqueMemberSlug } from "@/lib/slug";
import { recordAudit } from "@/lib/audit";
import { membersData as fallbackMembers } from "@/data/members";
import { generateMemberSearchTags } from "@/lib/transliteration";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

// GET /api/members/[id] (Supports lookup by MongoDB ObjectId OR unique slug)
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const conn = await connectDB();

    const isAuthorizedAdmin = Boolean(verifyAdminToken(req));

    if (conn) {
      let member = null;

      // 1. Check by 24-character hex MongoDB ID
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        member = await Member.findById(id).lean();
      }

      // 2. Check by unique URL slug
      if (!member) {
        member = await Member.findOne({ slug: id.toLowerCase().trim() }).lean();
      }

      if (!member) {
        return NextResponse.json({ error: "Member profile not found." }, { status: 404 });
      }

      // If not admin, verify member is approved, published, and not archived
      if (!isAuthorizedAdmin && (!member.isPublished || !member.isApproved || member.isArchived || member.membershipStatus === "archived")) {
        return NextResponse.json(
          { error: "This member profile is private, pending administrative approval, or unlisted." },
          { status: 403 }
        );
      }

      // Mask private contact info if consent was not granted by member
      if (!isAuthorizedAdmin) {
        member.phone = member.showPhone ? member.phone : null;
        member.email = member.showEmail ? member.email : null;
        member.address = member.showAddress ? member.address : null;
      }

      return NextResponse.json({ member });
    }

    // Fallback to in-memory dataset
    const member = fallbackMembers.find(
      (m) =>
        String(m.id) === String(id) ||
        String(m._id) === String(id) ||
        (m.slug && m.slug.toLowerCase() === id.toLowerCase())
    );

    if (!member) {
      return NextResponse.json({ error: "Member profile not found." }, { status: 404 });
    }

    const sanitized = {
      ...member,
      phone: isAuthorizedAdmin || member.showPhone ? member.phone : null,
      email: isAuthorizedAdmin || member.showEmail ? member.email : null,
      address: isAuthorizedAdmin || member.showAddress ? member.address : null,
    };

    return NextResponse.json({ member: sanitized });
  } catch (error) {
    console.error("GET member by ID/slug error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/members/[id] (Admin update with validation, duplicate detection, and slug handling)
export async function PUT(req, { params }) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access. Please log in as an administrator." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected. Please ensure MongoDB is running." }, { status: 503 });
    }

    // Locate the existing member
    let member = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      member = await Member.findById(id);
    }
    if (!member) {
      member = await Member.findOne({ slug: id.toLowerCase().trim() });
    }

    if (!member) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    // Server-side validation if updating key fields
    if (body.name !== undefined) {
      if (!body.name || body.name.trim().length < 2) {
        return NextResponse.json({ error: "Full Name must be at least 2 characters." }, { status: 400 });
      }
    }
    if (body.occupation !== undefined && (!body.occupation || body.occupation.trim().length === 0)) {
      return NextResponse.json({ error: "Profession / Occupation cannot be empty." }, { status: 400 });
    }
    if (body.city !== undefined && (!body.city || body.city.trim().length === 0)) {
      return NextResponse.json({ error: "City cannot be empty." }, { status: 400 });
    }
    if (body.state !== undefined && (!body.state || body.state.trim().length === 0)) {
      return NextResponse.json({ error: "State cannot be empty." }, { status: 400 });
    }

    // Duplicate detection on email
    if (body.email !== undefined && body.email.trim()) {
      const cleanEmail = body.email.toLowerCase().trim();
      if (!isValidEmail(cleanEmail)) {
        return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
      }
      const existingEmail = await Member.findOne({
        _id: { $ne: member._id },
        email: cleanEmail,
      }).lean();

      if (existingEmail) {
        return NextResponse.json(
          { error: `Another member profile (${existingEmail.name}) already uses the email "${cleanEmail}".` },
          { status: 409 }
        );
      }
      body.email = cleanEmail;
    }

    // Duplicate detection on phone
    if (body.phone !== undefined && body.phone.trim()) {
      const cleanPhone = body.phone.trim();
      if (!isValidPhone(cleanPhone)) {
        return NextResponse.json({ error: "Please provide a valid phone number (minimum 7 digits)." }, { status: 400 });
      }
      const existingPhone = await Member.findOne({
        _id: { $ne: member._id },
        phone: cleanPhone,
      }).lean();

      if (existingPhone) {
        return NextResponse.json(
          { error: `Another member profile (${existingPhone.name}) already uses the phone number "${cleanPhone}".` },
          { status: 409 }
        );
      }
      body.phone = cleanPhone;
    }

    // Slug management: update slug if name changed or if slug is missing
    if (body.name && body.name.trim() !== member.name && !body.slug) {
      body.slug = await generateUniqueMemberSlug(Member, body.name, member._id);
    } else if (!member.slug) {
      body.slug = await generateUniqueMemberSlug(Member, member.name, member._id);
    }

    // Biography sanitization
    if (body.biography !== undefined) {
      body.biography = sanitizeContent(body.biography);
    }

    // Synchronize status fields
    if (body.isArchived !== undefined) {
      body.isArchived = Boolean(body.isArchived);
      body.membershipStatus = body.isArchived ? "archived" : (member.isApproved ? "active" : "pending");
    } else if (body.membershipStatus) {
      if (body.membershipStatus === "archived") {
        body.isArchived = true;
      } else if (body.membershipStatus === "active") {
        body.isArchived = false;
        body.isApproved = true;
      } else if (body.membershipStatus === "pending") {
        body.isArchived = false;
        body.isApproved = false;
      }
    }

    if (body.tags && typeof body.tags === "string") {
      body.tags = body.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    const mergedForTags = {
      name: body.name || member.name,
      role: body.role || member.role,
      occupation: body.occupation || member.occupation,
      company: body.company !== undefined ? body.company : member.company,
      city: body.city || member.city,
      state: body.state || member.state,
      tags: body.tags || member.tags || [],
    };
    body.tags = generateMemberSearchTags(mergedForTags);

    Object.assign(member, body);
    await member.save();

    await recordAudit({
      req,
      admin,
      action: "update_member",
      targetEntity: "Member",
      targetId: member._id,
      details: {
        name: member.name,
        status: member.membershipStatus,
        isApproved: member.isApproved,
        isPublished: member.isPublished,
        isArchived: member.isArchived,
      },
    });

    try {
      revalidatePath("/directory");
      revalidatePath("/", "layout");
      if (member.slug) revalidatePath(`/members/${member.slug}`);
      revalidatePath(`/member/${member._id}`);
    } catch (e) {
      console.warn("Revalidation notice:", e.message);
    }

    return NextResponse.json(
      { success: true, member },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" } }
    );
  } catch (error) {
    console.error("PUT member by ID error:", error);
    return NextResponse.json({ error: "Failed to update member: " + error.message }, { status: 500 });
  }
}

// DELETE /api/members/[id] (Admin deletion - restricted to superadmin)
export async function DELETE(req, { params }) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access. Please log in as an administrator." }, { status: 401 });
    }

    if (admin.role !== "superadmin") {
      return NextResponse.json(
        { error: "Access denied. Only Superadmins can permanently delete members. You may archive or unpublish instead." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected." }, { status: 503 });
    }

    let deleted = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Member.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Member.findOneAndDelete({ slug: id.toLowerCase().trim() });
    }

    if (!deleted) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    await recordAudit({
      req,
      admin,
      action: "delete_member",
      targetEntity: "Member",
      targetId: id,
      details: { name: deleted.name, email: deleted.email },
    });

    try {
      revalidatePath("/directory");
      revalidatePath("/", "layout");
    } catch (e) {
      console.warn("Revalidation notice:", e.message);
    }

    return NextResponse.json(
      { success: true, message: `Member "${deleted.name}" deleted successfully.` },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" } }
    );
  } catch (error) {
    console.error("DELETE member error:", error);
    return NextResponse.json({ error: "Failed to delete member." }, { status: 500 });
  }
}
