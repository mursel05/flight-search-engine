"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingDown,
  BarChart3,
  LineChart as LineChartIcon,
} from "lucide-react";
import { Flight } from "@/types/flight";

interface PriceGraphProps {
  flights: Flight[];
}

export default function PriceGraph({ flights }: PriceGraphProps) {
  const [viewMode, setViewMode] = useState<"distribution" | "airline">(
    "distribution",
  );

  if (!flights || flights.length === 0) {
    return null;
  }

  const prices = flights.map((f) => parseFloat(f.price.total));
  const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const getChartData = () => {
    switch (viewMode) {
      case "distribution":
        return flights
          .map((f, idx) => ({
            name: `Flight ${idx + 1}`,
            price: parseFloat(f.price.total),
            airline: f.validatingAirlineCodes.join(", "),
          }))
          .sort((a, b) => a.price - b.price)
          .filter((_, idx) => idx % Math.ceil(flights.length / 15) === 0); // Show max 15 points

      case "airline":
        const airlineMap = new Map<string, number[]>();
        flights.forEach((f) => {
          const airline = f.validatingAirlineCodes.join(", ");
          if (!airlineMap.has(airline)) {
            airlineMap.set(airline, []);
          }
          airlineMap.get(airline)!.push(parseFloat(f.price.total));
        });
        return Array.from(airlineMap.entries())
          .map(([airline, prices]) => ({
            name: airline,
            avgPrice: Math.round(
              prices.reduce((a, b) => a + b, 0) / prices.length,
            ),
            minPrice: Math.round(Math.min(...prices)),
            maxPrice: Math.round(Math.max(...prices)),
            count: prices.length,
          }))
          .sort((a, b) => a.avgPrice - b.avgPrice);
    }
  };

  const chartData = getChartData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Live Price Analysis
          </h3>
          <p className="text-sm text-gray-500">
            {viewMode === "distribution" &&
              "Price distribution across all flights"}
            {viewMode === "airline" && "Average prices by airline"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("distribution")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === "distribution"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            <LineChartIcon className="w-4 h-4" />
            Distribution
          </button>
          <button
            onClick={() => setViewMode("airline")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              viewMode === "airline"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            <BarChart3 className="w-4 h-4" />
            Airlines
          </button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === "distribution" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
                formatter={(
                  value: number,
                  name: string,
                  props: { payload: { airline: string } },
                ) => [
                  `$${Math.round(value)}`,
                  `Price (${props.payload.airline})`,
                ]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px",
                }}
                formatter={(value: number, name: string) => [
                  `$${Math.round(value)}`,
                  name,
                ]}
              />
              <Legend />
              {viewMode === "airline" ? (
                <>
                  <Bar
                    dataKey="avgPrice"
                    fill="#2563eb"
                    name="Avg Price"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="minPrice"
                    fill="#10b981"
                    name="Min Price"
                    radius={[8, 8, 0, 0]}
                  />
                </>
              ) : (
                <Bar
                  dataKey="avgPrice"
                  fill="#2563eb"
                  name="Avg Price"
                  radius={[8, 8, 0, 0]}
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-500">Total Flights</div>
          <div className="text-2xl font-bold text-gray-900">
            {flights.length}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Lowest Price</div>
          <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
            <TrendingDown className="w-5 h-5" />${Math.round(minPrice)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Average Price</div>
          <div className="text-2xl font-bold text-gray-900">
            ${Math.round(avgPrice)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Highest Price</div>
          <div className="text-2xl font-bold text-red-600">
            ${Math.round(maxPrice)}
          </div>
        </div>
      </div>
    </div>
  );
}
