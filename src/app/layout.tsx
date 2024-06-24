import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from '@/components/providers';
import '@rainbow-me/rainbowkit/styles.css';
import "./globals.css";

/**
 * @author Ozzy(@Zerocousin) for Remilia Social Credit System
 */

// Initialize Inter font
const inter = Inter({ subsets: ["latin"] });

// Metadata for the application
export const metadata: Metadata = {
  title: "Remilia Social Credit System",
  description: "The gatekeeping tool for remilia",
};

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
