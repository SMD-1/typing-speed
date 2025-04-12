import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { results } from "@/lib/db/schema";

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
      !incorrectChars ||
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
