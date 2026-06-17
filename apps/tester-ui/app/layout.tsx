import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { type PropsWithChildren } from 'react'

import { Header } from '@/components/Header'
import { Container } from '@/components/Container'
import { Analytics } from '@/components/Analytics'
import { AnalyticsProvider } from '@/components/AnalyticsProvider'

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
  title: 'User Analytics',
  description: 'A simple user action tracker',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-hidden`}
    >
      <body className="h-full flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <AnalyticsProvider>
            <Container>{children}</Container>
          </AnalyticsProvider>
        </main>
      </body>
    </html>
  )
}
