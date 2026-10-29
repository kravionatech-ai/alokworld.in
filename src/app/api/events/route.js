import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { verifyAdminToken } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export const DEFAULT_EVENTS = [
  {
    id: "evt_live_countdown_2026",
    title: "वेबसाइट लाइव — 2 नवंबर 2026",
    subtitle: "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) आधिकारिक पोर्टल शुभारंभ",
    badge: "वेबसाइट लाइव उल्टी गिनती",
    date: "2026-11-02T10:00:00",
    location: "नई दिल्ली (केंद्रीय राष्ट्रीय सचिवालय)",
    description: "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) का आधिकारिक राष्ट्रीय डिजिटल पोर्टल का शुभारंभ एवं राष्ट्रीय सम्मेलन।",
    countdownLabel: "वेबसाइट लाइव होने में शेष समय",
    ctaText: "मुख्य पृष्ठ पर जाएं →",
    ctaLink: "/",
    image: "",
    isFeatured: true,
    isActive: true,
    status: "upcoming",
  },
  {
    id: "evt_talent_felicitation_2026",
    title: "राष्ट्रीय प्रतिभा सम्मान एवं करियर मार्गदर्शन संगोष्ठी 2026",
    subtitle: "सिविल सेवा, मेडिकल, इंजीनियरिंग व उच्च शिक्षा में चयनित युवाओं का सम्मान",
    badge: "प्रतिभा सम्मान",
    date: "2026-12-15T11:00:00",
    location: "भोपाल, मध्य प्रदेश (रवींद्र भवन सभागार)",
    description: "समाज के मेधावी छात्र-छात्राओं, यूपीएससी, राज्य लोक सेवा आयोगों व तकनीकी क्षेत्रों में चयनित अधिकारियों का राष्ट्रीय सम्मान समारोह एवं करियर काउंसलिंग।",
    countdownLabel: "सम्मेलन प्रारंभ होने में शेष समय",
    ctaText: "प्रतिभा सम्मान विवरण →",
    ctaLink: "/events",
    image: "",
    isFeatured: false,
    isActive: true,
    status: "upcoming",
  },
  {
    id: "evt_national_convention_2025",
    title: "अखिल भारतीय आलोक राष्ट्रीय प्रतिनिधि सम्मेलन 2025",
    subtitle: "देश भर के प्रांतीय पदाधिकारियों एवं सदस्यों का भव्य चिंतन शिविर",
    badge: "राष्ट्रीय सम्मेलन",
    date: "2025-10-12T10:30:00",
    location: "जयपुर, राजस्थान (इंदिरा गांधी पंचायती राज संस्थान सभागार)",
    description: "देश भर से पधारे समाज के अधिकारियों, कर्मचारियों व सामाजिक चिंतकों का विशाल राष्ट्रीय सम्मेलन जिसमें संगठनात्मक विस्तार, समाजोत्थान एवं शिक्षा कोष पर महत्वपूर्ण प्रस्ताव पारित किए गए।",
    countdownLabel: "सम्मेलन संपन्न",
    ctaText: "स्मृति छायाचित्र देखें →",
    ctaLink: "/gallery",
    image: "",
    isFeatured: false,
    isActive: true,
    status: "past",
  },
];

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ eventsList: DEFAULT_EVENTS });
    }

    if (!Array.isArray(settings.eventsList) || settings.eventsList.length === 0) {
      settings.eventsList = DEFAULT_EVENTS;
      if (!settings.eventTitle) {
        settings.eventTitle = DEFAULT_EVENTS[0].title;
        settings.eventDate = DEFAULT_EVENTS[0].date;
        settings.eventBadge = DEFAULT_EVENTS[0].badge;
        settings.eventLocation = DEFAULT_EVENTS[0].location;
        settings.eventDescription = DEFAULT_EVENTS[0].description;
        settings.eventEnabled = true;
      }
      await settings.save();
    }

    const events = settings.eventsList;
    const featuredEvent = events.find((e) => e.isFeatured && e.isActive !== false) || events[0] || null;

    return NextResponse.json(
      {
        success: true,
        events,
        featuredEvent,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/events error:", err);
    return NextResponse.json(
      { error: "Failed to load events", events: [] },
      {
        status: 500,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
      }
    );
  }
}

export async function POST(req) {
  try {
    const admin = verifyAdminToken(req);
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

    let currentList = Array.isArray(settings.eventsList) ? [...settings.eventsList] : [];

    const newId = body.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const isFeatured = body.isFeatured !== undefined ? Boolean(body.isFeatured) : currentList.length === 0;

    if (isFeatured) {
      currentList = currentList.map((e) => ({ ...e, isFeatured: false }));
    }

    const newEvent = {
      id: newId,
      title: body.title.trim(),
      subtitle: (body.subtitle || "").trim(),
      badge: (body.badge || "").trim(),
      date: body.date || "",
      location: (body.location || "").trim(),
      description: (body.description || "").trim(),
      image: (body.image || "").trim(),
      countdownLabel: (body.countdownLabel || "").trim(),
      ctaText: (body.ctaText || "").trim(),
      ctaLink: (body.ctaLink || "").trim(),
      isFeatured,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
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
      settings.eventImage = newEvent.image;
      settings.eventCountdownLabel = newEvent.countdownLabel;
      settings.eventCtaText = newEvent.ctaText;
      settings.eventCtaLink = newEvent.ctaLink;
      settings.eventEnabled = true;
      settings.eventTopBarEnabled = true;
      settings.eventPopupEnabled = true;
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

    try {
      revalidatePath("/events");
      revalidatePath("/", "layout");
    } catch (e) {
      console.warn("Revalidation notice:", e.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "कार्यक्रम सफलतापूर्वक जोड़ा गया!",
        event: newEvent,
        events: settings.eventsList,
      },
      {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
      }
    );
  } catch (err) {
    console.error("POST /api/events error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const admin = verifyAdminToken(req);
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
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : (currentList[targetIdx].isActive !== undefined ? currentList[targetIdx].isActive : true);

    if (isFeatured) {
      currentList = currentList.map((e, idx) => ({ ...e, isFeatured: idx === targetIdx }));
    } else if (body.isFeatured === false && currentList[targetIdx].isFeatured) {
      currentList[targetIdx].isFeatured = false;
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
      isFeatured: isFeatured && isActive, // Only active event can be featured
      isActive,
      updatedAt: new Date(),
    };

    currentList[targetIdx] = updatedEvent;
    settings.eventsList = currentList;

    // Sync with top-level settings if marked featured
    if (updatedEvent.isFeatured && updatedEvent.isActive) {
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
    } else if (!isFeatured || !isActive) {
      // If we unset featured or deactivated the featured event, find if another is featured
      const nextFeatured = currentList.find((e) => e.isFeatured && e.isActive);
      if (nextFeatured) {
        settings.eventTitle = nextFeatured.title;
        settings.eventSubtitle = nextFeatured.subtitle;
        settings.eventBadge = nextFeatured.badge;
        settings.eventDate = nextFeatured.date;
        settings.eventLocation = nextFeatured.location;
        settings.eventDescription = nextFeatured.description;
        settings.eventImage = nextFeatured.image || settings.eventImage;
        settings.eventCountdownLabel = nextFeatured.countdownLabel;
        settings.eventCtaText = nextFeatured.ctaText;
        settings.eventCtaLink = nextFeatured.ctaLink;
        settings.eventEnabled = true;
      } else {
        settings.eventEnabled = false;
      }
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

    try {
      revalidatePath("/events");
      revalidatePath("/", "layout");
    } catch (e) {
      console.warn("Revalidation notice:", e.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "कार्यक्रम विवरण सफलतापूर्वक अद्यतन किया गया!",
        event: updatedEvent,
        events: settings.eventsList,
      },
      {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
      }
    );
  } catch (err) {
    console.error("PUT /api/events error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const admin = verifyAdminToken(req);
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
    if (filtered.length === 0) {
      settings.eventEnabled = false;
      settings.eventTopBarEnabled = false;
      settings.eventPopupEnabled = false;
      settings.eventTitle = "";
      settings.eventSubtitle = "";
      settings.eventBadge = "";
      settings.eventDate = "";
      settings.eventLocation = "";
      settings.eventDescription = "";
      settings.eventImage = "";
      settings.eventCountdownLabel = "";
      settings.eventCtaText = "";
      settings.eventCtaLink = "";
    } else if (target.isFeatured) {
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

    try {
      revalidatePath("/events");
      revalidatePath("/", "layout");
    } catch (e) {
      console.warn("Revalidation notice:", e.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "कार्यक्रम सफलतापूर्वक हटा दिया गया।",
        events: settings.eventsList,
      },
      {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
      }
    );
  } catch (err) {
    console.error("DELETE /api/events error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
