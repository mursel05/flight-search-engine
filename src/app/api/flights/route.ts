import { NextRequest, NextResponse } from "next/server";
import { searchFlights } from "@/lib/amadeus";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departureDate = searchParams.get("departureDate");
  const adults = searchParams.get("adults");
  const returnDate = searchParams.get("returnDate");

  if (!origin || !destination || !departureDate || !adults) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  try {
    const flights = await searchFlights({
      origin,
      destination,
      departureDate,
      adults: parseInt(adults),
      returnDate: returnDate || undefined,
    });
    return NextResponse.json(flights);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to search flights",
      },
      { status: 500 },
    );
  }
}
