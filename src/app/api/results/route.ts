import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { results, user } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the required fields
    const {
      userId,
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars,
      duration,
      text,
    } = body;

    if (
      !userId ||
      !wpm ||
      !accuracy ||
      !correctChars ||
      !totalChars ||
      !duration ||
      !text
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert the record into the results table
    await db.insert(results).values({
      userId,
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars,
      duration,
      text,
    });

    return NextResponse.json({ message: "Record saved successfully" });
  } catch (error) {
    console.error("Error saving record:", error);
    return NextResponse.json(
      { error: "Failed to save record" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT * FROM (
      SELECT DISTINCT ON (r.user_id)
        u.name,
        u.image,
        r.user_id,
        r.wpm,
        r.accuracy,
        r.created_at
      FROM ${results} r
      JOIN ${user} u ON u.id = r.user_id
      ORDER BY r.user_id, r.wpm DESC, r.accuracy DESC
    ) AS best_results
    ORDER BY wpm DESC, accuracy DESC`);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
