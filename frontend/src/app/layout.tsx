import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Color_Emoji } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoColorEmoji = Noto_Color_Emoji({
  variable: "--font-noto-color-emoji",
  weight: "400",
  subsets: ["emoji"],
});

export const metadata: Metadata = {
  title: "AllyBuy - Web3 Bulk Purchase Platform",
  description: "Web3-based platform that enables users to purchase products in bulk at lower prices through blockchain operations and smart contracts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoColorEmoji.variable} antialiased bg-black text-white`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
