import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "uguisu",
  description: "note app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/uguisu/favicon.ico" />
        <link rel="manifest" href="/uguisu/manifest.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  );
}
