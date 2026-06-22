let _trackingId: string = ''

export const userAnalytics = {
  init: function (config: { trackingId: string; options?: Record<string, any> }) {
    if (!config || !config.trackingId) {
      throw new Error('trackingId is required in the config object')
    }
    _trackingId = config.trackingId

    return { isInitialized: true }
  },

  capture: async function (
    eventName: string,
    properties?: Record<string, any>,
    config?: Record<string, any>,
  ) {
    const payload = Object.assign({}, config, {
      eventName,
      properties,
      trackingId: _trackingId,
    })

    if (_trackingId || payload.trackingId) {
      await fetch('http://localhost:1351/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      })
    } else {
      console.error('Tracking ID is missing!')
    }
  },
}
