import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(req, { params }) {
  try {

    const { id } = await params;

    const { name, slug, status } = await req.json();

    await db.query(
      `UPDATE main_categories
       SET
       name = ?,
       slug = ?,
       status = ?
       WHERE id = ?`,
      [
        name,
        slug,
        status,
        id
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Category updated successfully"
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  try {

    const { id } = await params;

    await db.query(
      "DELETE FROM main_categories WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}   