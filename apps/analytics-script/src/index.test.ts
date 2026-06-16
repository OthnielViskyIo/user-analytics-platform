import { describe, it, expect, vi, beforeEach } from 'vitest'

// We need to import the script to execute it.
// Since it's an IIFE that attaches to window, we just import it.
import './index'

declare global {
  interface Window {
    userAnalytics: {
      init: (config: { trackingId: string; options: Record<string, any> }) => void
      capture: (name: string, config: Record<string, any>) => void
    }
  }
}

describe('userAnalytics', () => {
  const fetchMock = vi.fn()
  global.fetch = fetchMock as any

  beforeEach(() => {
    fetchMock.mockClear()
  })

  it('should define window.userAnalytics', () => {
    expect(window.userAnalytics).toBeDefined()
    expect(typeof window.userAnalytics.init).toBe('function')
    expect(typeof window.userAnalytics.capture).toBe('function')
  })

  describe('init', () => {
    it('should throw an error if trackingId is missing', () => {
      // @ts-ignore
      expect(() => window.userAnalytics.init({})).toThrow(
        'trackingId is required in the config object',
      )
    })

    it('should call fetch with the correct parameters', () => {
      const config = { trackingId: 'test-id', options: { debug: true } }
      window.userAnalytics.init(config)

      expect(fetchMock).toHaveBeenCalledWith('https://placeholder-endpoint.example.com/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      })
    })
  })

  describe('capture', () => {
    it('should call fetch with the correct parameters including trackingId', () => {
      window.userAnalytics.init({ trackingId: 'capture-test-id', options: {} })

      const eventName = 'test-event'
      const eventConfig = { prop1: 'val1' }
      window.userAnalytics.capture(eventName, eventConfig)

      expect(fetchMock).toHaveBeenLastCalledWith(
        'https://placeholder-endpoint.example.com/capture',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prop1: 'val1',
            name: eventName,
            trackingId: 'capture-test-id',
          }),
        },
      )
    })

    it('should prioritize internal fields over config fields in capture', () => {
      window.userAnalytics.init({ trackingId: 'real-id', options: {} })

      const eventName = 'real-event'
      const eventConfig = { name: 'fake-event', trackingId: 'fake-id', data: 'ok' }
      window.userAnalytics.capture(eventName, eventConfig)

      expect(fetchMock).toHaveBeenLastCalledWith(
        'https://placeholder-endpoint.example.com/capture',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: eventName,
            trackingId: 'real-id',
            data: 'ok',
          }),
        },
      )
    })
  })
})
