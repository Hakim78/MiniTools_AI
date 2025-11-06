import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Daily Hub - Mes outils IA quotidiens',
  description: 'Centralise tous mes micro-outils IA dans une seule plateforme moderne et intuitive.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="fr" className={inter.variable}>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
        </head>
        <body className="font-sans antialiased bg-[#F9FAFB] dark:bg-[#0F172A] min-h-screen">
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}