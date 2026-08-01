import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";

const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "optional",
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
      className={`${fontSans.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-background flex flex-col transition-colors duration-200">
        <AuthProvider>
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
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
