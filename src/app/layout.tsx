import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LynxBooks — Трекер чтения",
  description: "Отслеживайте свои книги, сессии чтения и делитесь с друзьями",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster
              position="top-center"
              theme="dark"
              richColors
              duration={4000}
              visibleToasts={3}
              toastOptions={{
                style: {
                  background: "#1d1529",
                  color: "#f3f4f6",
                  border: "1px solid #3b295a",
                },
                className: "my-toast-class",
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
