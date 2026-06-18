'use client'

import { usePathname } from 'next/navigation'
import { type PropsWithChildren, useEffect, useRef } from 'react'
import { userAnalytics } from '@repo/user-analytics-sdk'
import { v4 as uuidv4 } from 'uuid'

export const AnalyticsProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname()
  const { isInitialized } = userAnalytics.init({ trackingId: 'test-tracker-id' })

  const pageEnterRef = useRef<Date | null>(null)
  const hasLeftRef = useRef<boolean>(false)

  useEffect(() => {
    if (!isInitialized) {
      userAnalytics.init({ trackingId: 'test-tracker-id' })
    }
  }, [isInitialized])

  useEffect(() => {
    const pageEnter = new Date()
    pageEnterRef.current = pageEnter
    hasLeftRef.current = false
    const pageTransitionId = uuidv4()

    userAnalytics.capture('page-view', {
      pathname,
      pageEnter: pageEnter.toISOString(),
      pageLeave: null,
      pageTransitionId,
    })

    const handlePageLeave = () => {
      if (hasLeftRef.current) return

      const pageLeave = new Date()
      hasLeftRef.current = true
      userAnalytics.capture('page-view', {
        pathname,
        pageEnter: pageEnterRef.current ? pageEnterRef.current.toISOString() : null,
        pageLeave: pageLeave.toISOString(),
        pageTransitionId,
      })
    }

    window.addEventListener('beforeunload', handlePageLeave)

    return () => {
      handlePageLeave()
      window.removeEventListener('beforeunload', handlePageLeave)
    }
  }, [pathname])

  return children
}
