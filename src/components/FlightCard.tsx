"use client";
import { Flight } from "@/types/flight";
import { Plane } from "lucide-react";
import { format } from "date-fns";

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const outbound = flight.itineraries[0];
  const firstSegment = outbound.segments[0];
  const lastSegment = outbound.segments[outbound.segments.length - 1];

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd");
  };

  const parseDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    const hours = match[1] ? match[1].replace("H", "h ") : "";
    const minutes = match[2] ? match[2].replace("M", "m") : "";
    return hours + minutes;
  };

  const getStopsText = () => {
    const stops = outbound.segments.length - 1;
    if (stops === 0) return "Direct";
    if (stops === 1) return "1 Stop";
    return `${stops} Stops`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Plane className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">
              {firstSegment.carrierCode} {firstSegment.number}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(firstSegment.departure.at)}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {firstSegment.departure.iataCode}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(firstSegment.departure.at)}
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="text-sm text-gray-600 mb-1">
                {parseDuration(outbound.duration)}
              </div>
              <div className="w-full h-px bg-gray-300 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Plane className="w-4 h-4 text-gray-400 rotate-90" />
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{getStopsText()}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(lastSegment.arrival.at)}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {lastSegment.arrival.iataCode}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(lastSegment.arrival.at)}
              </div>
            </div>
          </div>
          {outbound.segments.length > 1 && (
            <div className="mt-3 text-xs text-gray-500">
              Via:{" "}
              {outbound.segments
                .slice(0, -1)
                .map((seg) => seg.arrival.iataCode)
                .join(", ")}
            </div>
          )}
        </div>
        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:gap-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              ${flight.price.total}
            </div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
            Select Flight
          </button>
        </div>
      </div>
    </div>
  );
}
