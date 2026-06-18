export const getData = async () => {
  try {
    const res = await fetch('http://localhost:1351/capture', { cache: 'no-store', method: 'GET' })
    if (!res.ok) {
      return null
    }
    return res.json()
  } catch (error) {
    console.error('Failed to fetch engagement data:', error)
    return null
  }
}
