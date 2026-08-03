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
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster
            position="top-center"
            theme="dark"
            offset="20px"
            gap={10}
            toastOptions={{
              duration: 3000,
              style: {
                maxWidth: "400px",
                borderRadius: "8px",
              },
              classNames: {
                toast: "!bg-popover !text-foreground",
                description: "!text-foreground",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
