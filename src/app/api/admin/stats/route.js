import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Member from "@/models/Member";
import Contact from "@/models/Contact";
import EmailLog from "@/models/EmailLog";
import PageContent from "@/models/PageContent";
import GalleryItem from "@/models/GalleryItem";
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
      return NextResponse.json({ error: "Database offline" }, { status: 503 });
    }

    const [
      totalMembers,
      approvedMembers,
      pendingMembers,
      archivedMembers,
      totalInquiries,
      unreadInquiries,
      emailStatsAgg,
      unreadInboundEmails,
      totalPages,
      totalGallery,
      recentActivity,
    ] = await Promise.all([
      Member.countDocuments(),
      Member.countDocuments({ isApproved: true, isPublished: true, isArchived: { $ne: true } }),
      Member.countDocuments({ $or: [{ isApproved: false }, { membershipStatus: "pending" }] }),
      Member.countDocuments({ $or: [{ isArchived: true }, { membershipStatus: "archived" }] }),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      EmailLog.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      EmailLog.countDocuments({ direction: "inbound", isRead: false }),
      PageContent.countDocuments(),
      GalleryItem.countDocuments(),
      AuditLog.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const emailStatsMap = emailStatsAgg.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return NextResponse.json({
      members: {
        total: totalMembers,
        approved: approvedMembers,
        pending: pendingMembers,
        archived: archivedMembers,
      },
      inquiries: {
        total: totalInquiries,
        unread: unreadInquiries,
      },
      emails: {
        sent: emailStatsMap.sent || 0,
        delivered: emailStatsMap.delivered || 0,
        failed: emailStatsMap.failed || 0,
        bounced: emailStatsMap.bounced || 0,
        received: emailStatsMap.received || 0,
        unreadInbound: unreadInboundEmails,
      },
      cms: {
        pages: totalPages,
        gallery: totalGallery,
      },
      recentActivity,
    });
  } catch (err) {
    console.error("GET /api/admin/stats error:", err.message);
    return NextResponse.json({ error: "Failed to load dashboard metrics" }, { status: 500 });
  }
}
