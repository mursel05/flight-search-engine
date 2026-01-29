"use client";
import { SyntheticEvent, useState } from "react";
import AirportSearch from "./AirportSearch";
import { Search, Calendar, Users } from "lucide-react";
import { SearchParams } from "@/types/searchParams";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
  onShowAlert: (
    alert: { type: "success" | "error"; message: string } | null,
  ) => void;
}

export default function SearchForm({
  onSearch,
  loading,
  onShowAlert,
}: SearchFormProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("roundTrip");
  const today = new Date();
  const localDate =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate) {
      onShowAlert({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }
    onSearch({
      origin,
      destination,
      departureDate,
      returnDate: tripType === "roundTrip" ? returnDate : undefined,
      adults,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setTripType("roundTrip")}
          className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${
            tripType === "roundTrip"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}>
          Round Trip
        </button>
        <button
          type="button"
          onClick={() => setTripType("oneWay")}
          className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${
            tripType === "oneWay"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}>
          One Way
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AirportSearch
          value={origin}
          onChange={(code) => setOrigin(code)}
          placeholder="Where from?"
          label="Origin"
          onShowAlert={onShowAlert}
        />
        <AirportSearch
          value={destination}
          onChange={(code) => setDestination(code)}
          placeholder="Where to?"
          label="Destination"
          onShowAlert={onShowAlert}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departure Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={localDate}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
        {tripType === "roundTrip" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departureDate || localDate}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passengers
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              min={1}
              max={9}
              value={adults}
              onChange={(e) =>
                setAdults(Math.max(1, Math.min(9, parseInt(e.target.value))))
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`${loading ? "cursor-not-allowed" : "cursor-pointer"} w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2`}>
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Searching Flights...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Search Flights
          </>
        )}
      </button>
    </form>
  );
}
