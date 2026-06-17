'use client'

import { usePathname } from 'next/navigation'
import { type PropsWithChildren, useEffect } from 'react'
import { userAnalytics } from '@repo/user-analytics-sdk'

export const AnalyticsProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname()
  const { isInitialized } = userAnalytics.init({ trackingId: 'test-tracker-id' })

  useEffect(() => {
    if (userAnalytics && !isInitialized) {
      userAnalytics.init({ trackingId: 'test-tracker-id' })
    }
  }, [isInitialized])

  useEffect(() => {
    if (userAnalytics) {
      userAnalytics.capture('page-view', { pathname })
    }
  }, [pathname])

  return children
}
