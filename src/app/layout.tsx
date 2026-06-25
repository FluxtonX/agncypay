import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/shared/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgncyPay | Secure Brand Invoice Payments & KYB Verification",
  description: "A verified brand payment platform for invoice management, business verification, and fast payment reconciliation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col bg-black text-white`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
