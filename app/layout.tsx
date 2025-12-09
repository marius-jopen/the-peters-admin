import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Peter\'s World - Admin',
  description: 'Admin panel for Peter\'s World shop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}

