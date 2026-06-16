;(function () {
  let _trackingId: string = ''

  ;(window as any).userAnalytics = {
    init: function (config: { trackingId: string; options: Record<string, any> }) {
      if (!config || !config.trackingId) {
        throw new Error('trackingId is required in the config object')
      }
      _trackingId = config.trackingId

      fetch('https://placeholder-endpoint.example.com/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: config }),
      })
    },

    capture: function (name: string, config: Record<string, any>) {
      const payload = Object.assign({}, config, {
        name,
        trackingId: _trackingId,
      })

      fetch('https://placeholder-endpoint.example.com/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    },
  }
})()
