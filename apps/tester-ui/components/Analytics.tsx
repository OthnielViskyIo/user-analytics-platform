'use client'

import { useEffect } from 'react'

export function Analytics() {
  useEffect(() => {
    const initAnalytics = async () => {
      // @ts-ignore
      await import('@repo/analytics-script/dist/analytics.iife.js')
      if (typeof window !== 'undefined' && (window as any).userAnalytics) {
        ;(window as any).userAnalytics.init({
          trackingId: 'tester-ui-id',
          options: {},
        })
      }
    }

    initAnalytics()
  }, [])

  return null
}
