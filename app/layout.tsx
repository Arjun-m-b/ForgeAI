import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ForgeAI',
  description: 'AI-powered 3D game asset generator for indie developers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
