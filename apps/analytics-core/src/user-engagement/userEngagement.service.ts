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

  async getUniqueSessionsOverTime(measure: 'week' | 'month' | 'year') {
    const dateFormatMap = {
      week: '%Y-%m-%d',
      month: '%Y-%m',
      year: '%Y',
    }

    const format = dateFormatMap[measure]

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
}
