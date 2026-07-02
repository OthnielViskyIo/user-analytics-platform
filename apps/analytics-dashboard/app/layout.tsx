import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { Providers } from '@/providers/Providers'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Analytics Dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-white dark:bg-zinc-950">
        <Providers>
          <Header />
          <Sidebar />
          <main className="pl-32 pt-0">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
