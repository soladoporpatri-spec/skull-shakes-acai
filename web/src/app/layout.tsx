import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://skullshakes.com.br"),
  title: "Skull Shakes | Açaí",
  description: "Açaí expresso super cremoso e batidinhas gourmet prontas pra beber. O melhor de Anápolis. Delivery rápido e prático.",
  keywords: ["açaí", "açaiteria", "batidinhas", "skull shakes", "delivery", "anápolis"],
  openGraph: {
    title: "Skull Shakes | Açaí",
    description: "Açaí expresso super cremoso e batidinhas gourmet prontas pra beber.",
    url: "https://skullshakes.com.br", // URL de produção
    siteName: "Skull Shakes",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
      }
    ],
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${anton.variable} h-full antialiased bg-black text-white`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
