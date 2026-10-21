import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Member from "@/models/Member";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { membersData as fallbackMembers } from "@/data/members";

// GET /api/members (supports query, city, profession, pagination, admin view)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const city = searchParams.get("city")?.trim() || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const isAdminView = searchParams.get("admin") === "true";

    // Verify admin token if requesting unapproved or unpublished records
    let isAuthorizedAdmin = false;
    if (isAdminView) {
      const token = req.cookies.get("admin_token")?.value;
      if (token && verifyAdminToken(token)) {
        isAuthorizedAdmin = true;
      }
    }

    const conn = await connectDB();

    if (conn) {
      const filter = {};

      if (!isAuthorizedAdmin) {
        filter.isPublished = true;
        filter.isApproved = true;
      }

      if (city && city !== "All") {
        filter.city = { $regex: new RegExp(`^${city}$`, "i") };
      }

      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: "i" } },
          { occupation: { $regex: q, $options: "i" } },
          { city: { $regex: q, $options: "i" } },
          { state: { $regex: q, $options: "i" } },
          { company: { $regex: q, $options: "i" } },
          { tags: { $in: [new RegExp(q, "i")] } },
        ];
      }

      const total = await Member.countDocuments(filter);
      const members = await Member.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Mask private contact info if not allowed by member privacy settings (unless requested by admin)
      const sanitizedMembers = members.map((m) => {
        if (isAuthorizedAdmin) return m;
        return {
          ...m,
          phone: m.showPhone ? m.phone : null,
          email: m.showEmail ? m.email : null,
          address: m.showAddress ? m.address : null,
        };
      });

      return NextResponse.json({
        members: sanitizedMembers,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      });
    }

    // Fallback in-memory dataset if database is not active yet
    let results = fallbackMembers;
    if (city && city !== "All") {
      results = results.filter((m) => m.city.toLowerCase() === city.toLowerCase());
    }
    if (q) {
      const lower = q.toLowerCase();
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(lower) ||
          m.occupation.toLowerCase().includes(lower) ||
          m.city.toLowerCase().includes(lower) ||
          m.state.toLowerCase().includes(lower) ||
          (m.company && m.company.toLowerCase().includes(lower)) ||
          (m.tags && m.tags.some((t) => t.toLowerCase().includes(lower)))
      );
    }

    const total = results.length;
    const paginated = results.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      members: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("GET /api/members error:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

// POST /api/members (Admin creates or approves member)
export async function POST(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      role,
      occupation,
      company,
      city,
      state,
      address,
      pincode,
      phone,
      email,
      avatar,
      biography,
      tags,
      isApproved,
      isPublished,
      showPhone,
      showEmail,
      showAddress,
    } = body;

    if (!name || !occupation || !city || !state) {
      return NextResponse.json(
        { error: "Name, occupation, city and state are required fields" },
        { status: 400 }
      );
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { error: "Database not connected. Please configure MongoDB." },
        { status: 503 }
      );
    }

    const sanitizedBio = sanitizeContent(biography || "");

    const newMember = await Member.create({
      name: name.trim(),
      role: role ? role.trim() : "Member",
      occupation: occupation.trim(),
      company: company ? company.trim() : "",
      city: city.trim(),
      state: state.trim(),
      address: address ? address.trim() : "",
      pincode: pincode ? pincode.trim() : "",
      phone: phone ? phone.trim() : "",
      email: email ? email.toLowerCase().trim() : "",
      avatar: avatar || "",
      biography: sanitizedBio,
      tags: Array.isArray(tags) ? tags : [],
      isApproved: isApproved !== undefined ? Boolean(isApproved) : true,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      showPhone: showPhone !== undefined ? Boolean(showPhone) : true,
      showEmail: showEmail !== undefined ? Boolean(showEmail) : true,
      showAddress: showAddress !== undefined ? Boolean(showAddress) : false,
    });

    return NextResponse.json({ success: true, member: newMember }, { status: 201 });
  } catch (error) {
    console.error("POST /api/members error:", error);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
