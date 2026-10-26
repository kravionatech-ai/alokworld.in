import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { verifyAdminToken } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

const DEFAULT_EVENTS = [
  {
    id: "event-2nov-live",
    title: "वेबसाइट लाइव — 2 नवंबर 2026",
    subtitle: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक) का आधिकारिक राष्ट्रीय डिजिटल पोर्टल लोकार्पण",
    badge: "वेबसाइट लाइव उल्टी गिनती",
    date: "2026-11-02T10:00:00",
    location: "नई दिल्ली (केंद्रीय सचिवालय)",
    description: "2 नवम्बर 2026 को समाज के गौरवशाली राष्ट्रीय महासम्मेलन, प्रतिभावान छात्र-छात्रा सम्मान एवं आलोक डिजिटल पोर्टल का भव्य राष्ट्रव्यापी लोकार्पण। देशभर के गणमान्य बंधु सादर आमंत्रित हैं।",
    image: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924149/alokworld/posters/poster1.jpg",
    countdownLabel: "वेबसाइट लाइव होने में शेष समय",
    ctaText: "मुख्य पृष्ठ पर जाएं →",
    ctaLink: "/",
    isFeatured: true,
    status: "upcoming",
    createdAt: new Date(),
  },
  {
    id: "event-national-convention",
    title: "आलोक राष्ट्रीय महासम्मेलन एवं प्रतिभा सम्मान समारोह 2026",
    subtitle: "समस्त राज्यों के लोधी-लोधा अधिकारी-कर्मचारी बंधुओं का वृहद समागम",
    badge: "राष्ट्रीय अधिवेशन",
    date: "2026-11-02T11:00:00",
    location: "कांस्टीट्यूशन क्लब, रफी मार्ग, नई दिल्ली",
    description: "राष्ट्रीय कार्यसमिति बैठक, सामाजिक सुधार परिचर्चा, मेधावी छात्र सम्मान एवं सांस्कृतिक सम्मेलन। समस्त प्रांतीय अध्यक्ष, सचिव एवं पदाधिकारी सहभागिता करेंगे।",
    image: "https://res.cloudinary.com/yk1l1nlz/image/upload/v1792924151/alokworld/posters/poster2.jpg",
    countdownLabel: "महासम्मेलन शुभारंभ उल्टी गिनती",
    ctaText: "अधिवेशन विवरण एवं पंजीकरण →",
    ctaLink: "/mahasabha",
    isFeatured: false,
    status: "upcoming",
    createdAt: new Date(),
  },
];

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({ eventsList: DEFAULT_EVENTS });
    }
    const events = (settings.eventsList && settings.eventsList.length > 0)
      ? settings.eventsList
      : DEFAULT_EVENTS;

    return NextResponse.json({
      success: true,
      events,
      featuredEvent: events.find((e) => e.isFeatured) || events[0] || null,
    });
  } catch (err) {
    console.error("GET /api/events error:", err);
    return NextResponse.json({ error: "Failed to load events", events: DEFAULT_EVENTS }, { status: 500 });
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
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "कार्यक्रम का शीर्षक आवश्यक है (Title is required)" }, { status: 400 });
    }

    await connectDB();
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    let currentList = Array.isArray(settings.eventsList) ? [...settings.eventsList] : [...DEFAULT_EVENTS];

    const newId = body.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const isFeatured = Boolean(body.isFeatured);

    if (isFeatured) {
      currentList = currentList.map((e) => ({ ...e, isFeatured: false }));
    }

    const newEvent = {
      id: newId,
      title: body.title.trim(),
      subtitle: (body.subtitle || "").trim(),
      badge: (body.badge || "विशेष आगामी कार्यक्रम").trim(),
      date: body.date || "2026-11-02T10:00:00",
      location: (body.location || "नई दिल्ली").trim(),
      description: (body.description || "").trim(),
      image: (body.image || "").trim(),
      countdownLabel: (body.countdownLabel || "वेबसाइट लाइव एवं उल्टी गिनती").trim(),
      ctaText: (body.ctaText || "विवरण देखें →").trim(),
      ctaLink: (body.ctaLink || "/").trim(),
      isFeatured,
      status: body.status || "upcoming",
      createdAt: new Date(),
    };

    currentList.unshift(newEvent);
    settings.eventsList = currentList;

    // If marked as featured, update top-level event fields for header & popup synchronization
    if (isFeatured) {
      settings.eventTitle = newEvent.title;
      settings.eventSubtitle = newEvent.subtitle;
      settings.eventBadge = newEvent.badge;
      settings.eventDate = newEvent.date;
      settings.eventLocation = newEvent.location;
      settings.eventDescription = newEvent.description;
      settings.eventImage = newEvent.image || settings.eventImage;
      settings.eventCountdownLabel = newEvent.countdownLabel;
      settings.eventCtaText = newEvent.ctaText;
      settings.eventCtaLink = newEvent.ctaLink;
      settings.eventEnabled = true;
    }

    await settings.save();

    await recordAudit({
      req,
      admin,
      action: "create_event",
      targetEntity: "Event",
      targetId: newId,
      details: `Created new event: "${newEvent.title}" (${newEvent.date})`,
    });

    return NextResponse.json({
      success: true,
      message: "कार्यक्रम सफलतापूर्वक जोड़ा गया!",
      event: newEvent,
      events: settings.eventsList,
    });
  } catch (err) {
    console.error("POST /api/events error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const eventId = body.id;
    if (!eventId) {
      return NextResponse.json({ error: "इवेंट ID आवश्यक है (Event ID is required)" }, { status: 400 });
    }

    await connectDB();
    let settings = await SiteSettings.findOne();
    if (!settings) {
      return NextResponse.json({ error: "सेटिंग्स नहीं मिलीं" }, { status: 404 });
    }

    let currentList = Array.isArray(settings.eventsList) && settings.eventsList.length > 0
      ? [...settings.eventsList]
      : [...DEFAULT_EVENTS];

    const targetIdx = currentList.findIndex((e) => e.id === eventId);
    if (targetIdx === -1) {
      return NextResponse.json({ error: "कार्यक्रम नहीं मिला (Event not found)" }, { status: 404 });
    }

    const isFeatured = body.isFeatured !== undefined ? Boolean(body.isFeatured) : currentList[targetIdx].isFeatured;

    if (isFeatured) {
      currentList = currentList.map((e, idx) => ({ ...e, isFeatured: idx === targetIdx }));
    }

    const updatedEvent = {
      ...currentList[targetIdx],
      title: body.title !== undefined ? body.title.trim() : currentList[targetIdx].title,
      subtitle: body.subtitle !== undefined ? body.subtitle.trim() : currentList[targetIdx].subtitle,
      badge: body.badge !== undefined ? body.badge.trim() : currentList[targetIdx].badge,
      date: body.date !== undefined ? body.date : currentList[targetIdx].date,
      location: body.location !== undefined ? body.location.trim() : currentList[targetIdx].location,
      description: body.description !== undefined ? body.description.trim() : currentList[targetIdx].description,
      image: body.image !== undefined ? body.image.trim() : currentList[targetIdx].image,
      countdownLabel: body.countdownLabel !== undefined ? body.countdownLabel.trim() : currentList[targetIdx].countdownLabel,
      ctaText: body.ctaText !== undefined ? body.ctaText.trim() : currentList[targetIdx].ctaText,
      ctaLink: body.ctaLink !== undefined ? body.ctaLink.trim() : currentList[targetIdx].ctaLink,
      status: body.status !== undefined ? body.status : currentList[targetIdx].status,
      isFeatured,
      updatedAt: new Date(),
    };

    currentList[targetIdx] = updatedEvent;
    settings.eventsList = currentList;

    // Sync with top-level settings if marked featured
    if (isFeatured) {
      settings.eventTitle = updatedEvent.title;
      settings.eventSubtitle = updatedEvent.subtitle;
      settings.eventBadge = updatedEvent.badge;
      settings.eventDate = updatedEvent.date;
      settings.eventLocation = updatedEvent.location;
      settings.eventDescription = updatedEvent.description;
      settings.eventImage = updatedEvent.image || settings.eventImage;
      settings.eventCountdownLabel = updatedEvent.countdownLabel;
      settings.eventCtaText = updatedEvent.ctaText;
      settings.eventCtaLink = updatedEvent.ctaLink;
      settings.eventEnabled = true;
    }

    await settings.save();

    await recordAudit({
      req,
      admin,
      action: "update_event",
      targetEntity: "Event",
      targetId: eventId,
      details: `Updated event: "${updatedEvent.title}"`,
    });

    return NextResponse.json({
      success: true,
      message: "कार्यक्रम विवरण सफलतापूर्वक अद्यतन किया गया!",
      event: updatedEvent,
      events: settings.eventsList,
    });
  } catch (err) {
    console.error("PUT /api/events error:", err);
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
    const eventId = searchParams.get("id");
    if (!eventId) {
      return NextResponse.json({ error: "इवेंट ID आवश्यक है" }, { status: 400 });
    }

    await connectDB();
    let settings = await SiteSettings.findOne();
    if (!settings) {
      return NextResponse.json({ error: "सेटिंग्स नहीं मिलीं" }, { status: 404 });
    }

    const originalList = Array.isArray(settings.eventsList) ? settings.eventsList : [];
    const target = originalList.find((e) => e.id === eventId);
    if (!target) {
      return NextResponse.json({ error: "कार्यक्रम नहीं मिला" }, { status: 404 });
    }

    const filtered = originalList.filter((e) => e.id !== eventId);
    // If the deleted event was featured, make the first one featured if available
    if (target.isFeatured && filtered.length > 0) {
      filtered[0].isFeatured = true;
      settings.eventTitle = filtered[0].title;
      settings.eventSubtitle = filtered[0].subtitle;
      settings.eventBadge = filtered[0].badge;
      settings.eventDate = filtered[0].date;
      settings.eventLocation = filtered[0].location;
      settings.eventDescription = filtered[0].description;
      settings.eventImage = filtered[0].image || settings.eventImage;
      settings.eventCountdownLabel = filtered[0].countdownLabel;
      settings.eventCtaText = filtered[0].ctaText;
      settings.eventCtaLink = filtered[0].ctaLink;
    }

    settings.eventsList = filtered;
    await settings.save();

    await recordAudit({
      req,
      admin,
      action: "delete_event",
      targetEntity: "Event",
      targetId: eventId,
      details: `Deleted event: "${target.title}"`,
    });

    return NextResponse.json({
      success: true,
      message: "कार्यक्रम सफलतापूर्वक हटा दिया गया।",
      events: settings.eventsList,
    });
  } catch (err) {
    console.error("DELETE /api/events error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
