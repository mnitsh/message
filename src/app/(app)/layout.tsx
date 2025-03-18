import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import Navbar from "../../components/Navbar";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mystery Message",
  description: "A fun way to receive anonymous messages!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-[#2C2C2E] via-[#3A3A3C] to-[#1C1C1E] text-white`}
      >
        <Navbar />
        <main className="flex-grow flex justify-center items-center p-6 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
