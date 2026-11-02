import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { portfolio } from "@/lib/portfolio";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: portfolio.url ? new URL(portfolio.url) : undefined,
  title: portfolio.name,
  description: portfolio.description,
  icons: portfolio.logo ? { icon: portfolio.logo, apple: portfolio.logo } : undefined,
  openGraph: {
    title: portfolio.name,
    description: portfolio.description,
    images: portfolio.logo ? [portfolio.logo] : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{ "--accent": portfolio.accent } as React.CSSProperties}
    >
      <body>{children}</body>
    </html>
  );
}
