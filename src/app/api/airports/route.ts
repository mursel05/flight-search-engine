import { NextRequest, NextResponse } from "next/server";
import { searchAirports } from "@/lib/amadeus";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get("keyword");

  if (!keyword) {
    return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
  }

  try {
    const airports = await searchAirports(keyword);
    return NextResponse.json(airports);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to search airports",
      },
      { status: 500 },
    );
  }
}
