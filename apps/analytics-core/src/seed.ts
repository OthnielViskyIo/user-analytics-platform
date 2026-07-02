import { MongoClient, ObjectId } from 'mongodb'

const MONGO_URI = 'mongodb://localhost/user-analytics-db'
const DB_NAME = 'user-analytics-db'
const COLLECTION = 'captureevents'

const PATHNAMES = ['/', '/images', '/images/1', '/images/2', '/images/3', '/about']

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function randomTimeOnDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(randomBetween(8, 22), randomBetween(0, 59), randomBetween(0, 59), 0)
  return d
}

async function seed() {
  const client = new MongoClient(MONGO_URI)
  await client.connect()
  const db = client.db(DB_NAME)
  const collection = db.collection(COLLECTION)

  // Drop existing data
  await collection.deleteMany({})
  console.log('Cleared existing events.')

  const now = new Date()
  const oneYearAgo = new Date(now)
  oneYearAgo.setFullYear(now.getFullYear() - 1)

  const events: object[] = []

  // Generate data for every day over the past year
  let currentDate = new Date(oneYearAgo)
  while (currentDate <= now) {
    // 2–8 sessions per day, more on weekends
    const dayOfWeek = currentDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const sessionsToday = randomBetween(isWeekend ? 4 : 2, isWeekend ? 12 : 8)

    for (let s = 0; s < sessionsToday; s++) {
      const trackingId = uuid()
      const sessionId = uuid()

      // Each session visits 1–4 pages
      const pagesVisited = randomBetween(1, 4)
      const shuffledPaths = [...PATHNAMES].sort(() => Math.random() - 0.5).slice(0, pagesVisited)

      let pageTime = randomTimeOnDay(currentDate)

      for (const pathname of shuffledPaths) {
        const correlationId = uuid()
        const pageTransitionId = uuid()
        const viewTime = new Date(pageTime)
        const dwellSeconds = randomBetween(10, 180)
        const leaveTime = new Date(viewTime.getTime() + dwellSeconds * 1000)

        events.push({
          _id: new ObjectId(),
          eventName: 'page-view',
          trackingId,
          sessionId,
          correlationId,
          createdAt: viewTime.toISOString(),
          properties: {
            pathname,
            pageTransitionId,
          },
        })

        events.push({
          _id: new ObjectId(),
          eventName: 'page-leave',
          trackingId,
          sessionId,
          correlationId: uuid(),
          createdAt: leaveTime.toISOString(),
          properties: {
            pathname,
            pageTransitionId,
            timeOnPage: dwellSeconds,
          },
        })

        // Next page visit starts after leaving current page
        pageTime = new Date(leaveTime.getTime() + randomBetween(5, 30) * 1000)
      }
    }

    currentDate = addDays(currentDate, 1)
  }

  await collection.insertMany(events)
  console.log(`Seeded ${events.length} events across the past year.`)

  await client.close()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
