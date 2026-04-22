import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swift Financial | Online Banking",
  description: "Swift Financial offers secure online banking, transfers, savings, and investment tools for individuals and businesses.",
  keywords: "Swift Financial, online banking, secure banking, SFB, digital banking",
  authors: [{ name: "Swift Financial Corporation" }],
  openGraph: {
    title: "Swift Financial | Online Banking",
    description: "Swift Financial offers secure online banking, transfers, savings, and investment tools.",
    siteName: "Swift Financial",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Swift Financial | Online Banking",
    description: "Secure online banking with Swift Financial.",
  },
  robots: { index: true, follow: true },
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
        <link rel="manifest" href="/assets/site.webmanifest" />
        <meta name="theme-color" content="#0066CC" />
      </head>
      <body>{children}</body>
    </html>
  );
}
