let _trackingId: string = ''

export const userAnalytics = {
  init: function (config: { trackingId: string; options?: Record<string, any> }) {
    if (!config || !config.trackingId) {
      throw new Error('trackingId is required in the config object')
    }
    _trackingId = config.trackingId

    // TODO: re-enable this when we have a concept of user and session
    /*fetch('https://placeholder-endpoint.example.com/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: config }),
    })*/
    console.log('init with: ', config)
    return { isInitialized: true }
  },

  capture: async function (eventName: string, config?: Record<string, any>) {
    const payload = Object.assign({}, config, {
      eventName,
      userId: 'test-user-id-142',
      trackingId: _trackingId,
    })

    if (_trackingId || payload.trackingId) {
      await fetch('http://localhost:1351/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      console.error('Tracking ID is missing!')
    }
  },
}
