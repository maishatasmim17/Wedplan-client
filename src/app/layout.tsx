import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAuthProviderWrapper from "@/components/GoogleAuthProviderWrapper";

export const metadata: Metadata = {
  title: "WedPlan — Luxury Wedding Planning Platform",
  description: "Discover wedding venues, photography, caterers, floral decor, and bridal styling. Book trusted wedding vendors effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col font-sans antialiased selection:bg-rose-600 selection:text-white transition-colors duration-300">
        <ThemeProvider>
          <GoogleAuthProviderWrapper>
            <ToastProvider>
              <AuthProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </AuthProvider>
            </ToastProvider>
          </GoogleAuthProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
