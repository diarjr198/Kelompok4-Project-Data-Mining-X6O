import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rumah Tangsel ML — Prediksi Harga Properti",
  description: "Dashboard analitik & prediksi harga rumah Tangerang Selatan menggunakan Machine Learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body>{children}</body>
    </html>
  );
}
