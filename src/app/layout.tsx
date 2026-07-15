import type { Metadata } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Kowdiar Ward Citizens' Portal",
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
              
              {/* Site Footer */}
              <footer className="w-full bg-gray-50 border-t border-gray-200 py-8 px-6 mt-12 text-center text-sm font-semibold text-gray-550">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col text-left gap-1">
                    <span className="font-extrabold text-base text-gray-800">Kowdiar Ward Citizens' Portal</span>
                    <span className="text-xs text-gray-500 font-medium">Official local citizen reporting system of Kowdiar Ward.</span>
                  </div>
                  <div className="flex flex-col text-right gap-1 text-xs">
                    <span>Helpdesk: <a href="tel:04712345678" className="text-dark-teal hover:underline font-extrabold">0471-2345678</a></span>
                    <span className="text-gray-400 font-normal">© 2026 Kowdiar Municipal Corporation. All rights reserved.</span>
                  </div>
                </div>
              </footer>
            </AuthGuard>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
