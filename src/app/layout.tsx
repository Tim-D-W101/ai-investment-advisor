import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InvestNow — AI-powered investing for South Africans",
  description:
    "Get an AI-powered portfolio in 2 minutes. No jargon. No advisor fees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-white text-navy antialiased">
        {children}
      </body>
    </html>
  );
}
