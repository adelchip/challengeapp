import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClientLayout } from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Challenge App - MVP",
  description: "Platform to create and manage company challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="teamsystem" suppressHydrationWarning>
      <body className="min-h-screen bg-base-200" suppressHydrationWarning>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <ClientLayout>{children}</ClientLayout>
        </main>
      </body>
    </html>
  );
}
