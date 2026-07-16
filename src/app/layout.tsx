import type { Metadata } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SabariChatBubble from "@/components/SabariChatBubble";

export const metadata: Metadata = {
  title: "WardConnect — Kowdiar Ward Citizens' Portal",
  description: "Report local issues, track grievances, and connect with your ward office — simple and accessible for every resident.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WardConnect",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col"
        style={{ background: '#F7F9F7', color: '#1F2937', fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <PWARegister />
        <AuthProvider>
          <ThemeProvider>
            <AuthGuard>
              {/* Top App Bar */}
              <Header />

              {/* Page content — padded bottom so BottomNav doesn't cover content */}
              <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4 pb-28 flex flex-col gap-5">
                {children}
              </main>

              {/* Bottom Navigation */}
              <BottomNav />

              {/* Floating Chat Bubble with K S Sabarinadhan */}
              <SabariChatBubble />
            </AuthGuard>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
