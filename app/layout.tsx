import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/providers/auth-provider'
import { ToastContainer } from '@/components/ui/toast'
import { DashboardLayout } from '@/components/ui/dashboard-layout'
import { AuthGuard } from '@/components/auth/auth-guard'

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
          <AuthGuard>
            <DashboardLayout>
              {children}
            </DashboardLayout>
          </AuthGuard>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  )
}
