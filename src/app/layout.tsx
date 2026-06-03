import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext"; // Import it here

const inter = Inter({ subsets: ["latin"] });

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
        {/* Wrap the entire app so every page shares the same cart */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}