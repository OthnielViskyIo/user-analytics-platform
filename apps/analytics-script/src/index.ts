;(function () {
  let _trackingId: string = ''

  ;(window as any).userAnalytics = {
    init: function (config: { trackingId: string; options: Record<string, any> }) {
      if (!config || !config.trackingId) {
        throw new Error('trackingId is required in the config object')
      }
      _trackingId = config.trackingId

      /*fetch('https://placeholder-endpoint.example.com/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: config }),
      })*/
      console.log('will init with: ', config)
    },

    capture: function (eventName: string, config: Record<string, any>) {
      const payload = Object.assign({}, config, {
        eventName,
        userId: 'test-user-id-142',
        trackingId: _trackingId,
      })

      fetch('http://localhost:3000/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    },
  }
})()
