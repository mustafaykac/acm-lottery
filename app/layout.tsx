import type { Metadata, Viewport } from "next";
import "./globals.css";
import BackgroundEffects from "@/components/BackgroundEffects";

export const metadata: Metadata = {
  title: "Hull City Maç Deneyimi - Kura Sistemi",
  description:
    "Hull City maç deneyimi için 5 şanslı kazananın belirlendiği kurumsal kura uygulaması.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="font-body antialiased">
        <BackgroundEffects />
        {children}
      </body>
    </html>
  );
}
