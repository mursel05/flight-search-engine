import { FlightSegment } from "./flightSegment";

export type Flight = {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Array<{
    segments: FlightSegment[];
    duration: string;
  }>;
  numberOfStops: number;
  validatingAirlineCodes: string[];
};
