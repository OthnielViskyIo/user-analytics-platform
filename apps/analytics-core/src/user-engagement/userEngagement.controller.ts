import { Controller, UsePipes, ValidationPipe } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'

import { UserEngagementService } from './userEngagement.service'

type TimePeriod = 'week' | 'month' | 'year'

@Controller()
export class UserEngagementController {
  constructor(private readonly userEngagementService: UserEngagementService) {}

  @MessagePattern('analytics.user-engagement')
  @UsePipes(new ValidationPipe())
  getUserEngagement() {
    return this.userEngagementService.getUserEngagementStats()
  }

  @MessagePattern('analytics.unique-sessions-lttb')
  @UsePipes(new ValidationPipe())
  getUniqueSessionsOverTimeLTTB(data: { measure: TimePeriod }) {
    return this.userEngagementService.getSessionsOverTimeLTTB(data.measure)
  }

  @MessagePattern('analytics.unique-sessions-min-max-avg')
  @UsePipes(new ValidationPipe())
  getUniqueSessionsOverTimeMinMaxAvg(data: { measure: TimePeriod }) {
    return this.userEngagementService.getSessionsOverTimeMinMaxAvg(data.measure)
  }
}
