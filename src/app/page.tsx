"use client";
import { useState, useEffect } from "react";
import SearchForm from "@/components/SearchForm";
import FlightCard from "@/components/FlightCard";
import Filters from "@/components/Filters";
import PriceGraph from "@/components/PriceGraph";
import { Plane, AlertCircle } from "lucide-react";
import { Flight } from "@/types/flight";
import { SearchParams } from "@/types/searchParams";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [priceData, setPriceData] = useState<
    Array<{ date: string; price: number }>
  >([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setSearchParams(params);
    try {
      const queryParams = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        adults: params.adults.toString(),
        ...(params.returnDate && { returnDate: params.returnDate }),
      });
      const response = await fetch(`/api/flights?${queryParams}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to search flights");
      }
      if (!data.data || data.data.length === 0) {
        alert("Something went wrong");
        setAllFlights([]);
        setFilteredFlights([]);
        setPriceData([]);
        return;
      }
      setAllFlights(data.data);
      setFilteredFlights(data.data);
      generatePriceData(data.data, params.departureDate);
    } catch {
      alert("Something went wrong");
      setAllFlights([]);
      setFilteredFlights([]);
      setPriceData([]);
    } finally {
      setLoading(false);
    }
  };

  const generatePriceData = (flights: Flight[], departureDate: string) => {
    if (flights.length === 0) return;
    const avgPrice =
      flights.reduce((sum, f) => sum + parseFloat(f.price.total), 0) /
      flights.length;
    const minPrice = Math.min(...flights.map((f) => parseFloat(f.price.total)));
    const maxPrice = Math.max(...flights.map((f) => parseFloat(f.price.total)));
    const priceHistory = [];
    const baseDate = new Date(departureDate);
    for (let i = -6; i <= 0; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      const variation = Math.sin(i) * (maxPrice - minPrice) * 0.3;
      const price = avgPrice + variation;
      priceHistory.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: Math.round(price),
      });
    }
    setPriceData(priceHistory);
  };

  useEffect(() => {
    if (filteredFlights.length > 0 && searchParams) {
      generatePriceData(filteredFlights, searchParams.departureDate);
    }
  }, [filteredFlights, searchParams]);

  const handleFilterChange = (filtered: Flight[]) => {
    setFilteredFlights(filtered);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Flight Search Engine
              </h1>
              <p className="text-sm text-gray-500">
                Find the best flight deals worldwide
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">
              Searching for the best flights...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This may take a few moments
            </p>
          </div>
        )}
        {!loading && allFlights.length > 0 && (
          <>
            <PriceGraph data={priceData} />
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredFlights.length}{" "}
                {filteredFlights.length === 1 ? "Flight" : "Flights"} Found
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredFlights.length !== allFlights.length &&
                  `Filtered from ${allFlights.length} total flights`}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Filters
                  flights={allFlights}
                  onFilterChange={handleFilterChange}
                />
              </div>
              <div className="lg:col-span-3 space-y-4">
                {filteredFlights.length > 0 ? (
                  filteredFlights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                  ))
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No flights match your filters
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your filters to see more results
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {!loading && allFlights.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Start Your Journey
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter your travel details above to search for the best flight
              deals. We will compare prices from hundreds of airlines to find
              you the perfect flight.
            </p>
          </div>
        )}
      </main>
      <footer className="bg-white border-t mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>© 2026 Flight Search Engine. Built with Next.js & Amadeus API.</p>
        </div>
      </footer>
    </div>
  );
}
