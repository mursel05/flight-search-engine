export type Airport = {
  id: string;
  iataCode: string;
  name: string;
  address: {
    cityName: string;
    countryName: string;
  };
};
