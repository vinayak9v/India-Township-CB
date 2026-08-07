import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { setOtp, verifyOtp } from "@/lib/otpStore";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req) {
  try {
    const { name, phone, otp } = await req.json();

    // ==========================================
    // STEP 2: Verify OTP and create the account
    // ==========================================
    if (otp) {
      if (!name || !phone) {
        return NextResponse.json({ success: false, message: "Name and phone are required" }, { status: 400 });
      }

      const isValid = verifyOtp(`register:${phone}`, otp);
      if (!isValid) {
        return NextResponse.json({ success: false, message: "Invalid or expired OTP. Please request a new one." }, { status: 400 });
      }

      const [existing] = await db.query("SELECT id FROM users WHERE phone = ?", [phone]);
      if (existing.length > 0) {
        return NextResponse.json({ success: false, message: "This phone number is already registered" }, { status: 400 });
      }

      const [result] = await db.query(
        "INSERT INTO users (name, phone, role) VALUES (?, ?, 'USER')",
        [name, phone]
      );

      const token = jwt.sign({ id: result.insertId, role: "USER" }, process.env.JWT_SECRET, { expiresIn: "24h" });

      const response = NextResponse.json({
        success: true,
        message: "Registered successfully!",
        token,
        user: { id: result.insertId, name, role: "USER" },
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
    // STEP 1: Validate details and send OTP
    // ==========================================
    if (!name || !phone) {
      return NextResponse.json({ success: false, message: "Name and phone are required" }, { status: 400 });
    }

    const [existing] = await db.query("SELECT id FROM users WHERE phone = ?", [phone]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "This phone number is already registered" }, { status: 400 });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(`register:${phone}`, generatedOtp, OTP_TTL_MS);

    // No SMS gateway configured yet — log the OTP server-side so it can be tested end-to-end.
    console.log(`[OTP] Registration OTP for ${phone}: ${generatedOtp}`);

    return NextResponse.json({ success: true, message: "OTP sent to your phone number" });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
