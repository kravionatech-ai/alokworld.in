import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { verifyAdminToken } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export async function GET(req) {
  try {
    const admin = verifyAdminToken(req);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    if (admin.role !== "superadmin") {
      return NextResponse.json({ error: "Access denied. Superadmin privileges required." }, { status: 403 });
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const users = await Admin.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ users, currentAdminId: admin.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = verifyAdminToken(req);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    if (admin.role !== "superadmin") {
      return NextResponse.json({ error: "Access denied. Only Superadmins can add team members." }, { status: 403 });
    }

    const body = await req.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    const targetRole = role === "editor" ? "editor" : "superadmin";

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const existing = await Admin.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json({ error: `An administrator with email '${cleanEmail}' already exists.` }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      email: cleanEmail,
      password: hashedPassword,
      name: name.trim(),
      role: targetRole,
    });

    await recordAudit({
      req,
      admin,
      action: "create_admin_user",
      targetEntity: "Admin",
      targetId: newAdmin._id,
      details: { email: cleanEmail, name: newAdmin.name, role: newAdmin.role },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: newAdmin._id,
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role,
          createdAt: newAdmin.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const admin = verifyAdminToken(req);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    if (admin.role !== "superadmin") {
      return NextResponse.json({ error: "Access denied. Only Superadmins can remove team members." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const targetUser = await Admin.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Prevent self-deletion
    if (targetUser._id.toString() === admin.id || targetUser.email === admin.email) {
      return NextResponse.json({ error: "You cannot delete your own administrative account." }, { status: 400 });
    }

    // Ensure at least one superadmin remains
    if (targetUser.role === "superadmin") {
      const superadminCount = await Admin.countDocuments({ role: "superadmin" });
      if (superadminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the sole remaining Superadmin account." },
          { status: 400 }
        );
      }
    }

    await Admin.findByIdAndDelete(id);

    await recordAudit({
      req,
      admin,
      action: "delete_admin_user",
      targetEntity: "Admin",
      targetId: id,
      details: { email: targetUser.email, name: targetUser.name, role: targetUser.role },
    });

    return NextResponse.json({
      success: true,
      message: `Administrator ${targetUser.name} (${targetUser.email}) removed successfully.`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
