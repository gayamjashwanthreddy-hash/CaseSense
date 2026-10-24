import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { RoleProvider } from "@/lib/context/RoleContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "CaseSense — Institutional Grievance Intelligence Platform",
  description:
    "Transparent oversight, cross-bureau coordination, and accountable resolution across AICTE grievance workflows (SIH26264).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-screen bg-white text-[#20231F] font-sans antialiased selection:bg-[#E8EEE7] selection:text-[#344B3B]">
        <QueryProvider>
          <RoleProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
            </ToastProvider>
          </RoleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
