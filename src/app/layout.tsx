import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext"; // Import it here

export const metadata: Metadata = {
  title: "Shift Essentials",
  description: "Elevate your daily carry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
  return (
    <html lang="en">
      <body>
        {/* Wrap the entire app so every page shares the same cart */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
