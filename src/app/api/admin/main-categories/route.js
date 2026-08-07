import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const { name, slug, status } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const [existing] = await db.query(
      "SELECT id FROM main_categories WHERE slug = ?",
      [slug]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Slug already exists" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `INSERT INTO main_categories
      (name, slug, status)
      VALUES (?, ?, ?)`,
      [
        name,
        slug,
        status || "ACTIVE"
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      id: result.insertId
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {

    const [categories] = await db.query(`
      SELECT *
      FROM main_categories
      ORDER BY id DESC
    `);

    return NextResponse.json({
      success: true,
      data: categories
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}