import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "自动驾驶售前助手",
  description: "AI辅助自动驾驶技术售前顾问系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
