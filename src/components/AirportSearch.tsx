"use client";
import { useState, useEffect, useRef } from "react";
import { Plane } from "lucide-react";
import { Airport } from "@/types/airport";

interface AirportSearchProps {
  value: string;
  onChange: (value: string, airport: Airport) => void;
  placeholder: string;
  label: string;
}

export default function AirportSearch({
  value,
  onChange,
  placeholder,
  label,
}: AirportSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchAirports = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `/api/airports?keyword=${encodeURIComponent(query)}`,
        );
        const data = await response.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(searchAirports, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (airport: Airport) => {
    setQuery(`${airport.address.cityName} (${airport.iataCode})`);
    onChange(airport.iataCode, airport);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query || value}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>
      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            results.map((airport) => (
              <button
                key={airport.id}
                onClick={() => handleSelect(airport)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b last:border-b-0">
                <div className="font-medium text-gray-900">
                  {airport.address.cityName} ({airport.iataCode})
                </div>
                <div className="text-sm text-gray-500">
                  {airport.name}, {airport.address.countryName}
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No airports found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
