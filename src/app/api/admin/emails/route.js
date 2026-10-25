import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import EmailLog from "@/models/EmailLog";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({
        logs: [],
        total: 0,
        page: 1,
        totalPages: 1,
        stats: { sent: 0, delivered: 0, failed: 0, bounced: 0, received: 0, unreadInbound: 0 },
      });
    }

    const { searchParams } = new URL(req.url);
    const direction = searchParams.get("direction") || "all";
    const status = searchParams.get("status") || "all";
    const q = (searchParams.get("q") || "").trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
    const skip = (page - 1) * limit;

    const filter = {};

    if (direction !== "all") {
      filter.direction = direction;
    }

    if (status !== "all") {
      filter.status = status;
    }

    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { subject: regex },
        { from: regex },
        { to: regex },
        { providerMessageId: regex },
      ];
    }

    const [logs, total, statsAggregation] = await Promise.all([
      EmailLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      EmailLog.countDocuments(filter),
      EmailLog.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const unreadInbound = await EmailLog.countDocuments({ direction: "inbound", isRead: false });

    const statsMap = statsAggregation.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const stats = {
      sent: statsMap.sent || 0,
      delivered: statsMap.delivered || 0,
      failed: statsMap.failed || 0,
      bounced: statsMap.bounced || 0,
      received: statsMap.received || 0,
      unreadInbound,
      totalOutbound: (statsMap.sent || 0) + (statsMap.delivered || 0) + (statsMap.failed || 0) + (statsMap.bounced || 0),
    };

    return NextResponse.json({
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      stats,
    });
  } catch (err) {
    console.error("GET /api/admin/emails error:", err.message);
    return NextResponse.json({ error: "Failed to fetch email logs" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { logId, isRead, markAllRead, direction } = await req.json();
    await connectDB();

    if (markAllRead) {
      const filter = { isRead: false };
      if (direction && direction !== "all") filter.direction = direction;
      await EmailLog.updateMany(filter, { $set: { isRead: true } });
      return NextResponse.json({ success: true, message: "Marked all as read" });
    }

    if (!logId) {
      return NextResponse.json({ error: "logId is required" }, { status: 400 });
    }

    const updated = await EmailLog.findByIdAndUpdate(
      logId,
      { $set: { isRead: Boolean(isRead) } },
      { new: true }
    );

    return NextResponse.json({ success: true, log: updated });
  } catch (err) {
    console.error("PATCH /api/admin/emails error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const logId = searchParams.get("id");
    if (!logId) {
      return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    }

    await connectDB();
    await EmailLog.findByIdAndDelete(logId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/emails error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
