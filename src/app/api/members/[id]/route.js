import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Member from "@/models/Member";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { membersData as fallbackMembers } from "@/data/members";

// GET /api/members/[id]
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const conn = await connectDB();

    const token = req.cookies.get("admin_token")?.value;
    const isAuthorizedAdmin = token ? Boolean(verifyAdminToken(token)) : false;

    if (conn) {
      let member = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        member = await Member.findById(id).lean();
      }

      if (!member) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
      }

      if (!isAuthorizedAdmin && (!member.isPublished || !member.isApproved)) {
        return NextResponse.json({ error: "Member profile is private or unapproved" }, { status: 403 });
      }

      if (!isAuthorizedAdmin) {
        member.phone = member.showPhone ? member.phone : null;
        member.email = member.showEmail ? member.email : null;
        member.address = member.showAddress ? member.address : null;
      }

      return NextResponse.json({ member });
    }

    // Fallback to dummy data
    const member = fallbackMembers.find((m) => String(m.id) === String(id));
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error("GET member by ID error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/members/[id] (Admin update)
export async function PUT(req, { params }) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    if (body.biography) {
      body.biography = sanitizeContent(body.biography);
    }

    const updated = await Member.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    console.error("PUT member by ID error:", error);
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

// DELETE /api/members/[id] (Admin delete)
export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const deleted = await Member.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Member removed successfully" });
  } catch (error) {
    console.error("DELETE member error:", error);
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
