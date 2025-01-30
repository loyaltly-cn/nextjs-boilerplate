import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/components/providers/auth-provider'
import { ToastContainer } from '@/components/ui/toast'
import { DashboardLayout } from '@/components/ui/dashboard-layout'
import LanguageWrapper from "@/components/providers/LanguageWrapper";
import { Geist, Geist_Mono} from "next/font/google";
import { LanguageProvider } from "@/app/language";
const geist = Geist({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "A modern admin dashboard built with Next.js",
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <LanguageProvider>
          <LanguageWrapper className={`${geistSans.variable} ${geistMono.variable}`}>
            <AuthProvider>
              <DashboardLayout>
                {children}
              </DashboardLayout>
              <ToastContainer />
            </AuthProvider>
        </LanguageWrapper>
        </LanguageProvider>
      </body>
    </html>
  )
}
