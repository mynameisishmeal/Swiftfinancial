import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swift Financial | Online Banking",
  description: "Secure online banking services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/assets/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
