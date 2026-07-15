import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/PWARegister";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Greenfield Ward Citizens' Portal",
  description: "An easy-to-use, elderly-friendly application for ward residents to report local issues and view community news.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ward Portal",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <PWARegister />
        <ThemeProvider>
          <Header />
          <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
