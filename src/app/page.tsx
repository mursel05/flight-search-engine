"use client";
import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import FlightCard from "@/components/FlightCard";
import Filters from "@/components/Filters";
import { Plane, AlertCircle } from "lucide-react";
import { Flight } from "@/types/flight";
import { SearchParams } from "@/types/searchParams";
import FlightLoadingCard from "@/components/FlightLoadingCard";
import { Alert, Snackbar } from "@mui/material";
import { Alert as AlertType } from "@/types/alert";
import PriceGraph from "@/components/PriceGraph";

export default function Home() {
  const [showAlert, setShowAlert] = useState<AlertType | null>(null);
  const [loading, setLoading] = useState(false);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  console.log(allFlights[0]);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
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
        setShowAlert({ type: "error", message: "Something went wrong" });
        setAllFlights([]);
        setFilteredFlights([]);
        return;
      }
      setAllFlights(data.data);
      setFilteredFlights(data.data);
    } catch {
      setShowAlert({ type: "error", message: "Something went wrong" });
      setAllFlights([]);
      setFilteredFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filtered: Flight[]) => {
    setFilteredFlights(filtered);
  };

  const handleClose = () => {
    setShowAlert(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50">
      {showAlert && (
        <Snackbar
          open={!!showAlert}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert severity={showAlert?.type} variant="filled">
            {showAlert?.message}
          </Alert>
        </Snackbar>
      )}
      <header className="bg-white shadow-sm">
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
          <SearchForm
            onSearch={handleSearch}
            loading={loading}
            onShowAlert={setShowAlert}
          />
        </div>
        {(loading || allFlights.length > 0) && (
          <>
            <PriceGraph flights={filteredFlights} />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Filters
                  flights={allFlights}
                  onFilterChange={handleFilterChange}
                  loading={loading}
                />
              </div>
              <div className="lg:col-span-3 space-y-4">
                {loading ? (
                  Array(5)
                    .fill(null)
                    .map((_, index) => <FlightLoadingCard key={index} />)
                ) : filteredFlights.length > 0 ? (
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
    </div>
  );
}
