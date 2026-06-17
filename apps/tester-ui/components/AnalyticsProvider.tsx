'use client'
import { usePathname } from 'next/navigation'

import { type PropsWithChildren, useEffect } from 'react'

export const AnalyticsProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname()

  useEffect(() => {
    if (window && (window as any).userAnalytics) {
      ;(window as any).userAnalytics.capture('page-view', { pathname })
    }
  }, [pathname])

  return children
}
