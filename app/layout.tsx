import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { RoleProvider } from "@/lib/context/RoleContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "CaseBridge AI — AICTE Multi-Bureau Grievance & Overlap Resolution (SIH26264)",
  description:
    "Integrated administrative dashboard for monitoring, de-duplication, and tracking institution-related complaints across AICTE bureaus and cells.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
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
