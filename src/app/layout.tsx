import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lotería",
  description: "Mexican Lotería live event app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
