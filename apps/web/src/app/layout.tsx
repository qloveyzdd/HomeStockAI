import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "家补 AI",
  description: "家庭补货决策助手",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
