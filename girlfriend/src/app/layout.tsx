import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";
import { EditProvider } from "./context/EditContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memories of Love 💞",
  description: "Um diário digital de lembranças especiais.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-linear-to-b from-pink-100 to-purple-200`}
      >
        <EditProvider>
          <Navbar />
          <main>{children}</main>
        </EditProvider>
      </body>
    </html>
  );
}
