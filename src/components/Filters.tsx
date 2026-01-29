"use client";
import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { Flight } from "@/types/flight";
import { Skeleton, Slider } from "@mui/material";

interface FiltersProps {
  flights: Flight[];
  onFilterChange: (filtered: Flight[]) => void;
  loading: boolean;
}

export default function Filters({
  flights,
  onFilterChange,
  loading,
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const airlines = Array.from(
    new Set(flights.map((f) => f.validatingAirlineCodes[0])),
  ).sort();
  const prices =
    flights.length > 0 ? flights.map((f) => parseFloat(f.price.total)) : [0];
  const minPrice = parseFloat((Math.min(...prices) || 0).toFixed(0));
  const maxPrice = parseFloat((Math.max(...prices) || 0).toFixed(0));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const applyFilters = () => {
    let filtered = [...flights];
    filtered = filtered.filter((flight) => {
      const price = parseFloat(flight.price.total);
      return price >= priceRange[0] && price <= priceRange[1];
    });
    if (selectedStops.length > 0) {
      filtered = filtered.filter((flight) => {
        const stops = flight.itineraries[0].segments.length - 1;
        return selectedStops.includes(stops.toString());
      });
    }
    if (selectedAirlines.length > 0) {
      filtered = filtered.filter((flight) =>
        selectedAirlines.includes(flight.validatingAirlineCodes[0]),
      );
    }
    onFilterChange(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [priceRange, selectedStops, selectedAirlines, flights]);

  const toggleStop = (stop: string) => {
    setSelectedStops((prev) =>
      prev.includes(stop) ? prev.filter((s) => s !== stop) : [...prev, stop],
    );
  };

  const toggleAirline = (airline: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline)
        ? prev.filter((a) => a !== airline)
        : [...prev, airline],
    );
  };

  const clearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedStops([]);
    setSelectedAirlines([]);
  };

  const activeFiltersCount =
    (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0) +
    selectedStops.length +
    selectedAirlines.length;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-40 flex items-center gap-2">
        <Filter className="w-5 h-5" />
        {activeFiltersCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>
      <div
        className={`
          fixed lg:relative inset-0 lg:inset-auto bg-white lg:bg-transparent z-50 lg:z-auto
          transform transition-transform duration-300 lg:transform-none
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}>
        <div className="h-full overflow-y-auto lg:sticky lg:top-6 bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer lg:hidden text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-6 pb-6 border-b">
            <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
            {loading ? (
              <div>
                <Skeleton variant="rounded" width={"100%"} height={40} />
              </div>
            ) : (
              <div className="space-y-3">
                <Slider
                  getAriaLabel={() => "Temperature range"}
                  value={priceRange[1]}
                  onChange={(event: Event, newValue: number | number[]) =>
                    setPriceRange([
                      priceRange[0],
                      typeof newValue === "number" ? newValue : newValue[1],
                    ])
                  }
                  min={minPrice}
                  max={maxPrice}
                  valueLabelDisplay="auto"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${Math.round(minPrice)}</span>
                  <span className="font-medium text-gray-900">
                    Up to ${Math.round(priceRange[1])}
                  </span>
                  <span>${Math.round(maxPrice)}</span>
                </div>
              </div>
            )}
          </div>
          <div className="mb-6 pb-6 border-b">
            <h4 className="font-medium text-gray-900 mb-3">Stops</h4>
            {loading ? (
              <div className="flex flex-col gap-2">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <Skeleton
                      variant="rounded"
                      width={"100%"}
                      height={16}
                      key={index}
                    />
                  ))}
              </div>
            ) : (
              <div className="space-y-2">
                {["0", "1", "2"].map((stop) => (
                  <label
                    key={stop}
                    className="flex items-center gap-2 cursor-pointer"
                    htmlFor={`stop-${stop}`}>
                    <input
                      id={`stop-${stop}`}
                      type="checkbox"
                      checked={selectedStops.includes(stop)}
                      onChange={() => toggleStop(stop)}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">
                      {stop === "0"
                        ? "Direct"
                        : stop === "1"
                          ? "1 Stop"
                          : "2+ Stops"}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Airlines</h4>
            {loading ? (
              <div className="flex flex-col gap-2">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <Skeleton
                      variant="rounded"
                      width={"100%"}
                      height={16}
                      key={index}
                    />
                  ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {airlines.map((airline) => (
                  <label
                    key={airline}
                    className="flex items-center gap-2 cursor-pointer"
                    htmlFor={`airline-${airline}`}>
                    <input
                      id={`airline-${airline}`}
                      type="checkbox"
                      checked={selectedAirlines.includes(airline)}
                      onChange={() => toggleAirline(airline)}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{airline}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium mt-6 cursor-pointer text-left">
              Clear all filters
            </button>
          )}
        </div>
      </div>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}
    </>
  );
}
