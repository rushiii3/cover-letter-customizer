import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cover Letter Customizer',
  description: 'Cover Letter Customizer for job applications',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
