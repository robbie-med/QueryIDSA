import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QueryIDSA — fast lookup for IDSA guidelines",
  description:
    "Tap-friendly index of common infectious-disease diagnoses that fetches the official IDSA guideline page live. No content stored.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
