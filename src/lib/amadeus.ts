import { SearchParams } from "@/types/searchParams";
import axios from "axios";

const AMADEUS_AUTH_URL =
  "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_API_URL = "https://test.api.amadeus.com";
let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.NEXT_PUBLIC_AMADEUS_API_KEY || "");
  params.append(
    "client_secret",
    process.env.NEXT_PUBLIC_AMADEUS_API_SECRET || "",
  );

  try {
    const response = await axios.post(AMADEUS_AUTH_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000;
    return accessToken || "";
  } catch {
    throw new Error("Failed to authenticate with Amadeus API");
  }
}

export async function searchFlights(params: SearchParams) {
  const token = await getAccessToken();
  const searchParams = {
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    adults: params.adults,
    max: 50,
  };

  try {
    const response = await axios.get(
      `${AMADEUS_API_URL}/v2/shopping/flight-offers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: searchParams,
      },
    );
    return response.data;
  } catch {
    throw new Error("Failed to search flights");
  }
}

export async function searchAirports(keyword: string) {
  const token = await getAccessToken();

  try {
    const response = await axios.get(
      `${AMADEUS_API_URL}/v1/reference-data/locations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          keyword,
          subType: "AIRPORT,CITY",
          "page[limit]": 10,
        },
      },
    );
    return response.data.data;
  } catch {
    throw new Error("Failed to search airports");
  }
}

export async function getFlightPrices(params: {
  origin: string;
  destination: string;
  departureDate: string;
}) {
  const token = await getAccessToken();
  try {
    const response = await axios.get(
      `${AMADEUS_API_URL}/v1/shopping/flight-destinations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          origin: params.origin,
          departureDate: params.departureDate,
        },
      },
    );
    return response.data.data;
  } catch {
    return [];
  }
}
