import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/providers/auth-provider'
import { ToastContainer } from '@/components/ui/toast'
import { ChatLayout } from '@/components/ui/chat-layout'
import { PageTransition } from '@/components/ui/page-transition'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Appointment System",
  description: "A modern appointment booking system built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ChatLayout>
            <PageTransition>
              {children}
            </PageTransition>
          </ChatLayout>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
