import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solergy — Independencia Energética Inteligente",
  description:
    "Evalúa tu ahorro en energía solar, calcula tu retorno de inversión y alcanza la independencia energética con Solergy. V Región, VI Región y Región Metropolitana.",
  keywords: "energía solar, paneles solares, ahorro energético, Chile, V Región, VI Región",
  openGraph: {
    title: "Solergy — Independencia Energética Inteligente",
    description: "Tu cuenta eléctrica seguirá subiendo. Descubre cuánto podrías ahorrar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
