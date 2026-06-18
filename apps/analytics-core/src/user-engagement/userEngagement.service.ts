import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { differenceInSeconds } from 'date-fns'

import { CaptureEvent } from '../capture-event/captureEvent.schema'

type SomethingProperties = {
  pathname: string
  pageEnter: string
  pageLeave: string
  pageTransitionId: string
}

@Injectable()
export class UserEngagementService {
  constructor(
    @InjectModel(CaptureEvent.name) private readonly captureEventModel: Model<CaptureEvent>,
  ) {}

  async getUserEngagementStats() {
    const captureEvent = await this.captureEventModel.aggregate<CaptureEvent>([
      {
        $match: {
          properties: { $exists: true, $type: 'object' },
          $expr: { $gt: [{ $size: { $objectToArray: '$properties' } }, 0] },
        },
      },
    ])
    const properties = captureEvent.map((event) => event.properties as SomethingProperties)
    const filterOnPathname = properties.filter((props) => props.pathname)

    const pageviews = filterOnPathname.reduce(
      (viewsPerPage, property) => {
        viewsPerPage[property.pathname] = (viewsPerPage[property.pathname] || 0) + 1
        return viewsPerPage
      },
      {} as Record<string, number>,
    )

    const timeOnPage = filterOnPathname.reduce(
      (timeSpentPerPage, currentProperty) => {
        timeSpentPerPage[currentProperty.pathname] = Math.abs(
          differenceInSeconds(currentProperty.pageEnter, currentProperty.pageLeave),
        )
        return timeSpentPerPage
      },
      {} as Record<string, number>,
    )

    return {
      key: 'userEngagement',
      value: {
        pageviews,
        timeOnPage,
      },
    }
  }
}
