import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { generateOtp, setOtp, verifyOtp, resendWaitSeconds } from "@/lib/otpStore";
import { sendOtpEmail } from "@/lib/nodemailer";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;

// Returns an error message if the email or phone is already taken, else null
async function findConflict(email, phone) {
  const [rows] = await db.query("SELECT email, phone FROM users WHERE email = ? OR phone = ?", [email, phone]);
  if (rows.some((r) => r.email && r.email.toLowerCase() === email)) return "This email is already registered. Please login instead.";
  if (rows.some((r) => r.phone === phone)) return "This phone number is already registered.";
  return null;
}

// Two-step email OTP registration:
//   1. { name, email, phone }       -> validates and emails a 6-digit OTP
//   2. { name, email, phone, otp }  -> verifies it, creates the user and returns a JWT
export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").replace(/\D/g, "");
    const otp = body.otp ? String(body.otp).trim() : "";

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, message: "Name, email and phone are required" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address" }, { status: 400 });
    }
    if (!PHONE_RE.test(phone)) {
      return NextResponse.json({ success: false, message: "Please enter a valid 10-digit mobile number" }, { status: 400 });
    }

    const otpKey = `register:${email}`;

    // ==========================================
    // STEP 2: Verify OTP and create the account
    // ==========================================
    if (otp) {
      const isValid = verifyOtp(otpKey, otp);
      if (!isValid) {
        return NextResponse.json({ success: false, message: "Invalid or expired OTP. Please request a new one." }, { status: 400 });
      }

      const conflict = await findConflict(email, phone);
      if (conflict) {
        return NextResponse.json({ success: false, message: conflict }, { status: 400 });
      }

      const [result] = await db.query(
        "INSERT INTO users (name, email, phone, role) VALUES (?, ?, ?, 'USER')",
        [name, email, phone]
      );

      const token = jwt.sign({ id: result.insertId, role: "USER" }, process.env.JWT_SECRET, { expiresIn: "24h" });

      const response = NextResponse.json({
        success: true,
        message: "Registered successfully!",
        token,
        user: { id: result.insertId, name, email, phone, role: "USER" },
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400,
      });

      return response;
    }

    // ==========================================
    // STEP 1: Validate details and email the OTP
    // ==========================================
    const conflict = await findConflict(email, phone);
    if (conflict) {
      return NextResponse.json({ success: false, message: conflict }, { status: 400 });
    }

    const wait = resendWaitSeconds(otpKey);
    if (wait > 0) {
      return NextResponse.json({ success: false, message: `Please wait ${wait} seconds before requesting a new OTP.`, retryAfter: wait }, { status: 429 });
    }

    const generatedOtp = generateOtp();
    setOtp(otpKey, generatedOtp, OTP_TTL_MS);
    await sendOtpEmail(email, generatedOtp, "register");

    return NextResponse.json({ success: true, message: `OTP sent to ${email}` });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ success: false, message: "Could not send OTP right now. Please try again." }, { status: 500 });
  }
}
