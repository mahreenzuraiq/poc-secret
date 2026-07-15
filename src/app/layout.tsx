import type { Metadata } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";

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
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col text-ink-black bg-white">
        <PWARegister />
        <AuthProvider>
          <ThemeProvider>
            <AuthGuard>
              <Header />
              <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
                {children}
              </main>
            </AuthGuard>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
