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
      <body className={inter.className + ' text-lg bg-transparent'}>
        {/* Animated dispersed fire/ember background */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          {/* Large center ember */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[90vh] bg-gradient-to-t from-orange-200/3 via-yellow-100/2 to-transparent rounded-full blur-[200px] animate-pulse"></div>
          {/* Top ember */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-gradient-to-b from-orange-100/2 via-yellow-50/2 to-transparent rounded-full blur-[140px] animate-pulse"></div>
          {/* Bottom ember */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-gradient-to-t from-orange-200/3 via-yellow-100/2 to-transparent rounded-full blur-[180px] animate-pulse"></div>
          {/* Left vertical ember */}
          <div className="absolute top-1/4 left-0 w-[30vw] h-[70vh] bg-gradient-to-tr from-orange-100/2 via-yellow-50/2 to-transparent rounded-full blur-[140px] animate-pulse"></div>
          {/* Right vertical ember */}
          <div className="absolute top-1/4 right-0 w-[30vw] h-[70vh] bg-gradient-to-tl from-orange-100/2 via-yellow-50/2 to-transparent rounded-full blur-[140px] animate-pulse"></div>
        </div>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
