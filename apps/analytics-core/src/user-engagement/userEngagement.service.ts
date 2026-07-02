import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CaptureEvent } from '../capture-event/captureEvent.schema'

type UserEngagementAggregationResult = {
  _id: string
  pageviews: number
  timeOnPage: number
}

type SessionOverTimeResult = {
  period: string
  count: number
}

type MinMaxAvgResult = {
  period: string
  min: number
  max: number
  avg: number
}

@Injectable()
export class UserEngagementService {
  constructor(
    @InjectModel(CaptureEvent.name) private readonly captureEventModel: Model<CaptureEvent>,
  ) {}

  async getUserEngagementStats() {
    const results = await this.captureEventModel.aggregate<UserEngagementAggregationResult>([
      {
        $match: {
          'properties.pathname': { $exists: true, $ne: null },
          'properties.pageEnter': { $exists: true },
          'properties.pageLeave': { $exists: true, $ne: null },
        },
      },
      {
        $project: {
          pathname: '$properties.pathname',
          duration: {
            $abs: {
              $divide: [
                {
                  $subtract: [
                    { $toDate: '$properties.pageLeave' },
                    { $toDate: '$properties.pageEnter' },
                  ],
                },
                1000,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: '$pathname',
          pageviews: { $sum: 1 },
          timeOnPage: { $sum: '$duration' },
        },
      },
    ])

    const pageviews: Record<string, number> = {}
    const timeOnPage: Record<string, number> = {}

    for (const result of results) {
      pageviews[result._id] = result.pageviews
      timeOnPage[result._id] = result.timeOnPage
    }

    return {
      key: 'userEngagement',
      value: {
        pageviews,
        timeOnPage,
      },
    }
  }

  async getSessionsOverTimeLTTB(measure: 'week' | 'month' | 'year') {
    const rawData = await this.getDailySessions(measure)
    if (rawData.length <= 10) return rawData

    return this.lttb(rawData, 10)
  }

  async getSessionsOverTimeMinMaxAvg(measure: 'week' | 'month' | 'year') {
    const rawData = await this.getDailySessions(measure)
    if (rawData.length <= 10) {
      return rawData.map((d) => ({
        period: d.period,
        min: d.count,
        max: d.count,
        avg: d.count,
      }))
    }

    return this.minMaxAvgBucketing(rawData, 10)
  }

  private async getDailySessions(
    measure: 'week' | 'month' | 'year',
  ): Promise<SessionOverTimeResult[]> {
    const format = '%Y-%m-%d'
    const now = new Date()
    const startDate = new Date()

    if (measure === 'week') {
      startDate.setDate(now.getDate() - 7)
    } else if (measure === 'month') {
      startDate.setMonth(now.getMonth() - 1)
    } else if (measure === 'year') {
      startDate.setFullYear(now.getFullYear() - 1)
    }

    return this.captureEventModel.aggregate<SessionOverTimeResult>([
      {
        $match: {
          createdAt: { $gte: startDate.toISOString() },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format,
              date: { $toDate: '$createdAt' },
            },
          },
          uniqueSessions: { $addToSet: '$sessionId' },
        },
      },
      {
        $project: {
          _id: 0,
          period: '$_id',
          count: { $size: '$uniqueSessions' },
        },
      },
      { $sort: { period: 1 } },
    ])
  }

  private lttb(data: SessionOverTimeResult[], threshold: number): SessionOverTimeResult[] {
    const n = data.length
    if (threshold >= n || threshold === 0) return data

    const sampled: SessionOverTimeResult[] = []
    let sampledIndex = 0

    // Bucket size. Leave room for start and end data points
    const bucketSize = (n - 2) / (threshold - 2)

    let a = 0 // Initially a is the first point in the triangle
    let maxAreaPoint: SessionOverTimeResult = data[0]
    let maxArea = -1
    let area = -1

    sampled[sampledIndex++] = data[a] // Always add the first point

    for (let i = 0; i < threshold - 2; i++) {
      // Calculate point average for next bucket (containing c)
      let avgX = 0
      let avgY = 0
      let avgRangeStart = Math.floor((i + 1) * bucketSize) + 1
      let avgRangeEnd = Math.floor((i + 2) * bucketSize) + 1
      avgRangeEnd = avgRangeEnd < n ? avgRangeEnd : n

      const avgRangeLength = avgRangeEnd - avgRangeStart

      for (; avgRangeStart < avgRangeEnd; avgRangeStart++) {
        avgX += avgRangeStart
        avgY += data[avgRangeStart].count
      }
      avgX /= avgRangeLength
      avgY /= avgRangeLength

      // Get the range for this bucket
      let rangeOffs = Math.floor(i * bucketSize) + 1
      const rangeTo = Math.floor((i + 1) * bucketSize) + 1

      // Point a
      const pointAX = a
      const pointAY = data[a].count

      maxArea = area = -1

      for (; rangeOffs < rangeTo; rangeOffs++) {
        // Calculate triangle area over three buckets
        area =
          Math.abs(
            (pointAX - avgX) * (data[rangeOffs].count - pointAY) -
              (pointAX - rangeOffs) * (avgY - pointAY),
          ) * 0.5
        if (area > maxArea) {
          maxArea = area
          maxAreaPoint = data[rangeOffs]
          a = rangeOffs // Next a is this b
        }
      }

      sampled[sampledIndex++] = maxAreaPoint // Pick this point from the bucket
    }

    sampled[sampledIndex++] = data[n - 1] // Always add last

    return sampled
  }

  private minMaxAvgBucketing(data: SessionOverTimeResult[], threshold: number): MinMaxAvgResult[] {
    const n = data.length
    const bucketSize = n / threshold
    const result: MinMaxAvgResult[] = []

    for (let i = 0; i < threshold; i++) {
      const start = Math.floor(i * bucketSize)
      const end = i === threshold - 1 ? n : Math.floor((i + 1) * bucketSize)
      const bucket = data.slice(start, end)

      if (bucket.length === 0) continue

      const counts = bucket.map((d) => d.count)
      const min = Math.min(...counts)
      const max = Math.max(...counts)
      const avg = counts.reduce((a, b) => a + b, 0) / counts.length

      result.push({
        period: bucket[Math.floor(bucket.length / 2)].period,
        min,
        max,
        avg: Math.round(avg),
      })
    }

    return result
  }
}
