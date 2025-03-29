import type { Metadata } from "next";
import { Providers } from "@/providers";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "SQL Playground",
  description:
    "A complete SQL playground solution that works entirely offline",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
