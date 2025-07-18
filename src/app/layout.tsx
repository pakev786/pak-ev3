import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import AuthProvider from '@/providers/SessionProvider'
import WhatsappChatButton from '@/components/WhatsappChatButton'
import Navigation from '@/components/Navigation'
import { CartProvider } from '@/components/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pak EV - Electric Vehicle Solutions',
  description: 'Leading provider of electric vehicle charging solutions in Pakistan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`} suppressHydrationWarning={true}>
        <CartProvider>
          <Navigation />
          <main className="pt-16">
            <AuthProvider>{children}</AuthProvider>
          </main>
          <WhatsappChatButton />
        </CartProvider>
      </body>
    </html>
  )
}
