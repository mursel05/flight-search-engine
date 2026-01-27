import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flight Search Engine - Find Best Flight Deals",
  description:
    "Search and compare flights from hundreds of airlines worldwide. Find the best deals with live price trends and advanced filtering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
