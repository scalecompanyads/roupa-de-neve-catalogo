import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nevou no Chile — Catálogo 2026",
  description: "Catálogo editável de aluguel de roupas para neve."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
