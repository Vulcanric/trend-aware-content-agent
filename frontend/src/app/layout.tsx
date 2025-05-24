import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trend-Aware Content Generator",
  description: "Generate engaging content based on trending topics using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + ' h-screen text-md'}>
        {children}
        <Toaster position="top-right" containerClassName="text-base" />
      </body>
    </html>
  );
}
