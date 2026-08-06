import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import { DemoAuthProvider } from "@/components/auth/demo-auth-provider";
import { CopyEditProvider } from "@/components/copy/copy-edit-provider";
import { ToastHost } from "@/components/ui/toast-host";
import { TooltipProvider } from "@/components/ui/tooltip";
import { copy } from "@/lib/copy";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: copy.app.name,
  description: copy.app.metaDescription,
  applicationName: copy.app.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: copy.app.name,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full w-full max-w-full flex-col overflow-x-clip font-sans" suppressHydrationWarning>
        <TooltipProvider delayDuration={100}>
          <DemoAuthProvider>
            <CopyEditProvider>
              {children}
              <ToastHost />
            </CopyEditProvider>
          </DemoAuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
