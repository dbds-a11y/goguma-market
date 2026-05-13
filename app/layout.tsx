import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "고구마마켓",
  description: "중고 물품을 사고팔 수 있는 웹 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
