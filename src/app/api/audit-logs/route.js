import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AuditLog from "@/models/AuditLog";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ logs: [], total: 0, page: 1, totalPages: 1 });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const action = searchParams.get("action") || "";
    const entity = searchParams.get("entity") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
    const skip = (page - 1) * limit;

    const filter = {};

    if (action && action !== "All") {
      filter.action = action;
    }
    if (entity && entity !== "All") {
      filter.targetEntity = entity;
    }
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { adminEmail: regex },
        { adminName: regex },
        { action: regex },
        { targetEntity: regex },
        { details: regex },
      ];
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      logs,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
