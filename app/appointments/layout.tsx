import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Appointments | Appointment System',
  description: 'View and manage your appointments',
}

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 