import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Member from "@/models/Member";
import { verifyAdminToken, sanitizeContent } from "@/lib/auth";
import { generateUniqueMemberSlug } from "@/lib/slug";
import { recordAudit } from "@/lib/audit";
import { membersData as fallbackMembers } from "@/data/members";
import { getSearchTokens, generateMemberSearchTags } from "@/lib/transliteration";

// Helper for email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper for phone validation
function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

// GET /api/members (supports server-side search, multi-field filters, sorting, pagination, and admin view)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const city = searchParams.get("city")?.trim() || "";
    const state = searchParams.get("state")?.trim() || "";
    const profession = searchParams.get("profession")?.trim() || searchParams.get("occupation")?.trim() || "";
    const organization = searchParams.get("organization")?.trim() || searchParams.get("company")?.trim() || "";
    const status = searchParams.get("status")?.trim() || searchParams.get("membershipStatus")?.trim() || "";
    const sortBy = searchParams.get("sortBy")?.trim() || "newest";
    const isFeaturedOnly = searchParams.get("featured") === "true" || searchParams.get("isFeatured") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "12", 10)));
    const isAdminView = searchParams.get("admin") === "true";

    // Verify admin token if requesting administrative view
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

      if (isFeaturedOnly) {
        filter.isFeatured = true;
      }

      if (!isAuthorizedAdmin) {
        // Public directory: strictly approved, published, and active (non-archived)
        filter.isPublished = true;
        filter.isApproved = true;
        filter.isArchived = { $ne: true };
        filter.membershipStatus = { $ne: "archived" };
      } else {
        // Admin filter by membershipStatus or flags
        if (status && status !== "all") {
          if (status === "pending") {
            filter.$or = [{ isApproved: false }, { membershipStatus: "pending" }];
          } else if (status === "archived") {
            filter.$or = [{ isArchived: true }, { membershipStatus: "archived" }];
          } else if (status === "unlisted" || status === "draft") {
            filter.isPublished = false;
            filter.isArchived = { $ne: true };
          } else if (status === "active" || status === "published") {
            filter.isPublished = true;
            filter.isApproved = true;
            filter.isArchived = { $ne: true };
          }
        }
      }

      // City filter
      if (city && city !== "All") {
        filter.city = { $regex: new RegExp(`^${city}$`, "i") };
      }

      // State filter
      if (state && state !== "All") {
        filter.state = { $regex: new RegExp(`^${state}$`, "i") };
      }

      // Profession / Occupation filter
      if (profession && profession !== "All") {
        filter.occupation = { $regex: new RegExp(profession, "i") };
      }

      // Organization / Company filter
      if (organization && organization !== "All") {
        filter.company = { $regex: new RegExp(organization, "i") };
      }

      // Search keyword filter across multiple key attributes with bilingual support (Hindi & English)
      if (q) {
        const tokens = getSearchTokens(q);
        const orClauses = [];

        for (const token of tokens) {
          const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(escaped, "i");
          orClauses.push({ name: regex });
          orClauses.push({ occupation: regex });
          orClauses.push({ company: regex });
          orClauses.push({ city: regex });
          orClauses.push({ state: regex });
          orClauses.push({ address: regex });
          orClauses.push({ biography: regex });
          orClauses.push({ tags: { $in: [regex] } });
        }

        const digits = q.replace(/\D/g, "");
        if (digits.length >= 3) {
          orClauses.push({ phone: { $regex: digits, $options: "i" } });
        }

        filter.$or = orClauses;
      }

      // Sorting: prioritize order (official hierarchy)
      let sortObj = { order: 1, createdAt: 1 };
      if (sortBy === "newest" || !sortBy) sortObj = { order: 1, createdAt: 1 };
      else if (sortBy === "oldest") sortObj = { order: -1, createdAt: -1 };
      else if (sortBy === "name_asc") sortObj = { name: 1 };
      else if (sortBy === "name_desc") sortObj = { name: -1 };
      else if (sortBy === "city_asc") sortObj = { city: 1, name: 1 };

      const total = await Member.countDocuments(filter);
      const members = await Member.find(filter)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Collect available filter options for dynamic UI dropdowns
      const [distinctCities, distinctStates, distinctProfessions, distinctOrgs] = await Promise.all([
        Member.distinct("city", { isPublished: true, isApproved: true, isArchived: { $ne: true } }),
        Member.distinct("state", { isPublished: true, isApproved: true, isArchived: { $ne: true } }),
        Member.distinct("occupation", { isPublished: true, isApproved: true, isArchived: { $ne: true } }),
        Member.distinct("company", { isPublished: true, isApproved: true, isArchived: { $ne: true }, company: { $ne: "" } }),
      ]);

      // Mask private contact info if not consented by member (unless requested by authorized admin)
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
        filterOptions: {
          cities: distinctCities.filter(Boolean).sort(),
          states: distinctStates.filter(Boolean).sort(),
          professions: distinctProfessions.filter(Boolean).sort(),
          organizations: distinctOrgs.filter(Boolean).sort(),
        },
      });
    }

    // In-memory fallback if database connection is pending
    let results = [...fallbackMembers];
    if (!isAuthorizedAdmin) {
      results = results.filter((m) => m.isPublished && m.isApproved && !m.isArchived);
    }

    if (city && city !== "All") {
      results = results.filter((m) => m.city.toLowerCase() === city.toLowerCase());
    }
    if (state && state !== "All") {
      results = results.filter((m) => m.state.toLowerCase() === state.toLowerCase());
    }
    if (profession && profession !== "All") {
      results = results.filter((m) => m.occupation.toLowerCase().includes(profession.toLowerCase()));
    }
    if (organization && organization !== "All") {
      results = results.filter((m) => m.company && m.company.toLowerCase().includes(organization.toLowerCase()));
    }
    if (q) {
      const tokens = getSearchTokens(q).map((t) => t.toLowerCase());
      const digits = q.replace(/\D/g, "");
      results = results.filter((m) => {
        const fullText = [
          m.name,
          m.occupation,
          m.city,
          m.state,
          m.company,
          m.address,
          m.biography,
          ...(m.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const textMatches = tokens.some((t) => fullText.includes(t));
        const phoneMatches = digits.length >= 3 && m.phone && m.phone.replace(/\D/g, "").includes(digits);
        return textMatches || phoneMatches;
      });
    }

    // Sorting fallback
    if (sortBy === "oldest") {
      results.reverse();
    } else if (sortBy === "name_asc") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name_desc") {
      results.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "city_asc") {
      results.sort((a, b) => a.city.localeCompare(b.city));
    }

    const total = results.length;
    const paginated = results.slice((page - 1) * limit, page * limit).map((m) => {
      if (isAuthorizedAdmin) return m;
      return {
        ...m,
        phone: m.showPhone ? m.phone : null,
        email: m.showEmail ? m.email : null,
        address: m.showAddress ? m.address : null,
      };
    });

    const fallbackCities = [...new Set(fallbackMembers.map((m) => m.city))].sort();
    const fallbackStates = [...new Set(fallbackMembers.map((m) => m.state))].sort();
    const fallbackProfessions = [...new Set(fallbackMembers.map((m) => m.occupation))].sort();
    const fallbackOrgs = [...new Set(fallbackMembers.map((m) => m.company).filter(Boolean))].sort();

    return NextResponse.json({
      members: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      filterOptions: {
        cities: fallbackCities,
        states: fallbackStates,
        professions: fallbackProfessions,
        organizations: fallbackOrgs,
      },
    });
  } catch (error) {
    console.error("GET /api/members error:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

// POST /api/members (Admin creates or approves member with validation & duplicate detection)
export async function POST(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access. Please log in as an administrator." }, { status: 401 });
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
      membershipStatus,
      isApproved,
      isPublished,
      isArchived,
      isFeatured,
      featuredOrder,
      showPhone,
      showEmail,
      showAddress,
    } = body;

    // 1. Server-side validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Full Name is required (minimum 2 characters)." }, { status: 400 });
    }
    if (!occupation || occupation.trim().length === 0) {
      return NextResponse.json({ error: "Profession / Occupation is required." }, { status: 400 });
    }
    if (!city || city.trim().length === 0) {
      return NextResponse.json({ error: "City is required." }, { status: 400 });
    }
    if (!state || state.trim().length === 0) {
      return NextResponse.json({ error: "State is required." }, { status: 400 });
    }

    const cleanEmail = email ? email.toLowerCase().trim() : "";
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const cleanPhone = phone ? phone.trim() : "";
    if (cleanPhone && !isValidPhone(cleanPhone)) {
      return NextResponse.json({ error: "Please provide a valid phone number (minimum 7 digits)." }, { status: 400 });
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { error: "Database not connected. Please ensure MongoDB is running." },
        { status: 503 }
      );
    }

    // 2. Duplicate Detection
    if (cleanEmail) {
      const emailDup = await Member.findOne({ email: cleanEmail }).lean();
      if (emailDup) {
        return NextResponse.json(
          { error: `A member profile with email "${cleanEmail}" already exists in the directory (${emailDup.name}).` },
          { status: 409 }
        );
      }
    }

    if (cleanPhone) {
      const phoneDup = await Member.findOne({ phone: cleanPhone }).lean();
      if (phoneDup) {
        return NextResponse.json(
          { error: `A member profile with phone number "${cleanPhone}" already exists in the directory (${phoneDup.name}).` },
          { status: 409 }
        );
      }
    }

    // 3. Generate Unique Profile Slug
    const uniqueSlug = await generateUniqueMemberSlug(Member, name);

    // 4. Sanitize Biography
    const sanitizedBio = sanitizeContent(biography || "");

    // 5. Derive membership status
    const statusVal = membershipStatus || (isArchived ? "archived" : isApproved ? "active" : "pending");

    const manualTags = Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const autoTags = generateMemberSearchTags({ name, role, occupation, company, city, state, tags: manualTags });
    const finalTags = Array.from(new Set([...manualTags, ...autoTags]));

    const newMember = await Member.create({
      name: name.trim(),
      slug: uniqueSlug,
      role: role ? role.trim() : "Member",
      occupation: occupation.trim(),
      company: company ? company.trim() : "",
      city: city.trim(),
      state: state.trim(),
      address: address ? address.trim() : "",
      pincode: pincode ? pincode.trim() : "",
      phone: cleanPhone,
      email: cleanEmail,
      avatar: avatar || "",
      biography: sanitizedBio,
      tags: finalTags,
      membershipStatus: statusVal,
      isApproved: isApproved !== undefined ? Boolean(isApproved) : true,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      isArchived: isArchived !== undefined ? Boolean(isArchived) : statusVal === "archived",
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      featuredOrder: featuredOrder !== undefined ? Number(featuredOrder) : 0,
      showPhone: showPhone !== undefined ? Boolean(showPhone) : true,
      showEmail: showEmail !== undefined ? Boolean(showEmail) : true,
      showAddress: showAddress !== undefined ? Boolean(showAddress) : false,
    });

    await recordAudit({
      req,
      admin,
      action: "create_member",
      targetEntity: "Member",
      targetId: newMember._id,
      details: { name: newMember.name, email: newMember.email, city: newMember.city },
    });

    return NextResponse.json({ success: true, member: newMember }, { status: 201 });
  } catch (error) {
    console.error("POST /api/members error:", error);
    return NextResponse.json({ error: "Failed to create member: " + error.message }, { status: 500 });
  }
}
