"use client";
import { Skeleton } from "@mui/material";
import { Plane } from "lucide-react";

export default function FlightLoadingCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Plane className="w-4 h-4 text-blue-600" />
            </div>
            <Skeleton
              variant="text"
              sx={{ fontSize: "1.3rem", width: "80px" }}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <Skeleton
                variant="text"
                sx={{ fontSize: "1.5rem", width: "80px" }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: "1rem", width: "50px" }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: "0.8rem", width: "50px" }}
              />
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <Skeleton
                variant="text"
                sx={{ fontSize: "1rem", width: "60px" }}
              />
              <div className="w-full h-px bg-gray-300 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Plane className="w-4 h-4 text-gray-400 rotate-90" />
                </div>
              </div>
              <Skeleton
                variant="text"
                sx={{ fontSize: "0.8rem", width: "50px" }}
              />
            </div>
            <div className="flex flex-col items-center">
              <Skeleton
                variant="text"
                sx={{ fontSize: "1.5rem", width: "80px" }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: "1rem", width: "50px" }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: "0.8rem", width: "50px" }}
              />
            </div>
          </div>
        </div>
        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:gap-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
          <div className="text-right">
            <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100px" }} />
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
