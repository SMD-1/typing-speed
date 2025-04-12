import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { results } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.pathname.split("/").pop();
    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const response = await db
      .select()
      .from(results)
      .where(eq(results.userId, userId));
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
