import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { signAdminToken, verifyAdminToken } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { recordAudit } from "@/lib/audit";
import bcrypt from "bcryptjs";

// Helper to seed initial admin if database has none
async function ensureAdminExists() {
  const count = await Admin.countDocuments();
  if (count === 0) {
    const email = (process.env.INITIAL_ADMIN_EMAIL || "admin@alokworld.in").toLowerCase();
    const rawPass = process.env.INITIAL_ADMIN_PASSWORD || "AdminSecure@2026";
    const hashedPassword = await bcrypt.hash(rawPass, 10);
    await Admin.create({
      email,
      password: hashedPassword,
      name: "Directory Super Admin",
      role: "superadmin",
    });
  }
}

export async function POST(req) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Rate Limiting check: max 10 attempts per 15 minutes per IP
    const rateLimit = checkRateLimit(`login_${ip}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please wait ${rateLimit.retryAfter} seconds before trying again.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
      );
    }

    const conn = await connectDB();
    if (conn) {
      await ensureAdminExists();
      const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (!admin) {
        return NextResponse.json(
          { error: "Invalid administrative credentials" },
          { status: 401 }
        );
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Invalid administrative credentials" },
          { status: 401 }
        );
      }

      // Reset rate limit on successful authentication
      resetRateLimit(`login_${ip}`);

      const token = signAdminToken(admin);

      // Record audit log
      await recordAudit({
        req,
        admin,
        action: "ADMIN_LOGIN",
        targetEntity: "AdminSession",
        targetId: admin._id,
        details: `Administrator ${admin.email} (${admin.role}) logged in successfully.`,
      });

      const res = NextResponse.json({
        success: true,
        admin: { email: admin.email, name: admin.name, role: admin.role },
      });

      res.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return res;
    } else {
      // Fallback demo admin authentication if MongoDB is currently offline
      const fallbackEmail = (process.env.INITIAL_ADMIN_EMAIL || "admin@alokworld.in").toLowerCase();
      const fallbackPass = process.env.INITIAL_ADMIN_PASSWORD || "AdminSecure@2026";

      if (email.toLowerCase().trim() === fallbackEmail && password === fallbackPass) {
        const dummyAdmin = {
          id: "demo_admin_1",
          email: fallbackEmail,
          name: "Directory Admin (Standby Mode)",
          role: "superadmin",
        };
        const token = signAdminToken(dummyAdmin);
        const res = NextResponse.json({
          success: true,
          admin: { email: dummyAdmin.email, name: dummyAdmin.name, role: dummyAdmin.role },
        });

        res.cookies.set("admin_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });

        return res;
      }

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = verifyAdminToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user: payload });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function DELETE(req) {
  const token = req.cookies.get("admin_token")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (admin) {
    await recordAudit({
      req,
      admin,
      action: "ADMIN_LOGOUT",
      targetEntity: "AdminSession",
      targetId: admin.id || "",
      details: `Administrator ${admin.email} logged out.`,
    });
  }

  const res = NextResponse.json({ success: true, message: "Logged out successfully" });
  res.cookies.set("admin_token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return res;
}
