"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingDown } from "lucide-react";

interface PriceGraphProps {
  data: Array<{ date: string; price: number }>;
}

export default function PriceGraph({ data }: PriceGraphProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const avgPrice = data.reduce((sum, d) => sum + d.price, 0) / data.length;
  const minPrice = Math.min(...data.map((d) => d.price));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Price Trends</h3>
          <p className="text-sm text-gray-500">Prices update as you filter</p>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingDown className="w-5 h-5" />
          <span className="text-sm font-medium">
            Best: ${Math.round(minPrice)}
          </span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
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
              formatter={(value: number | undefined) => [`$${Math.round(value ?? 0)}`, "Price"]}
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
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-500">Lowest</div>
          <div className="text-lg font-semibold text-green-600">
            ${Math.round(minPrice)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Average</div>
          <div className="text-lg font-semibold text-gray-900">
            ${Math.round(avgPrice)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Highest</div>
          <div className="text-lg font-semibold text-red-600">
            ${Math.round(Math.max(...data.map((d) => d.price)))}
          </div>
        </div>
      </div>
    </div>
  );
}
