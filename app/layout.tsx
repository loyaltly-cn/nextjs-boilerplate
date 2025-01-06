import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/providers/auth-provider'
import { ToastContainer } from '@/components/ui/toast'
import { DashboardLayout } from '@/components/ui/dashboard-layout'

const geist = Geist({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "A modern admin dashboard built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <AuthProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  )
}
