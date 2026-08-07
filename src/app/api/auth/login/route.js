import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { setOtp, verifyOtp } from "@/lib/otpStore";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req) {
  try {
    const { phone, otp } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
    }

    const [users] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (users.length === 0) {
      return NextResponse.json({ success: false, error: "No account found with this phone number" }, { status: 404 });
    }
    const user = users[0];

    // ==========================================
    // STEP 2: Verify OTP and log in
    // ==========================================
    if (otp) {
      const isValid = verifyOtp(`login:${phone}`, otp);
      if (!isValid) {
        return NextResponse.json({ success: false, error: "Invalid or expired OTP. Please request a new one." }, { status: 400 });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, role: user.role },
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
    // STEP 1: Send OTP
    // ==========================================
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(`login:${phone}`, generatedOtp, OTP_TTL_MS);

    // No SMS gateway configured yet — log the OTP server-side so it can be tested end-to-end.
    console.log(`[OTP] Login OTP for ${phone}: ${generatedOtp}`);

    return NextResponse.json({ success: true, message: "OTP sent to your phone number" });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
